/* REDPOLY Shopify-minimal Orders & Reviews Admin Dashboard */
(function () {
  var ADMIN_EMAIL = 'ashketchupkeke@gmail.com';
  var FREE_STANDARD_FROM = 2000;
  var FREE_EXPRESS_FROM = 5000;
  var FREE_GIFT_FROM = 3500;
  var GST_RATE = 12;

  var CATALOGUE = {
    'BUBBLE GUN': { price: 499, href: '/bubble-gun', image: '/assets/images/redpoly/products/bubble-gun-thumb.webp?v=bubble-20261121' },
    'STUNT PET': { price: 599, href: '/stunt-pet', image: '/assets/images/redpoly/products/stunt-pet-thumb.webp?v=pet-20261122' },
    'MINI COOL CAR': { price: 749, href: '/mini-cool-car', image: '/assets/images/redpoly/products/mini-cool-car-thumb.webp?v=car-20261117' },
    'GEL STORM': { price: 1999, href: '/gel-storm', image: '/assets/images/redpoly/products/gel-storm-thumb.webp?v=gel-20261121' },
    'MECHA ROVER': { price: 499, href: '/mecha-rover', image: '/assets/images/redpoly/products/mecha-rover-thumb.webp?v=mecha-20261120' },
    'PIXEL SPLASH': { price: 1749, href: '/pixel-splash', image: '/assets/images/redpoly/products/pixel-splash-thumb.webp?v=pixel-20261117-v3' },
    'CUTE DINOS GREEN': { price: 249, href: '/cute-dinos?colour=green', image: '/assets/images/redpoly/products/cute-dinos-green-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS RED': { price: 249, href: '/cute-dinos?colour=red', image: '/assets/images/redpoly/products/cute-dinos-red-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS TEAL': { price: 249, href: '/cute-dinos?colour=teal', image: '/assets/images/redpoly/products/cute-dinos-teal-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS TRIO': { price: 549, href: '/cute-dinos?pack=trio', image: '/assets/images/redpoly/products/cute-dinos-trio-thumb.webp?v=dinos-20261116' }
  };

  var VALID_ORDER_STATUSES = ['placed', 'created', 'processed', 'shipped', 'out_for_delivery', 'delivered', 'fulfilled', 'cancelled'];
  var VALID_PRODUCT_SLUGS = ['bubble-gun', 'stunt-pet', 'mini-cool-car', 'gel-storm', 'mecha-rover', 'pixel-splash', 'cute-dinos'];
  var PRODUCT_PAGE_BY_SLUG = {
    'bubble-gun': '/bubble-gun#product-reviews',
    'stunt-pet': '/stunt-pet#product-reviews',
    'mini-cool-car': '/mini-cool-car#product-reviews',
    'gel-storm': '/gel-storm#product-reviews',
    'mecha-rover': '/mecha-rover#product-reviews',
    'pixel-splash': '/pixel-splash#product-reviews',
    'cute-dinos': '/cute-dinos#product-reviews'
  };

  var GOOGLE_SVG = '<svg class="google-btn-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5H1.2v3.1C3.2 21.4 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.2 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.2C.4 8.2 0 10.1 0 12s.4 3.8 1.2 5.4l4-3.1z"/><path fill="#EA4335" d="M12 4.7c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.2 2.6 1.2 6.6l4 3.1c1-2.9 3.7-5 6.8-5z"/></svg>';

  function normalizeOrderStatus(raw) {
    var s = String(raw || '');
    return VALID_ORDER_STATUSES.indexOf(s) !== -1 ? s : 'placed';
  }
  function isDeliveredStatus(status) {
    return status === 'delivered' || status === 'fulfilled';
  }
  function isOpenStatus(status) {
    return status !== 'delivered' && status !== 'fulfilled' && status !== 'cancelled';
  }
  function isShippedStage(status) {
    return status === 'shipped' || status === 'out_for_delivery';
  }
  function canonicalStatusForControls(status) {
    if (status === 'placed') return 'created';
    if (status === 'fulfilled') return 'delivered';
    return status;
  }
  function statusMeta(status) {
    if (status === 'processed') return { label: 'Order Processed', percent: 15, badgeClass: 'status-badge status-badge--processed' };
    if (status === 'shipped') return { label: 'Order Shipped', percent: 50, badgeClass: 'status-badge status-badge--shipped' };
    if (status === 'out_for_delivery') return { label: 'Out for Delivery', percent: 90, badgeClass: 'status-badge status-badge--out' };
    if (status === 'delivered' || status === 'fulfilled') return { label: 'Order Delivered', percent: 100, badgeClass: 'status-badge status-badge--fulfilled' };
    if (status === 'cancelled') return { label: 'Cancelled', percent: 0, badgeClass: 'status-badge status-badge--cancelled' };
    return { label: 'Order Created', percent: 0, badgeClass: 'status-badge status-badge--placed' };
  }

  // Standalone Firebase ESM bootstrap fallback (when loaded without /firebase-client.js)
  var dashBootstrapPromise = null;
  function ensureDashboardFirebase() {
    if (
      window.RedpolyFirebase &&
      typeof window.RedpolyFirebase.listAllOrders === 'function' &&
      typeof window.RedpolyFirebase.updateOrderDetails === 'function' &&
      typeof window.RedpolyFirebase.listAllReviews === 'function'
    ) {
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

      if (
        window.RedpolyFirebase &&
        typeof window.RedpolyFirebase.listAllOrders === 'function' &&
        typeof window.RedpolyFirebase.updateOrderDetails === 'function' &&
        typeof window.RedpolyFirebase.listAllReviews === 'function'
      ) {
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

      var LIMITS = {
        ID_PATTERN: /^[a-zA-Z0-9_\-]+$/,
        FULL_NAME_MAX: 120,
        EMAIL_MAX: 200,
        PHONE_PATTERN: /^[6-9][0-9]{9}$/,
        ADDRESS_MAX: 300,
        PIN_PATTERN: /^[1-9][0-9]{5}$/,
        CITY_MAX: 100,
        STATE_MAX: 100,
        QTY_MIN: 1,
        QTY_MAX: 99
      };

      function clampQty(raw) {
        var n = Math.floor(Number(raw));
        if (!Number.isFinite(n)) return 1;
        return Math.min(LIMITS.QTY_MAX, Math.max(LIMITS.QTY_MIN, n));
      }
      function itemSlug(name) {
        return String(name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      function inCatalogue(name, price) {
        var entry = CATALOGUE[name];
        return Boolean(entry && Number(price) === entry.price);
      }

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

      function sanitizePhoto(url) {
        if (!url || typeof url !== 'string') return '';
        var trimmed = url.trim().slice(0, 500);
        return trimmed.indexOf('https://') === 0 ? trimmed : '';
      }

      function toReviewRecord(docId, d, fallbackSlug) {
        var createdTs = d.createdAt;
        var modTs = d.moderatedAt;
        var rawSlug = String(d.productSlug || fallbackSlug || '');
        var productSlug = VALID_PRODUCT_SLUGS.indexOf(rawSlug) !== -1 ? rawSlug : 'bubble-gun';
        var rawStatus = String(d.status || 'pending');
        var status = (rawStatus === 'approved' || rawStatus === 'rejected') ? rawStatus : 'pending';
        return {
          id: docId,
          uid: String(d.uid || ''),
          orderId: String(d.orderId || ''),
          orderReference: String(d.orderReference || ''),
          productSlug: productSlug,
          itemSlug: String(d.itemSlug || ''),
          productName: String(d.productName || ''),
          authorName: String(d.authorName || 'Verified Buyer'),
          rating: Math.max(1, Math.min(5, Math.round(Number(d.rating || 5)))),
          title: String(d.title || ''),
          body: String(d.body || ''),
          status: status,
          verifiedPurchase: d.verifiedPurchase !== false,
          createdAtMs: createdTs && typeof createdTs.toMillis === 'function' ? createdTs.toMillis() : 0,
          moderatedAtMs: modTs && typeof modTs.toMillis === 'function' ? modTs.toMillis() : 0
        };
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
          if (!isAdminUser()) throw new Error('Admin access required to view all store orders.');
          try {
            var snapshot = await fsMod.getDocs(fsMod.collectionGroup(db, 'orders'));
            var orders = await Promise.all(snapshot.docs.map(async function (docSnap) {
              var d = docSnap.data();
              var ts = d.createdAt;
              var createdAtMs = ts && typeof ts.toMillis === 'function' ? ts.toMillis() : 0;
              var deliveredTs = d.deliveredAt;
              var deliveredAtMs = deliveredTs && typeof deliveredTs.toMillis === 'function' ? deliveredTs.toMillis() : 0;
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
                itemCount: Number(d.itemCount || lineItems.reduce(function (sum, item) { return sum + Number(item.quantity || 0); }, 0)),
                status: normalizeOrderStatus(d.status),
                trackingCode: String(d.trackingCode || ''),
                trackingCarrier: String(d.trackingCarrier || ''),
                deliveredAtMs: deliveredAtMs,
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
          if (!LIMITS.ID_PATTERN.test(uid) || !LIMITS.ID_PATTERN.test(orderId)) throw new Error('Invalid order identifier.');
          if (VALID_ORDER_STATUSES.indexOf(status) === -1) throw new Error('Invalid order status.');
          var orderPath = 'users/' + uid + '/orders/' + orderId;
          try {
            var payload = { status: status };
            if (isDeliveredStatus(status)) payload.deliveredAt = fsMod.serverTimestamp();
            await fsMod.updateDoc(fsMod.doc(db, 'users', uid, 'orders', orderId), payload);
          } catch (error) {
            handleFirestoreError(error, 'update', orderPath);
          }
        },
        updateOrderDetails: async function (uid, orderId, patch) {
          if (!isAdminUser()) throw new Error('Admin access required to edit order details.');
          if (!LIMITS.ID_PATTERN.test(uid) || !LIMITS.ID_PATTERN.test(orderId)) throw new Error('Invalid order identifier.');
          var orderPath = 'users/' + uid + '/orders/' + orderId;
          var orderRef = fsMod.doc(db, 'users', uid, 'orders', orderId);
          try {
            var existingSnap = await fsMod.getDoc(orderRef);
            if (!existingSnap.exists()) throw new Error('Order does not exist.');
            var existingData = existingSnap.data();

            var customerName = String(patch.customerName !== undefined ? patch.customerName : (existingData.customerName || '')).trim().slice(0, LIMITS.FULL_NAME_MAX);
            var email = String(patch.email !== undefined ? patch.email : (existingData.email || '')).trim().slice(0, LIMITS.EMAIL_MAX);
            var phone = String(patch.phone !== undefined ? patch.phone : (existingData.phone || '')).trim();
            var address = String(patch.address !== undefined ? patch.address : (existingData.address || '')).trim().slice(0, LIMITS.ADDRESS_MAX);
            var pin = String(patch.pin !== undefined ? patch.pin : (existingData.pin || '')).trim();
            var city = String(patch.city !== undefined ? patch.city : (existingData.city || '')).trim().slice(0, LIMITS.CITY_MAX);
            var state = String(patch.state !== undefined ? patch.state : (existingData.state || '')).trim().slice(0, LIMITS.STATE_MAX);

            if (!customerName) throw new Error('Customer name is required.');
            if (!email || email.length < 3) throw new Error('Valid email is required.');
            if (!LIMITS.PHONE_PATTERN.test(phone)) throw new Error('Enter a valid 10-digit Indian mobile number.');
            if (!address) throw new Error('Street address is required.');
            if (!LIMITS.PIN_PATTERN.test(pin)) throw new Error('Enter a valid 6-digit Indian PIN code.');
            if (!city || !state) throw new Error('City and state are required.');

            var shippingMethod = (patch.shippingMethod || existingData.shippingMethod) === 'express' ? 'express' : 'standard';
            var nextStatus = patch.status !== undefined ? normalizeOrderStatus(patch.status) : normalizeOrderStatus(existingData.status);
            var trackingCode = String(patch.trackingCode !== undefined ? patch.trackingCode : (existingData.trackingCode || '')).trim().slice(0, 64);
            var trackingCarrier = String(patch.trackingCarrier !== undefined ? patch.trackingCarrier : (existingData.trackingCarrier || '')).trim().slice(0, 64);

            var existingItemsSnap = await fsMod.getDocs(fsMod.collection(orderRef, 'items'));
            var existingItemsMap = new Map();
            existingItemsSnap.forEach(function (docSnap) {
              var d = docSnap.data();
              if (typeof d.name === 'string') existingItemsMap.set(docSnap.id, { name: d.name, price: Number(d.price), quantity: clampQty(d.quantity) });
            });

            var resolvedItems = patch.items !== undefined
              ? patch.items.filter(function (i) { return inCatalogue(i.name, i.price); }).map(function (i) { return { name: i.name, price: CATALOGUE[i.name].price, quantity: clampQty(i.quantity) }; })
              : Array.from(existingItemsMap.values());
            if (!resolvedItems.length) throw new Error('Order must contain at least one valid product.');

            var mergedBySlug = new Map();
            resolvedItems.forEach(function (item) {
              var slug = itemSlug(item.name);
              if (!LIMITS.ID_PATTERN.test(slug)) return;
              var prev = mergedBySlug.get(slug);
              if (prev) prev.quantity = clampQty(prev.quantity + item.quantity);
              else mergedBySlug.set(slug, Object.assign({}, item));
            });

            var finalItems = Array.from(mergedBySlug.values());
            var subtotal = finalItems.reduce(function (s, i) { return s + i.price * i.quantity; }, 0);
            var itemCount = finalItems.reduce(function (s, i) { return s + i.quantity; }, 0);
            var freeShipping = shippingMethod === 'express' ? subtotal >= FREE_EXPRESS_FROM : subtotal >= FREE_STANDARD_FROM;
            var freeGift = subtotal >= FREE_GIFT_FROM;
            var shippingCost = freeShipping ? 0 : (shippingMethod === 'express' ? 120 : 30);
            var gst = Math.round((subtotal * GST_RATE) / (100 + GST_RATE));
            var total = subtotal + shippingCost;

            var orderUpdate = {
              customerName: customerName, email: email, phone: phone, address: address, pin: pin, city: city, state: state,
              shippingMethod: shippingMethod, shippingCost: shippingCost, freeShipping: freeShipping, freeGift: freeGift,
              subtotal: subtotal, gst: gst, total: total, itemCount: itemCount, status: nextStatus,
              trackingCode: trackingCode, trackingCarrier: trackingCarrier
            };

            var existingDeliveredTs = existingData.deliveredAt;
            var alreadyDeliveredAtMs = existingDeliveredTs && typeof existingDeliveredTs.toMillis === 'function' ? existingDeliveredTs.toMillis() : 0;
            var prevStatus = normalizeOrderStatus(existingData.status);
            if (isDeliveredStatus(nextStatus) && (!isDeliveredStatus(prevStatus) || !alreadyDeliveredAtMs)) {
              orderUpdate.deliveredAt = fsMod.serverTimestamp();
            }

            var batch = fsMod.writeBatch(db);
            if (patch.items !== undefined) {
              existingItemsMap.forEach(function (_v, slug) {
                if (!mergedBySlug.has(slug)) batch.delete(fsMod.doc(db, 'users', uid, 'orders', orderId, 'items', slug));
              });
              mergedBySlug.forEach(function (item, slug) {
                batch.set(fsMod.doc(db, 'users', uid, 'orders', orderId, 'items', slug), {
                  uid: uid, orderId: orderId, name: item.name, price: item.price, quantity: item.quantity
                });
              });
            }
            batch.update(orderRef, orderUpdate);
            await batch.commit();

            var createdTs = existingData.createdAt;
            return {
              id: orderId, uid: uid, reference: String(existingData.reference || ''),
              customerName: customerName, email: email, phone: phone, address: address, pin: pin, city: city, state: state,
              shippingMethod: shippingMethod, shippingCost: shippingCost, freeShipping: freeShipping, freeGift: freeGift,
              subtotal: subtotal, gstRate: Number(existingData.gstRate || GST_RATE), gst: gst, total: total, itemCount: itemCount,
              status: nextStatus, trackingCode: trackingCode, trackingCarrier: trackingCarrier,
              deliveredAtMs: isDeliveredStatus(nextStatus) ? (alreadyDeliveredAtMs || Date.now()) : alreadyDeliveredAtMs,
              createdAtMs: createdTs && typeof createdTs.toMillis === 'function' ? createdTs.toMillis() : 0,
              items: finalItems
            };
          } catch (error) {
            if (error instanceof Error && error.message && error.message.charAt(0) !== '{') throw error;
            handleFirestoreError(error, 'update', orderPath);
          }
        },
        listAllReviews: async function () {
          if (!isAdminUser()) throw new Error('Admin access required to manage product reviews.');
          try {
            var snap = await fsMod.getDocs(fsMod.collectionGroup(db, 'reviews'));
            var reviews = [];
            snap.forEach(function (docSnap) {
              var parentSlug = docSnap.ref.parent && docSnap.ref.parent.parent ? docSnap.ref.parent.parent.id : '';
              reviews.push(toReviewRecord(docSnap.id, docSnap.data(), parentSlug));
            });
            reviews.sort(function (a, b) { return b.createdAtMs - a.createdAtMs; });
            return reviews;
          } catch (error) {
            handleFirestoreError(error, 'list', 'reviews');
          }
        },
        moderateReview: async function (productSlug, reviewId, status) {
          if (!isAdminUser()) throw new Error('Admin access required to moderate reviews.');
          if (VALID_PRODUCT_SLUGS.indexOf(productSlug) === -1 || !LIMITS.ID_PATTERN.test(reviewId)) throw new Error('Invalid review identifier.');
          if (status !== 'pending' && status !== 'approved' && status !== 'rejected') throw new Error('Invalid review moderation status.');
          var reviewPath = 'products/' + productSlug + '/reviews/' + reviewId;
          try {
            await fsMod.updateDoc(fsMod.doc(db, 'products', productSlug, 'reviews', reviewId), {
              status: status, moderatedAt: fsMod.serverTimestamp()
            });
          } catch (error) {
            handleFirestoreError(error, 'update', reviewPath);
          }
        },
        deleteReview: async function (productSlug, reviewId) {
          if (!isAdminUser()) throw new Error('Admin access required to delete reviews.');
          if (VALID_PRODUCT_SLUGS.indexOf(productSlug) === -1 || !LIMITS.ID_PATTERN.test(reviewId)) throw new Error('Invalid review identifier.');
          var reviewPath = 'products/' + productSlug + '/reviews/' + reviewId;
          try {
            await fsMod.deleteDoc(fsMod.doc(db, 'products', productSlug, 'reviews', reviewId));
          } catch (error) {
            handleFirestoreError(error, 'delete', reviewPath);
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
  var navOrdersLink = document.getElementById('nav-orders');
  var navReviewsLink = document.getElementById('nav-reviews');
  var sidebarOrdersCount = document.getElementById('sidebar-orders-count');
  var sidebarReviewsCount = document.getElementById('sidebar-reviews-count');
  var pageTitleEl = document.getElementById('page-title');

  var pageActions = document.getElementById('page-actions');
  var refreshBtn = document.getElementById('refresh-orders-btn');
  var exportCsvBtn = document.getElementById('export-csv-btn');
  var authGate = document.getElementById('auth-gate');
  var dashboardContent = document.getElementById('dashboard-content');
  var ordersView = document.getElementById('orders-view');
  var reviewsView = document.getElementById('reviews-view');

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
  var tabCountShipped = document.getElementById('tab-count-shipped');
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

  // Drawer DOM
  var drawerLayer = document.getElementById('order-drawer-layer');
  var drawerBackdrop = document.getElementById('drawer-backdrop');
  var drawerEl = document.getElementById('order-drawer');
  var drawerCloseBtn = document.getElementById('drawer-close-btn');
  var drawerEditToggle = document.getElementById('drawer-edit-toggle');
  var drawerOrderRef = document.getElementById('drawer-order-ref');
  var drawerStatusBadge = document.getElementById('drawer-status-badge');
  var drawerOrderDate = document.getElementById('drawer-order-date');
  var drawerReadView = document.getElementById('drawer-read-view');
  var drawerProgressFill = document.getElementById('drawer-progress-fill');
  var drawerStatusActions = document.getElementById('drawer-status-actions');
  var drawerStatusSaving = document.getElementById('drawer-status-saving');
  var drawerStatusError = document.getElementById('drawer-status-error');
  var drawerTrackingForm = document.getElementById('drawer-tracking-form');
  var drawerTrackingCarrier = document.getElementById('drawer-tracking-carrier');
  var drawerTrackingCode = document.getElementById('drawer-tracking-code');
  var drawerSaveTrackingBtn = document.getElementById('drawer-save-tracking-btn');
  var drawerItemCount = document.getElementById('drawer-item-count');
  var drawerItemsList = document.getElementById('drawer-items-list');
  var drawerSummaryList = document.getElementById('drawer-summary-list');
  var drawerCustomerDetails = document.getElementById('drawer-customer-details');

  // Edit Form DOM
  var drawerEditForm = document.getElementById('drawer-edit-form');
  var editCustomerName = document.getElementById('edit-customer-name');
  var editEmail = document.getElementById('edit-email');
  var editPhone = document.getElementById('edit-phone');
  var editPin = document.getElementById('edit-pin');
  var editAddress = document.getElementById('edit-address');
  var editCity = document.getElementById('edit-city');
  var editState = document.getElementById('edit-state');
  var editShippingMethod = document.getElementById('edit-shipping-method');
  var editStatusSelect = document.getElementById('edit-status');
  var editTrackingCarrier = document.getElementById('edit-tracking-carrier');
  var editTrackingCode = document.getElementById('edit-tracking-code');
  var editItemsList = document.getElementById('edit-items-list');
  var editPreviewTotal = document.getElementById('edit-preview-total');
  var editAddProductSelect = document.getElementById('edit-add-product');
  var editAddItemBtn = document.getElementById('edit-add-item-btn');
  var editTotalsNote = document.getElementById('edit-totals-note');
  var drawerEditError = document.getElementById('drawer-edit-error');
  var drawerEditCancel = document.getElementById('drawer-edit-cancel');
  var drawerEditSave = document.getElementById('drawer-edit-save');

  // Reviews View DOM
  var metricTotalReviews = document.getElementById('metric-total-reviews');
  var metricPendingReviews = document.getElementById('metric-pending-reviews');
  var metricApprovedReviews = document.getElementById('metric-approved-reviews');
  var metricRejectedReviews = document.getElementById('metric-rejected-reviews');
  var reviewsErrorBanner = document.getElementById('reviews-error-banner');
  var reviewsErrorText = document.getElementById('reviews-error-text');
  var reviewsRetryBtn = document.getElementById('reviews-retry-btn');
  var reviewsFilterTabs = document.getElementById('reviews-filter-tabs');
  var revTabAll = document.getElementById('rev-tab-all');
  var revTabPending = document.getElementById('rev-tab-pending');
  var revTabApproved = document.getElementById('rev-tab-approved');
  var revTabRejected = document.getElementById('rev-tab-rejected');
  var reviewsSearchInput = document.getElementById('reviews-search');
  var reviewsSearchClear = document.getElementById('reviews-search-clear');
  var reviewsSkeleton = document.getElementById('reviews-skeleton');
  var reviewsEmpty = document.getElementById('reviews-empty');
  var reviewsEmptyTitle = document.getElementById('reviews-empty-title');
  var reviewsEmptyCopy = document.getElementById('reviews-empty-copy');
  var reviewsListEl = document.getElementById('reviews-list');
  var reviewsFooter = document.getElementById('reviews-footer');
  var reviewsShowingText = document.getElementById('reviews-showing-text');

  var toastEl = document.getElementById('dash-toast');

  // State
  var activeView = window.location.hash === '#reviews' ? 'reviews' : 'orders';
  var allOrders = [];
  var activeFilter = 'all';
  var searchQuery = '';
  var sortMode = 'newest';
  var isLoading = false;
  var selectedOrderKey = null;
  var lastFocusedRow = null;
  var lastFetchedUid = null;
  var isEditingDrawer = false;
  var draftEditItems = [];

  var allReviews = [];
  var reviewFilter = 'all';
  var reviewSearchQuery = '';
  var reviewsLoading = false;
  var pendingDeleteConfirmId = null;

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

  function switchView(nextView) {
    activeView = nextView === 'reviews' ? 'reviews' : 'orders';
    var isOrders = activeView === 'orders';

    if (ordersView) ordersView.hidden = !isOrders;
    if (reviewsView) reviewsView.hidden = isOrders;
    if (pageTitleEl) pageTitleEl.textContent = isOrders ? 'Orders' : 'Reviews';
    if (exportCsvBtn) exportCsvBtn.hidden = !isOrders;

    if (navOrdersLink) {
      navOrdersLink.classList.toggle('is-active', isOrders);
      if (isOrders) navOrdersLink.setAttribute('aria-current', 'page');
      else navOrdersLink.removeAttribute('aria-current');
    }
    if (navReviewsLink) {
      navReviewsLink.classList.toggle('is-active', !isOrders);
      if (!isOrders) navReviewsLink.setAttribute('aria-current', 'page');
      else navReviewsLink.removeAttribute('aria-current');
    }

    if (window.location.hash !== '#' + activeView) {
      try {
        history.replaceState(null, '', '#' + activeView);
      } catch (_ignoreHash) {}
    }

    setSidebarOpen(false);
    if (!isOrders && !allReviews.length && !reviewsLoading) {
      loadAllReviews(true);
    }
  }

  if (navOrdersLink) {
    navOrdersLink.addEventListener('click', function (e) {
      e.preventDefault();
      switchView('orders');
    });
  }
  if (navReviewsLink) {
    navReviewsLink.addEventListener('click', function (e) {
      e.preventDefault();
      switchView('reviews');
    });
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
      btn.addEventListener('click', function () { triggerGoogleSignIn(btn, null); });
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
      h2.textContent = 'Sign in to manage store orders & reviews';
      p.textContent = 'Sign in with your store owner Google account to edit orders, update delivery milestones, and moderate customer reviews.';
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

    h2.textContent = 'Store owner access required';
    p.textContent = 'You are signed in as ' + (user && user.email ? user.email : 'a customer account') + '. Admin management is restricted to the REDPOLY store owner account.';
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

  // ---------- ORDERS VIEW ----------
  function updateMetricsAndCounts() {
    var totalCount = allOrders.length;
    var revenue = 0;
    var itemsSold = 0;
    var openCount = 0;
    var shippedCount = 0;
    var deliveredCount = 0;
    var cancelledCount = 0;
    var expressCount = 0;

    allOrders.forEach(function (o) {
      if (o.status !== 'cancelled') revenue += Number(o.total || 0);
      itemsSold += Number(o.itemCount || 0);
      if (isOpenStatus(o.status)) openCount += 1;
      if (isShippedStage(o.status)) shippedCount += 1;
      if (isDeliveredStatus(o.status)) deliveredCount += 1;
      else if (o.status === 'cancelled') cancelledCount += 1;
      if (o.shippingMethod === 'express') expressCount += 1;
    });

    if (sidebarOrdersCount) sidebarOrdersCount.textContent = String(totalCount);
    if (metricTotalOrders) metricTotalOrders.textContent = String(totalCount);
    if (metricGrossSales) metricGrossSales.textContent = money(revenue);
    if (metricItemsOrdered) metricItemsOrdered.textContent = String(itemsSold);
    if (metricUnfulfilled) metricUnfulfilled.textContent = String(openCount);

    if (tabCountAll) tabCountAll.textContent = String(totalCount);
    if (tabCountPlaced) tabCountPlaced.textContent = String(openCount);
    if (tabCountShipped) tabCountShipped.textContent = String(shippedCount);
    if (tabCountFulfilled) tabCountFulfilled.textContent = String(deliveredCount);
    if (tabCountCancelled) tabCountCancelled.textContent = String(cancelledCount);
    if (tabCountExpress) tabCountExpress.textContent = String(expressCount);

    if (exportCsvBtn) exportCsvBtn.disabled = totalCount === 0;
  }

  function filteredAndSortedOrders() {
    var q = searchQuery.trim().toLowerCase();
    var list = allOrders.filter(function (o) {
      if (activeFilter === 'open' && !isOpenStatus(o.status)) return false;
      if (activeFilter === 'shipped' && !isShippedStage(o.status)) return false;
      if (activeFilter === 'delivered' && !isDeliveredStatus(o.status)) return false;
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
        o.trackingCode,
        o.trackingCarrier,
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
      var meta = statusMeta(order.status);
      tr.setAttribute('data-order-key', key);
      if (key === selectedOrderKey) tr.classList.add('is-selected');
      tr.tabIndex = 0;
      tr.setAttribute('aria-label', 'Inspect order ' + order.reference + ' from ' + order.customerName);

      var tdRef = document.createElement('td');
      tdRef.className = 'cell-ref';
      tdRef.textContent = '#' + (order.reference || order.id);

      var tdDate = document.createElement('td');
      tdDate.className = 'cell-date';
      tdDate.textContent = formatDateShort(order.createdAtMs);

      var tdCustomer = document.createElement('td');
      tdCustomer.className = 'cell-customer';
      var cName = document.createElement('strong');
      cName.textContent = order.customerName || 'Customer';
      var cEmail = document.createElement('span');
      cEmail.textContent = order.email || ('+91 ' + order.phone);
      tdCustomer.appendChild(cName);
      tdCustomer.appendChild(cEmail);

      var tdDest = document.createElement('td');
      tdDest.className = 'cell-dest';
      tdDest.textContent = [order.city, order.pin].filter(Boolean).join(', ') || '—';

      var tdPay = document.createElement('td');
      var payBadge = document.createElement('span');
      payBadge.className = 'status-badge status-badge--neutral';
      payBadge.textContent = 'Demo';
      tdPay.appendChild(payBadge);

      var tdStatus = document.createElement('td');
      var stBadge = document.createElement('span');
      stBadge.className = meta.badgeClass;
      stBadge.textContent = meta.label;
      tdStatus.appendChild(stBadge);

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

      var tdDelivery = document.createElement('td');
      tdDelivery.className = 'cell-delivery';
      tdDelivery.textContent = order.shippingMethod === 'express' ? 'Express' : 'Standard';
      if (order.freeGift) {
        var gift = document.createElement('small');
        gift.textContent = '+ Free gift';
        tdDelivery.appendChild(gift);
      }
      if (order.trackingCode) {
        var trk = document.createElement('span');
        trk.className = 'cell-delivery__trk';
        trk.textContent = (order.trackingCarrier ? order.trackingCarrier + ' · ' : '') + order.trackingCode;
        tdDelivery.appendChild(trk);
      }

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

      tr.addEventListener('click', function () { openOrderDrawer(order, tr); });
      tr.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openOrderDrawer(order, tr);
        }
      });

      tbody.appendChild(tr);
    });
  }

  // ---------- ORDER DRAWER + EDIT MODE ----------
  function populateCatalogueDropdown() {
    if (!editAddProductSelect || editAddProductSelect.options.length > 0) return;
    Object.keys(CATALOGUE).forEach(function (name) {
      var opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name + ' (' + money(CATALOGUE[name].price) + ')';
      editAddProductSelect.appendChild(opt);
    });
  }

  function updateEditTotalsPreview() {
    var subtotal = draftEditItems.reduce(function (sum, item) {
      return sum + Number(item.price || 0) * Number(item.quantity || 0);
    }, 0);
    var shipMethod = editShippingMethod && editShippingMethod.value === 'express' ? 'express' : 'standard';
    var freeShip = shipMethod === 'express' ? subtotal >= FREE_EXPRESS_FROM : subtotal >= FREE_STANDARD_FROM;
    var shipCost = freeShip ? 0 : (shipMethod === 'express' ? 120 : 30);
    var gst = Math.round((subtotal * GST_RATE) / (100 + GST_RATE));
    var total = subtotal + shipCost;
    var freeGift = subtotal >= FREE_GIFT_FROM;

    if (editPreviewTotal) editPreviewTotal.textContent = money(total);
    if (editTotalsNote) {
      editTotalsNote.textContent = 'Subtotal ' + money(subtotal) + ' + Shipping ' + (shipCost ? money(shipCost) : 'Free') + ' · GST ' + money(gst) + (freeGift ? ' · + Free gift' : '');
    }
  }

  function renderDraftEditItems() {
    if (!editItemsList) return;
    editItemsList.textContent = '';
    draftEditItems.forEach(function (item, idx) {
      var li = document.createElement('li');
      li.className = 'edit-item-row';

      var copy = document.createElement('div');
      copy.className = 'edit-item-row__name';
      var strong = document.createElement('strong');
      strong.textContent = item.name;
      var sub = document.createElement('small');
      sub.textContent = money(item.price) + ' each';
      copy.appendChild(strong);
      copy.appendChild(sub);

      var qtyWrap = document.createElement('label');
      qtyWrap.className = 'edit-item-row__qty';
      var qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.min = '1';
      qtyInput.max = '99';
      qtyInput.value = String(item.quantity);
      qtyInput.setAttribute('aria-label', 'Quantity for ' + item.name);
      qtyInput.addEventListener('input', function () {
        var val = Math.floor(Number(qtyInput.value));
        item.quantity = Number.isFinite(val) ? Math.min(99, Math.max(1, val)) : 1;
        updateEditTotalsPreview();
      });
      qtyWrap.appendChild(qtyInput);

      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn btn--danger-ghost btn--sm';
      removeBtn.textContent = 'Remove';
      removeBtn.disabled = draftEditItems.length <= 1;
      removeBtn.addEventListener('click', function () {
        if (draftEditItems.length <= 1) return;
        draftEditItems.splice(idx, 1);
        renderDraftEditItems();
        updateEditTotalsPreview();
      });

      li.appendChild(copy);
      li.appendChild(qtyWrap);
      li.appendChild(removeBtn);
      editItemsList.appendChild(li);
    });
    updateEditTotalsPreview();
  }

  function setDrawerEditMode(editing, order) {
    isEditingDrawer = Boolean(editing && order);
    if (drawerReadView) drawerReadView.hidden = isEditingDrawer;
    if (drawerEditForm) drawerEditForm.hidden = !isEditingDrawer;
    if (drawerEditToggle) {
      drawerEditToggle.textContent = isEditingDrawer ? 'View summary' : 'Edit order';
      drawerEditToggle.setAttribute('aria-expanded', isEditingDrawer ? 'true' : 'false');
    }
    if (!isEditingDrawer || !order) return;

    populateCatalogueDropdown();
    if (drawerEditError) { drawerEditError.hidden = true; drawerEditError.textContent = ''; }
    editCustomerName.value = order.customerName || '';
    editEmail.value = order.email || '';
    editPhone.value = order.phone || '';
    editPin.value = order.pin || '';
    editAddress.value = order.address || '';
    editCity.value = order.city || '';
    editState.value = order.state || '';
    editShippingMethod.value = order.shippingMethod === 'express' ? 'express' : 'standard';
    editStatusSelect.value = canonicalStatusForControls(order.status);
    editTrackingCarrier.value = order.trackingCarrier || '';
    editTrackingCode.value = order.trackingCode || '';

    draftEditItems = (order.items || []).map(function (i) {
      var cat = CATALOGUE[i.name];
      return { name: i.name, price: cat ? cat.price : Number(i.price || 0), quantity: Number(i.quantity || 1) };
    });
    renderDraftEditItems();
  }

  function renderDrawerContent(order) {
    if (!order) return;
    var meta = statusMeta(order.status);
    var canonical = canonicalStatusForControls(order.status);

    drawerOrderRef.textContent = '#' + (order.reference || order.id);
    drawerStatusBadge.className = meta.badgeClass;
    drawerStatusBadge.textContent = meta.label + (order.status !== 'cancelled' ? ' · ' + meta.percent + '%' : '');
    drawerOrderDate.textContent = formatDateFull(order.createdAtMs);
    drawerStatusError.hidden = true;
    drawerStatusError.textContent = '';

    if (drawerProgressFill) {
      drawerProgressFill.style.width = (order.status === 'cancelled' ? 100 : Math.max(4, meta.percent)) + '%';
      drawerProgressFill.classList.toggle('is-delivered', isDeliveredStatus(order.status));
      drawerProgressFill.classList.toggle('is-cancelled', order.status === 'cancelled');
    }

    Array.prototype.forEach.call(drawerStatusActions.querySelectorAll('[data-status-action]'), function (btn) {
      var target = btn.getAttribute('data-status-action');
      btn.disabled = (target === canonical);
    });

    if (drawerTrackingCarrier) drawerTrackingCarrier.value = order.trackingCarrier || '';
    if (drawerTrackingCode) drawerTrackingCode.value = order.trackingCode || '';

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
      var metaEl = document.createElement('span');
      metaEl.className = 'drawer-item__meta';
      metaEl.textContent = item.quantity + ' × ' + money(item.price);
      copy.appendChild(metaEl);

      var tot = document.createElement('strong');
      tot.className = 'drawer-item__total';
      tot.textContent = money(Number(item.price) * Number(item.quantity));

      li.appendChild(copy);
      li.appendChild(tot);
      drawerItemsList.appendChild(li);
    });

    drawerSummaryList.textContent = '';
    var summaryRows = [
      ['Subtotal', money(order.subtotal)],
      ['Shipping (' + (order.shippingMethod === 'express' ? 'Express' : 'Standard') + ')', order.freeShipping || !order.shippingCost ? 'Free' : money(order.shippingCost)],
      ['Includes GST (' + (order.gstRate || 12) + '%)', money(order.gst)]
    ];
    if (order.freeGift) summaryRows.push(['Free mystery gift', 'Included']);
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

    drawerCustomerDetails.textContent = '';
    var cName = document.createElement('strong');
    cName.textContent = order.customerName || '—';
    drawerCustomerDetails.appendChild(cName);

    [
      order.email,
      order.phone ? '+91 ' + order.phone : '',
      order.address,
      [order.city, order.state].filter(Boolean).join(', ') + (order.pin ? ' — ' + order.pin : ''),
      order.trackingCode ? ('Tracking: ' + (order.trackingCarrier ? order.trackingCarrier + ' · ' : '') + order.trackingCode) : ''
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
    setDrawerEditMode(false, order);
    renderTable();
    renderDrawerContent(order);
    drawerLayer.hidden = false;
    drawerEl.focus();
  }

  function closeOrderDrawer() {
    if (drawerLayer.hidden) return;
    var previousKey = selectedOrderKey;
    isEditingDrawer = false;
    drawerLayer.hidden = true;
    selectedOrderKey = null;
    renderTable();
    var targetRow = null;
    if (lastFocusedRow && document.contains(lastFocusedRow)) {
      targetRow = lastFocusedRow;
    } else if (previousKey && tbody) {
      targetRow = Array.prototype.find.call(tbody.querySelectorAll('tr[data-order-key]'), function (tr) {
        return tr.getAttribute('data-order-key') === previousKey;
      }) || null;
    }
    var fallbackFocus = (filterTabsEl && filterTabsEl.querySelector('.orders-tab.is-active')) || refreshBtn;
    if (targetRow && typeof targetRow.focus === 'function') targetRow.focus();
    else if (fallbackFocus && typeof fallbackFocus.focus === 'function') fallbackFocus.focus();
    lastFocusedRow = null;
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeOrderDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeOrderDrawer);

  if (drawerEditToggle) {
    drawerEditToggle.addEventListener('click', function () {
      var order = allOrders.find(function (o) { return orderCompositeKey(o) === selectedOrderKey; });
      if (!order) return;
      setDrawerEditMode(!isEditingDrawer, order);
    });
  }
  if (drawerEditCancel) {
    drawerEditCancel.addEventListener('click', function () {
      var order = allOrders.find(function (o) { return orderCompositeKey(o) === selectedOrderKey; });
      setDrawerEditMode(false, order);
    });
  }
  if (editShippingMethod) {
    editShippingMethod.addEventListener('change', updateEditTotalsPreview);
  }
  if (editAddItemBtn) {
    editAddItemBtn.addEventListener('click', function () {
      var chosenName = editAddProductSelect.value;
      var cat = CATALOGUE[chosenName];
      if (!cat) return;
      var existing = draftEditItems.find(function (i) { return i.name === chosenName; });
      if (existing) {
        existing.quantity = Math.min(99, existing.quantity + 1);
      } else {
        draftEditItems.push({ name: chosenName, price: cat.price, quantity: 1 });
      }
      renderDraftEditItems();
    });
  }

  if (drawerEditForm) {
    drawerEditForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      var order = allOrders.find(function (o) { return orderCompositeKey(o) === selectedOrderKey; });
      if (!order) return;

      drawerEditError.hidden = true;
      drawerEditError.textContent = '';
      drawerEditSave.disabled = true;
      drawerEditSave.textContent = 'Saving…';

      try {
        var fb = await ensureDashboardFirebase();
        var updated = await fb.updateOrderDetails(order.uid, order.id, {
          customerName: editCustomerName.value.trim(),
          email: editEmail.value.trim(),
          phone: editPhone.value.trim(),
          pin: editPin.value.trim(),
          address: editAddress.value.trim(),
          city: editCity.value.trim(),
          state: editState.value.trim(),
          shippingMethod: editShippingMethod.value === 'express' ? 'express' : 'standard',
          status: editStatusSelect.value,
          trackingCarrier: editTrackingCarrier.value.trim(),
          trackingCode: editTrackingCode.value.trim(),
          items: draftEditItems
        });

        var idx = allOrders.findIndex(function (o) { return orderCompositeKey(o) === selectedOrderKey; });
        if (idx !== -1) allOrders[idx] = updated;
        updateMetricsAndCounts();
        renderTable();
        setDrawerEditMode(false, updated);
        renderDrawerContent(updated);
        showToast('Order #' + updated.reference + ' saved');
      } catch (err) {
        console.error(err);
        drawerEditError.textContent = (err && err.message && err.message.charAt(0) !== '{')
          ? err.message
          : 'Could not save order changes. Verify fields and Firestore permissions.';
        drawerEditError.hidden = false;
      } finally {
        drawerEditSave.disabled = false;
        drawerEditSave.textContent = 'Save order changes';
      }
    });
  }

  if (drawerTrackingForm) {
    drawerTrackingForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      var order = allOrders.find(function (o) { return orderCompositeKey(o) === selectedOrderKey; });
      if (!order) return;

      drawerSaveTrackingBtn.disabled = true;
      drawerStatusSaving.hidden = false;
      drawerStatusError.hidden = true;
      try {
        var fb = await ensureDashboardFirebase();
        var updated = await fb.updateOrderDetails(order.uid, order.id, {
          trackingCarrier: drawerTrackingCarrier.value.trim(),
          trackingCode: drawerTrackingCode.value.trim()
        });
        var idx = allOrders.findIndex(function (o) { return orderCompositeKey(o) === selectedOrderKey; });
        if (idx !== -1) allOrders[idx] = updated;
        renderTable();
        renderDrawerContent(updated);
        showToast(updated.trackingCode ? 'Tracking saved for #' + updated.reference : 'Tracking cleared');
      } catch (err) {
        console.error(err);
        drawerStatusError.textContent = 'Could not save tracking info.';
        drawerStatusError.hidden = false;
      } finally {
        drawerSaveTrackingBtn.disabled = false;
        drawerStatusSaving.hidden = true;
      }
    });
  }

  if (drawerStatusActions) {
    drawerStatusActions.addEventListener('click', async function (event) {
      var btn = event.target.closest('[data-status-action]');
      if (!btn || !selectedOrderKey) return;
      var nextStatus = btn.getAttribute('data-status-action');
      var order = allOrders.find(function (o) { return orderCompositeKey(o) === selectedOrderKey; });
      if (!order || !order.uid || !order.id) return;
      if (canonicalStatusForControls(order.status) === nextStatus) return;

      drawerStatusSaving.hidden = false;
      drawerStatusError.hidden = true;
      Array.prototype.forEach.call(drawerStatusActions.querySelectorAll('button'), function (b) { b.disabled = true; });

      try {
        var fb = await ensureDashboardFirebase();
        await fb.updateOrderStatus(order.uid, order.id, nextStatus);
        order.status = nextStatus;
        if (isDeliveredStatus(nextStatus) && !order.deliveredAtMs) {
          order.deliveredAtMs = Date.now();
        }
        updateMetricsAndCounts();
        renderTable();
        renderDrawerContent(order);
        showToast('Order #' + order.reference + ' → ' + statusMeta(nextStatus).label);
      } catch (err) {
        console.error(err);
        drawerStatusError.textContent = 'Could not update order milestone. Ensure updated Firestore rules are published.';
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
    if (/^[=+\-@\t\r]/.test(str)) str = "'" + str;
    if (/[",\n\r]/.test(str)) return '"' + str.replace(/"/g, '""') + '"';
    return str;
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', function () {
      var rows = filteredAndSortedOrders();
      if (!rows.length) return;
      var headers = ['Order Reference', 'Date', 'Customer Name', 'Email', 'Phone', 'Address', 'City', 'State', 'PIN', 'Shipping Method', 'Status', 'Tracking Carrier', 'Tracking Code', 'Items', 'Item Count', 'Subtotal (INR)', 'Shipping (INR)', 'GST (INR)', 'Total (INR)'];
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
          o.trackingCarrier || '',
          o.trackingCode || '',
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

  // ---------- REVIEWS MODERATION VIEW ----------
  function reviewStatusBadgeClass(status) {
    if (status === 'approved') return 'status-badge status-badge--fulfilled';
    if (status === 'rejected') return 'status-badge status-badge--cancelled';
    return 'status-badge status-badge--placed';
  }

  function updateReviewCounts() {
    var total = allReviews.length;
    var pending = 0;
    var approved = 0;
    var rejected = 0;
    allReviews.forEach(function (r) {
      if (r.status === 'approved') approved += 1;
      else if (r.status === 'rejected') rejected += 1;
      else pending += 1;
    });
    if (sidebarReviewsCount) sidebarReviewsCount.textContent = String(pending);
    if (metricTotalReviews) metricTotalReviews.textContent = String(total);
    if (metricPendingReviews) metricPendingReviews.textContent = String(pending);
    if (metricApprovedReviews) metricApprovedReviews.textContent = String(approved);
    if (metricRejectedReviews) metricRejectedReviews.textContent = String(rejected);
    if (revTabAll) revTabAll.textContent = String(total);
    if (revTabPending) revTabPending.textContent = String(pending);
    if (revTabApproved) revTabApproved.textContent = String(approved);
    if (revTabRejected) revTabRejected.textContent = String(rejected);
  }

  function filteredReviews() {
    var q = reviewSearchQuery.trim().toLowerCase();
    return allReviews.filter(function (r) {
      if (reviewFilter !== 'all' && r.status !== reviewFilter) return false;
      if (!q) return true;
      var hay = [r.productSlug, r.productName, r.authorName, r.orderReference, r.title, r.body].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }

  function renderReviewsList() {
    if (!reviewsListEl || !reviewsEmpty || !reviewsSkeleton || !reviewsFooter) return;
    reviewsSkeleton.hidden = !reviewsLoading;
    if (reviewsLoading) {
      reviewsListEl.hidden = true;
      reviewsEmpty.hidden = true;
      reviewsFooter.hidden = true;
      return;
    }

    var items = filteredReviews();
    reviewsListEl.textContent = '';

    if (!items.length) {
      reviewsListEl.hidden = true;
      reviewsFooter.hidden = true;
      reviewsEmpty.hidden = false;
      if (!allReviews.length) {
        reviewsEmptyTitle.textContent = 'No customer reviews yet';
        reviewsEmptyCopy.textContent = 'Verified buyers with delivered orders can leave reviews from any product page.';
      } else {
        reviewsEmptyTitle.textContent = 'No reviews match this filter';
        reviewsEmptyCopy.textContent = 'Switch tabs or clear your search query to see other reviews.';
      }
      return;
    }

    reviewsEmpty.hidden = true;
    reviewsListEl.hidden = false;
    reviewsFooter.hidden = false;
    reviewsShowingText.textContent = 'Showing ' + items.length + ' of ' + allReviews.length + (allReviews.length === 1 ? ' review' : ' reviews');

    items.forEach(function (rev) {
      var card = document.createElement('article');
      card.className = 'review-admin-card';

      var mainCol = document.createElement('div');
      var top = document.createElement('div');
      top.className = 'review-admin-card__top';

      var stars = document.createElement('span');
      stars.className = 'review-admin-card__stars';
      stars.textContent = '★★★★★'.slice(0, rev.rating) + '☆☆☆☆☆'.slice(0, 5 - rev.rating);

      var stBadge = document.createElement('span');
      stBadge.className = reviewStatusBadgeClass(rev.status);
      stBadge.textContent = rev.status.charAt(0).toUpperCase() + rev.status.slice(1);

      var prodLink = document.createElement('a');
      prodLink.className = 'review-admin-card__product';
      prodLink.href = PRODUCT_PAGE_BY_SLUG[rev.productSlug] || '/products/' + rev.productSlug;
      prodLink.textContent = rev.productName || rev.productSlug.toUpperCase();

      top.appendChild(stars);
      top.appendChild(stBadge);
      top.appendChild(prodLink);

      var h3 = document.createElement('h3');
      h3.className = 'review-admin-card__title';
      h3.textContent = rev.title;

      var body = document.createElement('p');
      body.className = 'review-admin-card__body';
      body.textContent = rev.body;

      var meta = document.createElement('div');
      meta.className = 'review-admin-card__meta';
      var buyerSpan = document.createElement('span');
      buyerSpan.textContent = rev.authorName + ' · Verified buyer';
      var orderSpan = document.createElement('span');
      orderSpan.textContent = 'Order #' + (rev.orderReference || rev.orderId);
      var dateSpan = document.createElement('span');
      dateSpan.textContent = formatDateShort(rev.createdAtMs);
      meta.appendChild(buyerSpan);
      meta.appendChild(orderSpan);
      meta.appendChild(dateSpan);

      mainCol.appendChild(top);
      mainCol.appendChild(h3);
      mainCol.appendChild(body);
      mainCol.appendChild(meta);

      var actionsCol = document.createElement('div');
      actionsCol.className = 'review-admin-card__actions';

      if (rev.status !== 'approved') {
        var approveBtn = document.createElement('button');
        approveBtn.type = 'button';
        approveBtn.className = 'btn btn--primary btn--sm';
        approveBtn.textContent = 'Approve';
        approveBtn.addEventListener('click', function () { handleModerateReview(rev, 'approved', approveBtn); });
        actionsCol.appendChild(approveBtn);
      }
      if (rev.status !== 'rejected') {
        var rejectBtn = document.createElement('button');
        rejectBtn.type = 'button';
        rejectBtn.className = 'btn btn--secondary btn--sm';
        rejectBtn.textContent = 'Reject';
        rejectBtn.addEventListener('click', function () { handleModerateReview(rev, 'rejected', rejectBtn); });
        actionsCol.appendChild(rejectBtn);
      }
      if (rev.status !== 'pending') {
        var pendingBtn = document.createElement('button');
        pendingBtn.type = 'button';
        pendingBtn.className = 'btn btn--secondary btn--sm';
        pendingBtn.textContent = 'Set pending';
        pendingBtn.addEventListener('click', function () { handleModerateReview(rev, 'pending', pendingBtn); });
        actionsCol.appendChild(pendingBtn);
      }

      var deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn btn--danger-ghost btn--sm';
      var key = rev.productSlug + '::' + rev.id;
      deleteBtn.textContent = pendingDeleteConfirmId === key ? 'Confirm delete' : 'Delete';
      deleteBtn.addEventListener('click', function () {
        if (pendingDeleteConfirmId !== key) {
          pendingDeleteConfirmId = key;
          renderReviewsList();
          window.setTimeout(function () {
            if (pendingDeleteConfirmId === key) {
              pendingDeleteConfirmId = null;
              renderReviewsList();
            }
          }, 4000);
          return;
        }
        pendingDeleteConfirmId = null;
        handleDeleteReview(rev, deleteBtn);
      });
      actionsCol.appendChild(deleteBtn);

      card.appendChild(mainCol);
      card.appendChild(actionsCol);
      reviewsListEl.appendChild(card);
    });
  }

  async function handleModerateReview(rev, nextStatus, btn) {
    if (btn) btn.disabled = true;
    try {
      var fb = await ensureDashboardFirebase();
      await fb.moderateReview(rev.productSlug, rev.id, nextStatus);
      rev.status = nextStatus;
      updateReviewCounts();
      renderReviewsList();
      showToast('Review ' + nextStatus);
    } catch (err) {
      console.error(err);
      showToast('Could not update review status');
      if (btn) btn.disabled = false;
    }
  }

  async function handleDeleteReview(rev, btn) {
    if (btn) btn.disabled = true;
    try {
      var fb = await ensureDashboardFirebase();
      await fb.deleteReview(rev.productSlug, rev.id);
      allReviews = allReviews.filter(function (item) {
        return !(item.productSlug === rev.productSlug && item.id === rev.id);
      });
      updateReviewCounts();
      renderReviewsList();
      showToast('Review deleted');
    } catch (err) {
      console.error(err);
      showToast('Could not delete review');
      if (btn) btn.disabled = false;
    }
  }

  if (reviewsFilterTabs) {
    reviewsFilterTabs.addEventListener('click', function (event) {
      var tab = event.target.closest('[data-review-filter]');
      if (!tab) return;
      reviewFilter = tab.getAttribute('data-review-filter') || 'all';
      Array.prototype.forEach.call(reviewsFilterTabs.querySelectorAll('.orders-tab'), function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      renderReviewsList();
    });
  }

  if (reviewsSearchInput) {
    reviewsSearchInput.addEventListener('input', function () {
      reviewSearchQuery = reviewsSearchInput.value || '';
      if (reviewsSearchClear) reviewsSearchClear.hidden = !reviewSearchQuery;
      renderReviewsList();
    });
  }

  if (reviewsSearchClear) {
    reviewsSearchClear.addEventListener('click', function () {
      reviewSearchQuery = '';
      if (reviewsSearchInput) { reviewsSearchInput.value = ''; reviewsSearchInput.focus(); }
      reviewsSearchClear.hidden = true;
      renderReviewsList();
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
      errorText.textContent = 'Could not load store orders from Firestore. Ensure Firestore rules are published and try again.';
      errorBanner.hidden = false;
    } finally {
      isLoading = false;
      if (refreshBtn) refreshBtn.disabled = false;
      renderTable();
    }
  }

  async function loadAllReviews(force) {
    var fb = await ensureDashboardFirebase();
    var user = fb.getUser();
    if (!isCurrentAdmin(user)) return;
    if (reviewsLoading && !force) return;

    reviewsLoading = true;
    if (refreshBtn) refreshBtn.disabled = true;
    if (reviewsErrorBanner) reviewsErrorBanner.hidden = true;
    renderReviewsList();

    try {
      allReviews = await fb.listAllReviews();
      updateReviewCounts();
    } catch (err) {
      console.error(err);
      if (reviewsErrorText) reviewsErrorText.textContent = 'Could not load reviews from Firestore. Ensure updated Firestore rules are published.';
      if (reviewsErrorBanner) reviewsErrorBanner.hidden = false;
    } finally {
      reviewsLoading = false;
      if (refreshBtn) refreshBtn.disabled = false;
      renderReviewsList();
    }
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      if (activeView === 'reviews') loadAllReviews(true);
      else loadAllOrders(true);
    });
  }
  if (retryBtn) {
    retryBtn.addEventListener('click', function () { loadAllOrders(true); });
  }
  if (reviewsRetryBtn) {
    reviewsRetryBtn.addEventListener('click', function () { loadAllReviews(true); });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (!drawerLayer.hidden) closeOrderDrawer();
      else if (sidebar && sidebar.classList.contains('is-open')) setSidebarOpen(false);
      return;
    }
    if (event.key === 'Tab' && !drawerLayer.hidden && drawerEl) {
      var focusable = Array.prototype.filter.call(
        drawerEl.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'),
        function (el) { return !el.hidden && el.offsetParent !== null; }
      );
      if (!focusable.length) {
        event.preventDefault();
        drawerEl.focus();
        return;
      }
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === drawerEl)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
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
      allReviews = [];
      lastFetchedUid = null;
      closeOrderDrawer();
      updateMetricsAndCounts();
      updateReviewCounts();
      renderAuthGate('signed-out', null);
      return;
    }

    if (!isCurrentAdmin(user)) {
      allOrders = [];
      allReviews = [];
      lastFetchedUid = null;
      closeOrderDrawer();
      updateMetricsAndCounts();
      updateReviewCounts();
      renderAuthGate('forbidden', user);
      return;
    }

    authGate.hidden = true;
    pageActions.hidden = false;
    dashboardContent.hidden = false;
    switchView(activeView);

    if (lastFetchedUid !== user.uid) {
      lastFetchedUid = user.uid;
      loadAllOrders(true);
      loadAllReviews(true);
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
