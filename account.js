/* REDPOLY My Account page controller: address, order history, favorites, and cart sync. */
(function () {
  var CART_KEY = 'redpoly-cart-v1';
  var WISH_KEY = 'redpoly-wishlist-v1';
  var GUEST_ADDRESS_KEY = 'redpoly-guest-address-v1';
  var DEMO_ORDER_KEY = 'redpoly-demo-order-v1';
  var FREE_SHIPPING_FROM = 2000;
  var FREE_GIFT_FROM = 3500;

  var CATALOGUE = {
    'BUBBLE GUN': { price: 449, href: '/bubble-gun', image: '/assets/images/redpoly/products/bubble-gun-thumb.webp?v=bubble-20261121' },
    'STUNT PET': { price: 599, href: '/stunt-pet', image: '/assets/images/redpoly/products/stunt-pet-thumb.webp?v=pet-20261122' },
    'MINI COOL CAR': { price: 749, href: '/mini-cool-car', image: '/assets/images/redpoly/products/mini-cool-car-thumb.webp?v=car-20261117' },
    'GEL STORM': { price: 1999, href: '/gel-storm', image: '/assets/images/redpoly/products/gel-storm-thumb.webp?v=gel-20261121' },
    'MECHA ROVER': { price: 499, href: '/mecha-rover', image: '/assets/images/redpoly/products/mecha-rover-thumb.webp?v=mecha-20261120' },
    'PIXEL SPLASH': { price: 1749, href: '/pixel-splash', image: '/assets/images/redpoly/products/pixel-splash-thumb.webp?v=pixel-20261117-v3' },
    'CUTE DINOS GREEN': { price: 249, href: '/cute-dinos?colour=green', image: '/assets/images/redpoly/products/cute-dinos-green-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS RED': { price: 249, href: '/cute-dinos?colour=red', image: '/assets/images/redpoly/products/cute-dinos-red-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS TEAL': { price: 249, href: '/cute-dinos?colour=teal', image: '/assets/images/redpoly/products/cute-dinos-teal-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS TRIO': { price: 549, href: '/cute-dinos?pack=trio', image: '/assets/images/redpoly/products/cute-dinos-trio-thumb.webp?v=dinos-20261116' },
    'SIP BUDDIES COW': { price: 899, href: '/sip-buddies?buddy=cow', image: '/assets/images/redpoly/products/sip-buddies-cow-thumb.webp?v=sip-20261122' },
    'SIP BUDDIES CAT': { price: 899, href: '/sip-buddies?buddy=cat', image: '/assets/images/redpoly/products/sip-buddies-cat-thumb.webp?v=sip-20261122' },
    'SIP BUDDIES PUPPY': { price: 899, href: '/sip-buddies?buddy=puppy', image: '/assets/images/redpoly/products/sip-buddies-puppy-thumb.webp?v=sip-20261122' },
    'SIP BUDDIES APPLE': { price: 899, href: '/sip-buddies?buddy=apple', image: '/assets/images/redpoly/products/sip-buddies-apple-thumb.webp?v=sip-20261122' },
    'MAGNETIC BLOCKS 25 PCS': { price: 319, href: '/magnetic-blocks?pack=25pcs', image: '/assets/images/redpoly/products/magnetic-blocks-25pcs-thumb.webp?v=mag-20261122' },
    'MAGNETIC BLOCKS 36 PCS': { price: 479, href: '/magnetic-blocks?pack=36pcs', image: '/assets/images/redpoly/products/magnetic-blocks-36pcs-thumb.webp?v=mag-20261122' },
    'MAGNETIC BLOCKS 42 PCS': { price: 549, href: '/magnetic-blocks?pack=42pcs', image: '/assets/images/redpoly/products/magnetic-blocks-42pcs-thumb.webp?v=mag-20261122' },
    'MAGNETIC BLOCKS 64 PCS': { price: 799, href: '/magnetic-blocks?pack=64pcs', image: '/assets/images/redpoly/products/magnetic-blocks-64pcs-thumb.webp?v=mag-20261122' },
    'RISE ONE X 4X4': { price: 1499, href: '/rise-one-x-4x4', image: '/assets/images/redpoly/products/rise-one-x-4x4-thumb.webp?v=rise-20261122' },
    'DRIFT KING': { price: 799, href: '/drift-king', image: '/assets/images/redpoly/products/drift-king-thumb.webp?v=dk-20261124' },
    'BABY LINGO': { price: 799, href: '/baby-lingo', image: '/assets/images/redpoly/products/baby-lingo-thumb.webp?v=lingo-20261119' },
    'MARIO TOOTHBRUSH': { price: 99, href: '/mario-toothbrush', image: '/assets/images/redpoly/products/mario-toothbrush-studio.jpg?v=tooth-20261122' }
  };

  var GOOGLE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5H1.2v3.1C3.2 21.4 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.2 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.2C.4 8.2 0 10.1 0 12s.4 3.8 1.2 5.4l4-3.1z"/><path fill="#EA4335" d="M12 4.7c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.2 2.6 1.2 6.6l4 3.1c1-2.9 3.7-5 6.8-5z"/></svg>';
  var CATALOG_CACHE_KEY = 'redpoly-catalog-cache-v1';
  var liveCatalogMap = {};
  (function hydrateAccountCatalog() {
    try {
      var cached = JSON.parse(window.sessionStorage.getItem(CATALOG_CACHE_KEY) || '{}');
      if (cached && typeof cached === 'object') {
        Object.keys(cached).forEach(function (k) {
          var rec = cached[k];
          if (rec && rec.name && Object.prototype.hasOwnProperty.call(CATALOGUE, rec.name)) {
            if (Number.isFinite(Number(rec.price)) && Number(rec.price) > 0) {
              CATALOGUE[rec.name].price = Math.round(Number(rec.price));
            }
            liveCatalogMap[rec.name] = rec;
            if (rec.sku) liveCatalogMap[rec.sku] = rec;
          }
        });
      }
    } catch (ignoreCache) {}
  })();

  function isKnownProduct(name) {
    return Object.prototype.hasOwnProperty.call(CATALOGUE, name);
  }
  function getLiveProduct(name) {
    var fb = window.RedpolyFirebase;
    if (fb && typeof fb.getProduct === 'function') {
      var rec = fb.getProduct(name);
      if (rec) return rec;
    }
    return liveCatalogMap[name] || null;
  }
  function syncCatalogueMap(map) {
    if (!map || typeof map !== 'object') return;
    liveCatalogMap = map;
    Object.keys(CATALOGUE).forEach(function (name) {
      var rec = map[name];
      if (rec && Number.isFinite(Number(rec.price)) && Number(rec.price) > 0) {
        CATALOGUE[name].price = Math.round(Number(rec.price));
      }
    });
  }
  function money(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN');
  }
  function isSitePath(val) {
    return typeof val === 'string' && val.charAt(0) === '/' && val.charAt(1) !== '/';
  }
  function showToast(msg) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 2200);
  }

  function readCart() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(CART_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (item) {
        return item && typeof item.name === 'string' && isKnownProduct(item.name) && Number(item.quantity) >= 1;
      }).map(function (item) {
        var price = CATALOGUE[item.name].price;
        return {
          id: item.name.toLowerCase() + '|' + price,
          name: item.name,
          price: price,
          quantity: Math.min(99, Math.max(1, Math.floor(Number(item.quantity))))
        };
      });
    } catch (e) {
      return [];
    }
  }
  function writeCart(items) {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (e) {
      /* Storage unavailable */
    }
    window.dispatchEvent(new CustomEvent('redpoly:cart-updated', { detail: { items: items.slice() } }));
  }

  function readFavorites() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(WISH_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (item) {
        return item && typeof item.name === 'string' && isSitePath(item.href) && isKnownProduct(item.name);
      }).map(function (item) {
        return {
          name: item.name,
          href: item.href,
          image: isSitePath(item.image) ? item.image : CATALOGUE[item.name].image,
          price: CATALOGUE[item.name].price
        };
      });
    } catch (e) {
      return [];
    }
  }
  function writeFavorites(items) {
    try {
      window.localStorage.setItem(WISH_KEY, JSON.stringify(items));
    } catch (e) {
      /* Storage unavailable */
    }
    window.dispatchEvent(new CustomEvent('redpoly:wishlist-updated', { detail: { items: items.slice() } }));
  }

  function readGuestAddress() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(GUEST_ADDRESS_KEY) || 'null');
      if (!parsed || typeof parsed !== 'object') return null;
      return {
        fullName: typeof parsed.fullName === 'string' ? parsed.fullName : '',
        email: typeof parsed.email === 'string' ? parsed.email : '',
        phone: typeof parsed.phone === 'string' ? parsed.phone : '',
        address: typeof parsed.address === 'string' ? parsed.address : '',
        pinCode: typeof parsed.pinCode === 'string' ? parsed.pinCode : '',
        city: typeof parsed.city === 'string' ? parsed.city : '',
        state: typeof parsed.state === 'string' ? parsed.state : ''
      };
    } catch (e) {
      return null;
    }
  }
  function writeGuestAddress(addr) {
    try {
      if (!addr) window.localStorage.removeItem(GUEST_ADDRESS_KEY);
      else window.localStorage.setItem(GUEST_ADDRESS_KEY, JSON.stringify(addr));
    } catch (e) {
      /* Storage unavailable */
    }
  }
  function readSessionDemoOrder() {
    try {
      var parsed = JSON.parse(window.sessionStorage.getItem(DEMO_ORDER_KEY) || 'null');
      if (!parsed || !Array.isArray(parsed.items) || !parsed.items.length) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  // DOM refs
  var identityEl = document.getElementById('account-identity');
  var tabOrdersCount = document.getElementById('tab-orders-count');
  var tabFavCount = document.getElementById('tab-fav-count');
  var tabCartCount = document.getElementById('tab-cart-count');
  var tabsNav = document.getElementById('account-tabs');
  var sectionEls = Array.prototype.slice.call(document.querySelectorAll('.account-card[data-section]'));

  var addressSyncBadge = document.getElementById('address-sync-badge');
  var addressPreview = document.getElementById('address-preview');
  var addressForm = document.getElementById('account-address-form');
  var fullNameInput = document.getElementById('acc-fullName');
  var emailInput = document.getElementById('acc-email');
  var phoneInput = document.getElementById('acc-phone');
  var streetInput = document.getElementById('acc-address');
  var pinInput = document.getElementById('acc-pinCode');
  var cityInput = document.getElementById('acc-city');
  var stateInput = document.getElementById('acc-state');
  var pinStatus = document.getElementById('account-pin-status');
  var addressStatus = document.getElementById('account-address-status');
  var addressSaveBtn = document.getElementById('account-address-save');

  var ordersBadge = document.getElementById('orders-sync-badge');
  var ordersContainer = document.getElementById('account-orders-container');
  var favBadge = document.getElementById('favorites-count-badge');
  var favContainer = document.getElementById('account-favorites-container');
  var cartBadge = document.getElementById('cart-count-badge');
  var cartContainer = document.getElementById('account-cart-container');

  var lookupTimer = null;
  var activeLookup = null;
  var lookupSeq = 0;
  var lastAutoPin = '';
  var formDirty = false;

  if (addressForm) {
    addressForm.addEventListener('input', function () {
      formDirty = true;
    });
  }

  function hasCompleteAddress(addr) {
    return Boolean(addr && addr.address && addr.pinCode && addr.city && addr.state);
  }

  function activeAddressRecord() {
    var fb = window.RedpolyFirebase;
    var user = fb ? fb.getUser() : null;
    var profile = fb ? fb.getProfile() : null;
    var guest = readGuestAddress();
    if (user && profile) {
      return {
        source: 'cloud',
        data: {
          fullName: profile.fullName || user.displayName || '',
          email: profile.email || user.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          pinCode: profile.pinCode || '',
          city: profile.city || '',
          state: profile.state || ''
        },
        fallbackGuest: guest
      };
    }
    return { source: 'local', data: guest, fallbackGuest: null };
  }

  function addItemToCart(name, price, openDrawer) {
    if (!isKnownProduct(name)) return;
    var rec = getLiveProduct(name);
    var livePrice = rec && rec.price > 0 ? rec.price : CATALOGUE[name].price;
    var items = readCart();
    if (rec && rec.initialized) {
      if (rec.stock <= 0) {
        showToast(name + ' is out of stock');
        return;
      }
      var curQty = items.reduce(function (sum, entry) {
        return entry.name === name ? sum + entry.quantity : sum;
      }, 0);
      if (curQty + 1 > rec.stock) {
        showToast('Only ' + rec.stock + ' left in stock for ' + name);
        return;
      }
    }
    var id = name.toLowerCase() + '|' + livePrice;
    var existing = items.find(function (entry) { return entry.id === id; });
    if (existing) {
      existing.quantity = Math.min(99, existing.quantity + 1);
    } else {
      existing = { id: id, name: name, price: livePrice, quantity: 1 };
      items.push(existing);
    }
    writeCart(items);
    if (window.RedpolyFirebase && window.RedpolyFirebase.getUser()) {
      window.RedpolyFirebase.syncCartItem(existing).catch(function (err) { console.error(err); });
    }
    renderCartSection();
    renderTabCounts();
    showToast(name + ' added to cart');
    if (openDrawer) {
      window.dispatchEvent(new CustomEvent('redpoly:open-cart'));
    }
  }

  async function handleGoogleSignIn(triggerBtn, statusNode) {
    if (triggerBtn) triggerBtn.disabled = true;
    if (statusNode) {
      statusNode.textContent = 'Loading Google authentication…';
      statusNode.classList.add('is-ok');
    }
    if (!window.RedpolyFirebase && typeof window.RedpolyEnsureFirebase === 'function') {
      try {
        await window.RedpolyEnsureFirebase();
      } catch (err) {
        console.error(err);
      }
    }
    if (!window.RedpolyFirebase) {
      if (triggerBtn) triggerBtn.disabled = false;
      if (statusNode) {
        statusNode.textContent = 'Could not load Firebase authentication. Please refresh and try again.';
        statusNode.classList.remove('is-ok');
      }
      return;
    }
    try {
      var user = await window.RedpolyFirebase.signInWithGoogle();
      if (user) {
        formDirty = false;
        showToast('Signed in with Google');
      } else if (statusNode) {
        statusNode.textContent = '';
      }
    } catch (err) {
      var code = err && err.code ? String(err.code) : '';
      var msg = err && err.message ? err.message : '';
      if (statusNode) {
        statusNode.classList.remove('is-ok');
        if (code === 'auth/unauthorized-domain' || msg.indexOf('unauthorized-domain') !== -1) {
          statusNode.textContent = 'This domain (' + window.location.hostname + ') must be added to Firebase Console → Authentication → Authorized domains.';
        } else if (code === 'auth/popup-blocked' || msg.indexOf('popup-blocked') !== -1) {
          statusNode.textContent = 'Popup was blocked by your browser. Please allow popups and try again.';
        } else if (code === 'auth/operation-not-allowed') {
          statusNode.textContent = 'Google Sign-In is not enabled in Firebase Authentication for this project.';
        } else {
          statusNode.textContent = 'Could not sign in with Google. Please try again.';
        }
      }
    } finally {
      if (triggerBtn) triggerBtn.disabled = false;
    }
  }

  function renderIdentity() {
    if (!identityEl) return;
    var fb = window.RedpolyFirebase;
    var user = fb ? fb.getUser() : null;
    identityEl.textContent = '';

    var grid = document.createElement('div');
    grid.className = 'account-identity__grid';

    var left = document.createElement('div');
    left.className = 'account-identity__user';

    if (user) {
      if (user.photoURL) {
        var img = document.createElement('img');
        img.className = 'account-identity__avatar';
        img.src = user.photoURL;
        img.alt = '';
        img.referrerPolicy = 'no-referrer';
        left.appendChild(img);
      } else {
        var init = document.createElement('span');
        init.className = 'account-identity__initial';
        init.textContent = (user.displayName || 'R').charAt(0).toUpperCase();
        left.appendChild(init);
      }
      var copy = document.createElement('div');
      var eyebrow = document.createElement('p');
      eyebrow.className = 'account-identity__eyebrow';
      eyebrow.textContent = 'GOOGLE ACCOUNT';
      var name = document.createElement('h2');
      name.className = 'account-identity__name';
      name.textContent = user.displayName || 'REDPOLY MEMBER';
      var meta = document.createElement('div');
      meta.className = 'account-identity__meta';
      var emailSpan = document.createElement('span');
      emailSpan.textContent = user.email || '';
      var badge = document.createElement('span');
      badge.className = 'account-badge';
      badge.textContent = user.emailVerified ? 'SYNC ON' : 'SIGNED IN';
      meta.appendChild(emailSpan);
      meta.appendChild(badge);
      copy.appendChild(eyebrow);
      copy.appendChild(name);
      copy.appendChild(meta);
      left.appendChild(copy);

      var controls = document.createElement('div');
      controls.className = 'account-identity__controls';
      var signOutBtn = document.createElement('button');
      signOutBtn.type = 'button';
      signOutBtn.className = 'account-btn account-btn--ghost';
      signOutBtn.textContent = 'SIGN OUT';
      var statusLine = document.createElement('p');
      statusLine.className = 'account-identity__status';
      signOutBtn.addEventListener('click', async function () {
        if (!window.RedpolyFirebase) return;
        signOutBtn.disabled = true;
        try {
          await window.RedpolyFirebase.signOut();
          formDirty = false;
          showToast('Signed out');
        } catch (err) {
          statusLine.textContent = 'Could not sign out. Please try again.';
        } finally {
          signOutBtn.disabled = false;
        }
      });
      if (fb && typeof fb.isAdmin === 'function' && fb.isAdmin()) {
        var dashLink = document.createElement('a');
        dashLink.className = 'account-btn';
        dashLink.href = '/dashboard';
        dashLink.textContent = 'ORDERS DASHBOARD ↗';
        controls.appendChild(dashLink);
      }
      controls.appendChild(signOutBtn);
      grid.appendChild(left);
      grid.appendChild(controls);
      identityEl.appendChild(grid);
      identityEl.appendChild(statusLine);
    } else {
      var guestInit = document.createElement('span');
      guestInit.className = 'account-identity__initial';
      guestInit.textContent = '★';
      left.appendChild(guestInit);

      var gCopy = document.createElement('div');
      var gEyebrow = document.createElement('p');
      gEyebrow.className = 'account-identity__eyebrow';
      gEyebrow.textContent = 'GUEST MODE';
      var gName = document.createElement('h2');
      gName.className = 'account-identity__name';
      gName.textContent = 'SIGN IN WITH GOOGLE';
      var gMeta = document.createElement('div');
      gMeta.className = 'account-identity__meta';
      var gBadge = document.createElement('span');
      gBadge.className = 'account-badge account-badge--guest';
      gBadge.textContent = 'LOCAL';
      gMeta.appendChild(gBadge);
      gCopy.appendChild(gEyebrow);
      gCopy.appendChild(gName);
      gCopy.appendChild(gMeta);
      left.appendChild(gCopy);

      var gControls = document.createElement('div');
      gControls.className = 'account-identity__controls';
      var signInBtn = document.createElement('button');
      signInBtn.type = 'button';
      signInBtn.className = 'account-btn';
      signInBtn.innerHTML = GOOGLE_SVG + '<span>CONTINUE WITH GOOGLE</span>';
      var gStatus = document.createElement('p');
      gStatus.className = 'account-identity__status';
      signInBtn.addEventListener('click', function () {
        handleGoogleSignIn(signInBtn, gStatus);
      });
      gControls.appendChild(signInBtn);
      grid.appendChild(left);
      grid.appendChild(gControls);
      identityEl.appendChild(grid);
      identityEl.appendChild(gStatus);
    }
  }

  function renderAddressSection() {
    if (!addressPreview || !addressForm) return;
    var rec = activeAddressRecord();
    var data = rec.data;
    var isCloud = rec.source === 'cloud';

    if (addressSyncBadge) {
      addressSyncBadge.textContent = isCloud ? 'SYNCED' : 'LOCAL';
      addressSyncBadge.className = isCloud ? 'account-badge' : 'account-badge account-badge--guest';
    }
    if (addressSaveBtn) {
      addressSaveBtn.textContent = isCloud ? 'SAVE ADDRESS' : 'SAVE ON DEVICE';
    }

    // Populate form inputs unless the user is actively typing edits
    if (!formDirty) {
      var seed = hasCompleteAddress(data) ? data : (isCloud && rec.fallbackGuest ? rec.fallbackGuest : data);
      fullNameInput.value = (seed && seed.fullName) || '';
      emailInput.value = (seed && seed.email) || '';
      phoneInput.value = (seed && seed.phone) || '';
      streetInput.value = (seed && seed.address) || '';
      pinInput.value = (seed && seed.pinCode) || '';
      cityInput.value = (seed && seed.city) || '';
      stateInput.value = (seed && seed.state) || '';
      cityInput.readOnly = false;
      stateInput.readOnly = false;
      lastAutoPin = '';
      if (pinStatus) pinStatus.textContent = '';
    }

    addressPreview.textContent = '';
    var top = document.createElement('div');
    top.className = 'address-preview__top';
    var label = document.createElement('span');
    label.className = 'address-preview__label';
    label.textContent = 'SAVED ADDRESS';
    var badge = document.createElement('span');
    badge.className = isCloud ? 'account-badge' : 'account-badge account-badge--guest';
    badge.textContent = hasCompleteAddress(data) ? (isCloud ? 'SAVED' : 'LOCAL') : 'NONE';
    top.appendChild(label);
    top.appendChild(badge);
    addressPreview.appendChild(top);

    if (hasCompleteAddress(data)) {
      var nameEl = document.createElement('h3');
      nameEl.className = 'address-preview__name';
      nameEl.textContent = data.fullName || 'REDPOLY RECIPIENT';
      addressPreview.appendChild(nameEl);

      var lines = document.createElement('div');
      lines.className = 'address-preview__lines';
      [
        data.address,
        [data.city, data.state].filter(Boolean).join(', ') + (data.pinCode ? ' - ' + data.pinCode : ''),
        data.phone ? 'Mobile: +91 ' + data.phone : '',
        data.email ? 'Email: ' + data.email : ''
      ].filter(Boolean).forEach(function (lineText) {
        var p = document.createElement('p');
        p.textContent = lineText;
        lines.appendChild(p);
      });
      addressPreview.appendChild(lines);

      var actions = document.createElement('div');
      actions.className = 'address-preview__actions';
      var editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.textContent = 'EDIT FIELDS';
      editBtn.addEventListener('click', function () {
        fullNameInput.focus();
      });
      actions.appendChild(editBtn);

      if (!isCloud) {
        var clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.textContent = 'CLEAR';
        clearBtn.addEventListener('click', function () {
          writeGuestAddress(null);
          formDirty = false;
          if (addressStatus) {
            addressStatus.textContent = 'Address cleared.';
            addressStatus.classList.add('is-ok');
          }
          renderAddressSection();
          renderTabCounts();
          showToast('Saved address cleared');
        });
        actions.appendChild(clearBtn);
      }
      addressPreview.appendChild(actions);
    } else {
      var emptyName = document.createElement('h3');
      emptyName.className = 'address-preview__name';
      emptyName.textContent = 'NO SAVED ADDRESS';
      addressPreview.appendChild(emptyName);
    }
  }

  var ORDER_MILESTONES = [
    { key: 'created', label: 'Order Created', pct: 0 },
    { key: 'processed', label: 'Order Processed', pct: 15 },
    { key: 'shipped', label: 'Order Shipped', pct: 50 },
    { key: 'out_for_delivery', label: 'Out for Delivery', pct: 90 },
    { key: 'delivered', label: 'Order Delivered', pct: 100 }
  ];

  function resolveOrderMilestone(status) {
    if (status === 'cancelled') {
      return { key: 'cancelled', step: -1, pct: 0, label: 'Cancelled', delivered: false, cancelled: true };
    }
    if (status === 'delivered' || status === 'fulfilled') {
      return { key: 'delivered', step: 4, pct: 100, label: 'Order Delivered', delivered: true, cancelled: false };
    }
    if (status === 'out_for_delivery') {
      return { key: 'out_for_delivery', step: 3, pct: 90, label: 'Order Out for Delivery', delivered: false, cancelled: false };
    }
    if (status === 'shipped') {
      return { key: 'shipped', step: 2, pct: 50, label: 'Order Shipped', delivered: false, cancelled: false };
    }
    if (status === 'processed') {
      return { key: 'processed', step: 1, pct: 15, label: 'Order Processed', delivered: false, cancelled: false };
    }
    return { key: 'created', step: 0, pct: 0, label: 'Order Created', delivered: false, cancelled: false };
  }

  function reviewUrlForProduct(itemName) {
    var cat = CATALOGUE[itemName];
    if (!cat || !cat.href) return '';
    return cat.href.split('?')[0] + '#product-reviews';
  }

  function buildOrderCard(order, isSessionOnly) {
    var card = document.createElement('article');
    card.className = 'order-card';
    var ms = resolveOrderMilestone(order.status);

    var top = document.createElement('div');
    top.className = 'order-card__top';

    var left = document.createElement('div');
    var refRow = document.createElement('div');
    refRow.className = 'order-card__ref-row';
    var ref = document.createElement('span');
    ref.className = 'order-card__ref';
    ref.textContent = order.reference || 'RED-DEMO';
    var statusPill = document.createElement('span');
    statusPill.className = isSessionOnly
      ? 'account-badge account-badge--guest'
      : ms.delivered
        ? 'account-badge account-badge--delivered'
        : ms.cancelled
          ? 'account-badge account-badge--cancelled'
          : 'account-badge';
    statusPill.textContent = isSessionOnly ? 'DEMO' : (ms.cancelled ? 'CANCELLED' : (ms.label.toUpperCase() + ' · ' + ms.pct + '%'));
    refRow.appendChild(ref);
    refRow.appendChild(statusPill);
    if (order.freeGift) {
      var giftPill = document.createElement('span');
      giftPill.className = 'account-badge account-badge--indigo';
      giftPill.textContent = '✦ FREE GIFT';
      refRow.appendChild(giftPill);
    }

    var meta = document.createElement('p');
    meta.className = 'order-card__meta';
    var dateText = order.createdAtMs
      ? new Date(order.createdAtMs).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'Session demo';
    var methodLabel = order.shippingMethod === 'express' ? 'Express shipping' : 'Standard shipping';
    meta.textContent = dateText + ' · ' + methodLabel;
    left.appendChild(refRow);
    left.appendChild(meta);

    var right = document.createElement('div');
    right.className = 'order-card__total-box';
    var totLbl = document.createElement('span');
    totLbl.textContent = 'ORDER TOTAL';
    var totVal = document.createElement('strong');
    totVal.textContent = money(order.total);
    right.appendChild(totLbl);
    right.appendChild(totVal);

    top.appendChild(left);
    top.appendChild(right);
    card.appendChild(top);

    // Milestone Progress & Tracking Strip
    if (!isSessionOnly) {
      var milestoneBox = document.createElement('div');
      milestoneBox.className = 'order-milestone' + (ms.delivered ? ' order-milestone--delivered' : '') + (ms.cancelled ? ' order-milestone--cancelled' : '');

      var msHead = document.createElement('div');
      msHead.className = 'order-milestone__head';
      var msLabel = document.createElement('span');
      msLabel.className = 'order-milestone__label';
      msLabel.textContent = ms.cancelled ? 'ORDER CANCELLED' : ms.label;
      var msPct = document.createElement('strong');
      msPct.className = 'order-milestone__pct';
      msPct.textContent = ms.cancelled ? '-' : ms.pct + '%';
      msHead.appendChild(msLabel);
      msHead.appendChild(msPct);
      milestoneBox.appendChild(msHead);

      if (!ms.cancelled) {
        var bar = document.createElement('div');
        bar.className = 'order-milestone__track';
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-valuemin', '0');
        bar.setAttribute('aria-valuemax', '100');
        bar.setAttribute('aria-valuenow', String(ms.pct));
        bar.setAttribute('aria-label', ms.label + ' (' + ms.pct + '%)');
        var fill = document.createElement('span');
        fill.className = 'order-milestone__fill';
        fill.style.width = ms.pct + '%';
        bar.appendChild(fill);
        milestoneBox.appendChild(bar);

        var stepsUl = document.createElement('ol');
        stepsUl.className = 'order-milestone__steps';
        ORDER_MILESTONES.forEach(function (stepObj, idx) {
          var li = document.createElement('li');
          if (idx <= ms.step) li.classList.add('is-done');
          if (idx === ms.step) li.classList.add('is-current');
          li.textContent = stepObj.label + ' (' + stepObj.pct + '%)';
          stepsUl.appendChild(li);
        });
        milestoneBox.appendChild(stepsUl);
      }

      var trackingRow = document.createElement('div');
      trackingRow.className = 'order-tracking';
      var trackingInfo = document.createElement('div');
      trackingInfo.className = 'order-tracking__info';
      if (order.trackingCode) {
        var trkLbl = document.createElement('span');
        trkLbl.textContent = order.trackingCarrier ? order.trackingCarrier + ' Tracking:' : 'Tracking Code:';
        var trkCode = document.createElement('code');
        trkCode.className = 'order-tracking__code';
        trkCode.textContent = order.trackingCode;
        trackingInfo.appendChild(trkLbl);
        trackingInfo.appendChild(trkCode);

        var copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'order-tracking__copy';
        copyBtn.textContent = 'COPY CODE';
        copyBtn.addEventListener('click', function () {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(order.trackingCode).then(function () {
              showToast('Tracking code copied');
            }).catch(function () {
              showToast('Tracking: ' + order.trackingCode);
            });
          } else {
            showToast('Tracking: ' + order.trackingCode);
          }
        });
        trackingRow.appendChild(trackingInfo);
        trackingRow.appendChild(copyBtn);
      } else {
        var pending = document.createElement('span');
        pending.className = 'order-tracking__pending';
        pending.textContent = ms.cancelled
          ? 'Order cancelled: no shipment tracking.'
          : 'Tracking code will appear here once dispatched by REDPOLY.';
        trackingInfo.appendChild(pending);
        trackingRow.appendChild(trackingInfo);
      }
      milestoneBox.appendChild(trackingRow);
      card.appendChild(milestoneBox);
    }

    var itemsWrap = document.createElement('div');
    itemsWrap.className = 'order-card__items';
    (order.items || []).forEach(function (item) {
      var cat = CATALOGUE[item.name];
      var row = document.createElement('div');
      row.className = 'order-item';

      if (cat && cat.image) {
        var img = document.createElement('img');
        img.src = cat.image;
        img.alt = '';
        img.loading = 'lazy';
        row.appendChild(img);
      }
      var copy = document.createElement('div');
      copy.className = 'order-item__copy';
      if (cat && cat.href) {
        var link = document.createElement('a');
        link.href = cat.href;
        link.textContent = item.name;
        copy.appendChild(link);
      } else {
        var strong = document.createElement('strong');
        strong.textContent = item.name;
        copy.appendChild(strong);
      }
      var sub = document.createElement('small');
      sub.textContent = 'Qty ' + item.quantity + ' × ' + money(item.price);
      copy.appendChild(sub);

      var itemActions = document.createElement('div');
      itemActions.className = 'order-item__actions';
      if (!isSessionOnly && ms.delivered) {
        var revHref = reviewUrlForProduct(item.name);
        if (revHref) {
          var revLink = document.createElement('a');
          revLink.className = 'order-item__review-link';
          revLink.href = revHref;
          revLink.textContent = 'REVIEW ↗';
          itemActions.appendChild(revLink);
        }
      }

      var lineTot = document.createElement('span');
      lineTot.className = 'order-item__total';
      lineTot.textContent = money(Number(item.price) * Number(item.quantity));
      itemActions.appendChild(lineTot);

      row.appendChild(copy);
      row.appendChild(itemActions);
      itemsWrap.appendChild(row);
    });
    card.appendChild(itemsWrap);

    var bottom = document.createElement('div');
    bottom.className = 'order-card__bottom';
    var shipNote = document.createElement('p');
    shipNote.className = 'order-card__ship';
    if (order.customerName) {
      var destStrong = document.createElement('strong');
      destStrong.textContent = order.customerName;
      shipNote.appendChild(destStrong);
    }
    var shipLines = [
      order.address,
      [order.city, order.state].filter(Boolean).join(', ') + (order.pin ? ' - ' + order.pin : ''),
      order.phone ? '+91 ' + order.phone : ''
    ].filter(Boolean).join(' · ');
    if (shipLines) {
      shipNote.appendChild(document.createTextNode((order.customerName ? ' · ' : '') + shipLines));
    }

    var actions = document.createElement('div');
    actions.className = 'order-card__actions';
    var validRebuyItems = (order.items || []).filter(function (i) {
      return Boolean(i && typeof i.name === 'string' && isKnownProduct(i.name));
    });
    if (validRebuyItems.length) {
      var rebuy = document.createElement('button');
      rebuy.type = 'button';
      rebuy.className = 'account-btn';
      rebuy.textContent = 'BUY AGAIN ↗';
      rebuy.addEventListener('click', function () {
        var cart = readCart();
        var addedAny = false;
        validRebuyItems.forEach(function (line) {
          var rec = getLiveProduct(line.name);
          var livePrice = rec && rec.price > 0 ? rec.price : CATALOGUE[line.name].price;
          var qtyRequested = Math.max(1, Math.floor(Number(line.quantity) || 1));
          if (rec && rec.initialized && rec.stock <= 0) {
            showToast(line.name + ' is out of stock');
            return;
          }
          var id = line.name.toLowerCase() + '|' + livePrice;
          var existing = cart.find(function (c) { return c.id === id; });
          var curQty = existing ? existing.quantity : 0;
          var maxAllowed = rec && rec.initialized ? Math.min(99, rec.stock) : 99;
          var targetQty = Math.min(maxAllowed, curQty + qtyRequested);
          if (targetQty <= curQty) {
            showToast('Only ' + rec.stock + ' left in stock for ' + line.name);
            return;
          }
          if (existing) existing.quantity = targetQty;
          else {
            existing = { id: id, name: line.name, price: livePrice, quantity: targetQty };
            cart.push(existing);
          }
          addedAny = true;
          if (window.RedpolyFirebase && window.RedpolyFirebase.getUser()) {
            window.RedpolyFirebase.syncCartItem(existing).catch(function (err) { console.error(err); });
          }
        });
        if (!addedAny) return;
        writeCart(cart);
        renderCartSection();
        renderTabCounts();
        showToast('Order items added to cart');
        window.dispatchEvent(new CustomEvent('redpoly:open-cart'));
      });
      actions.appendChild(rebuy);
    }

    bottom.appendChild(shipNote);
    bottom.appendChild(actions);
    card.appendChild(bottom);
    return card;
  }

  function renderOrdersSection() {
    if (!ordersContainer) return;
    var fb = window.RedpolyFirebase;
    var user = fb ? fb.getUser() : null;
    var cloudOrders = fb ? fb.getOrders() : [];
    var sessionOrder = readSessionDemoOrder();

    ordersContainer.textContent = '';

    var listToShow = [];
    if (user && cloudOrders.length) {
      listToShow = cloudOrders.map(function (o) { return { order: o, sessionOnly: false }; });
    } else if (!user && sessionOrder) {
      listToShow = [{ order: sessionOrder, sessionOnly: true }];
    }

    if (ordersBadge) {
      ordersBadge.textContent = listToShow.length + (listToShow.length === 1 ? ' ORDER' : ' ORDERS');
    }
    if (tabOrdersCount) {
      tabOrdersCount.textContent = String(listToShow.length);
    }

    if (!listToShow.length) {
      var empty = document.createElement('div');
      empty.className = 'account-empty';
      var copyWrap = document.createElement('div');
      var title = document.createElement('strong');
      title.textContent = 'NO ORDERS YET';
      copyWrap.appendChild(title);

      var cta = document.createElement('a');
      cta.className = 'account-btn';
      cta.href = '/#shop';
      cta.textContent = 'EXPLORE SHOP →';
      empty.appendChild(copyWrap);
      empty.appendChild(cta);
      ordersContainer.appendChild(empty);
      return;
    }

    var list = document.createElement('div');
    list.className = 'orders-list';
    listToShow.forEach(function (entry) {
      try {
        list.appendChild(buildOrderCard(entry.order, entry.sessionOnly));
      } catch (err) {
        console.error('Failed to render order card:', err);
      }
    });
    ordersContainer.appendChild(list);
  }

  function renderFavoritesSection() {
    if (!favContainer) return;
    var items = readFavorites();
    favContainer.textContent = '';

    if (favBadge) favBadge.textContent = items.length + ' SAVED';
    if (tabFavCount) tabFavCount.textContent = String(items.length);

    if (!items.length) {
      var empty = document.createElement('div');
      empty.className = 'account-empty';
      var copyWrap = document.createElement('div');
      var title = document.createElement('strong');
      title.textContent = 'NO FAVORITES YET';
      copyWrap.appendChild(title);

      var cta = document.createElement('a');
      cta.className = 'account-btn';
      cta.href = '/#shop';
      cta.textContent = 'BROWSE TOYS →';
      empty.appendChild(copyWrap);
      empty.appendChild(cta);
      favContainer.appendChild(empty);
      return;
    }

    var grid = document.createElement('div');
    grid.className = 'fav-grid';
    items.forEach(function (item) {
      var card = document.createElement('article');
      card.className = 'fav-card';

      var imgLink = document.createElement('a');
      imgLink.className = 'fav-card__img';
      imgLink.href = item.href;
      var img = document.createElement('img');
      img.src = item.image || (CATALOGUE[item.name] ? CATALOGUE[item.name].image : '');
      img.alt = item.name;
      img.loading = 'lazy';
      imgLink.appendChild(img);

      var body = document.createElement('div');
      body.className = 'fav-card__body';
      var titleLink = document.createElement('a');
      titleLink.className = 'fav-card__name';
      titleLink.href = item.href;
      titleLink.textContent = item.name;

      var price = document.createElement('p');
      price.className = 'fav-card__price';
      price.textContent = money(item.price);
      var gst = document.createElement('small');
      gst.textContent = 'INCL. GST';
      price.appendChild(gst);

      var favRec = getLiveProduct(item.name);
      var favOut = Boolean(favRec && favRec.initialized && favRec.stock === 0);
      var favLow = Boolean(favRec && favRec.initialized && favRec.stock > 0 && favRec.stock <= favRec.lowStockThreshold);

      var actions = document.createElement('div');
      actions.className = 'fav-card__actions';
      var addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'fav-card__add';
      addBtn.textContent = favOut ? 'OUT OF STOCK' : 'ADD TO CART';
      addBtn.disabled = favOut;
      addBtn.addEventListener('click', function () {
        addItemToCart(item.name, item.price, true);
      });

      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'fav-card__remove';
      removeBtn.textContent = 'REMOVE';
      removeBtn.setAttribute('aria-label', 'Remove ' + item.name + ' from favorites');
      removeBtn.addEventListener('click', function () {
        var remaining = readFavorites().filter(function (entry) { return entry.name !== item.name; });
        writeFavorites(remaining);
        if (window.RedpolyFirebase && window.RedpolyFirebase.getUser()) {
          window.RedpolyFirebase.removeWishlistItem(item.name).catch(function (err) { console.error(err); });
        }
        renderFavoritesSection();
        renderTabCounts();
        showToast(item.name + ' removed from favorites');
      });

      actions.appendChild(addBtn);
      actions.appendChild(removeBtn);
      body.appendChild(titleLink);
      body.appendChild(price);
      if (favOut || favLow) {
        var stockHint = document.createElement('p');
        stockHint.className = 'fav-card__stock ' + (favOut ? 'is-out' : 'is-low');
        stockHint.textContent = favOut ? 'CURRENTLY OUT OF STOCK' : 'ONLY ' + favRec.stock + ' LEFT!';
        body.appendChild(stockHint);
      }
      body.appendChild(actions);
      card.appendChild(imgLink);
      card.appendChild(body);
      grid.appendChild(card);
    });
    favContainer.appendChild(grid);
  }

  function renderCartSection() {
    if (!cartContainer) return;
    var items = readCart();
    var pieces = items.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    var subtotal = items.reduce(function (sum, item) { return sum + item.price * item.quantity; }, 0);

    cartContainer.textContent = '';
    if (cartBadge) cartBadge.textContent = pieces + (pieces === 1 ? ' ITEM' : ' ITEMS');
    if (tabCartCount) tabCartCount.textContent = String(pieces);

    if (!items.length) {
      var empty = document.createElement('div');
      empty.className = 'account-empty';
      var copyWrap = document.createElement('div');
      var title = document.createElement('strong');
      title.textContent = 'CART IS EMPTY';
      copyWrap.appendChild(title);

      var cta = document.createElement('a');
      cta.className = 'account-btn';
      cta.href = '/#shop';
      cta.textContent = 'BROWSE TOYS →';
      empty.appendChild(copyWrap);
      empty.appendChild(cta);
      cartContainer.appendChild(empty);
      return;
    }

    var grid = document.createElement('div');
    grid.className = 'account-cart-grid';

    var list = document.createElement('div');
    list.className = 'account-cart-list';
    var anyStockBlocked = false;

    items.forEach(function (item) {
      var cat = CATALOGUE[item.name] || { href: '/#shop', image: '' };
      var rec = getLiveProduct(item.name);
      var stockManaged = Boolean(rec && rec.initialized);
      var availStock = stockManaged ? rec.stock : null;
      var isOut = stockManaged && availStock === 0;
      var exceedsStock = stockManaged && item.quantity > availStock;
      if (isOut || exceedsStock) anyStockBlocked = true;

      var row = document.createElement('article');
      row.className = 'account-cart-row';

      if (cat.image) {
        var img = document.createElement('img');
        img.src = cat.image;
        img.alt = '';
        img.loading = 'lazy';
        row.appendChild(img);
      }

      var info = document.createElement('div');
      info.className = 'account-cart-row__info';
      var nameLink = document.createElement('a');
      nameLink.href = cat.href;
      nameLink.textContent = item.name;
      var priceLine = document.createElement('p');
      priceLine.textContent = money(item.price) + ' each';
      info.appendChild(nameLink);
      info.appendChild(priceLine);
      if (isOut || exceedsStock || (stockManaged && availStock <= rec.lowStockThreshold)) {
        var rowStock = document.createElement('p');
        rowStock.className = 'account-cart-row__stock ' + (isOut || exceedsStock ? 'is-out' : 'is-low');
        rowStock.textContent = isOut
          ? 'OUT OF STOCK: remove to check out'
          : exceedsStock
            ? 'ONLY ' + availStock + ' LEFT: reduce quantity'
            : 'ONLY ' + availStock + ' LEFT!';
        info.appendChild(rowStock);
      }

      var controls = document.createElement('div');
      controls.className = 'account-cart-row__controls';
      var stepper = document.createElement('div');
      stepper.className = 'account-stepper';

      var decBtn = document.createElement('button');
      decBtn.type = 'button';
      decBtn.textContent = '−';
      decBtn.setAttribute('aria-label', 'Decrease quantity of ' + item.name);
      decBtn.addEventListener('click', function () {
        var latest = readCart();
        var target = latest.find(function (c) { return c.id === item.id; });
        if (!target) return;
        target.quantity -= 1;
        if (target.quantity <= 0) {
          latest = latest.filter(function (c) { return c.id !== item.id; });
          if (window.RedpolyFirebase && window.RedpolyFirebase.getUser()) {
            window.RedpolyFirebase.removeCartItem(item.name).catch(function (err) { console.error(err); });
          }
        } else if (window.RedpolyFirebase && window.RedpolyFirebase.getUser()) {
          window.RedpolyFirebase.syncCartItem(target).catch(function (err) { console.error(err); });
        }
        writeCart(latest);
        renderCartSection();
        renderTabCounts();
      });

      var qtySpan = document.createElement('span');
      qtySpan.textContent = String(item.quantity);

      var incBtn = document.createElement('button');
      incBtn.type = 'button';
      incBtn.textContent = '+';
      incBtn.setAttribute('aria-label', 'Increase quantity of ' + item.name);
      if (stockManaged && item.quantity >= availStock) incBtn.disabled = true;
      incBtn.addEventListener('click', function () {
        var latest = readCart();
        var target = latest.find(function (c) { return c.id === item.id; });
        if (!target) return;
        var live = getLiveProduct(item.name);
        if (live && live.initialized && target.quantity + 1 > live.stock) {
          showToast('Only ' + live.stock + ' left in stock for ' + item.name);
          return;
        }
        target.quantity = Math.min(99, target.quantity + 1);
        writeCart(latest);
        if (window.RedpolyFirebase && window.RedpolyFirebase.getUser()) {
          window.RedpolyFirebase.syncCartItem(target).catch(function (err) { console.error(err); });
        }
        renderCartSection();
        renderTabCounts();
      });

      stepper.appendChild(decBtn);
      stepper.appendChild(qtySpan);
      stepper.appendChild(incBtn);

      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'account-cart-remove';
      removeBtn.textContent = 'REMOVE';
      removeBtn.addEventListener('click', function () {
        var latest = readCart().filter(function (c) { return c.id !== item.id; });
        writeCart(latest);
        if (window.RedpolyFirebase && window.RedpolyFirebase.getUser()) {
          window.RedpolyFirebase.removeCartItem(item.name).catch(function (err) { console.error(err); });
        }
        renderCartSection();
        renderTabCounts();
        showToast(item.name + ' removed from cart');
      });

      controls.appendChild(stepper);
      controls.appendChild(removeBtn);
      info.appendChild(controls);

      var rowTotal = document.createElement('strong');
      rowTotal.className = 'account-cart-row__price';
      rowTotal.textContent = money(item.price * item.quantity);

      row.appendChild(info);
      row.appendChild(rowTotal);
      list.appendChild(row);
    });

    var summary = document.createElement('aside');
    summary.className = 'account-cart-summary';
    var sumTitle = document.createElement('h3');
    sumTitle.textContent = 'BAG SUMMARY';
    var sumLine = document.createElement('p');
    sumLine.className = 'account-cart-summary__line';
    var lbl = document.createElement('span');
    lbl.textContent = 'ITEMS (' + pieces + ')';
    var val = document.createElement('strong');
    val.textContent = money(subtotal);
    sumLine.appendChild(lbl);
    sumLine.appendChild(val);

    var reward = document.createElement('p');
    reward.className = 'account-cart-summary__reward';
    if (subtotal >= FREE_GIFT_FROM) {
      reward.textContent = '✦ Free shipping + gift unlocked';
    } else if (subtotal >= FREE_SHIPPING_FROM) {
      reward.textContent = '✓ Free shipping · Add ' + money(FREE_GIFT_FROM - subtotal) + ' for gift';
    } else {
      reward.textContent = 'Add ' + money(FREE_SHIPPING_FROM - subtotal) + ' for free shipping';
    }

    var checkoutLink = document.createElement('a');
    checkoutLink.className = 'account-btn' + (anyStockBlocked ? ' account-btn--disabled' : '');
    checkoutLink.href = '/checkout';
    checkoutLink.textContent = anyStockBlocked ? 'ADJUST OUT-OF-STOCK ITEMS' : 'PROCEED TO CHECKOUT ↗';

    summary.appendChild(sumTitle);
    summary.appendChild(sumLine);
    summary.appendChild(reward);
    summary.appendChild(checkoutLink);

    grid.appendChild(list);
    grid.appendChild(summary);
    cartContainer.appendChild(grid);
  }

  function renderTabCounts() {
    var fb = window.RedpolyFirebase;
    var user = fb ? fb.getUser() : null;
    var cloudOrders = fb ? fb.getOrders() : [];
    var sessionOrder = readSessionDemoOrder();
    var orderCount = user ? cloudOrders.length : (sessionOrder ? 1 : 0);
    if (tabOrdersCount) tabOrdersCount.textContent = String(orderCount);

    var favs = readFavorites();
    if (tabFavCount) tabFavCount.textContent = String(favs.length);

    var cart = readCart();
    var pieces = cart.reduce(function (s, i) { return s + i.quantity; }, 0);
    if (tabCartCount) tabCartCount.textContent = String(pieces);
  }

  function renderAll() {
    renderIdentity();
    renderAddressSection();
    renderOrdersSection();
    renderFavoritesSection();
    renderCartSection();
    renderTabCounts();
  }

  // PIN code lookup for the delivery address editor
  if (pinInput && cityInput && stateInput) {
    pinInput.addEventListener('input', function () {
      var pin = pinInput.value.trim();
      lookupSeq += 1;
      var seq = lookupSeq;
      window.clearTimeout(lookupTimer);
      if (activeLookup) activeLookup.abort();
      activeLookup = null;

      if (lastAutoPin && pin !== lastAutoPin) {
        cityInput.value = '';
        stateInput.value = '';
        cityInput.readOnly = false;
        stateInput.readOnly = false;
        lastAutoPin = '';
      }
      if (!pin) {
        if (pinStatus) pinStatus.textContent = '';
        return;
      }
      if (!/^[1-9][0-9]{5}$/.test(pin)) {
        if (pinStatus) pinStatus.textContent = pin.length < 6 ? '6 digits required' : 'Invalid PIN code';
        return;
      }

      if (pinStatus) pinStatus.textContent = 'Checking PIN…';
      lookupTimer = window.setTimeout(function () {
        var controller = window.AbortController ? new AbortController() : null;
        activeLookup = controller;
        window.fetch('https://api.postalpincode.in/pincode/' + encodeURIComponent(pin), controller ? { signal: controller.signal } : {})
          .then(function (resp) {
            if (!resp.ok) throw new Error('PIN lookup failed');
            return resp.json();
          })
          .then(function (res) {
            if (seq !== lookupSeq || pinInput.value.trim() !== pin) return;
            var offices = res && res[0] && res[0].Status === 'Success' && res[0].PostOffice;
            var office = offices && offices.find(function (entry) { return entry && entry.Country === 'India' && entry.State && (entry.District || entry.Block || entry.Name); });
            if (!office) {
              if (pinStatus) pinStatus.textContent = 'PIN not found: enter city & state';
              return;
            }
            cityInput.value = office.District || office.Block || office.Name;
            stateInput.value = office.State;
            cityInput.readOnly = true;
            stateInput.readOnly = true;
            lastAutoPin = pin;
            if (pinStatus) pinStatus.textContent = cityInput.value + ', ' + stateInput.value;
          })
          .catch(function () {
            if (seq !== lookupSeq || pinInput.value.trim() !== pin) return;
            if (pinStatus) pinStatus.textContent = 'Enter city & state manually';
          });
      }, 180);
    });
  }

  // Save delivery address (Cloud Firestore when signed in, localStorage draft when guest)
  if (addressForm) {
    addressForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (!addressForm.reportValidity()) return;

      var payload = {
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        address: streetInput.value.trim(),
        pinCode: pinInput.value.trim(),
        city: cityInput.value.trim(),
        state: stateInput.value.trim()
      };

      if (!/^[6-9][0-9]{9}$/.test(payload.phone)) {
        if (addressStatus) {
          addressStatus.classList.remove('is-ok');
          addressStatus.textContent = 'Enter a valid 10-digit Indian mobile number.';
        }
        phoneInput.focus();
        return;
      }
      if (!/^[1-9][0-9]{5}$/.test(payload.pinCode)) {
        if (addressStatus) {
          addressStatus.classList.remove('is-ok');
          addressStatus.textContent = 'Enter a valid 6-digit Indian PIN code.';
        }
        pinInput.focus();
        return;
      }

      var fb = window.RedpolyFirebase;
      var user = fb ? fb.getUser() : null;

      if (user) {
        addressSaveBtn.disabled = true;
        if (addressStatus) {
          addressStatus.classList.add('is-ok');
          addressStatus.textContent = 'Saving…';
        }
        try {
          await fb.saveDeliveryProfile(payload);
          formDirty = false;
          writeGuestAddress(null);
          if (addressStatus) {
            addressStatus.classList.add('is-ok');
            addressStatus.textContent = 'Saved';
          }
          renderAddressSection();
          renderTabCounts();
          showToast('Address saved');
        } catch (err) {
          if (addressStatus) {
            addressStatus.classList.remove('is-ok');
            addressStatus.textContent = err && err.message ? err.message : 'Could not save address.';
          }
        } finally {
          addressSaveBtn.disabled = false;
        }
      } else {
        writeGuestAddress(payload);
        formDirty = false;
        if (addressStatus) {
          addressStatus.classList.add('is-ok');
          addressStatus.textContent = 'Saved on device';
        }
        renderAddressSection();
        renderTabCounts();
        showToast('Address saved');
      }
    });
  }

  // Tab switching: open Recent Orders by default, show Address/Favorites/Cart only on click
  var VALID_TABS = ['orders', 'address', 'favorites', 'cart'];
  function resolveTab(name) {
    return VALID_TABS.indexOf(name) !== -1 ? name : 'orders';
  }
  function activateTab(tabName, scrollToPanel) {
    var active = resolveTab(tabName);
    if (tabsNav) {
      tabsNav.querySelectorAll('button[data-tab]').forEach(function (btn) {
        var match = btn.getAttribute('data-tab') === active;
        btn.classList.toggle('is-active', match);
        btn.setAttribute('aria-selected', match ? 'true' : 'false');
      });
    }
    sectionEls.forEach(function (sec) {
      sec.hidden = sec.getAttribute('data-section') !== active;
    });
    if (scrollToPanel && tabsNav) {
      tabsNav.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  if (tabsNav) {
    tabsNav.addEventListener('click', function (event) {
      var btn = event.target.closest('button[data-tab]');
      if (!btn) return;
      activateTab(btn.getAttribute('data-tab'), false);
    });
    tabsNav.addEventListener('keydown', function (event) {
      var tabs = Array.prototype.slice.call(tabsNav.querySelectorAll('button[data-tab]'));
      var idx = tabs.indexOf(document.activeElement);
      if (idx === -1) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        var next = tabs[(idx + 1) % tabs.length];
        next.focus();
        activateTab(next.getAttribute('data-tab'), false);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        var prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        prev.focus();
        activateTab(prev.getAttribute('data-tab'), false);
      }
    });
  }

  function syncTabFromHash() {
    var hash = (window.location.hash || '').replace(/^#/, '');
    activateTab(hash ? resolveTab(hash) : 'orders', false);
  }
  window.addEventListener('hashchange', syncTabFromHash);

  // Sync live with Firebase bridge, header drawers, and other browser tabs
  window.addEventListener('redpoly:firebase-ready', function () {
    var fb = window.RedpolyFirebase;
    if (fb && typeof fb.getCatalogMap === 'function') syncCatalogueMap(fb.getCatalogMap());
    renderAll();
  });
  window.addEventListener('redpoly:catalog-updated', function (event) {
    if (event.detail && event.detail.map) syncCatalogueMap(event.detail.map);
    renderOrdersSection();
    renderFavoritesSection();
    renderCartSection();
    renderTabCounts();
  });
  window.addEventListener('redpoly:auth-changed', function () {
    formDirty = false;
    renderAll();
  });
  window.addEventListener('redpoly:profile-updated', function () {
    formDirty = false;
    renderAddressSection();
    renderTabCounts();
  });
  window.addEventListener('redpoly:orders-updated', function () {
    renderOrdersSection();
    renderTabCounts();
  });
  window.addEventListener('redpoly:cart-updated', function () {
    renderCartSection();
    renderTabCounts();
  });
  window.addEventListener('redpoly:cart-local-sync', function () {
    renderCartSection();
    renderTabCounts();
  });
  window.addEventListener('redpoly:wishlist-updated', function () {
    renderFavoritesSection();
    renderTabCounts();
  });
  window.addEventListener('redpoly:wishlist-local-sync', function () {
    renderFavoritesSection();
    renderTabCounts();
  });
  window.addEventListener('storage', renderAll);

  renderAll();
  syncTabFromHash();
})();
