/* REDPOLY Shopify-minimal Orders & Reviews Admin Dashboard */
(function () {
  var ADMIN_EMAIL = 'ashketchupkeke@gmail.com';
  var FREE_STANDARD_FROM = 2000;
  var FREE_EXPRESS_FROM = 2000;
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
    'CUTE DINOS TRIO': { price: 549, href: '/cute-dinos?pack=trio', image: '/assets/images/redpoly/products/cute-dinos-trio-thumb.webp?v=dinos-20261116' },
    'MAGNETIC BLOCKS 25 PCS': { price: 399, href: '/magnetic-blocks?pack=25pcs', image: '/assets/images/redpoly/products/magnetic-blocks-25pcs-thumb.webp?v=mag-20261122' },
    'MAGNETIC BLOCKS 36 PCS': { price: 549, href: '/magnetic-blocks?pack=36pcs', image: '/assets/images/redpoly/products/magnetic-blocks-36pcs-thumb.webp?v=mag-20261122' },
    'MAGNETIC BLOCKS 42 PCS': { price: 599, href: '/magnetic-blocks?pack=42pcs', image: '/assets/images/redpoly/products/magnetic-blocks-42pcs-thumb.webp?v=mag-20261122' },
    'MAGNETIC BLOCKS 64 PCS': { price: 799, href: '/magnetic-blocks?pack=64pcs', image: '/assets/images/redpoly/products/magnetic-blocks-64pcs-thumb.webp?v=mag-20261122' },
    'RISE ONE X 4X4': { price: 1499, href: '/rise-one-x-4x4', image: '/assets/images/redpoly/products/rise-one-x-4x4-thumb.webp?v=rise-20261122' },
    'DRIFT KING': { price: 799, href: '/drift-king', image: '/assets/images/redpoly/products/drift-king-thumb.webp?v=dk-20261124' },
    'BABY LINGO': { price: 799, href: '/baby-lingo', image: '/assets/images/redpoly/products/baby-lingo-thumb.webp?v=lingo-20261119' }
  };
  var SKU_ORDER = [
    'baby-lingo',
    'drift-king',
    'rise-one-x-4x4',
    'magnetic-blocks-25-pcs', 'magnetic-blocks-36-pcs', 'magnetic-blocks-42-pcs', 'magnetic-blocks-64-pcs',
    'mecha-rover', 'bubble-gun', 'stunt-pet',
    'cute-dinos-green', 'cute-dinos-red', 'cute-dinos-teal', 'cute-dinos-trio',
    'mini-cool-car', 'gel-storm', 'pixel-splash'
  ];
  var SKU_TO_NAME = {
    'baby-lingo': 'BABY LINGO',
    'drift-king': 'DRIFT KING',
    'rise-one-x-4x4': 'RISE ONE X 4X4',
    'magnetic-blocks-25-pcs': 'MAGNETIC BLOCKS 25 PCS',
    'magnetic-blocks-36-pcs': 'MAGNETIC BLOCKS 36 PCS',
    'magnetic-blocks-42-pcs': 'MAGNETIC BLOCKS 42 PCS',
    'magnetic-blocks-64-pcs': 'MAGNETIC BLOCKS 64 PCS',
    'mecha-rover': 'MECHA ROVER',
    'bubble-gun': 'BUBBLE GUN',
    'stunt-pet': 'STUNT PET',
    'cute-dinos-green': 'CUTE DINOS GREEN',
    'cute-dinos-red': 'CUTE DINOS RED',
    'cute-dinos-teal': 'CUTE DINOS TEAL',
    'cute-dinos-trio': 'CUTE DINOS TRIO',
    'mini-cool-car': 'MINI COOL CAR',
    'gel-storm': 'GEL STORM',
    'pixel-splash': 'PIXEL SPLASH'
  };
  var NAME_TO_SKU = {};
  Object.keys(SKU_TO_NAME).forEach(function (sku) {
    NAME_TO_SKU[SKU_TO_NAME[sku]] = sku;
  });
  var PRODUCT_GROUPS = [
    { id: 'baby-lingo', name: 'BABY LINGO', href: '/baby-lingo', image: '/assets/images/redpoly/products/baby-lingo-thumb.webp?v=lingo-20261119', skus: ['baby-lingo'], variantLabels: {} },
    { id: 'drift-king', name: 'DRIFT KING', href: '/drift-king', image: '/assets/images/redpoly/products/drift-king-thumb.webp?v=dk-20261124', skus: ['drift-king'], variantLabels: {} },
    { id: 'rise-one-x-4x4', name: 'RISE ONE X 4X4', href: '/rise-one-x-4x4', image: '/assets/images/redpoly/products/rise-one-x-4x4-thumb.webp?v=rise-20261122', skus: ['rise-one-x-4x4'], variantLabels: {} },
    {
      id: 'magnetic-blocks',
      name: 'MAGNETIC BLOCKS',
      href: '/magnetic-blocks',
      image: '/assets/images/redpoly/products/magnetic-blocks-25pcs-thumb.webp?v=mag-20261122',
      skus: ['magnetic-blocks-25-pcs', 'magnetic-blocks-36-pcs', 'magnetic-blocks-42-pcs', 'magnetic-blocks-64-pcs'],
      variantLabels: {
        'magnetic-blocks-25-pcs': '25 PCS',
        'magnetic-blocks-36-pcs': '36 PCS',
        'magnetic-blocks-42-pcs': '42 PCS',
        'magnetic-blocks-64-pcs': '64 PCS'
      }
    },
    { id: 'mecha-rover', name: 'MECHA ROVER', href: '/mecha-rover', image: '/assets/images/redpoly/products/mecha-rover-thumb.webp?v=mecha-20261120', skus: ['mecha-rover'], variantLabels: {} },
    { id: 'bubble-gun', name: 'BUBBLE GUN', href: '/bubble-gun', image: '/assets/images/redpoly/products/bubble-gun-thumb.webp?v=bubble-20261121', skus: ['bubble-gun'], variantLabels: {} },
    { id: 'stunt-pet', name: 'STUNT PET', href: '/stunt-pet', image: '/assets/images/redpoly/products/stunt-pet-thumb.webp?v=pet-20261122', skus: ['stunt-pet'], variantLabels: {} },
    {
      id: 'cute-dinos',
      name: 'CUTE DINOS',
      href: '/cute-dinos',
      image: '/assets/images/redpoly/products/cute-dinos-trio-thumb.webp?v=dinos-20261116',
      skus: ['cute-dinos-green', 'cute-dinos-red', 'cute-dinos-teal', 'cute-dinos-trio'],
      variantLabels: {
        'cute-dinos-green': 'Green',
        'cute-dinos-red': 'Red',
        'cute-dinos-teal': 'Teal',
        'cute-dinos-trio': 'Trio Pack'
      }
    },
    { id: 'mini-cool-car', name: 'MINI COOL CAR', href: '/mini-cool-car', image: '/assets/images/redpoly/products/mini-cool-car-thumb.webp?v=car-20261117', skus: ['mini-cool-car'], variantLabels: {} },
    { id: 'gel-storm', name: 'GEL STORM', href: '/gel-storm', image: '/assets/images/redpoly/products/gel-storm-thumb.webp?v=gel-20261121', skus: ['gel-storm'], variantLabels: {} },
    { id: 'pixel-splash', name: 'PIXEL SPLASH', href: '/pixel-splash', image: '/assets/images/redpoly/products/pixel-splash-thumb.webp?v=pixel-20261117-v3', skus: ['pixel-splash'], variantLabels: {} }
  ];
  var GROUP_BY_ID = {};
  var SKU_TO_GROUP = {};
  PRODUCT_GROUPS.forEach(function (grp, idx) {
    grp.orderIndex = idx;
    GROUP_BY_ID[grp.id] = grp;
    grp.skus.forEach(function (sku) {
      SKU_TO_GROUP[sku] = grp;
    });
  });
  var DEFAULT_CARD_TAGS = {
    'baby-lingo': 'NEW IN STORE',
    'drift-king': 'NEW IN STORE',
    'rise-one-x-4x4': 'NEW IN STORE',
    'magnetic-blocks-25-pcs': 'NEW IN STORE',
    'magnetic-blocks-36-pcs': '',
    'magnetic-blocks-42-pcs': '',
    'magnetic-blocks-64-pcs': '',
    'mecha-rover': '',
    'bubble-gun': 'IN STORE NOW',
    'stunt-pet': 'NEW IN STORE',
    'cute-dinos-green': 'NEW IN STORE',
    'cute-dinos-red': '',
    'cute-dinos-teal': '',
    'cute-dinos-trio': '',
    'mini-cool-car': 'NEW IN STORE',
    'gel-storm': 'JUST LANDED',
    'pixel-splash': 'NEW IN STORE'
  };
  var DEFAULT_LOW_STOCK_THRESHOLD = 5;
  var INITIAL_SEED_STOCK = 20;
  var CATEGORY_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  var CATEGORY_HEX_RE = /^#[0-9a-fA-F]{6}$/;
  var DEFAULT_CATEGORIES = [
    {
      slug: 'guns',
      name: 'Guns',
      shortDesc: 'Gel blasters, pixel water guns & bubble shooters',
      shelfDesc: 'Outdoor gel blasters, motorised water sprayers & giant bubble guns.',
      accentColor: '#FF6B1A',
      sortOrder: 1,
      visible: true,
      thumbnailUrl: '',
      updatedAtMs: 0
    },
    {
      slug: 'cars',
      name: 'Cars',
      shortDesc: '4x4 off-road crawlers, drift cars & pocket racers',
      shelfDesc: '4x4 off-road crawlers, high-speed drift machines & pocket racers.',
      accentColor: '#1C7ED6',
      sortOrder: 2,
      visible: true,
      thumbnailUrl: '',
      updatedAtMs: 0
    },
    {
      slug: 'educational',
      name: 'Educational',
      shortDesc: 'Magnetic STEM blocks, Baby Lingo & robotic builds',
      shelfDesc: 'Screen-free STEM builders, speech flashcards & hands-on engineering kits.',
      accentColor: '#0E9F6E',
      sortOrder: 3,
      visible: true,
      thumbnailUrl: '',
      updatedAtMs: 0
    },
    {
      slug: 'fun',
      name: 'Fun',
      shortDesc: '360° flip stunt pets & colourful wind-up dinos',
      shelfDesc: 'Flip-tastic stunt companions & pocket-sized pocket dinos for everyday giggles.',
      accentColor: '#7C3AED',
      sortOrder: 4,
      visible: true,
      thumbnailUrl: '',
      updatedAtMs: 0
    }
  ];
  var DEFAULT_PRODUCT_CATEGORIES = {
    'baby-lingo': 'educational',
    'drift-king': 'cars',
    'rise-one-x-4x4': 'cars',
    'magnetic-blocks-25-pcs': 'educational',
    'magnetic-blocks-36-pcs': 'educational',
    'magnetic-blocks-42-pcs': 'educational',
    'magnetic-blocks-64-pcs': 'educational',
    'mecha-rover': 'educational',
    'bubble-gun': 'guns',
    'stunt-pet': 'fun',
    'cute-dinos-green': 'fun',
    'cute-dinos-red': 'fun',
    'cute-dinos-teal': 'fun',
    'cute-dinos-trio': 'fun',
    'mini-cool-car': 'cars',
    'gel-storm': 'guns',
    'pixel-splash': 'guns'
  };

  var VALID_ORDER_STATUSES = ['placed', 'created', 'processed', 'shipped', 'out_for_delivery', 'delivered', 'fulfilled', 'cancelled'];
  var VALID_PRODUCT_SLUGS = ['bubble-gun', 'stunt-pet', 'mini-cool-car', 'gel-storm', 'mecha-rover', 'pixel-splash', 'cute-dinos', 'magnetic-blocks', 'rise-one-x-4x4', 'drift-king', 'baby-lingo'];
  var PRODUCT_PAGE_BY_SLUG = {
    'bubble-gun': '/bubble-gun#product-reviews',
    'stunt-pet': '/stunt-pet#product-reviews',
    'mini-cool-car': '/mini-cool-car#product-reviews',
    'gel-storm': '/gel-storm#product-reviews',
    'mecha-rover': '/mecha-rover#product-reviews',
    'pixel-splash': '/pixel-splash#product-reviews',
    'cute-dinos': '/cute-dinos#product-reviews',
    'magnetic-blocks': '/magnetic-blocks#product-reviews',
    'rise-one-x-4x4': '/rise-one-x-4x4#product-reviews',
    'drift-king': '/drift-king#product-reviews',
    'baby-lingo': '/baby-lingo#product-reviews'
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
      typeof window.RedpolyFirebase.listAllReviews === 'function' &&
      typeof window.RedpolyFirebase.listAllWishlists === 'function' &&
      typeof window.RedpolyFirebase.listAllProducts === 'function' &&
      typeof window.RedpolyFirebase.listAllCustomers === 'function' &&
      typeof window.RedpolyFirebase.listAllCategories === 'function'
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
        typeof window.RedpolyFirebase.listAllReviews === 'function' &&
        typeof window.RedpolyFirebase.listAllWishlists === 'function' &&
        typeof window.RedpolyFirebase.listAllProducts === 'function' &&
        typeof window.RedpolyFirebase.listAllCustomers === 'function' &&
        typeof window.RedpolyFirebase.listAllCategories === 'function'
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

      function normalizeCostPriceFallback(raw) {
        if (raw === null || raw === undefined || raw === '') return null;
        var num = Number(raw);
        if (!Number.isFinite(num) || num < 0 || num > 500000) return null;
        return Math.round(num * 100) / 100;
      }
      var DEFAULT_COST_PRICES = { 'drift-king': 485, 'baby-lingo': 500 };
      var DEFAULT_PRICE_COMPARISONS = { 'drift-king': [{ platform: 'Amazon', price: 859 }], 'baby-lingo': [{ platform: 'Amazon', price: 899 }] };
      var fallbackCostCache = { 'drift-king': 485, 'baby-lingo': 500 };

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
          var orderRef = fsMod.doc(db, 'users', uid, 'orders', orderId);
          try {
            var itemsSnap = await fsMod.getDocs(fsMod.collection(orderRef, 'items'));
            var orderItems = [];
            itemsSnap.forEach(function (docSnap) {
              var d = docSnap.data();
              if (typeof d.name === 'string' && NAME_TO_SKU[d.name]) {
                orderItems.push({ slug: NAME_TO_SKU[d.name], name: d.name, quantity: clampQty(d.quantity) });
              }
            });
            await fsMod.runTransaction(db, async function (tx) {
              var snap = await tx.get(orderRef);
              if (!snap.exists()) throw new Error('Order does not exist.');
              var prevStatus = normalizeOrderStatus(snap.data().status);
              var wasCancelled = prevStatus === 'cancelled';
              var willBeCancelled = status === 'cancelled';
              var productOps = [];
              if (!wasCancelled && willBeCancelled) {
                for (var i = 0; i < orderItems.length; i += 1) {
                  var pRef = fsMod.doc(db, 'products', orderItems[i].slug);
                  var pSnap = await tx.get(pRef);
                  if (pSnap.exists()) {
                    var cur = Math.max(0, Math.floor(Number(pSnap.data().stock != null ? pSnap.data().stock : 0)));
                    productOps.push({ ref: pRef, nextStock: cur + orderItems[i].quantity });
                  }
                }
              } else if (wasCancelled && !willBeCancelled) {
                for (var j = 0; j < orderItems.length; j += 1) {
                  var pRef2 = fsMod.doc(db, 'products', orderItems[j].slug);
                  var pSnap2 = await tx.get(pRef2);
                  if (pSnap2.exists()) {
                    var cur2 = Math.max(0, Math.floor(Number(pSnap2.data().stock != null ? pSnap2.data().stock : 0)));
                    if (cur2 < orderItems[j].quantity) {
                      throw new Error('Cannot restore order: only ' + cur2 + ' left in stock for ' + orderItems[j].name + '.');
                    }
                    productOps.push({ ref: pRef2, nextStock: cur2 - orderItems[j].quantity });
                  }
                }
              }
              var payload = { status: status };
              if (isDeliveredStatus(status)) payload.deliveredAt = fsMod.serverTimestamp();
              tx.update(orderRef, payload);
              productOps.forEach(function (op) {
                tx.update(op.ref, { stock: op.nextStock, updatedAt: fsMod.serverTimestamp() });
              });
            });
          } catch (error) {
            if (error instanceof Error && error.message && error.message.charAt(0) !== '{') throw error;
            handleFirestoreError(error, 'update', orderPath);
          }
        },
        updateOrderDetails: async function (uid, orderId, patch) {
          if (!isAdminUser()) throw new Error('Admin access required to edit order details.');
          if (!LIMITS.ID_PATTERN.test(uid) || !LIMITS.ID_PATTERN.test(orderId)) throw new Error('Invalid order identifier.');
          var orderPath = 'users/' + uid + '/orders/' + orderId;
          var orderRef = fsMod.doc(db, 'users', uid, 'orders', orderId);
          try {
            var existingItemsSnap = await fsMod.getDocs(fsMod.collection(orderRef, 'items'));
            var existingItemsMap = new Map();
            existingItemsSnap.forEach(function (docSnap) {
              var d = docSnap.data();
              if (typeof d.name === 'string') existingItemsMap.set(docSnap.id, { name: d.name, price: Number(d.price), quantity: clampQty(d.quantity) });
            });

            var result = await fsMod.runTransaction(db, async function (tx) {
              var existingSnap = await tx.get(orderRef);
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

              var resolvedItems = patch.items !== undefined
                ? patch.items.filter(function (i) { return Boolean(CATALOGUE[i.name]); }).map(function (i) { return { name: i.name, price: Number(i.price) || CATALOGUE[i.name].price, quantity: clampQty(i.quantity) }; })
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
              var prevStatus = normalizeOrderStatus(existingData.status);
              var wasCancelled = prevStatus === 'cancelled';
              var willBeCancelled = nextStatus === 'cancelled';

              var allSlugs = new Set();
              existingItemsMap.forEach(function (_v, slug) { allSlugs.add(slug); });
              mergedBySlug.forEach(function (_v, slug) { allSlugs.add(slug); });

              var stockPlans = [];
              var slugArr = Array.from(allSlugs);
              for (var sIdx = 0; sIdx < slugArr.length; sIdx += 1) {
                var sSlug = slugArr[sIdx];
                if (!SKU_TO_NAME[sSlug]) continue;
                var prevQty = wasCancelled ? 0 : (existingItemsMap.get(sSlug) ? existingItemsMap.get(sSlug).quantity : 0);
                var nextQty = willBeCancelled ? 0 : (mergedBySlug.get(sSlug) ? mergedBySlug.get(sSlug).quantity : 0);
                var delta = nextQty - prevQty;
                if (delta !== 0) {
                  var pRef = fsMod.doc(db, 'products', sSlug);
                  var pSnap = await tx.get(pRef);
                  if (pSnap.exists()) {
                    var curStock = Math.max(0, Math.floor(Number(pSnap.data().stock != null ? pSnap.data().stock : 0)));
                    var updatedStock = curStock - delta;
                    if (updatedStock < 0) {
                      throw new Error('Only ' + curStock + ' left in stock for ' + SKU_TO_NAME[sSlug] + '.');
                    }
                    stockPlans.push({ ref: pRef, nextStock: updatedStock });
                  }
                }
              }

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
              if (isDeliveredStatus(nextStatus) && (!isDeliveredStatus(prevStatus) || !alreadyDeliveredAtMs)) {
                orderUpdate.deliveredAt = fsMod.serverTimestamp();
              }

              if (patch.items !== undefined) {
                existingItemsMap.forEach(function (_v, slug) {
                  if (!mergedBySlug.has(slug)) tx.delete(fsMod.doc(db, 'users', uid, 'orders', orderId, 'items', slug));
                });
                mergedBySlug.forEach(function (item, slug) {
                  tx.set(fsMod.doc(db, 'users', uid, 'orders', orderId, 'items', slug), {
                    uid: uid, orderId: orderId, name: item.name, price: item.price, quantity: item.quantity
                  });
                });
              }
              tx.update(orderRef, orderUpdate);
              stockPlans.forEach(function (sp) {
                tx.update(sp.ref, { stock: sp.nextStock, updatedAt: fsMod.serverTimestamp() });
              });

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
            });
            return result;
          } catch (error) {
            if (error instanceof Error && error.message && error.message.charAt(0) !== '{') throw error;
            handleFirestoreError(error, 'update', orderPath);
          }
        },
        getCatalog: function () {
          return SKU_ORDER.map(function (sku) {
            var name = SKU_TO_NAME[sku];
            var base = CATALOGUE[name];
            var compsDefault = DEFAULT_PRICE_COMPARISONS[sku] ? DEFAULT_PRICE_COMPARISONS[sku].map(function (c) { return { platform: c.platform, price: c.price }; }) : [];
            return {
              sku: sku, name: name, price: base.price, compareAtPrice: 0,
              costPrice: Object.prototype.hasOwnProperty.call(fallbackCostCache, sku) ? fallbackCostCache[sku] : null,
              stock: null, lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD, cardTag: DEFAULT_CARD_TAGS[sku] || '',
              priceComparisons: compsDefault, href: base.href, image: base.image, initialized: false, updatedAtMs: 0
            };
          });
        },
        getCatalogMap: function () {
          var map = {};
          this.getCatalog().forEach(function (r) { map[r.sku] = r; map[r.name] = r; });
          return map;
        },
        getProduct: function (skuOrName) {
          var key = String(skuOrName || '').trim();
          var slug = SKU_TO_NAME[key] ? key : (NAME_TO_SKU[key.toUpperCase()] || '');
          if (!slug) return null;
          var name = SKU_TO_NAME[slug];
          var base = CATALOGUE[name];
          var compsDefault = DEFAULT_PRICE_COMPARISONS[slug] ? DEFAULT_PRICE_COMPARISONS[slug].map(function (c) { return { platform: c.platform, price: c.price }; }) : [];
          return {
            sku: slug, name: name, price: base.price, compareAtPrice: 0,
            costPrice: Object.prototype.hasOwnProperty.call(fallbackCostCache, slug) ? fallbackCostCache[slug] : null,
            stock: null, lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD, cardTag: DEFAULT_CARD_TAGS[slug] || '',
            priceComparisons: compsDefault, href: base.href, image: base.image, initialized: false, updatedAtMs: 0
          };
        },
        listAllProducts: async function () {
          if (!isAdminUser()) throw new Error('Admin access required to manage store products.');
          try {
            var pair = await Promise.all([
              fsMod.getDocs(fsMod.collection(db, 'products')),
              fsMod.getDocs(fsMod.collection(db, 'productCosts')).catch(function () { return null; })
            ]);
            var snap = pair[0];
            var costsSnap = pair[1];
            if (costsSnap) {
              costsSnap.forEach(function (costDoc) {
                if (SKU_TO_NAME[costDoc.id]) {
                  var cVal = normalizeCostPriceFallback(costDoc.data().costPrice);
                  if (cVal !== null) fallbackCostCache[costDoc.id] = cVal;
                }
              });
            }
            var existingMap = new Map();
            snap.forEach(function (docSnap) {
              if (SKU_TO_NAME[docSnap.id]) existingMap.set(docSnap.id, docSnap.data());
            });
            var missing = SKU_ORDER.filter(function (s) { return !existingMap.has(s); });
            var missingCosts = costsSnap
              ? SKU_ORDER.filter(function (s) {
                return Object.prototype.hasOwnProperty.call(DEFAULT_COST_PRICES, s) &&
                  !costsSnap.docs.some(function (c) { return c.id === s; });
              })
              : [];
            if (missing.length || missingCosts.length) {
              var batch = fsMod.writeBatch(db);
              missing.forEach(function (s) {
                var n = SKU_TO_NAME[s];
                var compsSeed = DEFAULT_PRICE_COMPARISONS[s] ? DEFAULT_PRICE_COMPARISONS[s].map(function (c) { return { platform: c.platform, price: c.price }; }) : [];
                var seedPayload = {
                  sku: s, name: n, price: CATALOGUE[n].price, compareAtPrice: 0, stock: INITIAL_SEED_STOCK,
                  lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD, cardTag: DEFAULT_CARD_TAGS[s] || '',
                  category: DEFAULT_PRODUCT_CATEGORIES[s] || 'fun',
                  priceComparisons: compsSeed, updatedAt: fsMod.serverTimestamp()
                };
                batch.set(fsMod.doc(db, 'products', s), seedPayload);
                existingMap.set(s, seedPayload);
              });
              missingCosts.forEach(function (s) {
                var cVal = DEFAULT_COST_PRICES[s];
                batch.set(fsMod.doc(db, 'productCosts', s), {
                  sku: s, costPrice: cVal, updatedAt: fsMod.serverTimestamp()
                });
                fallbackCostCache[s] = cVal;
              });
              await batch.commit();
            }
            var records = SKU_ORDER.map(function (s) {
              var d = existingMap.get(s) || {};
              var n = SKU_TO_NAME[s];
              var base = CATALOGUE[n];
              var price = Math.max(1, Math.round(Number(d.price != null ? d.price : base.price)));
              CATALOGUE[n].price = price;
              var comps = Array.isArray(d.priceComparisons)
                ? d.priceComparisons.filter(function (c) { return c && c.platform && Number(c.price) > 0 && Number(c.price) <= 500000; }).slice(0, 5).map(function (c) {
                  return { platform: String(c.platform).trim().slice(0, 32), price: Math.round(Number(c.price)) };
                })
                : [];
              var ts = d.updatedAt;
              var catSlug = typeof d.category === 'string' && CATEGORY_SLUG_RE.test(d.category.trim())
                ? d.category.trim()
                : (DEFAULT_PRODUCT_CATEGORIES[s] || 'fun');
              return {
                sku: s, name: n, price: price,
                compareAtPrice: Math.max(0, Math.round(Number(d.compareAtPrice != null ? d.compareAtPrice : 0))),
                costPrice: Object.prototype.hasOwnProperty.call(fallbackCostCache, s) ? fallbackCostCache[s] : null,
                stock: Math.max(0, Math.floor(Number(d.stock != null ? d.stock : INITIAL_SEED_STOCK))),
                lowStockThreshold: Math.max(0, Math.floor(Number(d.lowStockThreshold != null ? d.lowStockThreshold : DEFAULT_LOW_STOCK_THRESHOLD))),
                cardTag: typeof d.cardTag === 'string' ? d.cardTag.trim().slice(0, 32) : (DEFAULT_CARD_TAGS[s] || ''),
                category: catSlug,
                priceComparisons: comps, href: base.href, image: base.image, initialized: true,
                updatedAtMs: ts && typeof ts.toMillis === 'function' ? ts.toMillis() : Date.now()
              };
            });
            return records;
          } catch (error) {
            handleFirestoreError(error, 'list', 'products');
          }
        },
        updateProduct: async function (sku, patch) {
          if (!isAdminUser()) throw new Error('Admin access required to update products.');
          if (!SKU_TO_NAME[sku]) throw new Error('Unknown product SKU.');
          var path = 'products/' + sku;
          var ref = fsMod.doc(db, 'products', sku);
          var costRef = fsMod.doc(db, 'productCosts', sku);
          var n = SKU_TO_NAME[sku];
          var base = CATALOGUE[n];
          var nextCostPrice = Object.prototype.hasOwnProperty.call(fallbackCostCache, sku) ? fallbackCostCache[sku] : null;
          var shouldSaveCost = patch.costPrice !== undefined && patch.costPrice !== null;
          if (shouldSaveCost) {
            var parsedCost = Number(patch.costPrice);
            if (!Number.isFinite(parsedCost) || parsedCost < 0 || parsedCost > 500000) {
              throw new Error('Cost price must be between ₹0 and ₹5,00,000.');
            }
            nextCostPrice = Math.round(parsedCost * 100) / 100;
          }
          try {
            var updated = await fsMod.runTransaction(db, async function (tx) {
              var snap = await tx.get(ref);
              var costSnap = shouldSaveCost ? null : await tx.get(costRef).catch(function () { return null; });
              if (!shouldSaveCost && costSnap && costSnap.exists()) {
                nextCostPrice = normalizeCostPriceFallback(costSnap.data().costPrice);
              }
              var prev = snap.exists() ? snap.data() : {
                sku: sku, name: n, price: base.price, compareAtPrice: 0, stock: INITIAL_SEED_STOCK,
                lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD, cardTag: DEFAULT_CARD_TAGS[sku] || '', priceComparisons: []
              };
              var nextPrice = patch.price !== undefined ? Math.round(Number(patch.price)) : Math.round(Number(prev.price || base.price));
              if (!Number.isFinite(nextPrice) || nextPrice < 1 || nextPrice > 500000) throw new Error('Enter a valid price between ₹1 and ₹5,00,000.');
              var nextCompareAt = patch.compareAtPrice !== undefined ? Math.round(Number(patch.compareAtPrice)) : Math.round(Number(prev.compareAtPrice || 0));
              if (!Number.isFinite(nextCompareAt) || nextCompareAt < 0 || nextCompareAt > 500000) throw new Error('Compare-at MRP must be between ₹0 and ₹5,00,000.');
              var nextStock = patch.stock !== undefined ? Math.floor(Number(patch.stock)) : Math.floor(Number(prev.stock != null ? prev.stock : INITIAL_SEED_STOCK));
              if (!Number.isFinite(nextStock) || nextStock < 0 || nextStock > 100000) throw new Error('Stock must be between 0 and 1,00,000.');
              var nextThreshold = patch.lowStockThreshold !== undefined ? Math.floor(Number(patch.lowStockThreshold)) : Math.floor(Number(prev.lowStockThreshold != null ? prev.lowStockThreshold : DEFAULT_LOW_STOCK_THRESHOLD));
              if (!Number.isFinite(nextThreshold) || nextThreshold < 0 || nextThreshold > 10000) throw new Error('Low-stock threshold must be between 0 and 10,000.');
              var nextTag = patch.cardTag !== undefined ? String(patch.cardTag || '').trim().slice(0, 32) : String(prev.cardTag || '').trim().slice(0, 32);
              var prevCat = typeof prev.category === 'string' && CATEGORY_SLUG_RE.test(prev.category.trim()) ? prev.category.trim() : (DEFAULT_PRODUCT_CATEGORIES[sku] || 'fun');
              var nextCat = patch.category !== undefined ? String(patch.category || '').trim().toLowerCase() : prevCat;
              if (!CATEGORY_SLUG_RE.test(nextCat) || nextCat.length > 40) throw new Error('Select a valid category.');
              var rawComps = patch.priceComparisons !== undefined ? patch.priceComparisons : (Array.isArray(prev.priceComparisons) ? prev.priceComparisons : []);
              var nextComps = (rawComps || []).filter(function (c) { return c && c.platform && Number(c.price) > 0 && Number(c.price) <= 500000; }).slice(0, 5).map(function (c) {
                return { platform: String(c.platform).trim().slice(0, 32), price: Math.round(Number(c.price)) };
              });
              tx.set(ref, {
                sku: sku, name: n, price: nextPrice, compareAtPrice: nextCompareAt,
                stock: nextStock, lowStockThreshold: nextThreshold, cardTag: nextTag,
                category: nextCat, priceComparisons: nextComps, updatedAt: fsMod.serverTimestamp()
              });
              if (shouldSaveCost && nextCostPrice !== null) {
                tx.set(costRef, {
                  sku: sku,
                  costPrice: nextCostPrice,
                  updatedAt: fsMod.serverTimestamp()
                });
              }
              if (nextCostPrice !== null) fallbackCostCache[sku] = nextCostPrice;
              CATALOGUE[n].price = nextPrice;
              return {
                sku: sku, name: n, price: nextPrice, compareAtPrice: nextCompareAt, costPrice: nextCostPrice,
                stock: nextStock, lowStockThreshold: nextThreshold, cardTag: nextTag,
                category: nextCat, priceComparisons: nextComps, href: base.href, image: base.image,
                initialized: true, updatedAtMs: Date.now()
              };
            });
            return updated;
          } catch (error) {
            if (error instanceof Error && error.message && error.message.charAt(0) !== '{') throw error;
            handleFirestoreError(error, 'update', path);
          }
        },
        adjustProductStock: async function (sku, delta) {
          if (!isAdminUser()) throw new Error('Admin access required to update inventory.');
          if (!SKU_TO_NAME[sku]) throw new Error('Unknown product SKU.');
          var dInt = Math.trunc(Number(delta));
          if (!Number.isFinite(dInt)) throw new Error('Invalid stock adjustment.');
          var ref = fsMod.doc(db, 'products', sku);
          var n = SKU_TO_NAME[sku];
          var base = CATALOGUE[n];
          var prevCost = Object.prototype.hasOwnProperty.call(fallbackCostCache, sku) ? fallbackCostCache[sku] : null;
          try {
            var updated = await fsMod.runTransaction(db, async function (tx) {
              var snap = await tx.get(ref);
              var prev = snap.exists() ? snap.data() : {
                sku: sku, name: n, price: base.price, compareAtPrice: 0, stock: INITIAL_SEED_STOCK,
                lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD, cardTag: DEFAULT_CARD_TAGS[sku] || '',
                category: DEFAULT_PRODUCT_CATEGORIES[sku] || 'fun', priceComparisons: []
              };
              var curStock = Math.max(0, Math.floor(Number(prev.stock != null ? prev.stock : INITIAL_SEED_STOCK)));
              var nextStock = Math.max(0, Math.min(100000, curStock + dInt));
              var cleanComps = (Array.isArray(prev.priceComparisons) ? prev.priceComparisons : [])
                .filter(function (c) { return c && c.platform && Number(c.price) > 0 && Number(c.price) <= 500000; })
                .slice(0, 5)
                .map(function (c) {
                  return { platform: String(c.platform).trim().slice(0, 32), price: Math.round(Number(c.price)) };
                });
              var cleanTag = typeof prev.cardTag === 'string' ? prev.cardTag.trim().slice(0, 32) : (DEFAULT_CARD_TAGS[sku] || '');
              var cleanCat = typeof prev.category === 'string' && CATEGORY_SLUG_RE.test(prev.category.trim())
                ? prev.category.trim()
                : (DEFAULT_PRODUCT_CATEGORIES[sku] || 'fun');
              tx.set(ref, {
                sku: sku, name: n, price: Math.round(Number(prev.price || base.price)),
                compareAtPrice: Math.round(Number(prev.compareAtPrice || 0)),
                stock: nextStock,
                lowStockThreshold: Math.floor(Number(prev.lowStockThreshold != null ? prev.lowStockThreshold : DEFAULT_LOW_STOCK_THRESHOLD)),
                cardTag: cleanTag,
                category: cleanCat,
                priceComparisons: cleanComps,
                updatedAt: fsMod.serverTimestamp()
              });
              return {
                sku: sku, name: n, price: Math.round(Number(prev.price || base.price)),
                compareAtPrice: Math.round(Number(prev.compareAtPrice || 0)),
                costPrice: prevCost,
                stock: nextStock,
                lowStockThreshold: Math.floor(Number(prev.lowStockThreshold != null ? prev.lowStockThreshold : DEFAULT_LOW_STOCK_THRESHOLD)),
                cardTag: cleanTag,
                category: cleanCat,
                priceComparisons: cleanComps,
                href: base.href, image: base.image, initialized: true, updatedAtMs: Date.now()
              };
            });
            return updated;
          } catch (error) {
            if (error instanceof Error && error.message && error.message.charAt(0) !== '{') throw error;
            handleFirestoreError(error, 'update', 'products/' + sku);
          }
        },
        listAllCategories: async function () {
          if (!isAdminUser()) throw new Error('Admin access required to manage categories.');
          try {
            var snap = await fsMod.getDocs(fsMod.collection(db, 'categories'));
            if (snap.empty) {
              var batch = fsMod.writeBatch(db);
              DEFAULT_CATEGORIES.forEach(function (c) {
                batch.set(fsMod.doc(db, 'categories', c.slug), {
                  slug: c.slug, name: c.name, shortDesc: c.shortDesc, shelfDesc: c.shelfDesc,
                  accentColor: c.accentColor, sortOrder: c.sortOrder, visible: c.visible,
                  thumbnailUrl: c.thumbnailUrl, updatedAt: fsMod.serverTimestamp()
                });
              });
              await batch.commit();
              return DEFAULT_CATEGORIES.map(function (c) { return Object.assign({}, c, { updatedAtMs: Date.now() }); });
            }
            var list = [];
            snap.forEach(function (docSnap) {
              var d = docSnap.data();
              var slug = docSnap.id;
              if (!CATEGORY_SLUG_RE.test(slug)) return;
              var ts = d.updatedAt;
              list.push({
                slug: slug,
                name: String(d.name || slug).trim().slice(0, 60),
                shortDesc: String(d.shortDesc || '').trim().slice(0, 140),
                shelfDesc: String(d.shelfDesc || '').trim().slice(0, 220),
                accentColor: typeof d.accentColor === 'string' && CATEGORY_HEX_RE.test(d.accentColor.trim()) ? d.accentColor.trim() : '#171512',
                sortOrder: Math.max(0, Math.min(999, Math.floor(Number(d.sortOrder != null ? d.sortOrder : 0)))),
                visible: d.visible !== false,
                thumbnailUrl: typeof d.thumbnailUrl === 'string' ? d.thumbnailUrl.trim().slice(0, 300) : '',
                updatedAtMs: ts && typeof ts.toMillis === 'function' ? ts.toMillis() : 0
              });
            });
            list.sort(function (a, b) { return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name); });
            return list;
          } catch (error) {
            handleFirestoreError(error, 'list', 'categories');
          }
        },
        saveCategory: async function (input) {
          if (!isAdminUser()) throw new Error('Admin access required to save categories.');
          var slug = String(input && input.slug || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
          if (!slug || !CATEGORY_SLUG_RE.test(slug)) throw new Error('Enter a valid category slug.');
          var name = String(input && input.name || '').trim().slice(0, 60);
          if (!name) throw new Error('Category name is required.');
          var shortDesc = String(input && input.shortDesc || '').trim().slice(0, 140);
          var shelfDesc = String(input && input.shelfDesc || '').trim().slice(0, 220);
          var accentColor = String(input && input.accentColor || '#171512').trim();
          if (!CATEGORY_HEX_RE.test(accentColor)) throw new Error('Enter a valid 6-digit hex color.');
          var sortOrder = Math.max(0, Math.min(999, Math.floor(Number(input && input.sortOrder != null ? input.sortOrder : 0))));
          var visible = input && input.visible !== false;
          var thumbnailUrl = String(input && input.thumbnailUrl || '').trim().slice(0, 300);
          if (thumbnailUrl && !(/^(\/|https?:\/\/)/.test(thumbnailUrl))) throw new Error('Thumbnail URL must start with / or https://');
          try {
            await fsMod.setDoc(fsMod.doc(db, 'categories', slug), {
              slug: slug, name: name, shortDesc: shortDesc, shelfDesc: shelfDesc,
              accentColor: accentColor, sortOrder: sortOrder, visible: visible,
              thumbnailUrl: thumbnailUrl, updatedAt: fsMod.serverTimestamp()
            });
            return { slug: slug, name: name, shortDesc: shortDesc, shelfDesc: shelfDesc, accentColor: accentColor, sortOrder: sortOrder, visible: visible, thumbnailUrl: thumbnailUrl, updatedAtMs: Date.now() };
          } catch (error) {
            handleFirestoreError(error, 'write', 'categories/' + slug);
          }
        },
        deleteCategory: async function (slug, reassignToSlug) {
          if (!isAdminUser()) throw new Error('Admin access required to delete categories.');
          if (!CATEGORY_SLUG_RE.test(slug)) throw new Error('Invalid category slug.');
          if (reassignToSlug && (!CATEGORY_SLUG_RE.test(reassignToSlug) || reassignToSlug === slug)) {
            throw new Error('Choose another category to reassign products to.');
          }
          try {
            var prods = await api.listAllProducts();
            var toMove = prods.filter(function (p) { return p.category === slug; }).map(function (p) { return p.sku; });
            if (toMove.length) {
              if (!reassignToSlug) throw new Error('Choose a destination category for assigned products before deleting.');
              await api.assignProductsCategory(toMove, reassignToSlug);
            }
            await fsMod.deleteDoc(fsMod.doc(db, 'categories', slug));
          } catch (error) {
            if (error instanceof Error && error.message && error.message.charAt(0) !== '{') throw error;
            handleFirestoreError(error, 'delete', 'categories/' + slug);
          }
        },
        reorderCategories: async function (orderedSlugs) {
          if (!isAdminUser()) throw new Error('Admin access required to reorder categories.');
          var batch = fsMod.writeBatch(db);
          orderedSlugs.forEach(function (slug, idx) {
            if (!CATEGORY_SLUG_RE.test(slug)) return;
            batch.update(fsMod.doc(db, 'categories', slug), { sortOrder: idx + 1, updatedAt: fsMod.serverTimestamp() });
          });
          await batch.commit();
        },
        assignProductsCategory: async function (skus, categorySlug) {
          if (!isAdminUser()) throw new Error('Admin access required to assign product categories.');
          if (!CATEGORY_SLUG_RE.test(categorySlug)) throw new Error('Select a valid category.');
          var updated = [];
          for (var i = 0; i < skus.length; i += 1) {
            if (!SKU_TO_NAME[skus[i]]) continue;
            var rec = await api.updateProduct(skus[i], { category: categorySlug });
            updated.push(rec);
          }
          return updated;
        },
        resetDefaultCategories: async function () {
          if (!isAdminUser()) throw new Error('Admin access required to restore default categories.');
          var batch = fsMod.writeBatch(db);
          DEFAULT_CATEGORIES.forEach(function (c) {
            batch.set(fsMod.doc(db, 'categories', c.slug), {
              slug: c.slug, name: c.name, shortDesc: c.shortDesc, shelfDesc: c.shelfDesc,
              accentColor: c.accentColor, sortOrder: c.sortOrder, visible: c.visible,
              thumbnailUrl: c.thumbnailUrl, updatedAt: fsMod.serverTimestamp()
            });
          });
          await batch.commit();
          return api.listAllCategories();
        },
        listAllCustomers: async function () {
          if (!isAdminUser()) throw new Error('Admin access required to view store customers.');
          try {
            var pair = await Promise.all([
              fsMod.getDocs(fsMod.collection(db, 'users')),
              fsMod.getDocs(fsMod.collection(db, 'crewSubscribers'))
            ]);
            var usersSnap = pair[0];
            var crewSnap = pair[1];
            var accounts = await Promise.all(usersSnap.docs.map(async function (userDoc) {
              var uData = userDoc.data();
              var uid = String(uData.uid || userDoc.id);
              var profileSnap = await fsMod.getDoc(fsMod.doc(db, 'users', uid, 'private', 'profile')).catch(function () { return null; });
              var pData = profileSnap && profileSnap.exists() ? profileSnap.data() : {};
              var createdTs = uData.createdAt;
              var updatedTs = pData.updatedAt || uData.updatedAt;
              var displayName = String(uData.displayName || pData.fullName || 'REDPOLY Member');
              return {
                uid: uid,
                displayName: displayName,
                fullName: String(pData.fullName || displayName),
                email: String(pData.email || ''),
                photoURL: sanitizePhoto(typeof uData.photoURL === 'string' ? uData.photoURL : ''),
                phone: String(pData.phone || ''),
                address: String(pData.address || ''),
                pinCode: String(pData.pinCode || ''),
                city: String(pData.city || ''),
                state: String(pData.state || ''),
                createdAtMs: createdTs && typeof createdTs.toMillis === 'function' ? createdTs.toMillis() : 0,
                updatedAtMs: updatedTs && typeof updatedTs.toMillis === 'function' ? updatedTs.toMillis() : 0
              };
            }));
            var crewSubscribers = [];
            crewSnap.forEach(function (docSnap) {
              var d = docSnap.data();
              var email = String(d.email || '').trim().toLowerCase();
              if (!email) return;
              var ts = d.createdAt;
              crewSubscribers.push({
                id: docSnap.id,
                email: email,
                source: String(d.source || 'homepage-crew'),
                uid: String(d.uid || ''),
                displayName: String(d.displayName || ''),
                createdAtMs: ts && typeof ts.toMillis === 'function' ? ts.toMillis() : 0
              });
            });
            accounts.sort(function (a, b) { return (b.createdAtMs || b.updatedAtMs) - (a.createdAtMs || a.updatedAtMs); });
            crewSubscribers.sort(function (a, b) { return b.createdAtMs - a.createdAtMs; });
            return { accounts: accounts, crewSubscribers: crewSubscribers };
          } catch (error) {
            handleFirestoreError(error, 'list', 'users');
          }
        },
        listAllWishlists: async function () {
          if (!isAdminUser()) throw new Error('Admin access required to view customer favorites.');
          try {
            var snap = await fsMod.getDocs(fsMod.collectionGroup(db, 'wishlist'));
            var rawItems = [];
            var uidSet = new Set();
            snap.forEach(function (docSnap) {
              var d = docSnap.data();
              var parentUid = docSnap.ref.parent && docSnap.ref.parent.parent ? docSnap.ref.parent.parent.id : '';
              var uid = String(d.uid || parentUid || '');
              var productName = typeof d.name === 'string' ? d.name : '';
              if (!uid || !productName) return;
              if (LIMITS.ID_PATTERN.test(uid)) uidSet.add(uid);
              var ts = d.createdAt;
              var createdAtMs = ts && typeof ts.toMillis === 'function' ? ts.toMillis() : 0;
              var catEntry = CATALOGUE[productName];
              rawItems.push({
                id: docSnap.id,
                uid: uid,
                productName: productName,
                href: typeof d.href === 'string' && d.href.charAt(0) === '/' ? d.href : (catEntry ? catEntry.href : '/'),
                image: typeof d.image === 'string' && d.image.charAt(0) === '/' ? d.image : (catEntry ? catEntry.image : ''),
                price: Number(d.price || (catEntry ? catEntry.price : 0)),
                createdAtMs: createdAtMs
              });
            });
            var userMap = new Map();
            await Promise.all(Array.from(uidSet).map(async function (uid) {
              var pair = await Promise.all([
                fsMod.getDoc(fsMod.doc(db, 'users', uid)).catch(function () { return null; }),
                fsMod.getDoc(fsMod.doc(db, 'users', uid, 'private', 'profile')).catch(function () { return null; })
              ]);
              var accountData = pair[0] && pair[0].exists() ? pair[0].data() : {};
              var profileData = pair[1] && pair[1].exists() ? pair[1].data() : {};
              userMap.set(uid, {
                name: String(profileData.fullName || accountData.displayName || 'REDPOLY Member'),
                email: String(profileData.email || ''),
                photoURL: sanitizePhoto(typeof accountData.photoURL === 'string' ? accountData.photoURL : '')
              });
            }));
            var results = rawItems.map(function (item) {
              var u = userMap.get(item.uid);
              return {
                id: item.id,
                uid: item.uid,
                userName: (u && u.name) || 'REDPOLY Member',
                userEmail: (u && u.email) || '',
                userPhotoURL: (u && u.photoURL) || '',
                productName: item.productName,
                href: item.href,
                image: item.image,
                price: item.price,
                createdAtMs: item.createdAtMs
              };
            });
            results.sort(function (a, b) { return b.createdAtMs - a.createdAtMs; });
            return results;
          } catch (error) {
            handleFirestoreError(error, 'list', 'wishlist');
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
  var navProductsLink = document.getElementById('nav-products');
  var navCategoriesLink = document.getElementById('nav-categories');
  var navCustomersLink = document.getElementById('nav-customers');
  var navReviewsLink = document.getElementById('nav-reviews');
  var navFavoritesLink = document.getElementById('nav-favorites');
  var sidebarOrdersCount = document.getElementById('sidebar-orders-count');
  var sidebarProductsCount = document.getElementById('sidebar-products-count');
  var sidebarCategoriesCount = document.getElementById('sidebar-categories-count');
  var sidebarCustomersCount = document.getElementById('sidebar-customers-count');
  var sidebarReviewsCount = document.getElementById('sidebar-reviews-count');
  var sidebarFavoritesCount = document.getElementById('sidebar-favorites-count');
  var pageTitleEl = document.getElementById('page-title');

  var pageActions = document.getElementById('page-actions');
  var refreshBtn = document.getElementById('refresh-orders-btn');
  var exportCsvBtn = document.getElementById('export-csv-btn');
  var authGate = document.getElementById('auth-gate');
  var dashboardContent = document.getElementById('dashboard-content');
  var ordersView = document.getElementById('orders-view');
  var productsView = document.getElementById('products-view');
  var categoriesView = document.getElementById('categories-view');
  var customersView = document.getElementById('customers-view');
  var reviewsView = document.getElementById('reviews-view');
  var favoritesView = document.getElementById('favorites-view');

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

  // Favorites View DOM
  var metricTotalFavorites = document.getElementById('metric-total-favorites');
  var metricFavoriteUsers = document.getElementById('metric-favorite-users');
  var metricFavoriteProducts = document.getElementById('metric-favorite-products');
  var metricTopFavorite = document.getElementById('metric-top-favorite');
  var favoritesErrorBanner = document.getElementById('favorites-error-banner');
  var favoritesErrorText = document.getElementById('favorites-error-text');
  var favoritesRetryBtn = document.getElementById('favorites-retry-btn');
  var favoritesProductTabs = document.getElementById('favorites-product-tabs');
  var favoritesSearchInput = document.getElementById('favorites-search');
  var favoritesSearchClear = document.getElementById('favorites-search-clear');
  var favoritesSortSelect = document.getElementById('favorites-sort');
  var favoritesSkeleton = document.getElementById('favorites-skeleton');
  var favoritesEmpty = document.getElementById('favorites-empty');
  var favoritesEmptyTitle = document.getElementById('favorites-empty-title');
  var favoritesEmptyCopy = document.getElementById('favorites-empty-copy');
  var favoritesTableWrap = document.getElementById('favorites-table-wrap');
  var favoritesTbody = document.getElementById('favorites-tbody');
  var favoritesFooter = document.getElementById('favorites-footer');
  var favoritesShowingText = document.getElementById('favorites-showing-text');

  // Products View DOM
  var metricTotalProducts = document.getElementById('metric-total-products');
  var metricTotalUnits = document.getElementById('metric-total-units');
  var metricLowStockProducts = document.getElementById('metric-low-stock-products');
  var metricOutStockProducts = document.getElementById('metric-out-stock-products');
  var productsErrorBanner = document.getElementById('products-error-banner');
  var productsErrorText = document.getElementById('products-error-text');
  var productsRetryBtn = document.getElementById('products-retry-btn');
  var productsFilterTabs = document.getElementById('products-filter-tabs');
  var prodTabAll = document.getElementById('prod-tab-all');
  var prodTabInStock = document.getElementById('prod-tab-in-stock');
  var prodTabLowStock = document.getElementById('prod-tab-low-stock');
  var prodTabOutStock = document.getElementById('prod-tab-out-stock');
  var prodTabTagged = document.getElementById('prod-tab-tagged');
  var productsSearchInput = document.getElementById('products-search');
  var productsSearchClear = document.getElementById('products-search-clear');
  var productsCategoryFilter = document.getElementById('products-category-filter');
  var productsSortSelect = document.getElementById('products-sort');
  var productsSkeleton = document.getElementById('products-skeleton');
  var productsEmpty = document.getElementById('products-empty');
  var productsEmptyTitle = document.getElementById('products-empty-title');
  var productsEmptyCopy = document.getElementById('products-empty-copy');
  var productsResetBtn = document.getElementById('products-reset-btn');
  var productsTableWrap = document.getElementById('products-table-wrap');
  var productsTbody = document.getElementById('products-tbody');
  var productsFooter = document.getElementById('products-footer');
  var productsShowingText = document.getElementById('products-showing-text');

  // Product Edit Drawer DOM
  var productDrawerLayer = document.getElementById('product-drawer-layer');
  var productDrawerBackdrop = document.getElementById('product-drawer-backdrop');
  var productDrawerEl = document.getElementById('product-drawer');
  var productDrawerCloseBtn = document.getElementById('product-drawer-close');
  var productDrawerCancelBtn = document.getElementById('product-drawer-cancel');
  var productDrawerSaveBtn = document.getElementById('product-drawer-save');
  var productDrawerTitle = document.getElementById('product-drawer-title');
  var productDrawerStockBadge = document.getElementById('product-drawer-stock-badge');
  var productDrawerSku = document.getElementById('product-drawer-sku');
  var productDrawerStoreLink = document.getElementById('product-drawer-store-link');
  var productEditForm = document.getElementById('product-edit-form');
  var prodEditPrice = document.getElementById('prod-edit-price');
  var prodEditCompareAt = document.getElementById('prod-edit-compare-at');
  var prodEditCostPrice = document.getElementById('prod-edit-cost-price');
  var prodEditMarginPreview = document.getElementById('prod-edit-margin-preview');
  var prodEditStock = document.getElementById('prod-edit-stock');
  var prodEditThreshold = document.getElementById('prod-edit-threshold');
  var prodDrawerStockChips = document.getElementById('prod-drawer-stock-chips');
  var prodEditCategory = document.getElementById('prod-edit-category');
  var prodEditCategoryNote = document.getElementById('prod-edit-category-note');
  var prodEditCardTag = document.getElementById('prod-edit-card-tag');
  var prodTagPresets = document.getElementById('prod-tag-presets');
  var prodAddCompBtn = document.getElementById('prod-add-comp-btn');
  var prodComparisonsList = document.getElementById('prod-comparisons-list');
  var prodEditError = document.getElementById('prod-edit-error');

  // Categories View & Drawer DOM
  var metricTotalCategories = document.getElementById('metric-total-categories');
  var metricVisibleCategories = document.getElementById('metric-visible-categories');
  var metricHiddenCategories = document.getElementById('metric-hidden-categories');
  var metricCategorizedToys = document.getElementById('metric-categorized-toys');
  var categoriesErrorBanner = document.getElementById('categories-error-banner');
  var categoriesErrorText = document.getElementById('categories-error-text');
  var categoriesRetryBtn = document.getElementById('categories-retry-btn');
  var categoriesFilterTabs = document.getElementById('categories-filter-tabs');
  var catTabAll = document.getElementById('cat-tab-all');
  var catTabVisible = document.getElementById('cat-tab-visible');
  var catTabHidden = document.getElementById('cat-tab-hidden');
  var categoriesSearchInput = document.getElementById('categories-search');
  var categoriesSearchClear = document.getElementById('categories-search-clear');
  var categoriesResetDefaultsBtn = document.getElementById('categories-reset-defaults-btn');
  var categoriesNewBtn = document.getElementById('categories-new-btn');
  var categoriesSkeleton = document.getElementById('categories-skeleton');
  var categoriesEmpty = document.getElementById('categories-empty');
  var categoriesEmptyTitle = document.getElementById('categories-empty-title');
  var categoriesEmptyCopy = document.getElementById('categories-empty-copy');
  var categoriesClearFilterBtn = document.getElementById('categories-clear-filter-btn');
  var categoriesTableWrap = document.getElementById('categories-table-wrap');
  var categoriesTbody = document.getElementById('categories-tbody');
  var categoriesFooter = document.getElementById('categories-footer');
  var categoriesShowingText = document.getElementById('categories-showing-text');

  var categoryDrawerLayer = document.getElementById('category-drawer-layer');
  var categoryDrawerBackdrop = document.getElementById('category-drawer-backdrop');
  var categoryDrawerEl = document.getElementById('category-drawer');
  var categoryDrawerCloseBtn = document.getElementById('category-drawer-close');
  var categoryDrawerCancelBtn = document.getElementById('category-drawer-cancel');
  var categoryDrawerSaveBtn = document.getElementById('category-drawer-save');
  var categoryDrawerTitle = document.getElementById('category-drawer-title');
  var categoryDrawerVisBadge = document.getElementById('category-drawer-vis-badge');
  var categoryDrawerSlugSub = document.getElementById('category-drawer-slug-sub');
  var categoryEditForm = document.getElementById('category-edit-form');
  var catEditName = document.getElementById('cat-edit-name');
  var catEditSlug = document.getElementById('cat-edit-slug');
  var catSlugHelp = document.getElementById('cat-slug-help');
  var catEditColorPicker = document.getElementById('cat-edit-color-picker');
  var catEditColor = document.getElementById('cat-edit-color');
  var catColorSwatches = document.getElementById('cat-color-swatches');
  var catEditShortDesc = document.getElementById('cat-edit-short-desc');
  var catEditShelfDesc = document.getElementById('cat-edit-shelf-desc');
  var catEditOrder = document.getElementById('cat-edit-order');
  var catEditVisible = document.getElementById('cat-edit-visible');
  var catEditThumb = document.getElementById('cat-edit-thumb');
  var catEditAssignedCount = document.getElementById('cat-edit-assigned-count');
  var catEditProductsList = document.getElementById('cat-edit-products-list');
  var catDangerSection = document.getElementById('cat-danger-section');
  var catDeleteReassign = document.getElementById('cat-delete-reassign');
  var catDeleteBtn = document.getElementById('cat-delete-btn');
  var catEditError = document.getElementById('cat-edit-error');

  // Customers View DOM
  var metricTotalCustomers = document.getElementById('metric-total-customers');
  var metricSignedinCustomers = document.getElementById('metric-signedin-customers');
  var metricCrewCustomers = document.getElementById('metric-crew-customers');
  var metricPayingCustomers = document.getElementById('metric-paying-customers');
  var customersErrorBanner = document.getElementById('customers-error-banner');
  var customersErrorText = document.getElementById('customers-error-text');
  var customersRetryBtn = document.getElementById('customers-retry-btn');
  var customersFilterTabs = document.getElementById('customers-filter-tabs');
  var custTabAll = document.getElementById('cust-tab-all');
  var custTabSignedin = document.getElementById('cust-tab-signedin');
  var custTabCrew = document.getElementById('cust-tab-crew');
  var custTabOrders = document.getElementById('cust-tab-orders');
  var customersSearchInput = document.getElementById('customers-search');
  var customersSearchClear = document.getElementById('customers-search-clear');
  var customersSortSelect = document.getElementById('customers-sort');
  var customersSkeleton = document.getElementById('customers-skeleton');
  var customersEmpty = document.getElementById('customers-empty');
  var customersEmptyTitle = document.getElementById('customers-empty-title');
  var customersEmptyCopy = document.getElementById('customers-empty-copy');
  var customersResetBtn = document.getElementById('customers-reset-btn');
  var customersTableWrap = document.getElementById('customers-table-wrap');
  var customersTbody = document.getElementById('customers-tbody');
  var customersFooter = document.getElementById('customers-footer');
  var customersShowingText = document.getElementById('customers-showing-text');

  var toastEl = document.getElementById('dash-toast');

  // State
  var activeView = window.location.hash === '#products'
    ? 'products'
    : (window.location.hash === '#categories'
      ? 'categories'
      : (window.location.hash === '#customers'
        ? 'customers'
        : (window.location.hash === '#reviews' ? 'reviews' : (window.location.hash === '#favorites' ? 'favorites' : 'orders'))));
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

  var allFavorites = [];
  var favoriteProductFilter = 'all';
  var favoriteSearchQuery = '';
  var favoriteSortMode = 'newest';
  var favoritesLoading = false;

  var rawCustomersData = { accounts: [], crewSubscribers: [] };
  var customerFilter = 'all';
  var customerSearchQuery = '';
  var customerSortMode = 'newest';
  var customersLoading = false;
  var customersLoadedOnce = false;

  var allProducts = [];
  var productFilter = 'all';
  var productCategoryFilter = 'all';
  var productSearchQuery = '';
  var productSortMode = 'catalog';
  var productsLoading = false;
  var selectedProductSku = null;
  var lastFocusedProductTrigger = null;
  var draftComparisons = [];
  var expandedProductGroups = {
    'magnetic-blocks': true,
    'cute-dinos': true
  };

  var allCategories = DEFAULT_CATEGORIES.map(function (c) { return Object.assign({}, c); });
  var categoryFilter = 'all';
  var categorySearchQuery = '';
  var categoriesLoading = false;
  var categoriesLoadedOnce = false;
  var editingCategorySlug = null;
  var isCreatingCategory = false;
  var categorySlugManuallyEdited = false;
  var pendingDeleteCategorySlug = null;
  var pendingRestoreDefaultsConfirm = false;
  var lastFocusedCategoryTrigger = null;

  function money(val) {
    var n = Number(val || 0);
    if (!Number.isFinite(n)) return '₹0';
    var hasFraction = Math.abs(n - Math.round(n)) >= 0.005;
    return '₹' + n.toLocaleString('en-IN', hasFraction ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { maximumFractionDigits: 0 });
  }

  function formatDateShort(ms) {
    if (!ms) return '-';
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
    activeView = nextView === 'products'
      ? 'products'
      : (nextView === 'categories'
        ? 'categories'
        : (nextView === 'customers'
          ? 'customers'
          : (nextView === 'reviews' ? 'reviews' : (nextView === 'favorites' ? 'favorites' : 'orders'))));
    var isOrders = activeView === 'orders';
    var isProducts = activeView === 'products';
    var isCategories = activeView === 'categories';
    var isCustomers = activeView === 'customers';
    var isReviews = activeView === 'reviews';
    var isFavorites = activeView === 'favorites';

    if (ordersView) ordersView.hidden = !isOrders;
    if (productsView) productsView.hidden = !isProducts;
    if (categoriesView) categoriesView.hidden = !isCategories;
    if (customersView) customersView.hidden = !isCustomers;
    if (reviewsView) reviewsView.hidden = !isReviews;
    if (favoritesView) favoritesView.hidden = !isFavorites;
    if (pageTitleEl) {
      pageTitleEl.textContent = isOrders
        ? 'Orders'
        : (isProducts
          ? 'Products'
          : (isCategories ? 'Categories' : (isCustomers ? 'Customers' : (isReviews ? 'Reviews' : 'Favorites'))));
    }
    if (exportCsvBtn) exportCsvBtn.hidden = isReviews;

    if (navOrdersLink) {
      navOrdersLink.classList.toggle('is-active', isOrders);
      if (isOrders) navOrdersLink.setAttribute('aria-current', 'page');
      else navOrdersLink.removeAttribute('aria-current');
    }
    if (navProductsLink) {
      navProductsLink.classList.toggle('is-active', isProducts);
      if (isProducts) navProductsLink.setAttribute('aria-current', 'page');
      else navProductsLink.removeAttribute('aria-current');
    }
    if (navCategoriesLink) {
      navCategoriesLink.classList.toggle('is-active', isCategories);
      if (isCategories) navCategoriesLink.setAttribute('aria-current', 'page');
      else navCategoriesLink.removeAttribute('aria-current');
    }
    if (navCustomersLink) {
      navCustomersLink.classList.toggle('is-active', isCustomers);
      if (isCustomers) navCustomersLink.setAttribute('aria-current', 'page');
      else navCustomersLink.removeAttribute('aria-current');
    }
    if (navReviewsLink) {
      navReviewsLink.classList.toggle('is-active', isReviews);
      if (isReviews) navReviewsLink.setAttribute('aria-current', 'page');
      else navReviewsLink.removeAttribute('aria-current');
    }
    if (navFavoritesLink) {
      navFavoritesLink.classList.toggle('is-active', isFavorites);
      if (isFavorites) navFavoritesLink.setAttribute('aria-current', 'page');
      else navFavoritesLink.removeAttribute('aria-current');
    }

    if (window.location.hash !== '#' + activeView) {
      try {
        history.replaceState(null, '', '#' + activeView);
      } catch (_ignoreHash) {}
    }

    setSidebarOpen(false);
    if (isProducts && !allProducts.length && !productsLoading) {
      loadAllProducts(true);
    } else if (isCategories && !categoriesLoadedOnce && !categoriesLoading) {
      loadAllCategories(true);
    } else if (isCustomers && !customersLoadedOnce && !customersLoading) {
      loadAllCustomers(true);
    } else if (isReviews && !allReviews.length && !reviewsLoading) {
      loadAllReviews(true);
    } else if (isFavorites && !allFavorites.length && !favoritesLoading) {
      loadAllWishlists(true);
    }
  }

  if (navOrdersLink) {
    navOrdersLink.addEventListener('click', function (e) {
      e.preventDefault();
      switchView('orders');
    });
  }
  if (navProductsLink) {
    navProductsLink.addEventListener('click', function (e) {
      e.preventDefault();
      switchView('products');
    });
  }
  if (navCategoriesLink) {
    navCategoriesLink.addEventListener('click', function (e) {
      e.preventDefault();
      switchView('categories');
    });
  }
  if (navCustomersLink) {
    navCustomersLink.addEventListener('click', function (e) {
      e.preventDefault();
      switchView('customers');
    });
  }
  if (navReviewsLink) {
    navReviewsLink.addEventListener('click', function (e) {
      e.preventDefault();
      switchView('reviews');
    });
  }
  if (navFavoritesLink) {
    navFavoritesLink.addEventListener('click', function (e) {
      e.preventDefault();
      switchView('favorites');
    });
  }
  window.addEventListener('hashchange', function () {
    var h = window.location.hash.replace(/^#/, '');
    if (h === 'products' || h === 'categories' || h === 'customers' || h === 'reviews' || h === 'favorites' || h === 'orders') {
      switchView(h);
    }
  });

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
      tdDest.textContent = [order.city, order.pin].filter(Boolean).join(', ') || '-';

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
        : '-';
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
    if (!editAddProductSelect) return;
    var prevVal = editAddProductSelect.value;
    editAddProductSelect.textContent = '';
    var fb = window.RedpolyFirebase;
    var map = (fb && typeof fb.getCatalogMap === 'function') ? fb.getCatalogMap() : null;
    Object.keys(CATALOGUE).forEach(function (name) {
      var livePrice = map && map[name] ? map[name].price : CATALOGUE[name].price;
      CATALOGUE[name].price = livePrice;
      var opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name + ' (' + money(livePrice) + ')';
      editAddProductSelect.appendChild(opt);
    });
    if (prevVal && CATALOGUE[prevVal]) editAddProductSelect.value = prevVal;
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
    cName.textContent = order.customerName || '-';
    drawerCustomerDetails.appendChild(cName);

    [
      order.email,
      order.phone ? '+91 ' + order.phone : '',
      order.address,
      [order.city, order.state].filter(Boolean).join(', ') + (order.pin ? ' - ' + order.pin : ''),
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
        loadAllProducts(true);
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
        loadAllProducts(true);
        showToast('Order #' + order.reference + ' → ' + statusMeta(nextStatus).label);
      } catch (err) {
        console.error(err);
        drawerStatusError.textContent = (err && err.message && err.message.charAt(0) !== '{')
          ? err.message
          : 'Could not update order milestone. Ensure updated Firestore rules are published.';
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
      if (activeView === 'categories') {
        var catRows = filteredCategories();
        if (!catRows.length) return;
        var catHeaders = ['Sort Order', 'Slug', 'Name', 'Visible', 'Accent Color', 'Short Description', 'Shelf Description', 'Thumbnail URL', 'Assigned Toys Count', 'Assigned Toys'];
        var catLines = [catHeaders.map(escapeCsvCell).join(',')];
        catRows.forEach(function (c) {
          var assigned = getGroupsInCategory(c.slug);
          catLines.push([
            c.sortOrder,
            c.slug,
            c.name,
            c.visible !== false ? 'Visible' : 'Hidden',
            c.accentColor || '#171512',
            c.shortDesc || '',
            c.shelfDesc || '',
            c.thumbnailUrl || '',
            assigned.length,
            assigned.map(function (g) { return g.name; }).join('; ')
          ].map(escapeCsvCell).join(','));
        });
        var catBlob = new Blob([catLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        var catUrl = URL.createObjectURL(catBlob);
        var catAnchor = document.createElement('a');
        catAnchor.href = catUrl;
        catAnchor.download = 'redpoly-categories-' + new Date().toISOString().slice(0, 10) + '.csv';
        document.body.appendChild(catAnchor);
        catAnchor.click();
        document.body.removeChild(catAnchor);
        URL.revokeObjectURL(catUrl);
        showToast('Exported ' + catRows.length + (catRows.length === 1 ? ' category' : ' categories') + ' to CSV');
        return;
      }

      if (activeView === 'products') {
        var prodRows = filteredAndSortedProducts();
        if (!prodRows.length) return;
        var prodHeaders = ['SKU', 'Product Name', 'Category', 'Selling Price (INR)', 'Compare-at MRP (INR)', 'Cost Price (INR)', 'Unit Profit (INR)', 'Gross Margin (%)', 'Stock', 'Low Stock Threshold', 'Status', 'Card Tag', 'Price Comparisons'];
        var prodLines = [prodHeaders.map(escapeCsvCell).join(',')];
        prodRows.forEach(function (p) {
          var statusText = p.stock === 0 ? 'Out of stock' : (p.stock <= p.lowStockThreshold ? 'Low stock' : 'In stock');
          var compSummary = (p.priceComparisons || []).map(function (c) { return c.platform + ': ₹' + c.price; }).join('; ');
          var hasCost = p.costPrice != null && Number.isFinite(Number(p.costPrice));
          var unitProfit = hasCost ? Math.round((Number(p.price) - Number(p.costPrice)) * 100) / 100 : '';
          var marginPct = hasCost && Number(p.price) > 0
            ? (Math.round((((Number(p.price) - Number(p.costPrice)) / Number(p.price)) * 100) * 10) / 10)
            : '';
          var catRec = getCategoryBySlug(getProductCategorySlug(p));
          prodLines.push([
            p.sku,
            p.name,
            catRec ? catRec.name : getProductCategorySlug(p),
            p.price,
            p.compareAtPrice || '',
            hasCost ? Number(p.costPrice) : '',
            unitProfit,
            marginPct,
            p.stock,
            p.lowStockThreshold,
            statusText,
            p.cardTag || '',
            compSummary
          ].map(escapeCsvCell).join(','));
        });
        var prodBlob = new Blob([prodLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        var prodUrl = URL.createObjectURL(prodBlob);
        var prodAnchor = document.createElement('a');
        prodAnchor.href = prodUrl;
        prodAnchor.download = 'redpoly-products-' + new Date().toISOString().slice(0, 10) + '.csv';
        document.body.appendChild(prodAnchor);
        prodAnchor.click();
        document.body.removeChild(prodAnchor);
        URL.revokeObjectURL(prodUrl);
        showToast('Exported ' + prodRows.length + (prodRows.length === 1 ? ' product' : ' products') + ' to CSV');
        return;
      }

      if (activeView === 'customers') {
        var custRows = filteredAndSortedCustomers();
        if (!custRows.length) return;
        var custHeaders = ['Name', 'Email', 'Account', 'REDPOLY Crew', 'Crew Source', 'Phone', 'City', 'State', 'PIN', 'Orders', 'Total Spent (INR)', 'Joined At', 'UID'];
        var custLines = [custHeaders.map(escapeCsvCell).join(',')];
        custRows.forEach(function (c) {
          custLines.push([
            c.name,
            c.email || '',
            c.hasAccount ? 'Signed-in' : 'Guest',
            c.isCrewMember ? 'Yes' : 'No',
            c.crewSource || '',
            c.phone || '',
            c.city || '',
            c.state || '',
            c.pinCode || '',
            c.orderCount,
            c.totalSpent,
            c.joinedAtMs ? new Date(c.joinedAtMs).toISOString() : '',
            c.uid || ''
          ].map(escapeCsvCell).join(','));
        });
        var custBlob = new Blob([custLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        var custUrl = URL.createObjectURL(custBlob);
        var custAnchor = document.createElement('a');
        custAnchor.href = custUrl;
        custAnchor.download = 'redpoly-customers-' + new Date().toISOString().slice(0, 10) + '.csv';
        document.body.appendChild(custAnchor);
        custAnchor.click();
        document.body.removeChild(custAnchor);
        URL.revokeObjectURL(custUrl);
        showToast('Exported ' + custRows.length + (custRows.length === 1 ? ' customer' : ' customers') + ' to CSV');
        return;
      }

      if (activeView === 'favorites') {
        var favRows = filteredAndSortedFavorites();
        if (!favRows.length) return;
        var favHeaders = ['Customer Name', 'Email', 'User UID', 'Product', 'Price (INR)', 'Favorited At'];
        var favLines = [favHeaders.map(escapeCsvCell).join(',')];
        favRows.forEach(function (f) {
          favLines.push([
            f.userName,
            f.userEmail || '',
            f.uid,
            f.productName,
            f.price,
            f.createdAtMs ? new Date(f.createdAtMs).toISOString() : ''
          ].map(escapeCsvCell).join(','));
        });
        var favBlob = new Blob([favLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        var favUrl = URL.createObjectURL(favBlob);
        var favAnchor = document.createElement('a');
        favAnchor.href = favUrl;
        favAnchor.download = 'redpoly-favorites-' + new Date().toISOString().slice(0, 10) + '.csv';
        document.body.appendChild(favAnchor);
        favAnchor.click();
        document.body.removeChild(favAnchor);
        URL.revokeObjectURL(favUrl);
        showToast('Exported ' + favRows.length + (favRows.length === 1 ? ' favorite' : ' favorites') + ' to CSV');
        return;
      }

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

  // ---------- FAVORITES VIEW ----------
  function updateFavoritesSummaryAndTabs() {
    var total = allFavorites.length;
    var userSet = new Set();
    var productCounts = {};
    allFavorites.forEach(function (f) {
      if (f.uid) userSet.add(f.uid);
      if (f.productName) productCounts[f.productName] = (productCounts[f.productName] || 0) + 1;
    });
    var productKeys = Object.keys(productCounts).sort(function (a, b) {
      return productCounts[b] - productCounts[a] || a.localeCompare(b);
    });
    var topLabel = '-';
    if (productKeys.length) {
      topLabel = productKeys[0] + ' (' + productCounts[productKeys[0]] + ')';
    }

    if (sidebarFavoritesCount) sidebarFavoritesCount.textContent = String(total);
    if (metricTotalFavorites) metricTotalFavorites.textContent = String(total);
    if (metricFavoriteUsers) metricFavoriteUsers.textContent = String(userSet.size);
    if (metricFavoriteProducts) metricFavoriteProducts.textContent = String(productKeys.length);
    if (metricTopFavorite) metricTopFavorite.textContent = topLabel;

    if (favoritesProductTabs) {
      if (favoriteProductFilter !== 'all' && !productCounts[favoriteProductFilter]) {
        favoriteProductFilter = 'all';
      }
      favoritesProductTabs.textContent = '';
      var allBtn = document.createElement('button');
      allBtn.type = 'button';
      allBtn.className = 'orders-tab' + (favoriteProductFilter === 'all' ? ' is-active' : '');
      allBtn.setAttribute('role', 'tab');
      allBtn.setAttribute('aria-selected', favoriteProductFilter === 'all' ? 'true' : 'false');
      allBtn.setAttribute('data-fav-product', 'all');
      allBtn.textContent = 'All ';
      var allSpan = document.createElement('span');
      allSpan.textContent = String(total);
      allBtn.appendChild(allSpan);
      favoritesProductTabs.appendChild(allBtn);

      productKeys.forEach(function (name) {
        var btn = document.createElement('button');
        btn.type = 'button';
        var isActive = favoriteProductFilter === name;
        btn.className = 'orders-tab' + (isActive ? ' is-active' : '');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.setAttribute('data-fav-product', name);
        btn.textContent = name + ' ';
        var countSpan = document.createElement('span');
        countSpan.textContent = String(productCounts[name]);
        btn.appendChild(countSpan);
        favoritesProductTabs.appendChild(btn);
      });
    }
  }

  function filteredAndSortedFavorites() {
    var q = favoriteSearchQuery.trim().toLowerCase();
    var list = allFavorites.filter(function (f) {
      if (favoriteProductFilter !== 'all' && f.productName !== favoriteProductFilter) return false;
      if (!q) return true;
      var hay = [f.userName, f.userEmail, f.uid, f.productName].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });
    list.sort(function (a, b) {
      if (favoriteSortMode === 'customer-asc') {
        return (a.userName || '').localeCompare(b.userName || '') || (b.createdAtMs - a.createdAtMs);
      }
      if (favoriteSortMode === 'product-asc') {
        return (a.productName || '').localeCompare(b.productName || '') || (a.userName || '').localeCompare(b.userName || '');
      }
      return b.createdAtMs - a.createdAtMs;
    });
    return list;
  }

  function renderFavoritesTable() {
    if (!favoritesTbody || !favoritesTableWrap || !favoritesEmpty || !favoritesSkeleton || !favoritesFooter) return;
    favoritesSkeleton.hidden = !favoritesLoading;
    if (favoritesLoading) {
      favoritesTableWrap.hidden = true;
      favoritesEmpty.hidden = true;
      favoritesFooter.hidden = true;
      return;
    }

    var rows = filteredAndSortedFavorites();
    favoritesTbody.textContent = '';

    if (!rows.length) {
      favoritesTableWrap.hidden = true;
      favoritesFooter.hidden = true;
      favoritesEmpty.hidden = false;
      if (!allFavorites.length) {
        favoritesEmptyTitle.textContent = 'No customer favorites yet';
        favoritesEmptyCopy.textContent = 'When signed-in customers save toys as favorites, you will see who favorited each product here.';
      } else {
        favoritesEmptyTitle.textContent = 'No favorites match this filter';
        favoritesEmptyCopy.textContent = 'Choose another product tab or clear your search query.';
      }
      return;
    }

    favoritesEmpty.hidden = true;
    favoritesTableWrap.hidden = false;
    favoritesFooter.hidden = false;
    favoritesShowingText.textContent = 'Showing ' + rows.length + ' of ' + allFavorites.length + (allFavorites.length === 1 ? ' favorite' : ' favorites');

    rows.forEach(function (fav) {
      var tr = document.createElement('tr');

      var tdCustomer = document.createElement('td');
      var custWrap = document.createElement('div');
      custWrap.className = 'fav-customer';
      if (fav.userPhotoURL) {
        var avatar = document.createElement('img');
        avatar.className = 'fav-customer__avatar';
        avatar.src = fav.userPhotoURL;
        avatar.alt = '';
        avatar.referrerPolicy = 'no-referrer';
        custWrap.appendChild(avatar);
      } else {
        var initial = document.createElement('span');
        initial.className = 'fav-customer__initial';
        initial.textContent = (fav.userName || fav.userEmail || 'R').charAt(0).toUpperCase();
        custWrap.appendChild(initial);
      }
      var custText = document.createElement('div');
      custText.className = 'fav-customer__text';
      var custName = document.createElement('strong');
      custName.textContent = fav.userName || 'REDPOLY Member';
      var custSub = document.createElement('small');
      custSub.textContent = fav.userEmail ? fav.userEmail : ('UID: ' + fav.uid);
      custText.appendChild(custName);
      custText.appendChild(custSub);
      custWrap.appendChild(custText);
      tdCustomer.appendChild(custWrap);

      var tdProduct = document.createElement('td');
      var prodLink = document.createElement('a');
      prodLink.className = 'fav-product-cell';
      prodLink.href = fav.href || '/';
      if (fav.image) {
        var thumb = document.createElement('img');
        thumb.src = fav.image;
        thumb.alt = '';
        thumb.loading = 'lazy';
        prodLink.appendChild(thumb);
      }
      var prodName = document.createElement('span');
      prodName.textContent = fav.productName;
      prodLink.appendChild(prodName);
      tdProduct.appendChild(prodLink);

      var tdPrice = document.createElement('td');
      tdPrice.className = 'col-num';
      tdPrice.textContent = money(fav.price);

      var tdDate = document.createElement('td');
      tdDate.className = 'cell-date';
      tdDate.textContent = formatDateShort(fav.createdAtMs);

      tr.appendChild(tdCustomer);
      tr.appendChild(tdProduct);
      tr.appendChild(tdPrice);
      tr.appendChild(tdDate);
      favoritesTbody.appendChild(tr);
    });
  }

  if (favoritesProductTabs) {
    favoritesProductTabs.addEventListener('click', function (event) {
      var tab = event.target.closest('[data-fav-product]');
      if (!tab) return;
      favoriteProductFilter = tab.getAttribute('data-fav-product') || 'all';
      updateFavoritesSummaryAndTabs();
      renderFavoritesTable();
    });
  }

  if (favoritesSearchInput) {
    favoritesSearchInput.addEventListener('input', function () {
      favoriteSearchQuery = favoritesSearchInput.value || '';
      if (favoritesSearchClear) favoritesSearchClear.hidden = !favoriteSearchQuery;
      renderFavoritesTable();
    });
  }

  if (favoritesSearchClear) {
    favoritesSearchClear.addEventListener('click', function () {
      favoriteSearchQuery = '';
      if (favoritesSearchInput) { favoritesSearchInput.value = ''; favoritesSearchInput.focus(); }
      favoritesSearchClear.hidden = true;
      renderFavoritesTable();
    });
  }

  if (favoritesSortSelect) {
    favoritesSortSelect.addEventListener('change', function () {
      favoriteSortMode = favoritesSortSelect.value || 'newest';
      renderFavoritesTable();
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
      updateCustomersMetricsAndTabs();
      renderCustomersTable();
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

  async function loadAllWishlists(force) {
    var fb = await ensureDashboardFirebase();
    var user = fb.getUser();
    if (!isCurrentAdmin(user)) return;
    if (favoritesLoading && !force) return;

    favoritesLoading = true;
    if (refreshBtn) refreshBtn.disabled = true;
    if (favoritesErrorBanner) favoritesErrorBanner.hidden = true;
    renderFavoritesTable();

    try {
      allFavorites = await fb.listAllWishlists();
      updateFavoritesSummaryAndTabs();
    } catch (err) {
      console.error(err);
      if (favoritesErrorText) favoritesErrorText.textContent = 'Could not load customer favorites from Firestore. Ensure updated Firestore rules are published.';
      if (favoritesErrorBanner) favoritesErrorBanner.hidden = false;
    } finally {
      favoritesLoading = false;
      if (refreshBtn) refreshBtn.disabled = false;
      renderFavoritesTable();
    }
  }

  // ---------- PRODUCTS CATALOG & INVENTORY VIEW ----------
  function productStockMeta(prod) {
    var qty = prod && prod.stock != null ? Number(prod.stock) : INITIAL_SEED_STOCK;
    var threshold = prod && prod.lowStockThreshold != null ? Number(prod.lowStockThreshold) : DEFAULT_LOW_STOCK_THRESHOLD;
    if (qty <= 0) return { key: 'out_of_stock', label: 'Out of stock', badgeClass: 'status-badge status-badge--cancelled' };
    if (qty <= threshold) return { key: 'low_stock', label: 'Low stock', badgeClass: 'status-badge status-badge--placed' };
    return { key: 'in_stock', label: 'In stock', badgeClass: 'status-badge status-badge--fulfilled' };
  }

  function updateProductMetricsAndTabs() {
    var total = allProducts.length;
    var totalUnits = 0;
    var inStockCount = 0;
    var lowStockCount = 0;
    var outStockCount = 0;
    var taggedCount = 0;

    allProducts.forEach(function (p) {
      var qty = Number(p.stock != null ? p.stock : 0);
      totalUnits += qty;
      var meta = productStockMeta(p);
      if (meta.key === 'out_of_stock') outStockCount += 1;
      else if (meta.key === 'low_stock') lowStockCount += 1;
      else inStockCount += 1;
      if (p.cardTag && String(p.cardTag).trim()) taggedCount += 1;
    });

    if (sidebarProductsCount) sidebarProductsCount.textContent = String(total || SKU_ORDER.length);
    if (metricTotalProducts) metricTotalProducts.textContent = String(total || SKU_ORDER.length);
    if (metricTotalUnits) metricTotalUnits.textContent = total ? String(totalUnits) : '-';
    if (metricLowStockProducts) metricLowStockProducts.textContent = String(lowStockCount);
    if (metricOutStockProducts) metricOutStockProducts.textContent = String(outStockCount);

    if (prodTabAll) prodTabAll.textContent = String(total);
    if (prodTabInStock) prodTabInStock.textContent = String(inStockCount);
    if (prodTabLowStock) prodTabLowStock.textContent = String(lowStockCount);
    if (prodTabOutStock) prodTabOutStock.textContent = String(outStockCount);
    if (prodTabTagged) prodTabTagged.textContent = String(taggedCount);
  }

  function getProductCategorySlug(prod) {
    if (prod && typeof prod.category === 'string' && CATEGORY_SLUG_RE.test(prod.category.trim())) {
      return prod.category.trim();
    }
    return (prod && DEFAULT_PRODUCT_CATEGORIES[prod.sku]) || 'fun';
  }

  function getCategoryBySlug(slug) {
    var s = String(slug || '').trim().toLowerCase();
    return allCategories.find(function (c) { return c.slug === s; }) || null;
  }

  function getGroupCategorySlug(grp) {
    if (!grp || !grp.skus || !grp.skus.length) return 'fun';
    var firstProd = allProducts.find(function (p) { return p.sku === grp.skus[0]; });
    return firstProd ? getProductCategorySlug(firstProd) : (DEFAULT_PRODUCT_CATEGORIES[grp.skus[0]] || 'fun');
  }

  function getGroupsInCategory(slug) {
    return PRODUCT_GROUPS.filter(function (grp) {
      return getGroupCategorySlug(grp) === slug;
    });
  }

  function populateCategorySelectors() {
    var sortedCats = allCategories.slice().sort(function (a, b) {
      return (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0) || String(a.name).localeCompare(String(b.name));
    });
    if (productsCategoryFilter) {
      var prevFilter = productCategoryFilter || 'all';
      productsCategoryFilter.textContent = '';
      var optAll = document.createElement('option');
      optAll.value = 'all';
      optAll.textContent = 'All categories';
      productsCategoryFilter.appendChild(optAll);
      sortedCats.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c.slug;
        opt.textContent = c.name + (c.visible === false ? ' (Hidden)' : '');
        productsCategoryFilter.appendChild(opt);
      });
      var hasPrev = prevFilter === 'all' || sortedCats.some(function (c) { return c.slug === prevFilter; });
      productCategoryFilter = hasPrev ? prevFilter : 'all';
      productsCategoryFilter.value = productCategoryFilter;
    }
    if (prodEditCategory) {
      var prevVal = prodEditCategory.value;
      prodEditCategory.textContent = '';
      sortedCats.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c.slug;
        opt.textContent = c.name + (c.visible === false ? ' (Hidden)' : '');
        prodEditCategory.appendChild(opt);
      });
      if (prevVal && sortedCats.some(function (c) { return c.slug === prevVal; })) {
        prodEditCategory.value = prevVal;
      }
    }
  }

  async function quickAssignCategory(skus, nextCatSlug, selectEl, labelForToast) {
    if (!skus || !skus.length || !CATEGORY_SLUG_RE.test(nextCatSlug)) return;
    if (selectEl) selectEl.disabled = true;
    try {
      var fb = await ensureDashboardFirebase();
      var updatedList = await fb.assignProductsCategory(skus, nextCatSlug);
      updatedList.forEach(function (u) {
        var idx = allProducts.findIndex(function (p) { return p.sku === u.sku; });
        if (idx !== -1) allProducts[idx] = u;
        else allProducts.push(u);
      });
      updateProductMetricsAndTabs();
      renderProductsTable();
      updateCategoryMetricsAndTabs();
      renderCategoriesTable();
      if (selectedProductSku && skus.indexOf(selectedProductSku) !== -1 && productDrawerLayer && !productDrawerLayer.hidden) {
        var activeProd = allProducts.find(function (p) { return p.sku === selectedProductSku; });
        if (activeProd) fillProductDrawer(activeProd);
      }
      var catRec = getCategoryBySlug(nextCatSlug);
      showToast((labelForToast || 'Product') + ' → ' + (catRec ? catRec.name : nextCatSlug));
    } catch (err) {
      console.error(err);
      showToast(err && err.message && err.message.charAt(0) !== '{' ? err.message : 'Could not update category');
      renderProductsTable();
    } finally {
      if (selectEl) selectEl.disabled = false;
    }
  }

  function buildInlineCategorySelect(currentSlug, skus, labelForToast) {
    var sel = document.createElement('select');
    sel.className = 'prod-cat-select';
    sel.setAttribute('aria-label', 'Category for ' + (labelForToast || 'product'));
    var sortedCats = allCategories.slice().sort(function (a, b) {
      return (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0) || String(a.name).localeCompare(String(b.name));
    });
    var found = false;
    sortedCats.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c.slug;
      opt.textContent = c.name + (c.visible === false ? ' (Hidden)' : '');
      if (c.slug === currentSlug) found = true;
      sel.appendChild(opt);
    });
    if (!found && currentSlug) {
      var fallbackOpt = document.createElement('option');
      fallbackOpt.value = currentSlug;
      fallbackOpt.textContent = currentSlug;
      sel.appendChild(fallbackOpt);
    }
    sel.value = currentSlug;
    var activeCat = getCategoryBySlug(currentSlug);
    sel.style.borderLeftColor = (activeCat && activeCat.accentColor) || '#171512';
    sel.addEventListener('click', function (ev) { ev.stopPropagation(); });
    sel.addEventListener('change', function (ev) {
      ev.stopPropagation();
      var nextSlug = sel.value;
      var nextCat = getCategoryBySlug(nextSlug);
      sel.style.borderLeftColor = (nextCat && nextCat.accentColor) || '#171512';
      quickAssignCategory(skus, nextSlug, sel, labelForToast);
    });
    return sel;
  }

  function filteredAndSortedProducts() {
    var q = productSearchQuery.trim().toLowerCase();
    var list = allProducts.filter(function (p) {
      var meta = productStockMeta(p);
      if (productFilter === 'in_stock' && meta.key !== 'in_stock') return false;
      if (productFilter === 'low_stock' && meta.key !== 'low_stock') return false;
      if (productFilter === 'out_of_stock' && meta.key !== 'out_of_stock') return false;
      if (productFilter === 'tagged' && (!p.cardTag || !String(p.cardTag).trim())) return false;
      var pCatSlug = getProductCategorySlug(p);
      if (productCategoryFilter && productCategoryFilter !== 'all' && pCatSlug !== productCategoryFilter) return false;
      if (!q) return true;
      var grp = SKU_TO_GROUP[p.sku];
      var catRec = getCategoryBySlug(pCatSlug);
      var variantLabel = grp && grp.variantLabels ? (grp.variantLabels[p.sku] || '') : '';
      var compStr = (p.priceComparisons || []).map(function (c) { return c.platform + ' ' + c.price; }).join(' ');
      var hay = [p.sku, p.name, grp ? grp.name : '', variantLabel, pCatSlug, catRec ? catRec.name : '', p.cardTag || '', compStr].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    if (productSortMode === 'stock-asc') {
      list.sort(function (a, b) { return Number(a.stock || 0) - Number(b.stock || 0); });
    } else if (productSortMode === 'stock-desc') {
      list.sort(function (a, b) { return Number(b.stock || 0) - Number(a.stock || 0); });
    } else if (productSortMode === 'price-desc') {
      list.sort(function (a, b) { return Number(b.price || 0) - Number(a.price || 0); });
    } else if (productSortMode === 'price-asc') {
      list.sort(function (a, b) { return Number(a.price || 0) - Number(b.price || 0); });
    } else if (productSortMode === 'name-asc') {
      list.sort(function (a, b) { return String(a.name || '').localeCompare(String(b.name || '')); });
    } else {
      list.sort(function (a, b) { return SKU_ORDER.indexOf(a.sku) - SKU_ORDER.indexOf(b.sku); });
    }
    return list;
  }

  function buildGroupedProductRows(filteredSkus) {
    var byGroupId = {};
    var allByGroupId = {};
    allProducts.forEach(function (p) {
      var grp = SKU_TO_GROUP[p.sku];
      var gid = grp ? grp.id : p.sku;
      if (!allByGroupId[gid]) allByGroupId[gid] = [];
      allByGroupId[gid].push(p);
    });

    filteredSkus.forEach(function (p) {
      var grp = SKU_TO_GROUP[p.sku];
      var gid = grp ? grp.id : p.sku;
      if (!byGroupId[gid]) {
        byGroupId[gid] = {
          group: grp || { id: p.sku, name: p.name, href: p.href || '/', image: p.image || '', skus: [p.sku], variantLabels: {}, orderIndex: 999 },
          items: [],
          allItems: allByGroupId[gid] || [p]
        };
      }
      byGroupId[gid].items.push(p);
    });

    var groups = Object.keys(byGroupId).map(function (gid) {
      var entry = byGroupId[gid];
      if (productSortMode === 'catalog' || productSortMode === 'name-asc') {
        entry.items.sort(function (a, b) { return SKU_ORDER.indexOf(a.sku) - SKU_ORDER.indexOf(b.sku); });
      }
      return entry;
    });

    function groupTotalStock(g) {
      return g.items.reduce(function (sum, item) { return sum + Number(item.stock || 0); }, 0);
    }
    function groupMinStock(g) {
      return Math.min.apply(null, g.items.map(function (item) { return Number(item.stock || 0); }));
    }
    function groupMinPrice(g) {
      return Math.min.apply(null, g.items.map(function (item) { return Number(item.price || 0); }));
    }
    function groupMaxPrice(g) {
      return Math.max.apply(null, g.items.map(function (item) { return Number(item.price || 0); }));
    }

    if (productSortMode === 'stock-asc') {
      groups.sort(function (a, b) { return groupMinStock(a) - groupMinStock(b) || groupTotalStock(a) - groupTotalStock(b); });
    } else if (productSortMode === 'stock-desc') {
      groups.sort(function (a, b) { return groupTotalStock(b) - groupTotalStock(a); });
    } else if (productSortMode === 'price-desc') {
      groups.sort(function (a, b) { return groupMaxPrice(b) - groupMaxPrice(a); });
    } else if (productSortMode === 'price-asc') {
      groups.sort(function (a, b) { return groupMinPrice(a) - groupMinPrice(b); });
    } else if (productSortMode === 'name-asc') {
      groups.sort(function (a, b) { return String(a.group.name || '').localeCompare(String(b.group.name || '')); });
    } else {
      groups.sort(function (a, b) { return (a.group.orderIndex || 0) - (b.group.orderIndex || 0); });
    }
    return groups;
  }

  function upsertProductRecord(updated) {
    if (!updated || !updated.sku) return;
    var idx = allProducts.findIndex(function (p) { return p.sku === updated.sku; });
    if (idx !== -1) allProducts[idx] = updated;
    else allProducts.push(updated);
    if (CATALOGUE[updated.name]) {
      CATALOGUE[updated.name].price = updated.price;
    }
    populateCatalogueDropdown();
    updateProductMetricsAndTabs();
    renderProductsTable();
  }

  async function quickAdjustProductStock(prod, delta, triggerEls) {
    var targetBtn = triggerEls || [];
    targetBtn.forEach(function (el) { el.disabled = true; });
    try {
      var fb = await ensureDashboardFirebase();
      var updated = await fb.adjustProductStock(prod.sku, delta);
      upsertProductRecord(updated);
      if (selectedProductSku === updated.sku && !productDrawerLayer.hidden) {
        fillProductDrawer(updated);
      }
      showToast(updated.name + ' stock → ' + updated.stock);
    } catch (err) {
      console.error(err);
      showToast(err && err.message && err.message.charAt(0) !== '{' ? err.message : 'Could not update stock');
      renderProductsTable();
    }
  }

  async function quickSetProductStock(prod, nextQty, inputEl) {
    var cleaned = Math.max(0, Math.min(100000, Math.floor(Number(nextQty))));
    if (!Number.isFinite(cleaned)) {
      if (inputEl) inputEl.value = String(prod.stock);
      return;
    }
    if (cleaned === Number(prod.stock)) return;
    if (inputEl) inputEl.disabled = true;
    try {
      var fb = await ensureDashboardFirebase();
      var updated = await fb.updateProduct(prod.sku, { stock: cleaned });
      upsertProductRecord(updated);
      if (selectedProductSku === updated.sku && !productDrawerLayer.hidden) {
        fillProductDrawer(updated);
      }
      showToast(updated.name + ' stock → ' + updated.stock);
    } catch (err) {
      console.error(err);
      showToast(err && err.message && err.message.charAt(0) !== '{' ? err.message : 'Could not update stock');
      renderProductsTable();
    }
  }

  function buildProductSkuRow(prod, opts) {
    var isVariant = Boolean(opts && opts.isVariant);
    var isLastVariant = Boolean(opts && opts.isLastVariant);
    var variantLabel = opts && opts.variantLabel ? opts.variantLabel : '';

    var tr = document.createElement('tr');
    if (isVariant) {
      tr.className = 'prod-variant-row' + (isLastVariant ? ' is-last-variant' : '');
    }
    if (prod.sku === selectedProductSku) tr.classList.add('is-selected');
    var stMeta = productStockMeta(prod);

    var tdProd = document.createElement('td');
    var cellWrap = document.createElement('div');
    cellWrap.className = 'prod-cell' + (isVariant ? ' prod-cell--variant' : '');
    if (prod.image) {
      var img = document.createElement('img');
      img.className = 'prod-cell__img' + (isVariant ? ' prod-cell__img--sm' : '');
      img.src = prod.image;
      img.alt = '';
      img.loading = 'lazy';
      cellWrap.appendChild(img);
    }
    var copy = document.createElement('div');
    copy.className = 'prod-cell__copy';
    var title = document.createElement('strong');
    title.textContent = isVariant && variantLabel ? variantLabel : prod.name;
    var skuLine = document.createElement('span');
    skuLine.className = 'prod-cell__sku';
    skuLine.textContent = prod.sku;
    copy.appendChild(title);
    copy.appendChild(skuLine);
    cellWrap.appendChild(copy);
    tdProd.appendChild(cellWrap);

    var tdCat = document.createElement('td');
    var skuCatSlug = getProductCategorySlug(prod);
    if (isVariant) {
      var vCatRec = getCategoryBySlug(skuCatSlug);
      var vNote = document.createElement('span');
      vNote.className = 'prod-cat-variant-note';
      var vDot = document.createElement('span');
      vDot.className = 'prod-cat-dot';
      vDot.style.background = (vCatRec && vCatRec.accentColor) || '#171512';
      vNote.appendChild(vDot);
      vNote.appendChild(document.createTextNode((vCatRec && vCatRec.name) || skuCatSlug));
      tdCat.appendChild(vNote);
    } else {
      tdCat.appendChild(buildInlineCategorySelect(skuCatSlug, [prod.sku], prod.name));
    }

    var tdPrice = document.createElement('td');
    tdPrice.className = 'prod-price-cell';
    var priceStrong = document.createElement('strong');
    priceStrong.textContent = money(prod.price);
    tdPrice.appendChild(priceStrong);
    if (prod.compareAtPrice > prod.price) {
      var mrpStrike = document.createElement('s');
      mrpStrike.textContent = money(prod.compareAtPrice);
      tdPrice.appendChild(mrpStrike);
    }
    if (prod.priceComparisons && prod.priceComparisons.length) {
      var compNote = document.createElement('span');
      compNote.className = 'prod-price-cell__comp';
      compNote.textContent = prod.priceComparisons.map(function (c) { return money(c.price) + ' ' + c.platform; }).join(' · ');
      tdPrice.appendChild(compNote);
    }

    var tdCost = document.createElement('td');
    tdCost.className = 'prod-cost-cell';
    if (prod.costPrice != null && Number.isFinite(Number(prod.costPrice))) {
      var costStrong = document.createElement('strong');
      costStrong.textContent = money(prod.costPrice);
      tdCost.appendChild(costStrong);
      var unitProfit = Math.round((Number(prod.price) - Number(prod.costPrice)) * 100) / 100;
      var marginPct = Number(prod.price) > 0 ? Math.round(((unitProfit / Number(prod.price)) * 100) * 10) / 10 : 0;
      var marginSpan = document.createElement('span');
      marginSpan.className = 'prod-cost-margin' + (unitProfit <= 0 ? ' is-loss' : '');
      marginSpan.textContent = (unitProfit >= 0 ? '+' : '−') + money(Math.abs(unitProfit)) + ' (' + marginPct + '%)';
      tdCost.appendChild(marginSpan);
    } else {
      var setCostBtn = document.createElement('button');
      setCostBtn.type = 'button';
      setCostBtn.className = 'prod-cost-empty-btn';
      setCostBtn.textContent = '+ Set cost';
      setCostBtn.setAttribute('aria-label', 'Set cost price for ' + prod.name);
      setCostBtn.addEventListener('click', function () {
        openProductDrawer(prod, setCostBtn, true);
      });
      tdCost.appendChild(setCostBtn);
    }

    var tdTag = document.createElement('td');
    if (prod.cardTag && String(prod.cardTag).trim()) {
      var tagSpan = document.createElement('span');
      tagSpan.className = 'prod-tag-pill';
      tagSpan.textContent = prod.cardTag;
      tdTag.appendChild(tagSpan);
    } else {
      var noneSpan = document.createElement('span');
      noneSpan.className = 'prod-tag-empty';
      noneSpan.textContent = '-';
      tdTag.appendChild(noneSpan);
    }

    var tdStatus = document.createElement('td');
    var stBadge = document.createElement('span');
    stBadge.className = stMeta.badgeClass;
    stBadge.textContent = stMeta.label;
    tdStatus.appendChild(stBadge);

    var tdStock = document.createElement('td');
    var stockCtrl = document.createElement('div');
    stockCtrl.className = 'prod-stock-control';

    var decBtn = document.createElement('button');
    decBtn.type = 'button';
    decBtn.className = 'prod-stock-btn';
    decBtn.textContent = '−1';
    decBtn.disabled = Number(prod.stock || 0) <= 0;
    decBtn.setAttribute('aria-label', 'Decrease stock for ' + prod.name + ' by 1');

    var stockInput = document.createElement('input');
    stockInput.type = 'number';
    stockInput.className = 'prod-stock-input';
    stockInput.min = '0';
    stockInput.max = '100000';
    stockInput.value = String(prod.stock != null ? prod.stock : 0);
    stockInput.setAttribute('aria-label', 'Stock quantity for ' + prod.name);

    var inc1Btn = document.createElement('button');
    inc1Btn.type = 'button';
    inc1Btn.className = 'prod-stock-btn';
    inc1Btn.textContent = '+1';
    inc1Btn.setAttribute('aria-label', 'Increase stock for ' + prod.name + ' by 1');

    var inc10Btn = document.createElement('button');
    inc10Btn.type = 'button';
    inc10Btn.className = 'prod-stock-btn';
    inc10Btn.textContent = '+10';
    inc10Btn.setAttribute('aria-label', 'Increase stock for ' + prod.name + ' by 10');

    var rowCtrls = [decBtn, stockInput, inc1Btn, inc10Btn];
    decBtn.addEventListener('click', function () { quickAdjustProductStock(prod, -1, rowCtrls); });
    inc1Btn.addEventListener('click', function () { quickAdjustProductStock(prod, 1, rowCtrls); });
    inc10Btn.addEventListener('click', function () { quickAdjustProductStock(prod, 10, rowCtrls); });
    stockInput.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        stockInput.blur();
      }
    });
    stockInput.addEventListener('blur', function () {
      quickSetProductStock(prod, stockInput.value, stockInput);
    });

    stockCtrl.appendChild(decBtn);
    stockCtrl.appendChild(stockInput);
    stockCtrl.appendChild(inc1Btn);
    stockCtrl.appendChild(inc10Btn);
    tdStock.appendChild(stockCtrl);

    var tdAct = document.createElement('td');
    tdAct.className = 'col-num';
    var editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn btn--secondary btn--sm';
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('aria-label', 'Edit ' + prod.name);
    editBtn.addEventListener('click', function () { openProductDrawer(prod, editBtn); });
    tdAct.appendChild(editBtn);

    tr.appendChild(tdProd);
    tr.appendChild(tdCat);
    tr.appendChild(tdPrice);
    tr.appendChild(tdCost);
    tr.appendChild(tdTag);
    tr.appendChild(tdStatus);
    tr.appendChild(tdStock);
    tr.appendChild(tdAct);
    return tr;
  }

  function buildProductGroupRow(entry, isExpanded) {
    var grp = entry.group;
    var items = entry.items;
    var allItems = entry.allItems && entry.allItems.length ? entry.allItems : items;
    var totalStock = items.reduce(function (sum, p) { return sum + Number(p.stock || 0); }, 0);
    var prices = items.map(function (p) { return Number(p.price || 0); });
    var minPrice = Math.min.apply(null, prices);
    var maxPrice = Math.max.apply(null, prices);

    var allOut = items.every(function (p) { return productStockMeta(p).key === 'out_of_stock'; });
    var anyAlert = items.some(function (p) {
      var k = productStockMeta(p).key;
      return k === 'out_of_stock' || k === 'low_stock';
    });
    var aggBadge = allOut
      ? { label: 'Out of stock', badgeClass: 'status-badge status-badge--cancelled' }
      : (anyAlert
        ? { label: 'Low stock', badgeClass: 'status-badge status-badge--placed' }
        : { label: 'In stock', badgeClass: 'status-badge status-badge--fulfilled' });

    var primaryTagged = allItems.find(function (p) { return p.cardTag && String(p.cardTag).trim(); }) || null;

    var tr = document.createElement('tr');
    tr.className = 'prod-group-row' + (isExpanded ? ' is-expanded' : '');

    var tdProd = document.createElement('td');
    var cellWrap = document.createElement('div');
    cellWrap.className = 'prod-cell';

    var toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'prod-group-toggle';
    toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    toggleBtn.setAttribute('aria-label', (isExpanded ? 'Collapse ' : 'Expand ') + grp.name + ' variants');
    toggleBtn.innerHTML = '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5"/></svg>';
    cellWrap.appendChild(toggleBtn);

    if (grp.image) {
      var img = document.createElement('img');
      img.className = 'prod-cell__img';
      img.src = grp.image;
      img.alt = '';
      img.loading = 'lazy';
      cellWrap.appendChild(img);
    }

    var copy = document.createElement('div');
    copy.className = 'prod-cell__copy';
    var title = document.createElement('strong');
    title.textContent = grp.name;
    var badgeCount = document.createElement('span');
    badgeCount.className = 'prod-variant-pill';
    badgeCount.textContent = items.length === allItems.length
      ? (allItems.length + ' variants')
      : (items.length + ' of ' + allItems.length + ' variants');
    title.appendChild(badgeCount);

    var skuLine = document.createElement('span');
    skuLine.className = 'prod-cell__sku';
    skuLine.textContent = grp.id;
    copy.appendChild(title);
    copy.appendChild(skuLine);
    cellWrap.appendChild(copy);
    tdProd.appendChild(cellWrap);

    var tdCat = document.createElement('td');
    var grpCatSlug = getGroupCategorySlug(grp);
    tdCat.appendChild(buildInlineCategorySelect(grpCatSlug, grp.skus, grp.name));

    var tdPrice = document.createElement('td');
    tdPrice.className = 'prod-price-cell';
    var priceStrong = document.createElement('strong');
    priceStrong.textContent = minPrice === maxPrice ? money(minPrice) : (money(minPrice) + ' – ' + money(maxPrice));
    tdPrice.appendChild(priceStrong);
    var priceSub = document.createElement('span');
    priceSub.className = 'prod-price-cell__comp';
    priceSub.textContent = items.length + (items.length === 1 ? ' sub-product' : ' sub-products');
    tdPrice.appendChild(priceSub);

    var tdCost = document.createElement('td');
    tdCost.className = 'prod-cost-cell';
    var costedItems = items.filter(function (p) { return p.costPrice != null && Number.isFinite(Number(p.costPrice)); });
    if (costedItems.length) {
      var costs = costedItems.map(function (p) { return Number(p.costPrice); });
      var minCost = Math.min.apply(null, costs);
      var maxCost = Math.max.apply(null, costs);
      var gCostStrong = document.createElement('strong');
      gCostStrong.textContent = minCost === maxCost ? money(minCost) : (money(minCost) + ' – ' + money(maxCost));
      tdCost.appendChild(gCostStrong);
      var gCostSub = document.createElement('span');
      gCostSub.className = 'prod-cost-margin is-muted';
      gCostSub.textContent = costedItems.length + ' of ' + items.length + ' variants priced';
      tdCost.appendChild(gCostSub);
    } else {
      var gCostNone = document.createElement('span');
      gCostNone.className = 'prod-tag-empty';
      gCostNone.textContent = 'Not set';
      tdCost.appendChild(gCostNone);
    }

    var tdTag = document.createElement('td');
    if (primaryTagged && primaryTagged.cardTag) {
      var tagSpan = document.createElement('span');
      tagSpan.className = 'prod-tag-pill';
      tagSpan.textContent = primaryTagged.cardTag;
      tdTag.appendChild(tagSpan);
    } else {
      var noneSpan = document.createElement('span');
      noneSpan.className = 'prod-tag-empty';
      noneSpan.textContent = '-';
      tdTag.appendChild(noneSpan);
    }

    var tdStatus = document.createElement('td');
    var stBadge = document.createElement('span');
    stBadge.className = aggBadge.badgeClass;
    stBadge.textContent = aggBadge.label;
    tdStatus.appendChild(stBadge);

    var tdStock = document.createElement('td');
    var stockSummary = document.createElement('span');
    stockSummary.className = 'prod-group-stock';
    var stockStrong = document.createElement('strong');
    stockStrong.textContent = String(totalStock);
    stockSummary.appendChild(stockStrong);
    stockSummary.appendChild(document.createTextNode(' total across ' + items.length + (items.length === 1 ? ' variant' : ' variants')));
    tdStock.appendChild(stockSummary);

    var tdAct = document.createElement('td');
    tdAct.className = 'col-num';
    var actBtn = document.createElement('button');
    actBtn.type = 'button';
    actBtn.className = 'btn btn--secondary btn--sm';
    actBtn.textContent = isExpanded ? 'Hide variants' : 'Show variants';
    actBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    tdAct.appendChild(actBtn);

    function toggleGroup() {
      expandedProductGroups[grp.id] = !isExpanded;
      renderProductsTable();
    }
    tr.addEventListener('click', function (ev) {
      if (ev.target && ev.target.closest('button, select')) return;
      toggleGroup();
    });
    toggleBtn.addEventListener('click', toggleGroup);
    actBtn.addEventListener('click', toggleGroup);

    tr.appendChild(tdProd);
    tr.appendChild(tdCat);
    tr.appendChild(tdPrice);
    tr.appendChild(tdCost);
    tr.appendChild(tdTag);
    tr.appendChild(tdStatus);
    tr.appendChild(tdStock);
    tr.appendChild(tdAct);
    return tr;
  }

  function renderProductsTable() {
    if (!productsTbody || !productsTableWrap || !productsEmpty || !productsSkeleton || !productsFooter) return;
    productsSkeleton.hidden = !productsLoading;

    if (productsLoading) {
      productsTableWrap.hidden = true;
      productsEmpty.hidden = true;
      productsFooter.hidden = true;
      return;
    }

    var rows = filteredAndSortedProducts();
    var groups = buildGroupedProductRows(rows);
    productsTbody.textContent = '';

    if (!rows.length) {
      productsTableWrap.hidden = true;
      productsFooter.hidden = true;
      productsEmpty.hidden = false;
      if (!allProducts.length) {
        if (productsEmptyTitle) productsEmptyTitle.textContent = 'No catalog items loaded';
        if (productsEmptyCopy) productsEmptyCopy.textContent = 'Click Refresh to sync all ' + SKU_ORDER.length + ' REDPOLY SKUs from Firestore.';
      } else {
        if (productsEmptyTitle) productsEmptyTitle.textContent = 'No products match your filters';
        if (productsEmptyCopy) productsEmptyCopy.textContent = 'Try clearing your search or switching back to the All tab.';
      }
      return;
    }

    productsEmpty.hidden = true;
    productsTableWrap.hidden = false;
    productsFooter.hidden = false;
    var totalGroupCount = PRODUCT_GROUPS.length;
    productsShowingText.textContent = rows.length === allProducts.length
      ? ('Showing ' + groups.length + ' products (' + rows.length + ' SKUs)')
      : ('Showing ' + groups.length + ' of ' + totalGroupCount + ' products (' + rows.length + ' of ' + allProducts.length + ' SKUs)');

    groups.forEach(function (entry) {
      var grp = entry.group;
      var hasVariants = grp.skus.length > 1;
      if (!hasVariants && entry.items.length === 1) {
        productsTbody.appendChild(buildProductSkuRow(entry.items[0], { isVariant: false }));
        return;
      }
      var isExpanded = expandedProductGroups[grp.id] !== false;
      productsTbody.appendChild(buildProductGroupRow(entry, isExpanded));
      if (isExpanded) {
        entry.items.forEach(function (prod, idx) {
          var vLabel = grp.variantLabels && grp.variantLabels[prod.sku] ? grp.variantLabels[prod.sku] : prod.name;
          productsTbody.appendChild(buildProductSkuRow(prod, {
            isVariant: true,
            isLastVariant: idx === entry.items.length - 1,
            variantLabel: vLabel
          }));
        });
      }
    });
  }

  function renderProductComparisonRows() {
    if (!prodComparisonsList) return;
    prodComparisonsList.textContent = '';
    if (!draftComparisons.length) {
      var p = document.createElement('p');
      p.className = 'prod-comp-empty';
      p.textContent = 'No marketplace comparison prices added. Click "+ Add platform" to show tags like "₹749 on Amazon".';
      prodComparisonsList.appendChild(p);
      return;
    }
    draftComparisons.forEach(function (comp, idx) {
      var row = document.createElement('div');
      row.className = 'prod-comp-row';

      var platInput = document.createElement('input');
      platInput.type = 'text';
      platInput.maxLength = 32;
      platInput.placeholder = 'Platform (e.g. Amazon)';
      platInput.value = comp.platform || '';
      platInput.setAttribute('aria-label', 'Comparison platform ' + (idx + 1));
      platInput.addEventListener('input', function () {
        comp.platform = platInput.value;
      });

      var priceInput = document.createElement('input');
      priceInput.type = 'number';
      priceInput.min = '1';
      priceInput.max = '500000';
      priceInput.step = '1';
      priceInput.placeholder = 'Price (₹)';
      priceInput.value = comp.price ? String(comp.price) : '';
      priceInput.setAttribute('aria-label', 'Comparison price ' + (idx + 1));
      priceInput.addEventListener('input', function () {
        comp.price = Math.round(Number(priceInput.value || 0));
      });

      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn btn--danger-ghost btn--sm';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', function () {
        draftComparisons.splice(idx, 1);
        renderProductComparisonRows();
      });

      row.appendChild(platInput);
      row.appendChild(priceInput);
      row.appendChild(removeBtn);
      prodComparisonsList.appendChild(row);
    });
  }

  function updateProductMarginPreview() {
    if (!prodEditMarginPreview) return;
    prodEditMarginPreview.classList.remove('is-positive', 'is-loss');
    var sellVal = Number(prodEditPrice ? prodEditPrice.value : 0);
    var costRaw = prodEditCostPrice ? prodEditCostPrice.value.trim() : '';
    if (!costRaw) {
      prodEditMarginPreview.textContent = 'Enter cost price to preview profit per unit and margin for taxes.';
      return;
    }
    var costVal = Number(costRaw);
    if (!Number.isFinite(costVal) || costVal < 0 || !Number.isFinite(sellVal) || sellVal <= 0) {
      prodEditMarginPreview.textContent = 'Enter a valid selling price and cost price to preview margin.';
      return;
    }
    var grossProfit = Math.round((sellVal - costVal) * 100) / 100;
    var grossPct = Math.round(((grossProfit / sellVal) * 100) * 10) / 10;
    var exGstRevenue = Math.round((sellVal / (1 + GST_RATE / 100)) * 100) / 100;
    var netExGstProfit = Math.round((exGstRevenue - costVal) * 100) / 100;
    prodEditMarginPreview.classList.add(grossProfit > 0 ? 'is-positive' : 'is-loss');
    prodEditMarginPreview.textContent = '';
    var strongEl = document.createElement('strong');
    strongEl.textContent = (grossProfit >= 0 ? 'Profit: +' : 'Loss: −') + money(Math.abs(grossProfit)) + ' / unit (' + grossPct + '%)';
    prodEditMarginPreview.appendChild(strongEl);
    prodEditMarginPreview.appendChild(document.createTextNode(
      ' · Ex-' + GST_RATE + '% GST net: ' + money(exGstRevenue) + ' (' + (netExGstProfit >= 0 ? '+' : '−') + money(Math.abs(netExGstProfit)) + ' pre-tax)'
    ));
  }

  if (prodEditPrice) prodEditPrice.addEventListener('input', updateProductMarginPreview);
  if (prodEditCostPrice) prodEditCostPrice.addEventListener('input', updateProductMarginPreview);

  function fillProductDrawer(prod) {
    if (!prod) return;
    var stMeta = productStockMeta(prod);
    var grp = SKU_TO_GROUP[prod.sku];
    var vLabel = grp && grp.variantLabels && grp.variantLabels[prod.sku] ? grp.variantLabels[prod.sku] : '';
    if (productDrawerTitle) {
      productDrawerTitle.textContent = (grp && grp.skus.length > 1 && vLabel)
        ? (grp.name + ' · ' + vLabel)
        : prod.name;
    }
    if (productDrawerSku) {
      productDrawerSku.textContent = (grp && grp.skus.length > 1)
        ? ('Sub-product of ' + grp.name + ' · ' + prod.sku)
        : prod.sku;
    }
    if (productDrawerStockBadge) {
      productDrawerStockBadge.className = stMeta.badgeClass;
      productDrawerStockBadge.textContent = stMeta.label + ' · ' + prod.stock;
    }
    if (productDrawerStoreLink) productDrawerStoreLink.href = prod.href || '/';
    if (prodEditPrice) prodEditPrice.value = String(prod.price);
    if (prodEditCompareAt) prodEditCompareAt.value = prod.compareAtPrice > 0 ? String(prod.compareAtPrice) : '';
    if (prodEditCostPrice) prodEditCostPrice.value = (prod.costPrice != null && Number.isFinite(Number(prod.costPrice))) ? String(prod.costPrice) : '';
    updateProductMarginPreview();
    if (prodEditStock) prodEditStock.value = String(prod.stock);
    if (prodEditThreshold) prodEditThreshold.value = String(prod.lowStockThreshold);
    populateCategorySelectors();
    if (prodEditCategory) {
      var prodCatSlug = getProductCategorySlug(prod);
      if (!Array.prototype.some.call(prodEditCategory.options, function (o) { return o.value === prodCatSlug; })) {
        var extraOpt = document.createElement('option');
        extraOpt.value = prodCatSlug;
        extraOpt.textContent = prodCatSlug;
        prodEditCategory.appendChild(extraOpt);
      }
      prodEditCategory.value = prodCatSlug;
    }
    if (prodEditCategoryNote) {
      prodEditCategoryNote.textContent = (grp && grp.skus.length > 1)
        ? ('Changing category moves all ' + grp.skus.length + ' ' + grp.name + ' variants together on the storefront.')
        : 'Controls which category tab and shelf this toy appears under on the homepage.';
    }
    if (prodEditCardTag) prodEditCardTag.value = prod.cardTag || '';
    if (prodEditError) {
      prodEditError.hidden = true;
      prodEditError.textContent = '';
    }
    draftComparisons = (prod.priceComparisons || []).map(function (c) {
      return { platform: c.platform, price: c.price };
    });
    renderProductComparisonRows();
  }

  function openProductDrawer(prod, triggerEl, focusCostField) {
    if (!productDrawerLayer || !productDrawerEl) return;
    selectedProductSku = prod.sku;
    lastFocusedProductTrigger = triggerEl || null;
    fillProductDrawer(prod);
    renderProductsTable();
    productDrawerLayer.hidden = false;
    if (focusCostField && prodEditCostPrice) prodEditCostPrice.focus();
    else productDrawerEl.focus();
  }

  function closeProductDrawer() {
    if (!productDrawerLayer || productDrawerLayer.hidden) return;
    productDrawerLayer.hidden = true;
    selectedProductSku = null;
    renderProductsTable();
    if (lastFocusedProductTrigger && document.contains(lastFocusedProductTrigger)) {
      lastFocusedProductTrigger.focus();
    } else if (productsFilterTabs) {
      var activeTab = productsFilterTabs.querySelector('.orders-tab.is-active');
      if (activeTab) activeTab.focus();
    }
    lastFocusedProductTrigger = null;
  }

  if (productDrawerCloseBtn) productDrawerCloseBtn.addEventListener('click', closeProductDrawer);
  if (productDrawerCancelBtn) productDrawerCancelBtn.addEventListener('click', closeProductDrawer);
  if (productDrawerBackdrop) productDrawerBackdrop.addEventListener('click', closeProductDrawer);

  if (prodDrawerStockChips) {
    prodDrawerStockChips.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-stock-nudge]');
      if (!btn || !prodEditStock) return;
      var delta = Number(btn.getAttribute('data-stock-nudge') || 0);
      var cur = Math.max(0, Math.floor(Number(prodEditStock.value || 0)));
      prodEditStock.value = String(Math.max(0, Math.min(100000, cur + delta)));
    });
  }

  if (prodTagPresets) {
    prodTagPresets.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-tag-preset]');
      if (!btn || !prodEditCardTag) return;
      prodEditCardTag.value = btn.getAttribute('data-tag-preset') || '';
    });
  }

  if (prodAddCompBtn) {
    prodAddCompBtn.addEventListener('click', function () {
      if (draftComparisons.length >= 5) {
        showToast('Maximum 5 marketplace comparisons per product');
        return;
      }
      draftComparisons.push({ platform: '', price: 0 });
      renderProductComparisonRows();
    });
  }

  if (productEditForm) {
    productEditForm.addEventListener('submit', async function (ev) {
      ev.preventDefault();
      var prod = allProducts.find(function (p) { return p.sku === selectedProductSku; });
      if (!prod) return;

      if (prodEditError) {
        prodEditError.hidden = true;
        prodEditError.textContent = '';
      }

      var priceVal = Math.round(Number(prodEditPrice ? prodEditPrice.value : 0));
      var compareRaw = prodEditCompareAt && prodEditCompareAt.value.trim() ? Number(prodEditCompareAt.value) : 0;
      var compareVal = Math.max(0, Math.round(compareRaw));
      var costRawStr = prodEditCostPrice ? prodEditCostPrice.value.trim() : '';
      var hasCostInput = costRawStr !== '';
      var costVal = hasCostInput ? Math.round(Number(costRawStr) * 100) / 100 : null;
      var stockVal = Math.floor(Number(prodEditStock ? prodEditStock.value : 0));
      var thresholdVal = Math.floor(Number(prodEditThreshold ? prodEditThreshold.value : DEFAULT_LOW_STOCK_THRESHOLD));
      var tagVal = (prodEditCardTag ? prodEditCardTag.value : '').trim().slice(0, 32);

      if (!Number.isFinite(priceVal) || priceVal < 1 || priceVal > 500000) {
        if (prodEditError) {
          prodEditError.textContent = 'Enter a valid selling price between ₹1 and ₹5,00,000.';
          prodEditError.hidden = false;
        }
        return;
      }
      if (!Number.isFinite(compareVal) || compareVal < 0 || compareVal > 500000) {
        if (prodEditError) {
          prodEditError.textContent = 'Compare-at MRP must be between ₹0 and ₹5,00,000.';
          prodEditError.hidden = false;
        }
        return;
      }
      if (hasCostInput && (!Number.isFinite(costVal) || costVal < 0 || costVal > 500000)) {
        if (prodEditError) {
          prodEditError.textContent = 'Cost price must be between ₹0 and ₹5,00,000.';
          prodEditError.hidden = false;
        }
        return;
      }
      if (!Number.isFinite(stockVal) || stockVal < 0 || stockVal > 100000) {
        if (prodEditError) {
          prodEditError.textContent = 'Stock quantity must be between 0 and 1,00,000.';
          prodEditError.hidden = false;
        }
        return;
      }
      if (!Number.isFinite(thresholdVal) || thresholdVal < 0 || thresholdVal > 10000) {
        if (prodEditError) {
          prodEditError.textContent = 'Low-stock threshold must be between 0 and 10,000.';
          prodEditError.hidden = false;
        }
        return;
      }

      var cleanComparisons = [];
      for (var cIdx = 0; cIdx < draftComparisons.length && cleanComparisons.length < 5; cIdx += 1) {
        var comp = draftComparisons[cIdx];
        var plat = String(comp.platform || '').trim().slice(0, 32);
        var cPrice = Math.round(Number(comp.price || 0));
        if (!plat && !cPrice) continue;
        if (!plat || !Number.isFinite(cPrice) || cPrice < 1 || cPrice > 500000) {
          if (prodEditError) {
            prodEditError.textContent = 'Each marketplace comparison needs a platform name and a valid ₹ price.';
            prodEditError.hidden = false;
          }
          return;
        }
        cleanComparisons.push({ platform: plat, price: cPrice });
      }

      if (productDrawerSaveBtn) {
        productDrawerSaveBtn.disabled = true;
        productDrawerSaveBtn.textContent = 'Saving…';
      }

      try {
        var fb = await ensureDashboardFirebase();
        var nextCatSlug = prodEditCategory && prodEditCategory.value ? prodEditCategory.value.trim().toLowerCase() : getProductCategorySlug(prod);
        var prevCatSlug = getProductCategorySlug(prod);
        var updatePayload = {
          price: priceVal,
          compareAtPrice: compareVal,
          stock: stockVal,
          lowStockThreshold: thresholdVal,
          cardTag: tagVal,
          category: nextCatSlug,
          priceComparisons: cleanComparisons
        };
        if (hasCostInput) updatePayload.costPrice = costVal;
        var updated = await fb.updateProduct(prod.sku, updatePayload);
        upsertProductRecord(updated);
        var grpForSync = SKU_TO_GROUP[prod.sku];
        if (grpForSync && grpForSync.skus.length > 1 && nextCatSlug !== prevCatSlug) {
          var siblingSkus = grpForSync.skus.filter(function (s) { return s !== prod.sku; });
          if (siblingSkus.length) {
            var syncedSibs = await fb.assignProductsCategory(siblingSkus, nextCatSlug);
            syncedSibs.forEach(function (sib) {
              var sIdx = allProducts.findIndex(function (p) { return p.sku === sib.sku; });
              if (sIdx !== -1) allProducts[sIdx] = sib;
            });
            renderProductsTable();
          }
        }
        updateCategoryMetricsAndTabs();
        renderCategoriesTable();
        closeProductDrawer();
        showToast(updated.name + ' updated');
      } catch (err) {
        console.error(err);
        if (prodEditError) {
          prodEditError.textContent = err && err.message && err.message.charAt(0) !== '{'
            ? err.message
            : 'Could not save product changes. Ensure updated Firestore rules are published.';
          prodEditError.hidden = false;
        }
      } finally {
        if (productDrawerSaveBtn) {
          productDrawerSaveBtn.disabled = false;
          productDrawerSaveBtn.textContent = 'Save product';
        }
      }
    });
  }

  function expandMultiVariantGroups() {
    PRODUCT_GROUPS.forEach(function (grp) {
      if (grp.skus.length > 1) expandedProductGroups[grp.id] = true;
    });
  }

  if (productsFilterTabs) {
    productsFilterTabs.addEventListener('click', function (ev) {
      var tab = ev.target.closest('[data-product-filter]');
      if (!tab) return;
      productFilter = tab.getAttribute('data-product-filter') || 'all';
      if (productFilter !== 'all') expandMultiVariantGroups();
      Array.prototype.forEach.call(productsFilterTabs.querySelectorAll('.orders-tab'), function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      renderProductsTable();
    });
  }

  if (productsSearchInput) {
    productsSearchInput.addEventListener('input', function () {
      productSearchQuery = productsSearchInput.value || '';
      if (productSearchQuery.trim()) expandMultiVariantGroups();
      if (productsSearchClear) productsSearchClear.hidden = !productSearchQuery;
      renderProductsTable();
    });
  }

  if (productsSearchClear) {
    productsSearchClear.addEventListener('click', function () {
      productSearchQuery = '';
      if (productsSearchInput) { productsSearchInput.value = ''; productsSearchInput.focus(); }
      productsSearchClear.hidden = true;
      renderProductsTable();
    });
  }

  if (productsCategoryFilter) {
    productsCategoryFilter.addEventListener('change', function () {
      productCategoryFilter = productsCategoryFilter.value || 'all';
      if (productCategoryFilter !== 'all') expandMultiVariantGroups();
      renderProductsTable();
    });
  }

  if (productsSortSelect) {
    productsSortSelect.addEventListener('change', function () {
      productSortMode = productsSortSelect.value || 'catalog';
      renderProductsTable();
    });
  }

  if (productsResetBtn) {
    productsResetBtn.addEventListener('click', function () {
      productFilter = 'all';
      productCategoryFilter = 'all';
      productSearchQuery = '';
      if (productsSearchInput) productsSearchInput.value = '';
      if (productsSearchClear) productsSearchClear.hidden = true;
      if (productsCategoryFilter) productsCategoryFilter.value = 'all';
      if (productsFilterTabs) {
        Array.prototype.forEach.call(productsFilterTabs.querySelectorAll('.orders-tab'), function (t) {
          var isAll = t.getAttribute('data-product-filter') === 'all';
          t.classList.toggle('is-active', isAll);
          t.setAttribute('aria-selected', isAll ? 'true' : 'false');
        });
      }
      renderProductsTable();
    });
  }

  // ---------- CATEGORIES MANAGEMENT VIEW ----------
  function slugifyCategoryInput(raw) {
    return String(raw || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
  }

  function normalizeAccentHex(raw) {
    var v = String(raw || '').trim();
    if (!v) return '#171512';
    if (v.charAt(0) !== '#') v = '#' + v;
    return CATEGORY_HEX_RE.test(v) ? v.toUpperCase() : '#171512';
  }

  function sortCategoriesInPlace() {
    allCategories.sort(function (a, b) {
      return (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0) || String(a.name || '').localeCompare(String(b.name || ''));
    });
  }

  function updateCategoryMetricsAndTabs() {
    var total = allCategories.length;
    var visibleCount = allCategories.filter(function (c) { return c.visible !== false; }).length;
    var hiddenCount = total - visibleCount;
    var validSlugSet = {};
    allCategories.forEach(function (c) { validSlugSet[c.slug] = true; });
    var categorizedGroups = PRODUCT_GROUPS.filter(function (grp) {
      return Boolean(validSlugSet[getGroupCategorySlug(grp)]);
    }).length;

    if (sidebarCategoriesCount) sidebarCategoriesCount.textContent = String(total);
    if (metricTotalCategories) metricTotalCategories.textContent = String(total);
    if (metricVisibleCategories) metricVisibleCategories.textContent = String(visibleCount);
    if (metricHiddenCategories) metricHiddenCategories.textContent = String(hiddenCount);
    if (metricCategorizedToys) metricCategorizedToys.textContent = categorizedGroups + ' / ' + PRODUCT_GROUPS.length;

    if (catTabAll) catTabAll.textContent = String(total);
    if (catTabVisible) catTabVisible.textContent = String(visibleCount);
    if (catTabHidden) catTabHidden.textContent = String(hiddenCount);
  }

  function filteredCategories() {
    var q = categorySearchQuery.trim().toLowerCase();
    return allCategories.filter(function (c) {
      if (categoryFilter === 'visible' && c.visible === false) return false;
      if (categoryFilter === 'hidden' && c.visible !== false) return false;
      if (!q) return true;
      var assigned = getGroupsInCategory(c.slug).map(function (g) { return g.name; }).join(' ');
      var hay = [c.name, c.slug, c.shortDesc, c.shelfDesc, assigned].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }

  async function moveCategoryOrder(slug, delta) {
    sortCategoriesInPlace();
    var idx = allCategories.findIndex(function (c) { return c.slug === slug; });
    var nextIdx = idx + delta;
    if (idx === -1 || nextIdx < 0 || nextIdx >= allCategories.length) return;
    var copy = allCategories.slice();
    var swapped = copy[idx];
    copy[idx] = copy[nextIdx];
    copy[nextIdx] = swapped;
    var orderedSlugs = copy.map(function (c) { return c.slug; });
    copy.forEach(function (c, i) { c.sortOrder = i + 1; });
    allCategories = copy;
    renderCategoriesTable();
    try {
      var fb = await ensureDashboardFirebase();
      await fb.reorderCategories(orderedSlugs);
      populateCategorySelectors();
      showToast('Category order updated');
    } catch (err) {
      console.error(err);
      showToast(err && err.message && err.message.charAt(0) !== '{' ? err.message : 'Could not save category order');
      loadAllCategories(true);
    }
  }

  async function toggleCategoryVisibility(cat, btnEl) {
    if (btnEl) btnEl.disabled = true;
    try {
      var fb = await ensureDashboardFirebase();
      var saved = await fb.saveCategory({
        slug: cat.slug,
        name: cat.name,
        shortDesc: cat.shortDesc || '',
        shelfDesc: cat.shelfDesc || '',
        accentColor: cat.accentColor || '#171512',
        sortOrder: Number(cat.sortOrder || 1),
        visible: cat.visible === false,
        thumbnailUrl: cat.thumbnailUrl || ''
      });
      var idx = allCategories.findIndex(function (c) { return c.slug === saved.slug; });
      if (idx !== -1) allCategories[idx] = saved;
      updateCategoryMetricsAndTabs();
      populateCategorySelectors();
      renderCategoriesTable();
      renderProductsTable();
      showToast(saved.name + (saved.visible ? ' is now visible on storefront' : ' hidden from storefront'));
    } catch (err) {
      console.error(err);
      showToast(err && err.message && err.message.charAt(0) !== '{' ? err.message : 'Could not update visibility');
    } finally {
      if (btnEl) btnEl.disabled = false;
    }
  }

  function renderCategoriesTable() {
    if (!categoriesTbody || !categoriesTableWrap || !categoriesEmpty || !categoriesSkeleton || !categoriesFooter) return;
    categoriesSkeleton.hidden = !categoriesLoading;
    if (categoriesLoading) {
      categoriesTableWrap.hidden = true;
      categoriesEmpty.hidden = true;
      categoriesFooter.hidden = true;
      return;
    }

    sortCategoriesInPlace();
    var rows = filteredCategories();
    categoriesTbody.textContent = '';

    if (!rows.length) {
      categoriesTableWrap.hidden = true;
      categoriesFooter.hidden = true;
      categoriesEmpty.hidden = false;
      if (!allCategories.length) {
        if (categoriesEmptyTitle) categoriesEmptyTitle.textContent = 'No categories configured';
        if (categoriesEmptyCopy) categoriesEmptyCopy.textContent = 'Click "+ New category" or "Restore defaults" to set up storefront collections.';
      } else {
        if (categoriesEmptyTitle) categoriesEmptyTitle.textContent = 'No categories match your filter';
        if (categoriesEmptyCopy) categoriesEmptyCopy.textContent = 'Try clearing your search or switching back to All.';
      }
      return;
    }

    categoriesEmpty.hidden = true;
    categoriesTableWrap.hidden = false;
    categoriesFooter.hidden = false;
    categoriesShowingText.textContent = rows.length === allCategories.length
      ? ('Showing ' + rows.length + (rows.length === 1 ? ' category' : ' categories'))
      : ('Showing ' + rows.length + ' of ' + allCategories.length + ' categories');

    var canReorder = categoryFilter === 'all' && !categorySearchQuery.trim();

    rows.forEach(function (cat, idx) {
      var tr = document.createElement('tr');
      if (editingCategorySlug && cat.slug === editingCategorySlug && categoryDrawerLayer && !categoryDrawerLayer.hidden) {
        tr.classList.add('is-selected');
      }

      var tdOrder = document.createElement('td');
      var orderWrap = document.createElement('div');
      orderWrap.className = 'cat-order-cell';
      var orderNum = document.createElement('span');
      orderNum.className = 'cat-order-num';
      orderNum.textContent = String(cat.sortOrder != null ? cat.sortOrder : idx + 1).padStart(2, '0');
      orderWrap.appendChild(orderNum);

      var orderBtns = document.createElement('div');
      orderBtns.className = 'cat-order-btns';
      var upBtn = document.createElement('button');
      upBtn.type = 'button';
      upBtn.className = 'cat-order-btn';
      upBtn.textContent = '↑';
      upBtn.disabled = !canReorder || idx === 0;
      upBtn.setAttribute('aria-label', 'Move ' + cat.name + ' up');
      upBtn.addEventListener('click', function () { moveCategoryOrder(cat.slug, -1); });

      var downBtn = document.createElement('button');
      downBtn.type = 'button';
      downBtn.className = 'cat-order-btn';
      downBtn.textContent = '↓';
      downBtn.disabled = !canReorder || idx === rows.length - 1;
      downBtn.setAttribute('aria-label', 'Move ' + cat.name + ' down');
      downBtn.addEventListener('click', function () { moveCategoryOrder(cat.slug, 1); });

      orderBtns.appendChild(upBtn);
      orderBtns.appendChild(downBtn);
      orderWrap.appendChild(orderBtns);
      tdOrder.appendChild(orderWrap);

      var tdName = document.createElement('td');
      var nameWrap = document.createElement('div');
      nameWrap.className = 'cat-name-cell';
      var bar = document.createElement('span');
      bar.className = 'cat-accent-bar';
      bar.style.background = cat.accentColor || '#171512';
      nameWrap.appendChild(bar);
      var nameCopy = document.createElement('div');
      nameCopy.className = 'cat-name-copy';
      var titleEl = document.createElement('strong');
      titleEl.textContent = cat.name;
      if (cat.thumbnailUrl) {
        var imgPill = document.createElement('span');
        imgPill.className = 'prod-variant-pill';
        imgPill.textContent = 'Image';
        titleEl.appendChild(imgPill);
      }
      var slugEl = document.createElement('span');
      slugEl.className = 'cat-slug-mono';
      slugEl.textContent = '/' + cat.slug;
      nameCopy.appendChild(titleEl);
      nameCopy.appendChild(slugEl);
      nameWrap.appendChild(nameCopy);
      tdName.appendChild(nameWrap);

      var tdCopy = document.createElement('td');
      tdCopy.className = 'cat-copy-cell';
      var shortEl = document.createElement('span');
      shortEl.className = 'cat-copy-short';
      shortEl.textContent = cat.shortDesc || 'No card description';
      tdCopy.appendChild(shortEl);
      if (cat.shelfDesc) {
        var shelfEl = document.createElement('span');
        shelfEl.className = 'cat-copy-shelf';
        shelfEl.textContent = cat.shelfDesc;
        tdCopy.appendChild(shelfEl);
      }

      var assignedGroups = getGroupsInCategory(cat.slug);
      var tdToys = document.createElement('td');
      tdToys.className = 'cat-toys-cell';
      var countEl = document.createElement('span');
      countEl.className = 'cat-toys-count';
      countEl.textContent = assignedGroups.length + (assignedGroups.length === 1 ? ' toy' : ' toys');
      tdToys.appendChild(countEl);
      var namesEl = document.createElement('span');
      namesEl.className = 'cat-toys-names';
      namesEl.textContent = assignedGroups.length
        ? assignedGroups.map(function (g) { return g.name; }).join(', ')
        : 'No toys assigned yet';
      tdToys.appendChild(namesEl);

      var tdVis = document.createElement('td');
      var visBtn = document.createElement('button');
      visBtn.type = 'button';
      visBtn.className = 'cat-vis-btn';
      visBtn.title = 'Click to toggle storefront visibility';
      var visBadge = document.createElement('span');
      visBadge.className = cat.visible !== false ? 'status-badge status-badge--fulfilled' : 'status-badge status-badge--neutral';
      visBadge.textContent = cat.visible !== false ? 'Visible' : 'Hidden';
      visBtn.appendChild(visBadge);
      visBtn.addEventListener('click', function () { toggleCategoryVisibility(cat, visBtn); });
      tdVis.appendChild(visBtn);

      var tdAct = document.createElement('td');
      tdAct.className = 'col-num';
      var editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn btn--secondary btn--sm';
      editBtn.textContent = 'Edit';
      editBtn.setAttribute('aria-label', 'Edit ' + cat.name + ' category');
      editBtn.addEventListener('click', function () { openCategoryDrawer(cat, editBtn); });
      tdAct.appendChild(editBtn);

      tr.appendChild(tdOrder);
      tr.appendChild(tdName);
      tr.appendChild(tdCopy);
      tr.appendChild(tdToys);
      tr.appendChild(tdVis);
      tr.appendChild(tdAct);
      categoriesTbody.appendChild(tr);
    });
  }

  function setCategoryColorInputs(hexRaw) {
    var hex = normalizeAccentHex(hexRaw);
    if (catEditColorPicker) catEditColorPicker.value = hex;
    if (catEditColor) catEditColor.value = hex;
    if (catColorSwatches) {
      Array.prototype.forEach.call(catColorSwatches.querySelectorAll('.cat-swatch'), function (btn) {
        var c = String(btn.getAttribute('data-cat-color') || '').toUpperCase();
        btn.classList.toggle('is-active', c === hex);
      });
    }
  }

  function updateCategoryDrawerAssignedCount() {
    if (!catEditProductsList || !catEditAssignedCount) return;
    var checked = catEditProductsList.querySelectorAll('input[type="checkbox"]:checked').length;
    catEditAssignedCount.textContent = checked + ' selected';
  }

  function renderCategoryAssignList(targetSlug) {
    if (!catEditProductsList) return;
    catEditProductsList.textContent = '';
    PRODUCT_GROUPS.forEach(function (grp) {
      var curSlug = getGroupCategorySlug(grp);
      var isAssigned = Boolean(targetSlug && curSlug === targetSlug);
      var curCat = getCategoryBySlug(curSlug);

      var row = document.createElement('label');
      row.className = 'cat-assign-item' + (isAssigned ? ' is-checked' : '');

      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = grp.id;
      cb.checked = isAssigned;
      cb.addEventListener('change', function () {
        row.classList.toggle('is-checked', cb.checked);
        updateCategoryDrawerAssignedCount();
      });
      row.appendChild(cb);

      if (grp.image) {
        var img = document.createElement('img');
        img.className = 'cat-assign-item__img';
        img.src = grp.image;
        img.alt = '';
        img.loading = 'lazy';
        row.appendChild(img);
      }

      var copy = document.createElement('div');
      copy.className = 'cat-assign-item__copy';
      var strong = document.createElement('strong');
      strong.textContent = grp.name;
      var small = document.createElement('small');
      small.textContent = grp.skus.length > 1 ? (grp.skus.length + ' variants synced together') : grp.id;
      copy.appendChild(strong);
      copy.appendChild(small);
      row.appendChild(copy);

      var badge = document.createElement('span');
      badge.className = 'cat-assign-item__badge';
      badge.textContent = isAssigned ? 'In this category' : ('Currently: ' + (curCat ? curCat.name : curSlug));
      row.appendChild(badge);

      catEditProductsList.appendChild(row);
    });
    updateCategoryDrawerAssignedCount();
  }

  function openCategoryDrawer(catOrNull, triggerEl) {
    if (!categoryDrawerLayer || !categoryDrawerEl) return;
    isCreatingCategory = !catOrNull;
    editingCategorySlug = catOrNull ? catOrNull.slug : null;
    categorySlugManuallyEdited = false;
    pendingDeleteCategorySlug = null;
    lastFocusedCategoryTrigger = triggerEl || null;

    if (catEditError) {
      catEditError.hidden = true;
      catEditError.textContent = '';
    }

    if (isCreatingCategory) {
      var nextOrder = allCategories.length ? Math.max.apply(null, allCategories.map(function (c) { return Number(c.sortOrder || 0); })) + 1 : 1;
      if (categoryDrawerTitle) categoryDrawerTitle.textContent = 'New category';
      if (categoryDrawerSlugSub) categoryDrawerSlugSub.textContent = 'Creates a live storefront tab & shelf';
      if (categoryDrawerVisBadge) {
        categoryDrawerVisBadge.className = 'status-badge status-badge--fulfilled';
        categoryDrawerVisBadge.textContent = 'Visible';
      }
      if (catEditName) catEditName.value = '';
      if (catEditSlug) {
        catEditSlug.value = '';
        catEditSlug.disabled = false;
      }
      if (catSlugHelp) catSlugHelp.textContent = 'Lowercase letters, numbers, and hyphens (auto-filled from name).';
      setCategoryColorInputs('#FF6B1A');
      if (catEditShortDesc) catEditShortDesc.value = '';
      if (catEditShelfDesc) catEditShelfDesc.value = '';
      if (catEditOrder) catEditOrder.value = String(Math.min(999, nextOrder));
      if (catEditVisible) catEditVisible.checked = true;
      if (catEditThumb) catEditThumb.value = '';
      if (catDangerSection) catDangerSection.hidden = true;
      if (categoryDrawerSaveBtn) categoryDrawerSaveBtn.textContent = 'Create category';
      renderCategoryAssignList('');
    } else {
      if (categoryDrawerTitle) categoryDrawerTitle.textContent = 'Edit ' + catOrNull.name;
      if (categoryDrawerSlugSub) categoryDrawerSlugSub.textContent = '/' + catOrNull.slug;
      if (categoryDrawerVisBadge) {
        categoryDrawerVisBadge.className = catOrNull.visible !== false ? 'status-badge status-badge--fulfilled' : 'status-badge status-badge--neutral';
        categoryDrawerVisBadge.textContent = catOrNull.visible !== false ? 'Visible' : 'Hidden';
      }
      if (catEditName) catEditName.value = catOrNull.name || '';
      if (catEditSlug) {
        catEditSlug.value = catOrNull.slug || '';
        catEditSlug.disabled = true;
      }
      if (catSlugHelp) catSlugHelp.textContent = 'URL slug is fixed after creation to preserve storefront links.';
      setCategoryColorInputs(catOrNull.accentColor || '#171512');
      if (catEditShortDesc) catEditShortDesc.value = catOrNull.shortDesc || '';
      if (catEditShelfDesc) catEditShelfDesc.value = catOrNull.shelfDesc || '';
      if (catEditOrder) catEditOrder.value = String(catOrNull.sortOrder != null ? catOrNull.sortOrder : 1);
      if (catEditVisible) catEditVisible.checked = catOrNull.visible !== false;
      if (catEditThumb) catEditThumb.value = catOrNull.thumbnailUrl || '';
      if (categoryDrawerSaveBtn) categoryDrawerSaveBtn.textContent = 'Save category';
      renderCategoryAssignList(catOrNull.slug);

      var otherCats = allCategories.filter(function (c) { return c.slug !== catOrNull.slug; });
      if (catDangerSection) catDangerSection.hidden = false;
      if (catDeleteReassign) {
        catDeleteReassign.textContent = '';
        otherCats.forEach(function (oc) {
          var opt = document.createElement('option');
          opt.value = oc.slug;
          opt.textContent = oc.name;
          catDeleteReassign.appendChild(opt);
        });
        catDeleteReassign.disabled = !otherCats.length;
      }
      if (catDeleteBtn) {
        catDeleteBtn.disabled = !otherCats.length;
        catDeleteBtn.textContent = otherCats.length ? 'Delete category' : 'Keep at least 1 category';
      }
    }

    renderCategoriesTable();
    categoryDrawerLayer.hidden = false;
    if (catEditName) catEditName.focus();
    else categoryDrawerEl.focus();
  }

  function closeCategoryDrawer() {
    if (!categoryDrawerLayer || categoryDrawerLayer.hidden) return;
    categoryDrawerLayer.hidden = true;
    editingCategorySlug = null;
    isCreatingCategory = false;
    pendingDeleteCategorySlug = null;
    renderCategoriesTable();
    if (lastFocusedCategoryTrigger && document.contains(lastFocusedCategoryTrigger)) {
      lastFocusedCategoryTrigger.focus();
    }
    lastFocusedCategoryTrigger = null;
  }

  if (categoryDrawerCloseBtn) categoryDrawerCloseBtn.addEventListener('click', closeCategoryDrawer);
  if (categoryDrawerCancelBtn) categoryDrawerCancelBtn.addEventListener('click', closeCategoryDrawer);
  if (categoryDrawerBackdrop) categoryDrawerBackdrop.addEventListener('click', closeCategoryDrawer);

  if (catEditName) {
    catEditName.addEventListener('input', function () {
      if (isCreatingCategory && !categorySlugManuallyEdited && catEditSlug) {
        catEditSlug.value = slugifyCategoryInput(catEditName.value);
      }
    });
  }
  if (catEditSlug) {
    catEditSlug.addEventListener('input', function () {
      if (isCreatingCategory) categorySlugManuallyEdited = true;
    });
  }
  if (catEditColorPicker) {
    catEditColorPicker.addEventListener('input', function () {
      setCategoryColorInputs(catEditColorPicker.value);
    });
  }
  if (catEditColor) {
    catEditColor.addEventListener('change', function () {
      setCategoryColorInputs(catEditColor.value);
    });
  }
  if (catColorSwatches) {
    catColorSwatches.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-cat-color]');
      if (!btn) return;
      setCategoryColorInputs(btn.getAttribute('data-cat-color') || '#171512');
    });
  }
  if (catEditVisible) {
    catEditVisible.addEventListener('change', function () {
      if (categoryDrawerVisBadge) {
        categoryDrawerVisBadge.className = catEditVisible.checked ? 'status-badge status-badge--fulfilled' : 'status-badge status-badge--neutral';
        categoryDrawerVisBadge.textContent = catEditVisible.checked ? 'Visible' : 'Hidden';
      }
    });
  }

  if (categoryEditForm) {
    categoryEditForm.addEventListener('submit', async function (ev) {
      ev.preventDefault();
      if (catEditError) {
        catEditError.hidden = true;
        catEditError.textContent = '';
      }

      var nameVal = (catEditName ? catEditName.value : '').trim().slice(0, 60);
      var slugVal = isCreatingCategory
        ? slugifyCategoryInput(catEditSlug ? catEditSlug.value : nameVal)
        : String(editingCategorySlug || '');
      var colorVal = normalizeAccentHex(catEditColor ? catEditColor.value : (catEditColorPicker ? catEditColorPicker.value : '#171512'));
      var shortDescVal = (catEditShortDesc ? catEditShortDesc.value : '').trim().slice(0, 140);
      var shelfDescVal = (catEditShelfDesc ? catEditShelfDesc.value : '').trim().slice(0, 220);
      var orderVal = Math.max(0, Math.min(999, Math.floor(Number(catEditOrder ? catEditOrder.value : 1))));
      var visibleVal = catEditVisible ? Boolean(catEditVisible.checked) : true;
      var thumbVal = (catEditThumb ? catEditThumb.value : '').trim().slice(0, 300);

      if (!nameVal) {
        if (catEditError) { catEditError.textContent = 'Enter a category name.'; catEditError.hidden = false; }
        return;
      }
      if (!slugVal || !CATEGORY_SLUG_RE.test(slugVal)) {
        if (catEditError) { catEditError.textContent = 'Enter a valid lowercase URL slug (e.g. guns, rc-cars).'; catEditError.hidden = false; }
        return;
      }
      if (isCreatingCategory && allCategories.some(function (c) { return c.slug === slugVal; })) {
        if (catEditError) { catEditError.textContent = 'A category with slug "' + slugVal + '" already exists.'; catEditError.hidden = false; }
        return;
      }
      if (thumbVal && !(/^(\/|https?:\/\/)/.test(thumbVal))) {
        if (catEditError) { catEditError.textContent = 'Thumbnail URL must start with / or https:// (or leave blank).'; catEditError.hidden = false; }
        return;
      }

      var checkedGroupIds = {};
      if (catEditProductsList) {
        Array.prototype.forEach.call(catEditProductsList.querySelectorAll('input[type="checkbox"]:checked'), function (cb) {
          checkedGroupIds[cb.value] = true;
        });
      }

      if (categoryDrawerSaveBtn) {
        categoryDrawerSaveBtn.disabled = true;
        categoryDrawerSaveBtn.textContent = 'Saving…';
      }

      try {
        var fb = await ensureDashboardFirebase();
        var saved = await fb.saveCategory({
          slug: slugVal,
          name: nameVal,
          shortDesc: shortDescVal,
          shelfDesc: shelfDescVal,
          accentColor: colorVal,
          sortOrder: Number.isFinite(orderVal) ? orderVal : 1,
          visible: visibleVal,
          thumbnailUrl: thumbVal
        });

        var existingIdx = allCategories.findIndex(function (c) { return c.slug === saved.slug; });
        if (existingIdx !== -1) allCategories[existingIdx] = saved;
        else allCategories.push(saved);

        // Sync assigned toys
        var skusToAssign = [];
        var skusToReassignAway = [];
        PRODUCT_GROUPS.forEach(function (grp) {
          var currentlyIn = getGroupCategorySlug(grp) === saved.slug;
          var wantIn = Boolean(checkedGroupIds[grp.id]);
          if (wantIn && !currentlyIn) {
            grp.skus.forEach(function (s) { skusToAssign.push(s); });
          } else if (!wantIn && currentlyIn) {
            grp.skus.forEach(function (s) { skusToReassignAway.push(s); });
          }
        });

        if (skusToAssign.length) {
          var movedIn = await fb.assignProductsCategory(skusToAssign, saved.slug);
          movedIn.forEach(function (u) {
            var pIdx = allProducts.findIndex(function (p) { return p.sku === u.sku; });
            if (pIdx !== -1) allProducts[pIdx] = u;
          });
        }
        if (skusToReassignAway.length) {
          var fallbackCat = allCategories.find(function (c) { return c.slug !== saved.slug && c.visible !== false; })
            || allCategories.find(function (c) { return c.slug !== saved.slug; });
          if (fallbackCat) {
            var movedOut = await fb.assignProductsCategory(skusToReassignAway, fallbackCat.slug);
            movedOut.forEach(function (u) {
              var pIdx = allProducts.findIndex(function (p) { return p.sku === u.sku; });
              if (pIdx !== -1) allProducts[pIdx] = u;
            });
          }
        }

        sortCategoriesInPlace();
        populateCategorySelectors();
        updateCategoryMetricsAndTabs();
        renderCategoriesTable();
        renderProductsTable();
        closeCategoryDrawer();
        showToast(saved.name + ' category saved');
      } catch (err) {
        console.error(err);
        if (catEditError) {
          catEditError.textContent = err && err.message && err.message.charAt(0) !== '{'
            ? err.message
            : 'Could not save category. Ensure updated Firestore rules are published.';
          catEditError.hidden = false;
        }
      } finally {
        if (categoryDrawerSaveBtn) {
          categoryDrawerSaveBtn.disabled = false;
          categoryDrawerSaveBtn.textContent = isCreatingCategory ? 'Create category' : 'Save category';
        }
      }
    });
  }

  if (catDeleteBtn) {
    catDeleteBtn.addEventListener('click', async function () {
      if (!editingCategorySlug || isCreatingCategory) return;
      var targetSlug = editingCategorySlug;
      var reassignSlug = catDeleteReassign ? catDeleteReassign.value : '';
      if (!reassignSlug || reassignSlug === targetSlug) {
        showToast('Select another category to move assigned toys to');
        return;
      }
      if (pendingDeleteCategorySlug !== targetSlug) {
        pendingDeleteCategorySlug = targetSlug;
        catDeleteBtn.textContent = 'Confirm delete';
        window.setTimeout(function () {
          if (pendingDeleteCategorySlug === targetSlug) {
            pendingDeleteCategorySlug = null;
            if (catDeleteBtn) catDeleteBtn.textContent = 'Delete category';
          }
        }, 4000);
        return;
      }
      pendingDeleteCategorySlug = null;
      catDeleteBtn.disabled = true;
      catDeleteBtn.textContent = 'Deleting…';
      try {
        var fb = await ensureDashboardFirebase();
        await fb.deleteCategory(targetSlug, reassignSlug);
        allCategories = allCategories.filter(function (c) { return c.slug !== targetSlug; });
        allProducts = allProducts.map(function (p) {
          return getProductCategorySlug(p) === targetSlug ? Object.assign({}, p, { category: reassignSlug }) : p;
        });
        populateCategorySelectors();
        updateCategoryMetricsAndTabs();
        renderCategoriesTable();
        renderProductsTable();
        closeCategoryDrawer();
        showToast('Category deleted');
      } catch (err) {
        console.error(err);
        if (catEditError) {
          catEditError.textContent = err && err.message && err.message.charAt(0) !== '{' ? err.message : 'Could not delete category.';
          catEditError.hidden = false;
        }
      } finally {
        catDeleteBtn.disabled = false;
        catDeleteBtn.textContent = 'Delete category';
      }
    });
  }

  if (categoriesNewBtn) {
    categoriesNewBtn.addEventListener('click', function () {
      openCategoryDrawer(null, categoriesNewBtn);
    });
  }

  if (categoriesResetDefaultsBtn) {
    categoriesResetDefaultsBtn.addEventListener('click', async function () {
      if (!pendingRestoreDefaultsConfirm) {
        pendingRestoreDefaultsConfirm = true;
        categoriesResetDefaultsBtn.textContent = 'Confirm restore?';
        window.setTimeout(function () {
          if (pendingRestoreDefaultsConfirm) {
            pendingRestoreDefaultsConfirm = false;
            if (categoriesResetDefaultsBtn) categoriesResetDefaultsBtn.textContent = 'Restore defaults';
          }
        }, 4000);
        return;
      }
      pendingRestoreDefaultsConfirm = false;
      categoriesResetDefaultsBtn.disabled = true;
      categoriesResetDefaultsBtn.textContent = 'Restoring…';
      try {
        var fb = await ensureDashboardFirebase();
        allCategories = await fb.resetDefaultCategories();
        categoriesLoadedOnce = true;
        populateCategorySelectors();
        updateCategoryMetricsAndTabs();
        renderCategoriesTable();
        renderProductsTable();
        showToast('Default categories restored');
      } catch (err) {
        console.error(err);
        showToast(err && err.message && err.message.charAt(0) !== '{' ? err.message : 'Could not restore defaults');
      } finally {
        categoriesResetDefaultsBtn.disabled = false;
        categoriesResetDefaultsBtn.textContent = 'Restore defaults';
      }
    });
  }

  if (categoriesFilterTabs) {
    categoriesFilterTabs.addEventListener('click', function (ev) {
      var tab = ev.target.closest('[data-cat-filter]');
      if (!tab) return;
      categoryFilter = tab.getAttribute('data-cat-filter') || 'all';
      Array.prototype.forEach.call(categoriesFilterTabs.querySelectorAll('.orders-tab'), function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      renderCategoriesTable();
    });
  }

  if (categoriesSearchInput) {
    categoriesSearchInput.addEventListener('input', function () {
      categorySearchQuery = categoriesSearchInput.value || '';
      if (categoriesSearchClear) categoriesSearchClear.hidden = !categorySearchQuery;
      renderCategoriesTable();
    });
  }

  if (categoriesSearchClear) {
    categoriesSearchClear.addEventListener('click', function () {
      categorySearchQuery = '';
      if (categoriesSearchInput) { categoriesSearchInput.value = ''; categoriesSearchInput.focus(); }
      categoriesSearchClear.hidden = true;
      renderCategoriesTable();
    });
  }

  if (categoriesClearFilterBtn) {
    categoriesClearFilterBtn.addEventListener('click', function () {
      categoryFilter = 'all';
      categorySearchQuery = '';
      if (categoriesSearchInput) categoriesSearchInput.value = '';
      if (categoriesSearchClear) categoriesSearchClear.hidden = true;
      if (categoriesFilterTabs) {
        Array.prototype.forEach.call(categoriesFilterTabs.querySelectorAll('.orders-tab'), function (t) {
          var isAll = t.getAttribute('data-cat-filter') === 'all';
          t.classList.toggle('is-active', isAll);
          t.setAttribute('aria-selected', isAll ? 'true' : 'false');
        });
      }
      renderCategoriesTable();
    });
  }

  async function loadAllCategories(force) {
    var fb = await ensureDashboardFirebase();
    var user = fb.getUser();
    if (!isCurrentAdmin(user)) return;
    if (categoriesLoading && !force) return;

    categoriesLoading = true;
    if (refreshBtn) refreshBtn.disabled = true;
    if (categoriesErrorBanner) categoriesErrorBanner.hidden = true;
    renderCategoriesTable();

    try {
      allCategories = await fb.listAllCategories();
      categoriesLoadedOnce = true;
      sortCategoriesInPlace();
      populateCategorySelectors();
      updateCategoryMetricsAndTabs();
      renderProductsTable();
    } catch (err) {
      console.error(err);
      if (categoriesErrorText) categoriesErrorText.textContent = 'Could not load categories from Firestore. Ensure updated Firestore rules are published.';
      if (categoriesErrorBanner) categoriesErrorBanner.hidden = false;
    } finally {
      categoriesLoading = false;
      if (refreshBtn) refreshBtn.disabled = false;
      renderCategoriesTable();
    }
  }

  // ---------- CUSTOMERS DIRECTORY VIEW ----------
  function buildMergedCustomers() {
    var byUid = {};
    var byEmail = {};
    var orderStatsByUid = {};
    var orderStatsByEmail = {};

    function addOrderStat(bucket, key, order) {
      if (!key) return;
      if (!bucket[key]) {
        bucket[key] = { count: 0, activeCount: 0, spent: 0, latestOrderMs: 0, lastRef: '' };
      }
      var s = bucket[key];
      s.count += 1;
      if (order.status !== 'cancelled') {
        s.activeCount += 1;
        s.spent += Number(order.total || 0);
      }
      if ((order.createdAtMs || 0) >= s.latestOrderMs) {
        s.latestOrderMs = Number(order.createdAtMs || 0);
        s.lastRef = String(order.reference || '');
      }
    }

    (allOrders || []).forEach(function (o) {
      if (o.uid) addOrderStat(orderStatsByUid, o.uid, o);
      var em = String(o.email || '').trim().toLowerCase();
      if (em) addOrderStat(orderStatsByEmail, em, o);
    });

    var customers = [];
    (rawCustomersData.accounts || []).forEach(function (acc) {
      var emailNorm = String(acc.email || '').trim().toLowerCase();
      var stat = orderStatsByUid[acc.uid] || (emailNorm ? orderStatsByEmail[emailNorm] : null) || {
        count: 0, activeCount: 0, spent: 0, latestOrderMs: 0, lastRef: ''
      };
      var record = {
        key: 'uid:' + acc.uid,
        uid: acc.uid,
        name: String(acc.fullName || acc.displayName || (emailNorm ? emailNorm.split('@')[0] : 'REDPOLY Member')),
        email: emailNorm,
        photoURL: acc.photoURL || '',
        hasAccount: true,
        isCrewMember: false,
        crewSource: '',
        phone: String(acc.phone || ''),
        city: String(acc.city || ''),
        state: String(acc.state || ''),
        pinCode: String(acc.pinCode || ''),
        orderCount: stat.count,
        activeOrderCount: stat.activeCount,
        totalSpent: Math.round(stat.spent),
        lastOrderRef: stat.lastRef,
        joinedAtMs: Number(acc.createdAtMs || acc.updatedAtMs || 0),
        lastActivityMs: Math.max(Number(acc.createdAtMs || 0), Number(acc.updatedAtMs || 0), Number(stat.latestOrderMs || 0))
      };
      byUid[acc.uid] = record;
      if (emailNorm && !byEmail[emailNorm]) byEmail[emailNorm] = record;
      customers.push(record);
    });

    (rawCustomersData.crewSubscribers || []).forEach(function (sub) {
      var emailNorm = String(sub.email || '').trim().toLowerCase();
      if (!emailNorm) return;
      var target = (sub.uid && byUid[sub.uid]) || byEmail[emailNorm] || null;
      if (target) {
        target.isCrewMember = true;
        target.crewSource = target.crewSource || sub.source || 'homepage-crew';
        if (!target.joinedAtMs || (sub.createdAtMs && sub.createdAtMs < target.joinedAtMs)) {
          target.joinedAtMs = Number(sub.createdAtMs || target.joinedAtMs || 0);
        }
        target.lastActivityMs = Math.max(target.lastActivityMs || 0, Number(sub.createdAtMs || 0));
      } else {
        var stat = orderStatsByEmail[emailNorm] || { count: 0, activeCount: 0, spent: 0, latestOrderMs: 0, lastRef: '' };
        var fallbackName = sub.displayName || emailNorm.split('@')[0] || 'Crew Member';
        var crewRec = {
          key: 'crew:' + emailNorm,
          uid: sub.uid || '',
          name: fallbackName,
          email: emailNorm,
          photoURL: '',
          hasAccount: false,
          isCrewMember: true,
          crewSource: sub.source || 'homepage-crew',
          phone: '',
          city: '',
          state: '',
          pinCode: '',
          orderCount: stat.count,
          activeOrderCount: stat.activeCount,
          totalSpent: Math.round(stat.spent),
          lastOrderRef: stat.lastRef,
          joinedAtMs: Number(sub.createdAtMs || 0),
          lastActivityMs: Math.max(Number(sub.createdAtMs || 0), Number(stat.latestOrderMs || 0))
        };
        byEmail[emailNorm] = crewRec;
        customers.push(crewRec);
      }
    });

    return customers;
  }

  function updateCustomersMetricsAndTabs() {
    var list = buildMergedCustomers();
    var total = list.length;
    var signedInCount = 0;
    var crewCount = 0;
    var payingCount = 0;
    list.forEach(function (c) {
      if (c.hasAccount) signedInCount += 1;
      if (c.isCrewMember) crewCount += 1;
      if (c.orderCount > 0) payingCount += 1;
    });

    if (sidebarCustomersCount) sidebarCustomersCount.textContent = String(total);
    if (metricTotalCustomers) metricTotalCustomers.textContent = String(total);
    if (metricSignedinCustomers) metricSignedinCustomers.textContent = String(signedInCount);
    if (metricCrewCustomers) metricCrewCustomers.textContent = String(crewCount);
    if (metricPayingCustomers) metricPayingCustomers.textContent = String(payingCount);

    if (custTabAll) custTabAll.textContent = String(total);
    if (custTabSignedin) custTabSignedin.textContent = String(signedInCount);
    if (custTabCrew) custTabCrew.textContent = String(crewCount);
    if (custTabOrders) custTabOrders.textContent = String(payingCount);
  }

  function filteredAndSortedCustomers() {
    var q = customerSearchQuery.trim().toLowerCase();
    var list = buildMergedCustomers().filter(function (c) {
      if (customerFilter === 'account' && !c.hasAccount) return false;
      if (customerFilter === 'crew' && !c.isCrewMember) return false;
      if (customerFilter === 'ordered' && c.orderCount <= 0) return false;
      if (!q) return true;
      var hay = [c.name, c.email, c.phone, c.city, c.state, c.pinCode, c.uid, c.crewSource].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    if (customerSortMode === 'oldest') {
      list.sort(function (a, b) { return (a.joinedAtMs || 0) - (b.joinedAtMs || 0); });
    } else if (customerSortMode === 'orders-desc') {
      list.sort(function (a, b) { return b.orderCount - a.orderCount || b.totalSpent - a.totalSpent; });
    } else if (customerSortMode === 'spent-desc') {
      list.sort(function (a, b) { return b.totalSpent - a.totalSpent || b.orderCount - a.orderCount; });
    } else if (customerSortMode === 'name-asc') {
      list.sort(function (a, b) { return String(a.name || '').localeCompare(String(b.name || '')); });
    } else {
      list.sort(function (a, b) { return (b.lastActivityMs || b.joinedAtMs || 0) - (a.lastActivityMs || a.joinedAtMs || 0); });
    }
    return list;
  }

  function renderCustomersTable() {
    if (!customersTbody || !customersTableWrap || !customersEmpty || !customersSkeleton || !customersFooter) return;
    customersSkeleton.hidden = !customersLoading;
    if (customersLoading) {
      customersTableWrap.hidden = true;
      customersEmpty.hidden = true;
      customersFooter.hidden = true;
      return;
    }

    var allMerged = buildMergedCustomers();
    var rows = filteredAndSortedCustomers();
    customersTbody.textContent = '';

    if (!rows.length) {
      customersTableWrap.hidden = true;
      customersFooter.hidden = true;
      customersEmpty.hidden = false;
      if (!allMerged.length) {
        if (customersEmptyTitle) customersEmptyTitle.textContent = 'No customers yet';
        if (customersEmptyCopy) customersEmptyCopy.textContent = 'Signed-in Google accounts and REDPOLY Crew email signups will appear here.';
        if (customersResetBtn) customersResetBtn.hidden = true;
      } else {
        if (customersEmptyTitle) customersEmptyTitle.textContent = 'No customers match this filter';
        if (customersEmptyCopy) customersEmptyCopy.textContent = 'Try switching tabs or clearing your customer search.';
        if (customersResetBtn) customersResetBtn.hidden = false;
      }
      return;
    }

    customersEmpty.hidden = true;
    customersTableWrap.hidden = false;
    customersFooter.hidden = false;
    customersShowingText.textContent = rows.length === allMerged.length
      ? ('Showing ' + rows.length + (rows.length === 1 ? ' customer' : ' customers'))
      : ('Showing ' + rows.length + ' of ' + allMerged.length + ' customers');

    rows.forEach(function (cust) {
      var tr = document.createElement('tr');

      var tdCustomer = document.createElement('td');
      var custWrap = document.createElement('div');
      custWrap.className = 'fav-customer';
      if (cust.photoURL) {
        var avatar = document.createElement('img');
        avatar.className = 'fav-customer__avatar';
        avatar.src = cust.photoURL;
        avatar.alt = '';
        avatar.referrerPolicy = 'no-referrer';
        custWrap.appendChild(avatar);
      } else {
        var initial = document.createElement('span');
        initial.className = 'fav-customer__initial';
        initial.textContent = (cust.name || cust.email || 'R').charAt(0).toUpperCase();
        custWrap.appendChild(initial);
      }
      var custText = document.createElement('div');
      custText.className = 'fav-customer__text';
      var custName = document.createElement('strong');
      custName.textContent = cust.name;
      var custEmail = document.createElement('small');
      custEmail.textContent = cust.email || (cust.uid ? ('UID: ' + cust.uid) : '-');
      custText.appendChild(custName);
      custText.appendChild(custEmail);
      custWrap.appendChild(custText);
      tdCustomer.appendChild(custWrap);

      var tdChannel = document.createElement('td');
      var badges = document.createElement('div');
      badges.className = 'cust-badges';
      if (cust.hasAccount) {
        var accBadge = document.createElement('span');
        accBadge.className = 'cust-badge cust-badge--account';
        accBadge.textContent = 'Signed-in';
        badges.appendChild(accBadge);
      }
      if (cust.isCrewMember) {
        var crewBadge = document.createElement('span');
        crewBadge.className = 'cust-badge cust-badge--crew';
        crewBadge.textContent = 'Crew';
        badges.appendChild(crewBadge);
      }
      tdChannel.appendChild(badges);

      var tdContact = document.createElement('td');
      var locText = [cust.city, cust.state].filter(Boolean).join(', ');
      if (cust.pinCode) locText = locText ? (locText + ' · ' + cust.pinCode) : cust.pinCode;
      var primaryContact = document.createElement('span');
      primaryContact.className = 'cust-contact-primary';
      primaryContact.textContent = cust.phone ? ('+91 ' + cust.phone) : (locText || '-');
      tdContact.appendChild(primaryContact);
      if (cust.phone && locText) {
        var subContact = document.createElement('span');
        subContact.className = 'cust-contact-sub';
        subContact.textContent = locText;
        tdContact.appendChild(subContact);
      } else if (!cust.phone && !locText && cust.isCrewMember && !cust.hasAccount) {
        var crewNote = document.createElement('span');
        crewNote.className = 'cust-contact-sub';
        crewNote.textContent = 'Newsletter signup';
        tdContact.appendChild(crewNote);
      }

      var tdOrders = document.createElement('td');
      tdOrders.className = 'cust-orders-cell';
      tdOrders.textContent = cust.orderCount + (cust.orderCount === 1 ? ' order' : ' orders');
      if (cust.lastOrderRef) {
        var lastRefSpan = document.createElement('span');
        lastRefSpan.textContent = 'Latest #' + cust.lastOrderRef;
        tdOrders.appendChild(lastRefSpan);
      }

      var tdSpent = document.createElement('td');
      tdSpent.className = 'col-num cell-total';
      tdSpent.textContent = money(cust.totalSpent);

      var tdJoined = document.createElement('td');
      tdJoined.className = 'cell-date';
      tdJoined.textContent = formatDateShort(cust.joinedAtMs || cust.lastActivityMs);

      tr.appendChild(tdCustomer);
      tr.appendChild(tdChannel);
      tr.appendChild(tdContact);
      tr.appendChild(tdOrders);
      tr.appendChild(tdSpent);
      tr.appendChild(tdJoined);
      customersTbody.appendChild(tr);
    });
  }

  if (customersFilterTabs) {
    customersFilterTabs.addEventListener('click', function (ev) {
      var tab = ev.target.closest('[data-customer-filter]');
      if (!tab) return;
      customerFilter = tab.getAttribute('data-customer-filter') || 'all';
      Array.prototype.forEach.call(customersFilterTabs.querySelectorAll('.orders-tab'), function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      renderCustomersTable();
    });
  }

  if (customersSearchInput) {
    customersSearchInput.addEventListener('input', function () {
      customerSearchQuery = customersSearchInput.value || '';
      if (customersSearchClear) customersSearchClear.hidden = !customerSearchQuery;
      renderCustomersTable();
    });
  }

  if (customersSearchClear) {
    customersSearchClear.addEventListener('click', function () {
      customerSearchQuery = '';
      if (customersSearchInput) { customersSearchInput.value = ''; customersSearchInput.focus(); }
      customersSearchClear.hidden = true;
      renderCustomersTable();
    });
  }

  if (customersSortSelect) {
    customersSortSelect.addEventListener('change', function () {
      customerSortMode = customersSortSelect.value || 'newest';
      renderCustomersTable();
    });
  }

  if (customersResetBtn) {
    customersResetBtn.addEventListener('click', function () {
      customerFilter = 'all';
      customerSearchQuery = '';
      if (customersSearchInput) customersSearchInput.value = '';
      if (customersSearchClear) customersSearchClear.hidden = true;
      if (customersFilterTabs) {
        Array.prototype.forEach.call(customersFilterTabs.querySelectorAll('.orders-tab'), function (t) {
          var isAll = t.getAttribute('data-customer-filter') === 'all';
          t.classList.toggle('is-active', isAll);
          t.setAttribute('aria-selected', isAll ? 'true' : 'false');
        });
      }
      renderCustomersTable();
    });
  }

  async function loadAllCustomers(force) {
    var fb = await ensureDashboardFirebase();
    var user = fb.getUser();
    if (!isCurrentAdmin(user)) return;
    if (customersLoading && !force) return;

    customersLoading = true;
    if (refreshBtn) refreshBtn.disabled = true;
    if (customersErrorBanner) customersErrorBanner.hidden = true;
    renderCustomersTable();

    try {
      rawCustomersData = await fb.listAllCustomers();
      customersLoadedOnce = true;
      updateCustomersMetricsAndTabs();
    } catch (err) {
      console.error(err);
      if (customersErrorText) customersErrorText.textContent = 'Could not load customers from Firestore. Ensure updated Firestore rules are published.';
      if (customersErrorBanner) customersErrorBanner.hidden = false;
    } finally {
      customersLoading = false;
      if (refreshBtn) refreshBtn.disabled = false;
      renderCustomersTable();
    }
  }

  async function loadAllProducts(force) {
    var fb = await ensureDashboardFirebase();
    var user = fb.getUser();
    if (!isCurrentAdmin(user)) return;
    if (productsLoading && !force) return;

    productsLoading = true;
    if (refreshBtn) refreshBtn.disabled = true;
    if (productsErrorBanner) productsErrorBanner.hidden = true;
    renderProductsTable();

    try {
      allProducts = await fb.listAllProducts();
      allProducts.forEach(function (p) {
        if (CATALOGUE[p.name]) CATALOGUE[p.name].price = p.price;
      });
      populateCatalogueDropdown();
      populateCategorySelectors();
      updateProductMetricsAndTabs();
      updateCategoryMetricsAndTabs();
      renderCategoriesTable();
      if (selectedProductSku && productDrawerLayer && !productDrawerLayer.hidden) {
        var activeProd = allProducts.find(function (p) { return p.sku === selectedProductSku; });
        if (activeProd) fillProductDrawer(activeProd);
      }
    } catch (err) {
      console.error(err);
      if (productsErrorText) productsErrorText.textContent = 'Could not load products from Firestore. Ensure updated Firestore rules are published.';
      if (productsErrorBanner) productsErrorBanner.hidden = false;
    } finally {
      productsLoading = false;
      if (refreshBtn) refreshBtn.disabled = false;
      renderProductsTable();
    }
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      if (activeView === 'products') { loadAllCategories(true); loadAllProducts(true); }
      else if (activeView === 'categories') { loadAllCategories(true); loadAllProducts(true); }
      else if (activeView === 'customers') loadAllCustomers(true);
      else if (activeView === 'reviews') loadAllReviews(true);
      else if (activeView === 'favorites') loadAllWishlists(true);
      else loadAllOrders(true);
    });
  }
  if (retryBtn) {
    retryBtn.addEventListener('click', function () { loadAllOrders(true); });
  }
  if (productsRetryBtn) {
    productsRetryBtn.addEventListener('click', function () { loadAllProducts(true); });
  }
  if (categoriesRetryBtn) {
    categoriesRetryBtn.addEventListener('click', function () { loadAllCategories(true); });
  }
  if (customersRetryBtn) {
    customersRetryBtn.addEventListener('click', function () { loadAllCustomers(true); });
  }
  if (reviewsRetryBtn) {
    reviewsRetryBtn.addEventListener('click', function () { loadAllReviews(true); });
  }
  if (favoritesRetryBtn) {
    favoritesRetryBtn.addEventListener('click', function () { loadAllWishlists(true); });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (categoryDrawerLayer && !categoryDrawerLayer.hidden) closeCategoryDrawer();
      else if (productDrawerLayer && !productDrawerLayer.hidden) closeProductDrawer();
      else if (!drawerLayer.hidden) closeOrderDrawer();
      else if (sidebar && sidebar.classList.contains('is-open')) setSidebarOpen(false);
      return;
    }
    var activeDrawerLayer = (categoryDrawerLayer && !categoryDrawerLayer.hidden)
      ? categoryDrawerLayer
      : ((productDrawerLayer && !productDrawerLayer.hidden) ? productDrawerLayer : (!drawerLayer.hidden ? drawerLayer : null));
    var activeDrawerEl = activeDrawerLayer === categoryDrawerLayer
      ? categoryDrawerEl
      : (activeDrawerLayer === productDrawerLayer ? productDrawerEl : (activeDrawerLayer === drawerLayer ? drawerEl : null));
    if (event.key === 'Tab' && activeDrawerLayer && activeDrawerEl) {
      var focusable = Array.prototype.filter.call(
        activeDrawerEl.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'),
        function (el) { return !el.hidden && el.offsetParent !== null; }
      );
      if (!focusable.length) {
        event.preventDefault();
        activeDrawerEl.focus();
        return;
      }
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === activeDrawerEl)) {
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
      allProducts = [];
      allCategories = DEFAULT_CATEGORIES.map(function (c) { return Object.assign({}, c); });
      categoriesLoadedOnce = false;
      allReviews = [];
      allFavorites = [];
      rawCustomersData = { accounts: [], crewSubscribers: [] };
      customersLoadedOnce = false;
      lastFetchedUid = null;
      closeOrderDrawer();
      closeProductDrawer();
      closeCategoryDrawer();
      updateMetricsAndCounts();
      updateProductMetricsAndTabs();
      updateCategoryMetricsAndTabs();
      updateCustomersMetricsAndTabs();
      updateReviewCounts();
      updateFavoritesSummaryAndTabs();
      renderAuthGate('signed-out', null);
      return;
    }

    if (!isCurrentAdmin(user)) {
      allOrders = [];
      allProducts = [];
      allCategories = DEFAULT_CATEGORIES.map(function (c) { return Object.assign({}, c); });
      categoriesLoadedOnce = false;
      allReviews = [];
      allFavorites = [];
      rawCustomersData = { accounts: [], crewSubscribers: [] };
      customersLoadedOnce = false;
      lastFetchedUid = null;
      closeOrderDrawer();
      closeProductDrawer();
      closeCategoryDrawer();
      updateMetricsAndCounts();
      updateProductMetricsAndTabs();
      updateCategoryMetricsAndTabs();
      updateCustomersMetricsAndTabs();
      updateReviewCounts();
      updateFavoritesSummaryAndTabs();
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
      loadAllCategories(true);
      loadAllProducts(true);
      loadAllCustomers(true);
      loadAllReviews(true);
      loadAllWishlists(true);
    }
  }

  window.addEventListener('redpoly:firebase-ready', syncSession);
  window.addEventListener('redpoly:auth-changed', syncSession);
  window.addEventListener('redpoly:categories-updated', function (ev) {
    if (ev.detail && Array.isArray(ev.detail.categories) && ev.detail.categories.length && !categoriesLoading) {
      allCategories = ev.detail.categories.map(function (c) { return Object.assign({}, c); });
      sortCategoriesInPlace();
      populateCategorySelectors();
      updateCategoryMetricsAndTabs();
      renderCategoriesTable();
      renderProductsTable();
    }
  });
  window.addEventListener('redpoly:catalog-updated', function (ev) {
    if (ev.detail && ev.detail.map) {
      Object.keys(CATALOGUE).forEach(function (name) {
        var r = ev.detail.map[name];
        if (r && r.price > 0) CATALOGUE[name].price = r.price;
      });
      populateCatalogueDropdown();
    }
  });

  // Boot
  renderAuthGate('loading', null);
  ensureDashboardFirebase().then(function () {
    syncSession();
  }).catch(function (err) {
    console.error('Failed to bootstrap Firebase for dashboard:', err);
    renderAuthGate('signed-out', null);
  });
})();
