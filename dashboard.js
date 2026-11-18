/* REDPOLY Shopify-minimal Orders Admin Dashboard */
(function () {
  var ADMIN_EMAIL = 'ashketchupkeke@gmail.com';
  var CATALOGUE = {
    'BUBBLE GUN': { href: '/bubble-gun', image: '/assets/images/redpoly/products/bubble-gun-thumb.webp?v=bubble-20261121' },
    'STUNT PET': { href: '/stunt-pet', image: '/assets/images/redpoly/products/stunt-pet-thumb.webp?v=pet-20261122' },
    'MINI COOL CAR': { href: '/mini-cool-car', image: '/assets/images/redpoly/products/mini-cool-car-thumb.webp?v=car-20261117' },
    'GEL STORM': { href: '/gel-storm', image: '/assets/images/redpoly/products/gel-storm-thumb.webp?v=gel-20261121' },
    'MECHA ROVER': { href: '/mecha-rover', image: '/assets/images/redpoly/products/mecha-rover-thumb.webp?v=mecha-20261120' },
    'PIXEL SPLASH': { href: '/pixel-splash', image: '/assets/images/redpoly/products/pixel-splash-thumb.webp?v=pixel-20261117-v3' },
    'CUTE DINOS GREEN': { href: '/cute-dinos?colour=green', image: '/assets/images/redpoly/products/cute-dinos-green-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS RED': { href: '/cute-dinos?colour=red', image: '/assets/images/redpoly/products/cute-dinos-red-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS TEAL': { href: '/cute-dinos?colour=teal', image: '/assets/images/redpoly/products/cute-dinos-teal-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS TRIO': { href: '/cute-dinos?pack=trio', image: '/assets/images/redpoly/products/cute-dinos-trio-thumb.webp?v=dinos-20261116' }
  };

  var GOOGLE_SVG = '<svg class="google-btn-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5H1.2v3.1C3.2 21.4 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.2 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.2C.4 8.2 0 10.1 0 12s.4 3.8 1.2 5.4l4-3.1z"/><path fill="#EA4335" d="M12 4.7c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.2 2.6 1.2 6.6l4 3.1c1-2.9 3.7-5 6.8-5z"/></svg>';

  // Standalone Firebase ESM bootstrap fallback (needed when deployed as static files on Vercel without /firebase-client.js)
  var dashBootstrapPromise = null;
  function ensureDashboardFirebase() {
    if (window.RedpolyFirebase && typeof window.RedpolyFirebase.listAllOrders === 'function') {
      return Promise.resolve(window.RedpolyFirebase);
    }
    if (dashBootstrapPromise) return dashBootstrapPromise;

    dashBootstrapPromise = (async function () {
      var FIREBASE_VER = '13.4.0';
      var CDN = 'https://www.gstatic.com/firebasejs/' + FIREBASE_VER;
      var cfgRes = await fetch('/firebase-applet-config.json', { cache: 'no-store' });
      if (!cfgRes.ok) throw new Error('Could not load /firebase-applet-config.json (' + cfgRes.status + ')');
      var firebaseConfig = await cfgRes.json();

      var mods = await Promise.all([
        import(CDN + '/firebase-app.js'),
        import(CDN + '/firebase-auth.js'),
        import(CDN + '/firebase-firestore.js')
      ]);

      if (window.RedpolyFirebase && typeof window.RedpolyFirebase.listAllOrders === 'function') {
        return window.RedpolyFirebase;
      }

      var appMod = mods[0];
      var authMod = mods[1];
      var fsMod = mods[2];

      var app = appMod.getApps && appMod.getApps().length
        ? appMod.getApps()[0]
        : appMod.initializeApp(firebaseConfig);
      var db = firebaseConfig.firestoreDatabaseId
        ? fsMod.getFirestore(app, firebaseConfig.firestoreDatabaseId)
        : fsMod.getFirestore(app);
      var auth = authMod.getAuth(app);
      var googleProvider = new authMod.GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: 'select_account' });

      var LIMITS_ID = /^[a-zA-Z0-9_\-]+$/;

      function handleFirestoreError(error, operationType, path) {
        var u = auth.currentUser;
        var errInfo = {
          error: error instanceof Error ? error.message : String(error),
          authInfo: {
            userId: u ? u.uid : undefined,
            email: u ? u.email : undefined,
            emailVerified: u ? u.emailVerified : undefined,
            isAnonymous: u ? u.isAnonymous : undefined,
            tenantId: u ? u.tenantId : undefined,
            providerInfo: (u && u.providerData ? u.providerData : []).map(function (p) {
              return { providerId: p.providerId, email: p.email };
            })
          },
          operationType: operationType,
          path: path
        };
        console.error('Firestore Error: ', JSON.stringify(errInfo));
        throw new Error(JSON.stringify(errInfo));
      }

      (async function testConnection() {
        try {
          await fsMod.getDocFromServer(fsMod.doc(db, 'test', 'connection'));
        } catch (error) {
          if (error instanceof Error && error.message.indexOf('the client is offline') !== -1) {
            console.error('Please check your Firebase configuration.');
          }
        }
      })();

      function sanitizePhoto(url) {
        if (!url || typeof url !== 'string') return '';
        var trimmed = url.trim().slice(0, 500);
        return trimmed.indexOf('https://') === 0 ? trimmed : '';
      }

      var currentUser = auth.currentUser || null;
      var authReady = false;

      function dispatchAuth(user) {
        window.dispatchEvent(new CustomEvent('redpoly:auth-changed', {
          detail: {
            user: user ? {
              uid: user.uid,
              displayName: user.displayName || 'REDPOLY Admin',
              email: user.email || '',
              photoURL: sanitizePhoto(user.photoURL),
              emailVerified: user.emailVerified
            } : null
          }
        }));
      }

      authMod.onAuthStateChanged(auth, function (user) {
        currentUser = user;
        authReady = true;
        dispatchAuth(user);
      });

      function isAdminUser() {
        return Boolean(currentUser && currentUser.emailVerified && currentUser.email === ADMIN_EMAIL);
      }

      var api = {
        isReady: function () { return authReady; },
        isAdmin: isAdminUser,
        getUser: function () {
          return currentUser ? {
            uid: currentUser.uid,
            displayName: currentUser.displayName || 'REDPOLY Admin',
            email: currentUser.email || '',
            photoURL: sanitizePhoto(currentUser.photoURL),
            emailVerified: currentUser.emailVerified
          } : null;
        },
        signInWithGoogle: async function () {
          try {
            var res = await authMod.signInWithPopup(auth, googleProvider);
            return res.user;
          } catch (error) {
            var code = error && error.code ? String(error.code) : '';
            if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null;
            throw error;
          }
        },
        signOut: async function () {
          await authMod.signOut(auth);
        },
        listAllOrders: async function () {
          if (!isAdminUser()) {
            throw new Error('Admin access required to view all store orders.');
          }
          try {
            var snapshot = await fsMod.getDocs(fsMod.collectionGroup(db, 'orders'));
            var orders = await Promise.all(snapshot.docs.map(async function (docSnap) {
              var d = docSnap.data();
              var ts = d.createdAt;
              var createdAtMs = ts && typeof ts.toMillis === 'function' ? ts.toMillis() : 0;
              var orderUid = String(d.uid || (docSnap.ref.parent && docSnap.ref.parent.parent ? docSnap.ref.parent.parent.id : ''));
              var lineItems = [];
              try {
                var itemsSnap = await fsMod.getDocs(fsMod.collection(docSnap.ref, 'items'));
                itemsSnap.forEach(function (itemDoc) {
                  var itemData = itemDoc.data();
                  if (typeof itemData.name === 'string') {
                    lineItems.push({
                      name: itemData.name,
                      price: Number(itemData.price),
                      quantity: Number(itemData.quantity)
                    });
                  }
                });
              } catch (itemErr) {
                handleFirestoreError(itemErr, 'list', docSnap.ref.path + '/items');
              }
              var statusVal = (d.status === 'fulfilled' || d.status === 'cancelled') ? d.status : 'placed';
              return {
                id: docSnap.id,
                uid: orderUid,
                reference: String(d.reference || ''),
                customerName: String(d.customerName || ''),
                email: String(d.email || ''),
                phone: String(d.phone || ''),
                address: String(d.address || ''),
                pin: String(d.pin || ''),
                city: String(d.city || ''),
                state: String(d.state || ''),
                shippingMethod: d.shippingMethod === 'express' ? 'express' : 'standard',
                shippingCost: Number(d.shippingCost || 0),
                freeShipping: Boolean(d.freeShipping),
                freeGift: Boolean(d.freeGift),
                subtotal: Number(d.subtotal || 0),
                gstRate: Number(d.gstRate || 12),
                gst: Number(d.gst || 0),
                total: Number(d.total || 0),
                itemCount: Number(d.itemCount || lineItems.length),
                status: statusVal,
                createdAtMs: createdAtMs,
                items: lineItems
              };
            }));
            orders.sort(function (a, b) { return b.createdAtMs - a.createdAtMs; });
            return orders;
          } catch (error) {
            handleFirestoreError(error, 'list', 'orders');
          }
        },
        updateOrderStatus: async function (uid, orderId, status) {
          if (!isAdminUser()) throw new Error('Admin access required to update order status.');
          if (!LIMITS_ID.test(uid) || !LIMITS_ID.test(orderId)) throw new Error('Invalid order identifier.');
          if (status !== 'placed' && status !== 'fulfilled' && status !== 'cancelled') throw new Error('Invalid order status.');
          var orderPath = 'users/' + uid + '/orders/' + orderId;
          try {
            await fsMod.updateDoc(fsMod.doc(db, 'users', uid, 'orders', orderId), { status: status });
          } catch (error) {
            handleFirestoreError(error, 'update', orderPath);
          }
        }
      };

      window.RedpolyFirebase = api;
      window.dispatchEvent(new CustomEvent('redpoly:firebase-ready', { detail: { user: api.getUser() } }));
      return api;
    })().catch(function (err) {
      dashBootstrapPromise = null;
      throw err;
    });

    return dashBootstrapPromise;
  }

  // DOM References
  var topBarAccount = document.getElementById('top-bar-account');
  var sidebarToggle = document.getElementById('sidebar-toggle');
  var sidebar = document.getElementById('dash-sidebar');
  var sidebarBackdrop = document.getElementById('sidebar-backdrop');
  var sidebarOrdersCount = document.getElementById('sidebar-orders-count');

  var pageActions = document.getElementById('page-actions');
  var refreshBtn = document.getElementById('refresh-orders-btn');
  var exportCsvBtn = document.getElementById('export-csv-btn');
  var authGate = document.getElementById('auth-gate');
  var dashboardContent = document.getElementById('dashboard-content');

  var metricTotalOrders = document.getElementById('metric-total-orders');
  var metricGrossSales = document.getElementById('metric-gross-sales');
  var metricItemsOrdered = document.getElementById('metric-items-ordered');
  var metricUnfulfilled = document.getElementById('metric-unfulfilled');

  var errorBanner = document.getElementById('orders-error-banner');
  var errorText = document.getElementById('orders-error-text');
  var retryBtn = document.getElementById('orders-retry-btn');

  var filterTabsEl = document.getElementById('orders-filter-tabs');
  var tabCountAll = document.getElementById('tab-count-all');
  var tabCountPlaced = document.getElementById('tab-count-placed');
  var tabCountFulfilled = document.getElementById('tab-count-fulfilled');
  var tabCountCancelled = document.getElementById('tab-count-cancelled');
  var tabCountExpress = document.getElementById('tab-count-express');

  var searchInput = document.getElementById('orders-search');
  var searchClearBtn = document.getElementById('orders-search-clear');
  var sortSelect = document.getElementById('orders-sort');

  var skeletonEl = document.getElementById('orders-skeleton');
  var emptyEl = document.getElementById('orders-empty');
  var emptyTitle = document.getElementById('orders-empty-title');
  var emptyCopy = document.getElementById('orders-empty-copy');
  var emptyActions = document.getElementById('orders-empty-actions');
  var tableWrap = document.getElementById('orders-table-wrap');
  var tbody = document.getElementById('orders-tbody');
  var tableFooter = document.getElementById('orders-table-footer');
  var showingText = document.getElementById('orders-showing-text');

  var drawerLayer = document.getElementById('order-drawer-layer');
  var drawerBackdrop = document.getElementById('drawer-backdrop');
  var drawerEl = document.getElementById('order-drawer');
  var drawerCloseBtn = document.getElementById('drawer-close-btn');
  var drawerOrderRef = document.getElementById('drawer-order-ref');
  var drawerStatusBadge = document.getElementById('drawer-status-badge');
  var drawerOrderDate = document.getElementById('drawer-order-date');
  var drawerStatusActions = document.getElementById('drawer-status-actions');
  var drawerStatusSaving = document.getElementById('drawer-status-saving');
  var drawerStatusError = document.getElementById('drawer-status-error');
  var drawerItemCount = document.getElementById('drawer-item-count');
  var drawerItemsList = document.getElementById('drawer-items-list');
  var drawerSummaryList = document.getElementById('drawer-summary-list');
  var drawerCustomerDetails = document.getElementById('drawer-customer-details');
  var toastEl = document.getElementById('dash-toast');

  // State
  var allOrders = [];
  var activeFilter = 'all';
  var searchQuery = '';
  var sortMode = 'newest';
  var isLoading = false;
  var selectedOrderKey = null;
  var lastFocusedRow = null;
  var lastFetchedUid = null;

  function money(val) {
    return '₹' + Number(val || 0).toLocaleString('en-IN');
  }

  function formatDateShort(ms) {
    if (!ms) return '—';
    return new Date(ms).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ', ' + new Date(ms).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  function formatDateFull(ms) {
    if (!ms) return 'Timestamp unavailable';
    return new Date(ms).toLocaleString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  function statusLabel(status) {
    if (status === 'fulfilled') return 'Fulfilled';
    if (status === 'cancelled') return 'Cancelled';
    return 'Unfulfilled';
  }

  function statusClass(status) {
    if (status === 'fulfilled') return 'status-badge status-badge--fulfilled';
    if (status === 'cancelled') return 'status-badge status-badge--cancelled';
    return 'status-badge status-badge--placed';
  }

  function orderCompositeKey(order) {
    return (order.uid || '') + '::' + (order.id || order.reference || '');
  }

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2400);
  }

  function setSidebarOpen(open) {
    if (!sidebar || !sidebarBackdrop || !sidebarToggle) return;
    sidebar.classList.toggle('is-open', open);
    sidebarBackdrop.hidden = !open;
    sidebarToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function () {
      setSidebarOpen(!sidebar.classList.contains('is-open'));
    });
  }
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', function () { setSidebarOpen(false); });
  }

  function isCurrentAdmin(user) {
    return Boolean(user && user.emailVerified && user.email === ADMIN_EMAIL);
  }

  function renderTopBarAccount(user) {
    if (!topBarAccount) return;
    topBarAccount.textContent = '';
    if (!user) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'topbar-btn';
      btn.textContent = 'Sign in';
      btn.addEventListener('click', triggerGoogleSignIn);
      topBarAccount.appendChild(btn);
      return;
    }

    var pill = document.createElement('div');
    pill.className = 'topbar-user';
    if (user.photoURL) {
      var img = document.createElement('img');
      img.className = 'topbar-user__avatar';
      img.src = user.photoURL;
      img.alt = '';
      img.referrerPolicy = 'no-referrer';
      pill.appendChild(img);
    } else {
      var init = document.createElement('span');
      init.className = 'topbar-user__initial';
      init.textContent = (user.displayName || user.email || 'A').charAt(0).toUpperCase();
      pill.appendChild(init);
    }
    var name = document.createElement('span');
    name.className = 'topbar-user__name';
    name.textContent = user.email || user.displayName || 'Account';
    pill.appendChild(name);

    var signOutBtn = document.createElement('button');
    signOutBtn.type = 'button';
    signOutBtn.className = 'topbar-btn';
    signOutBtn.textContent = 'Sign out';
    signOutBtn.addEventListener('click', async function () {
      var fb = await ensureDashboardFirebase().catch(function () { return null; });
      if (!fb) return;
      signOutBtn.disabled = true;
      try {
        await fb.signOut();
        showToast('Signed out');
      } catch (err) {
        console.error(err);
      } finally {
        signOutBtn.disabled = false;
      }
    });

    topBarAccount.appendChild(pill);
    topBarAccount.appendChild(signOutBtn);
  }

  async function triggerGoogleSignIn(triggerBtn, noteNode) {
    if (triggerBtn) triggerBtn.disabled = true;
    try {
      var fb = await ensureDashboardFirebase();
      var user = await fb.signInWithGoogle();
      if (user) showToast('Signed in as ' + (user.email || user.displayName || 'Google user'));
    } catch (err) {
      console.error(err);
      var code = err && err.code ? String(err.code) : '';
      var msg = err && err.message ? err.message : '';
      if (noteNode) {
        if (code === 'auth/unauthorized-domain' || msg.indexOf('unauthorized-domain') !== -1) {
          noteNode.textContent = 'Add ' + window.location.hostname + ' in Firebase Console → Authentication → Authorized domains.';
        } else if (code === 'auth/popup-blocked' || msg.indexOf('popup-blocked') !== -1) {
          noteNode.textContent = 'Popup was blocked by your browser. Please allow popups and try again.';
        } else {
          noteNode.textContent = 'Could not complete Google sign-in. Please try again.';
        }
      }
    } finally {
      if (triggerBtn) triggerBtn.disabled = false;
    }
  }

  function renderAuthGate(mode, user) {
    if (!authGate || !dashboardContent || !pageActions) return;
    dashboardContent.hidden = true;
    pageActions.hidden = true;
    authGate.hidden = false;
    authGate.textContent = '';

    var iconWrap = document.createElement('div');
    iconWrap.className = 'gate-card__icon';
    iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
    authGate.appendChild(iconWrap);

    var h2 = document.createElement('h2');
    var p = document.createElement('p');
    var actions = document.createElement('div');
    actions.className = 'gate-card__actions';
    var note = document.createElement('p');
    note.className = 'gate-card__note';

    if (mode === 'loading') {
      h2.textContent = 'Checking session…';
      p.textContent = 'Connecting to REDPOLY store authentication.';
      authGate.appendChild(h2);
      authGate.appendChild(p);
      return;
    }

    if (mode === 'signed-out') {
      h2.textContent = 'Sign in to view all orders';
      p.textContent = 'Sign in with your store owner Google account to view placed customer orders, inspect line items, and manage fulfillment.';
      var signInBtn = document.createElement('button');
      signInBtn.type = 'button';
      signInBtn.className = 'btn btn--primary';
      signInBtn.innerHTML = GOOGLE_SVG + '<span>Continue with Google</span>';
      signInBtn.addEventListener('click', function () {
        triggerGoogleSignIn(signInBtn, note);
      });
      var storeBtn = document.createElement('a');
      storeBtn.className = 'btn btn--secondary';
      storeBtn.href = '/';
      storeBtn.textContent = 'Back to storefront';
      actions.appendChild(signInBtn);
      actions.appendChild(storeBtn);
      authGate.appendChild(h2);
      authGate.appendChild(p);
      authGate.appendChild(actions);
      authGate.appendChild(note);
      return;
    }

    // Wrong account signed in
    h2.textContent = 'Store owner access required';
    p.textContent = 'You are signed in as ' + (user && user.email ? user.email : 'a customer account') + '. Storewide order management is restricted to the REDPOLY store owner account.';
    var switchBtn = document.createElement('button');
    switchBtn.type = 'button';
    switchBtn.className = 'btn btn--primary';
    switchBtn.textContent = 'Switch Google account';
    switchBtn.addEventListener('click', function () {
      triggerGoogleSignIn(switchBtn, note);
    });
    var myOrdersLink = document.createElement('a');
    myOrdersLink.className = 'btn btn--secondary';
    myOrdersLink.href = '/account#orders';
    myOrdersLink.textContent = 'View my personal orders';
    actions.appendChild(switchBtn);
    actions.appendChild(myOrdersLink);
    authGate.appendChild(h2);
    authGate.appendChild(p);
    authGate.appendChild(actions);
    authGate.appendChild(note);
  }

  function updateMetricsAndCounts() {
    var totalCount = allOrders.length;
    var revenue = 0;
    var itemsSold = 0;
    var placedCount = 0;
    var fulfilledCount = 0;
    var cancelledCount = 0;
    var expressCount = 0;

    allOrders.forEach(function (o) {
      if (o.status !== 'cancelled') {
        revenue += Number(o.total || 0);
      }
      itemsSold += Number(o.itemCount || 0);
      if (o.status === 'placed') placedCount += 1;
      else if (o.status === 'fulfilled') fulfilledCount += 1;
      else if (o.status === 'cancelled') cancelledCount += 1;
      if (o.shippingMethod === 'express') expressCount += 1;
    });

    if (sidebarOrdersCount) sidebarOrdersCount.textContent = String(totalCount);
    if (metricTotalOrders) metricTotalOrders.textContent = String(totalCount);
    if (metricGrossSales) metricGrossSales.textContent = money(revenue);
    if (metricItemsOrdered) metricItemsOrdered.textContent = String(itemsSold);
    if (metricUnfulfilled) metricUnfulfilled.textContent = String(placedCount);

    if (tabCountAll) tabCountAll.textContent = String(totalCount);
    if (tabCountPlaced) tabCountPlaced.textContent = String(placedCount);
    if (tabCountFulfilled) tabCountFulfilled.textContent = String(fulfilledCount);
    if (tabCountCancelled) tabCountCancelled.textContent = String(cancelledCount);
    if (tabCountExpress) tabCountExpress.textContent = String(expressCount);

    if (exportCsvBtn) exportCsvBtn.disabled = totalCount === 0;
  }

  function filteredAndSortedOrders() {
    var q = searchQuery.trim().toLowerCase();
    var list = allOrders.filter(function (o) {
      if (activeFilter === 'placed' && o.status !== 'placed') return false;
      if (activeFilter === 'fulfilled' && o.status !== 'fulfilled') return false;
      if (activeFilter === 'cancelled' && o.status !== 'cancelled') return false;
      if (activeFilter === 'express' && o.shippingMethod !== 'express') return false;
      if (!q) return true;
      var itemsStr = (o.items || []).map(function (i) { return i.name; }).join(' ').toLowerCase();
      var haystack = [
        o.reference,
        o.customerName,
        o.email,
        o.phone,
        o.city,
        o.state,
        o.pin,
        itemsStr
      ].join(' ').toLowerCase();
      return haystack.indexOf(q) !== -1;
    });

    list.sort(function (a, b) {
      if (sortMode === 'oldest') return a.createdAtMs - b.createdAtMs;
      if (sortMode === 'total-desc') return Number(b.total || 0) - Number(a.total || 0);
      if (sortMode === 'total-asc') return Number(a.total || 0) - Number(b.total || 0);
      return b.createdAtMs - a.createdAtMs;
    });

    return list;
  }

  function renderTable() {
    if (!tbody || !tableWrap || !emptyEl || !skeletonEl || !tableFooter) return;
    skeletonEl.hidden = !isLoading;

    if (isLoading) {
      tableWrap.hidden = true;
      emptyEl.hidden = true;
      tableFooter.hidden = true;
      return;
    }

    var rows = filteredAndSortedOrders();
    tbody.textContent = '';

    if (!rows.length) {
      tableWrap.hidden = true;
      tableFooter.hidden = true;
      emptyEl.hidden = false;
      emptyActions.textContent = '';

      if (!allOrders.length) {
        emptyTitle.textContent = 'No orders placed yet';
        emptyCopy.textContent = 'Once a customer completes checkout while signed in, their order appears here immediately.';
        var shopLink = document.createElement('a');
        shopLink.className = 'btn btn--primary btn--sm';
        shopLink.href = '/checkout';
        shopLink.textContent = 'Open store checkout';
        emptyActions.appendChild(shopLink);
      } else {
        emptyTitle.textContent = 'No orders match your filters';
        emptyCopy.textContent = 'Try clearing your search or switching back to the All orders tab.';
        var resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'btn btn--secondary btn--sm';
        resetBtn.textContent = 'Clear filters';
        resetBtn.addEventListener('click', resetFilters);
        emptyActions.appendChild(resetBtn);
      }
      return;
    }

    emptyEl.hidden = true;
    tableWrap.hidden = false;
    tableFooter.hidden = false;
    showingText.textContent = 'Showing ' + rows.length + ' of ' + allOrders.length + (allOrders.length === 1 ? ' order' : ' orders');

    rows.forEach(function (order) {
      var tr = document.createElement('tr');
      var key = orderCompositeKey(order);
      if (key === selectedOrderKey) tr.classList.add('is-selected');
      tr.tabIndex = 0;
      tr.setAttribute('aria-label', 'Inspect order ' + order.reference + ' from ' + order.customerName);

      // 1. Order ref
      var tdRef = document.createElement('td');
      tdRef.className = 'cell-ref';
      tdRef.textContent = '#' + (order.reference || order.id);

      // 2. Date
      var tdDate = document.createElement('td');
      tdDate.className = 'cell-date';
      tdDate.textContent = formatDateShort(order.createdAtMs);

      // 3. Customer
      var tdCustomer = document.createElement('td');
      tdCustomer.className = 'cell-customer';
      var cName = document.createElement('strong');
      cName.textContent = order.customerName || 'Customer';
      var cEmail = document.createElement('span');
      cEmail.textContent = order.email || ('+91 ' + order.phone);
      tdCustomer.appendChild(cName);
      tdCustomer.appendChild(cEmail);

      // 4. Destination
      var tdDest = document.createElement('td');
      tdDest.className = 'cell-dest';
      tdDest.textContent = [order.city, order.pin].filter(Boolean).join(', ') || '—';

      // 5. Payment
      var tdPay = document.createElement('td');
      var payBadge = document.createElement('span');
      payBadge.className = 'status-badge status-badge--neutral';
      payBadge.textContent = 'Demo';
      tdPay.appendChild(payBadge);

      // 6. Fulfillment
      var tdStatus = document.createElement('td');
      var stBadge = document.createElement('span');
      stBadge.className = statusClass(order.status);
      stBadge.textContent = statusLabel(order.status);
      tdStatus.appendChild(stBadge);

      // 7. Items
      var tdItems = document.createElement('td');
      tdItems.className = 'cell-items';
      var countStrong = document.createElement('strong');
      var qty = Number(order.itemCount || 0);
      countStrong.textContent = qty + (qty === 1 ? ' item' : ' items');
      var itemsPreview = document.createElement('span');
      itemsPreview.textContent = (order.items && order.items.length)
        ? order.items.map(function (i) { return i.quantity + '× ' + i.name; }).join(', ')
        : '—';
      tdItems.appendChild(countStrong);
      tdItems.appendChild(itemsPreview);

      // 8. Delivery
      var tdDelivery = document.createElement('td');
      tdDelivery.className = 'cell-delivery';
      tdDelivery.textContent = order.shippingMethod === 'express' ? 'Express' : 'Standard';
      if (order.freeGift) {
        var gift = document.createElement('small');
        gift.textContent = '+ Free gift';
        tdDelivery.appendChild(gift);
      }

      // 9. Total
      var tdTotal = document.createElement('td');
      tdTotal.className = 'col-num cell-total';
      tdTotal.textContent = money(order.total);

      tr.appendChild(tdRef);
      tr.appendChild(tdDate);
      tr.appendChild(tdCustomer);
      tr.appendChild(tdDest);
      tr.appendChild(tdPay);
      tr.appendChild(tdStatus);
      tr.appendChild(tdItems);
      tr.appendChild(tdDelivery);
      tr.appendChild(tdTotal);

      tr.addEventListener('click', function () {
        openOrderDrawer(order, tr);
      });
      tr.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openOrderDrawer(order, tr);
        }
      });

      tbody.appendChild(tr);
    });
  }

  function renderDrawerContent(order) {
    if (!order) return;
    drawerOrderRef.textContent = '#' + (order.reference || order.id);
    drawerStatusBadge.className = statusClass(order.status);
    drawerStatusBadge.textContent = statusLabel(order.status);
    drawerOrderDate.textContent = formatDateFull(order.createdAtMs);
    drawerStatusError.hidden = true;
    drawerStatusError.textContent = '';

    Array.prototype.forEach.call(drawerStatusActions.querySelectorAll('[data-status-action]'), function (btn) {
      var target = btn.getAttribute('data-status-action');
      btn.disabled = (target === order.status);
    });

    // Items list
    var qtyTotal = Number(order.itemCount || 0);
    drawerItemCount.textContent = qtyTotal + (qtyTotal === 1 ? ' item' : ' items');
    drawerItemsList.textContent = '';
    (order.items || []).forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'drawer-item';
      var cat = CATALOGUE[item.name];
      if (cat && cat.image) {
        var img = document.createElement('img');
        img.className = 'drawer-item__img';
        img.src = cat.image;
        img.alt = '';
        li.appendChild(img);
      }
      var copy = document.createElement('div');
      copy.className = 'drawer-item__copy';
      if (cat && cat.href) {
        var link = document.createElement('a');
        link.className = 'drawer-item__name';
        link.href = cat.href;
        link.textContent = item.name;
        copy.appendChild(link);
      } else {
        var nameStrong = document.createElement('strong');
        nameStrong.className = 'drawer-item__name';
        nameStrong.textContent = item.name;
        copy.appendChild(nameStrong);
      }
      var meta = document.createElement('span');
      meta.className = 'drawer-item__meta';
      meta.textContent = item.quantity + ' × ' + money(item.price);
      copy.appendChild(meta);

      var tot = document.createElement('strong');
      tot.className = 'drawer-item__total';
      tot.textContent = money(Number(item.price) * Number(item.quantity));

      li.appendChild(copy);
      li.appendChild(tot);
      drawerItemsList.appendChild(li);
    });

    // Financial breakdown
    drawerSummaryList.textContent = '';
    var summaryRows = [
      ['Subtotal', money(order.subtotal)],
      ['Shipping (' + (order.shippingMethod === 'express' ? 'Express' : 'Standard') + ')', order.freeShipping || !order.shippingCost ? 'Free' : money(order.shippingCost)],
      ['Includes GST (' + (order.gstRate || 12) + '%)', money(order.gst)]
    ];
    if (order.freeGift) {
      summaryRows.push(['Free mystery gift', 'Included']);
    }
    summaryRows.push(['Total', money(order.total), true]);

    summaryRows.forEach(function (pair) {
      var row = document.createElement('div');
      row.className = 'summary-list__row' + (pair[2] ? ' summary-list__row--total' : '');
      var dt = document.createElement('dt');
      dt.textContent = pair[0];
      var dd = document.createElement('dd');
      dd.textContent = pair[1];
      row.appendChild(dt);
      row.appendChild(dd);
      drawerSummaryList.appendChild(row);
    });

    // Customer & shipping details
    drawerCustomerDetails.textContent = '';
    var cName = document.createElement('strong');
    cName.textContent = order.customerName || '—';
    drawerCustomerDetails.appendChild(cName);

    [
      order.email,
      order.phone ? '+91 ' + order.phone : '',
      order.address,
      [order.city, order.state].filter(Boolean).join(', ') + (order.pin ? ' — ' + order.pin : '')
    ].filter(Boolean).forEach(function (line) {
      var p = document.createElement('p');
      p.textContent = line;
      drawerCustomerDetails.appendChild(p);
    });

    if (order.uid) {
      var uidNote = document.createElement('p');
      uidNote.className = 'customer-details__mono';
      uidNote.textContent = 'Customer ID: ' + order.uid;
      drawerCustomerDetails.appendChild(uidNote);
    }
  }

  function openOrderDrawer(order, rowEl) {
    selectedOrderKey = orderCompositeKey(order);
    lastFocusedRow = rowEl || null;
    renderTable();
    renderDrawerContent(order);
    drawerLayer.hidden = false;
    drawerEl.focus();
  }

  function closeOrderDrawer() {
    if (drawerLayer.hidden) return;
    drawerLayer.hidden = true;
    selectedOrderKey = null;
    renderTable();
    if (lastFocusedRow && typeof lastFocusedRow.focus === 'function') {
      lastFocusedRow.focus();
    }
    lastFocusedRow = null;
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeOrderDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeOrderDrawer);

  if (drawerStatusActions) {
    drawerStatusActions.addEventListener('click', async function (event) {
      var btn = event.target.closest('[data-status-action]');
      if (!btn || !selectedOrderKey) return;
      var nextStatus = btn.getAttribute('data-status-action');
      var order = allOrders.find(function (o) { return orderCompositeKey(o) === selectedOrderKey; });
      if (!order || !order.uid || !order.id || order.status === nextStatus) return;

      drawerStatusSaving.hidden = false;
      drawerStatusError.hidden = true;
      Array.prototype.forEach.call(drawerStatusActions.querySelectorAll('button'), function (b) { b.disabled = true; });

      try {
        var fb = await ensureDashboardFirebase();
        await fb.updateOrderStatus(order.uid, order.id, nextStatus);
        order.status = nextStatus;
        updateMetricsAndCounts();
        renderTable();
        renderDrawerContent(order);
        showToast('Order #' + order.reference + ' marked ' + statusLabel(nextStatus).toLowerCase());
      } catch (err) {
        console.error(err);
        drawerStatusError.textContent = 'Could not update order status. Please check permissions and try again.';
        drawerStatusError.hidden = false;
        renderDrawerContent(order);
      } finally {
        drawerStatusSaving.hidden = true;
      }
    });
  }

  function resetFilters() {
    activeFilter = 'all';
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.hidden = true;
    Array.prototype.forEach.call(filterTabsEl.querySelectorAll('.orders-tab'), function (tab) {
      var isAll = tab.getAttribute('data-filter') === 'all';
      tab.classList.toggle('is-active', isAll);
      tab.setAttribute('aria-selected', isAll ? 'true' : 'false');
    });
    renderTable();
  }

  if (filterTabsEl) {
    filterTabsEl.addEventListener('click', function (event) {
      var tab = event.target.closest('[data-filter]');
      if (!tab) return;
      activeFilter = tab.getAttribute('data-filter') || 'all';
      Array.prototype.forEach.call(filterTabsEl.querySelectorAll('.orders-tab'), function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      renderTable();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchQuery = searchInput.value || '';
      if (searchClearBtn) searchClearBtn.hidden = !searchQuery;
      renderTable();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', function () {
      searchQuery = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchClearBtn.hidden = true;
      renderTable();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      sortMode = sortSelect.value || 'newest';
      renderTable();
    });
  }

  function escapeCsvCell(val) {
    var str = String(val == null ? '' : val);
    if (/[",\n\r]/.test(str)) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', function () {
      var rows = filteredAndSortedOrders();
      if (!rows.length) return;
      var headers = ['Order Reference', 'Date', 'Customer Name', 'Email', 'Phone', 'Address', 'City', 'State', 'PIN', 'Shipping Method', 'Status', 'Items', 'Item Count', 'Subtotal (INR)', 'Shipping (INR)', 'GST (INR)', 'Total (INR)'];
      var lines = [headers.map(escapeCsvCell).join(',')];
      rows.forEach(function (o) {
        var itemSummary = (o.items || []).map(function (i) { return i.quantity + 'x ' + i.name; }).join('; ');
        lines.push([
          o.reference,
          o.createdAtMs ? new Date(o.createdAtMs).toISOString() : '',
          o.customerName,
          o.email,
          o.phone,
          o.address,
          o.city,
          o.state,
          o.pin,
          o.shippingMethod,
          o.status,
          itemSummary,
          o.itemCount,
          o.subtotal,
          o.shippingCost,
          o.gst,
          o.total
        ].map(escapeCsvCell).join(','));
      });
      var blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'redpoly-orders-' + new Date().toISOString().slice(0, 10) + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Exported ' + rows.length + (rows.length === 1 ? ' order' : ' orders') + ' to CSV');
    });
  }

  async function loadAllOrders(force) {
    var fb = await ensureDashboardFirebase();
    var user = fb.getUser();
    if (!isCurrentAdmin(user)) return;
    if (isLoading && !force) return;

    isLoading = true;
    if (refreshBtn) refreshBtn.disabled = true;
    errorBanner.hidden = true;
    renderTable();

    try {
      allOrders = await fb.listAllOrders();
      updateMetricsAndCounts();
      if (selectedOrderKey) {
        var stillExists = allOrders.find(function (o) { return orderCompositeKey(o) === selectedOrderKey; });
        if (stillExists) renderDrawerContent(stillExists);
        else closeOrderDrawer();
      }
    } catch (err) {
      console.error(err);
      errorText.textContent = 'Could not load store orders from Firestore. Ensure Firestore rules are deployed and try again.';
      errorBanner.hidden = false;
    } finally {
      isLoading = false;
      if (refreshBtn) refreshBtn.disabled = false;
      renderTable();
    }
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      loadAllOrders(true);
    });
  }
  if (retryBtn) {
    retryBtn.addEventListener('click', function () {
      loadAllOrders(true);
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (!drawerLayer.hidden) {
        closeOrderDrawer();
      } else if (sidebar && sidebar.classList.contains('is-open')) {
        setSidebarOpen(false);
      }
    }
  });

  function syncSession() {
    var fb = window.RedpolyFirebase;
    if (!fb || !fb.isReady()) {
      renderTopBarAccount(null);
      renderAuthGate('loading', null);
      return;
    }

    var user = fb.getUser();
    renderTopBarAccount(user);

    if (!user) {
      allOrders = [];
      lastFetchedUid = null;
      closeOrderDrawer();
      updateMetricsAndCounts();
      renderAuthGate('signed-out', null);
      return;
    }

    if (!isCurrentAdmin(user)) {
      allOrders = [];
      lastFetchedUid = null;
      closeOrderDrawer();
      updateMetricsAndCounts();
      renderAuthGate('forbidden', user);
      return;
    }

    authGate.hidden = true;
    pageActions.hidden = false;
    dashboardContent.hidden = false;

    if (lastFetchedUid !== user.uid) {
      lastFetchedUid = user.uid;
      loadAllOrders(true);
    }
  }

  window.addEventListener('redpoly:firebase-ready', syncSession);
  window.addEventListener('redpoly:auth-changed', syncSession);

  // Boot
  renderAuthGate('loading', null);
  ensureDashboardFirebase().then(function () {
    syncSession();
  }).catch(function (err) {
    console.error('Failed to bootstrap Firebase for dashboard:', err);
    renderAuthGate('signed-out', null);
  });
})();
