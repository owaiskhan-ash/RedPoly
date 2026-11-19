/* REDPOLY interactions plus expressive, reduced-motion-aware movement. */
(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) root.classList.add('motion-ready');

  // Reveal each character-page title glyph in sequence while keeping one clean accessible label.
  if (!reduceMotion) {
    document.querySelectorAll('.char-hero h1[aria-label]').forEach(function (heading) {
      var walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      var textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      var letterIndex = 0;
      textNodes.forEach(function (node) {
        var fragment = document.createDocumentFragment();
        Array.from(node.nodeValue).forEach(function (character) {
          if (/\s/.test(character)) {
            fragment.appendChild(document.createTextNode(character));
            return;
          }
          var letter = document.createElement('span');
          letter.className = 'char-title__letter';
          letter.setAttribute('aria-hidden', 'true');
          letter.style.setProperty('--letter-index', letterIndex++);
          letter.textContent = character;
          fragment.appendChild(letter);
        });
        node.parentNode.replaceChild(fragment, node);
      });
    });
  }

  // Prefetch the adjacent page and its large hero figure on intent; navigation itself stays immediate.
  var productPagerLinks = document.querySelectorAll('.char-product-pager a[data-transition-image]');
  if (productPagerLinks.length) {
    var pagePreloads = Object.create(null);
    function prepareProductPage(link) {
      var href = link.href;
      if (pagePreloads[href]) return;
      var pageHint = document.createElement('link');
      pageHint.rel = 'prefetch';
      pageHint.href = href;
      document.head.appendChild(pageHint);
      var image = new Image();
      image.decoding = 'async';
      if ('fetchPriority' in image) image.fetchPriority = 'high';
      image.src = link.getAttribute('data-transition-image');
      pagePreloads[href] = { page: pageHint, figure: image };
    }

    productPagerLinks.forEach(function (link) {
      link.addEventListener('pointerenter', function () { prepareProductPage(link); }, { once: true });
      link.addEventListener('focus', function () { prepareProductPage(link); }, { once: true });
      link.addEventListener('touchstart', function () { prepareProductPage(link); }, { once: true, passive: true });
    });
  }

  var toast = document.getElementById('toast');
  var toastTimer = null;
  function showToast(msg) {
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  // Local cart shared across storefront and product pages. Checkout stays clearly marked as pending integration.
  // Free Standard & Express shipping starts at ₹2,000 and a free gift at ₹3,500; the same numbers live in checkout.js.
  // The catalogue is the list of products on sale. Add a product here (and in checkout.js) when it gets a page.
  // Anything else found in a saved cart or saved list (for example an item that is no longer sold) is dropped.
  var catalogue = {
    'BUBBLE GUN': { price:449, href:'/bubble-gun', image:'/assets/images/redpoly/products/bubble-gun-thumb.webp?v=bubble-20261121' },
    'STUNT PET': { price:599, href:'/stunt-pet', image:'/assets/images/redpoly/products/stunt-pet-thumb.webp?v=pet-20261122' },
    'MINI COOL CAR': { price:749, href:'/mini-cool-car', image:'/assets/images/redpoly/products/mini-cool-car-thumb.webp?v=car-20261117' },
    'GEL STORM': { price:1999, href:'/gel-storm', image:'/assets/images/redpoly/products/gel-storm-thumb.webp?v=gel-20261121' },
    'MECHA ROVER': { price:499, href:'/mecha-rover', image:'/assets/images/redpoly/products/mecha-rover-thumb.webp?v=mecha-20261120' },
    'PIXEL SPLASH': { price:1749, href:'/pixel-splash', image:'/assets/images/redpoly/products/pixel-splash-thumb.webp?v=pixel-20261117-v3' },
    // Cute Dinos sells as one dino in any of three colours (₹249) or the set of all three (₹549).
    'CUTE DINOS GREEN': { price:249, href:'/cute-dinos?colour=green', image:'/assets/images/redpoly/products/cute-dinos-green-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS RED': { price:249, href:'/cute-dinos?colour=red', image:'/assets/images/redpoly/products/cute-dinos-red-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS TEAL': { price:249, href:'/cute-dinos?colour=teal', image:'/assets/images/redpoly/products/cute-dinos-teal-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS TRIO': { price:549, href:'/cute-dinos?pack=trio', image:'/assets/images/redpoly/products/cute-dinos-trio-thumb.webp?v=dinos-20261116' },
    'MAGNETIC BLOCKS 25 PCS': { price:319, href:'/magnetic-blocks?pack=25pcs', image:'/assets/images/redpoly/products/magnetic-blocks-25pcs-thumb.webp?v=mag-20261122' },
    'MAGNETIC BLOCKS 36 PCS': { price:479, href:'/magnetic-blocks?pack=36pcs', image:'/assets/images/redpoly/products/magnetic-blocks-36pcs-thumb.webp?v=mag-20261122' },
    'MAGNETIC BLOCKS 42 PCS': { price:549, href:'/magnetic-blocks?pack=42pcs', image:'/assets/images/redpoly/products/magnetic-blocks-42pcs-thumb.webp?v=mag-20261122' },
    'MAGNETIC BLOCKS 64 PCS': { price:799, href:'/magnetic-blocks?pack=64pcs', image:'/assets/images/redpoly/products/magnetic-blocks-64pcs-thumb.webp?v=mag-20261122' },
    'RISE ONE X 4X4': { price:1499, href:'/rise-one-x-4x4', image:'/assets/images/redpoly/products/rise-one-x-4x4-thumb.webp?v=rise-20261122' },
    'DRIFT KING': { price:799, href:'/drift-king', image:'/assets/images/redpoly/products/drift-king-thumb.webp?v=dk-20261124' },
    'BABY LINGO': { price:799, href:'/baby-lingo', image:'/assets/images/redpoly/products/baby-lingo-thumb.webp?v=lingo-20261119' }
  };
  function isCatalogueProduct(name) { return Object.prototype.hasOwnProperty.call(catalogue, name); }
  function inCatalogue(name, price) { return isCatalogueProduct(name) && catalogue[name].price === Number(price); }
  var CATALOG_CACHE_KEY = 'redpoly-catalog-cache-v1';
  var DEFAULT_CARD_TAGS = {
    'DRIFT KING': 'NEW IN STORE',
    'RISE ONE X 4X4': 'NEW IN STORE',
    'MAGNETIC BLOCKS 25 PCS': 'NEW IN STORE',
    'MAGNETIC BLOCKS 36 PCS': '',
    'MAGNETIC BLOCKS 42 PCS': '',
    'MAGNETIC BLOCKS 64 PCS': '',
    'MECHA ROVER': '',
    'BUBBLE GUN': 'IN STORE NOW',
    'STUNT PET': 'NEW IN STORE',
    'CUTE DINOS GREEN': 'NEW IN STORE',
    'CUTE DINOS RED': '',
    'CUTE DINOS TEAL': '',
    'CUTE DINOS TRIO': '',
    'MINI COOL CAR': 'NEW IN STORE',
    'GEL STORM': 'JUST LANDED',
    'PIXEL SPLASH': 'NEW IN STORE',
    'BABY LINGO': 'NEW IN STORE'
  };
  var DEFAULT_PRICE_COMPARISONS = {
    'drift-king': [{ platform: 'Amazon', price: 859 }],
    'baby-lingo': [{ platform: 'Amazon', price: 899 }]
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
  function toCatalogRecord(sku, raw) {
    var name = SKU_TO_NAME[sku];
    var cat = catalogue[name];
    var r = raw && typeof raw === 'object' ? raw : {};
    var p = Math.round(Number(r.price));
    var price = Number.isFinite(p) && p >= 1 && p <= 500000 ? p : (cat ? cat.price : 499);
    var cmp = Math.round(Number(r.compareAtPrice));
    var compareAtPrice = Number.isFinite(cmp) && cmp >= 0 && cmp <= 500000 ? cmp : 0;
    var hasStock = r.stock !== undefined && r.stock !== null && Number.isFinite(Number(r.stock));
    var stock = hasStock ? Math.max(0, Math.min(100000, Math.floor(Number(r.stock)))) : null;
    var threshRaw = Number(r.lowStockThreshold);
    var lowStockThreshold = Number.isFinite(threshRaw) ? Math.max(0, Math.min(10000, Math.floor(threshRaw))) : 5;
    var cardTag = typeof r.cardTag === 'string' ? r.cardTag.trim().slice(0, 32) : (DEFAULT_CARD_TAGS[name] || '');
    var comps = Array.isArray(r.priceComparisons)
      ? r.priceComparisons.filter(function (c) {
          return c && typeof c.platform === 'string' && c.platform.trim() && Number(c.price) >= 1 && Number(c.price) <= 500000;
        }).slice(0, 5).map(function (c) {
          return { platform: c.platform.trim().slice(0, 32), price: Math.round(Number(c.price)) };
        })
      : (DEFAULT_PRICE_COMPARISONS[sku] ? DEFAULT_PRICE_COMPARISONS[sku].map(function (c) { return { platform: c.platform, price: c.price }; }) : []);
    return {
      sku: sku,
      name: name,
      price: price,
      compareAtPrice: compareAtPrice,
      stock: stock,
      lowStockThreshold: lowStockThreshold,
      cardTag: cardTag,
      priceComparisons: comps,
      href: cat ? cat.href : '/' + sku,
      image: cat ? cat.image : '',
      initialized: hasStock
    };
  }
  function buildCatalogMapFromStorageOrDefaults() {
    var map = {};
    var cached = {};
    try {
      cached = JSON.parse(window.sessionStorage.getItem(CATALOG_CACHE_KEY) || '{}') || {};
    } catch (e) { cached = {}; }
    SKU_ORDER.forEach(function (sku) {
      var rec = toCatalogRecord(sku, cached[sku]);
      if (catalogue[rec.name]) catalogue[rec.name].price = rec.price;
      map[sku] = rec;
      map[rec.name] = rec;
    });
    return map;
  }
  var initialCatalogSnapshot = buildCatalogMapFromStorageOrDefaults();

  var cartStorageKey = 'redpoly-cart-v1';
  var cartItems = [];
  try {
    var storedCart = JSON.parse(window.localStorage.getItem(cartStorageKey) || '[]');
    if (Array.isArray(storedCart)) cartItems = storedCart.filter(function (item) {
      return item && typeof item.id === 'string' && typeof item.name === 'string' &&
        isCatalogueProduct(item.name) && Number.isFinite(Number(item.quantity)) && Number(item.quantity) >= 1;
    }).map(function (item) {
      var livePrice = catalogue[item.name].price;
      return { id: item.name.toLowerCase() + '|' + livePrice, name: item.name, price: livePrice, quantity: Math.floor(Number(item.quantity)) };
    });
    if (Array.isArray(storedCart)) window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  } catch (ignoreCartStorage) { cartItems = []; }

  var cartToggle = document.createElement('button');
  cartToggle.type = 'button';
  cartToggle.className = 'cart-toggle';
  cartToggle.setAttribute('aria-haspopup', 'dialog');
  cartToggle.setAttribute('aria-expanded', 'false');
  cartToggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 11.2h10.8L21 8H6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="19" r="1.5" fill="currentColor"/><circle cx="18" cy="19" r="1.5" fill="currentColor"/></svg><span>CART</span><b class="cart-toggle__count">0</b>';
  // Every page shows the shared header, so the cart button is added there; pages without shop
  // controls (the help desk) get the button but no drawer machinery behind it.
  var homeHeader = document.querySelector('.site-header__inner');
  if (homeHeader) homeHeader.appendChild(cartToggle);

  var firebaseBootstrapPromise = null;
  function ensureFirebaseClient() {
    if (window.RedpolyFirebase) return Promise.resolve(window.RedpolyFirebase);
    if (firebaseBootstrapPromise) return firebaseBootstrapPromise;
    firebaseBootstrapPromise = (async function () {
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
      if (window.RedpolyFirebase) return window.RedpolyFirebase;

      var appMod = mods[0];
      var authMod = mods[1];
      var fsMod = mods[2];

      var app = appMod.initializeApp(firebaseConfig);
      var db = firebaseConfig.firestoreDatabaseId
        ? fsMod.getFirestore(app, firebaseConfig.firestoreDatabaseId)
        : fsMod.getFirestore(app);
      var auth = authMod.getAuth(app);
      var googleProvider = new authMod.GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: 'select_account' });

      var LIMITS = {
        ID_MAX: 128,
        ID_PATTERN: /^[a-zA-Z0-9_\-]+$/,
        DISPLAY_NAME_MAX: 120,
        PHOTO_URL_MAX: 500,
        EMAIL_MAX: 200,
        FULL_NAME_MAX: 120,
        PHONE_PATTERN: /^[6-9][0-9]{9}$/,
        ADDRESS_MAX: 300,
        PIN_PATTERN: /^[1-9][0-9]{5}$/,
        CITY_MAX: 100,
        STATE_MAX: 100,
        HREF_MAX: 200,
        HREF_PATTERN: /^\/[a-zA-Z0-9_\-/?=&]+$/,
        IMAGE_MAX: 300,
        IMAGE_PATTERN: /^\/[a-zA-Z0-9_\-./?=&]+$/,
        QTY_MIN: 1,
        QTY_MAX: 99
      };
      var WISH_KEY = 'redpoly-wishlist-v1';
      var FREE_STANDARD_FROM = 2000;
      var FREE_EXPRESS_FROM = 2000;
      var FREE_GIFT_FROM = 3500;
      var GST_RATE = 12;
      var VALID_ORDER_STATUSES = ['placed', 'created', 'processed', 'shipped', 'out_for_delivery', 'delivered', 'fulfilled', 'cancelled'];
      var VALID_PRODUCT_SLUGS = ['bubble-gun', 'stunt-pet', 'mini-cool-car', 'gel-storm', 'mecha-rover', 'pixel-splash', 'cute-dinos', 'magnetic-blocks', 'rise-one-x-4x4', 'drift-king', 'baby-lingo'];

      function normalizeOrderStatus(raw) {
        var str = String(raw || '');
        return VALID_ORDER_STATUSES.indexOf(str) !== -1 ? str : 'placed';
      }
      function isDeliveredStatus(status) {
        return status === 'delivered' || status === 'fulfilled';
      }
      function isValidProductSlug(slug) {
        return VALID_PRODUCT_SLUGS.indexOf(slug) !== -1;
      }
      function itemSlugMatchesProduct(itemSlugVal, productSlug) {
        if (productSlug === 'cute-dinos') {
          return itemSlugVal === 'cute-dinos-green' || itemSlugVal === 'cute-dinos-red' || itemSlugVal === 'cute-dinos-teal' || itemSlugVal === 'cute-dinos-trio';
        }
        if (productSlug === 'magnetic-blocks') {
          return itemSlugVal === 'magnetic-blocks-25-pcs' || itemSlugVal === 'magnetic-blocks-36-pcs' || itemSlugVal === 'magnetic-blocks-42-pcs' || itemSlugVal === 'magnetic-blocks-64-pcs';
        }
        return itemSlugVal === productSlug;
      }
      function toReviewRecord(docId, d, fallbackSlug) {
        var createdTs = d.createdAt;
        var modTs = d.moderatedAt;
        var rawSlug = String(d.productSlug || fallbackSlug || '');
        var productSlug = isValidProductSlug(rawSlug) ? rawSlug : 'bubble-gun';
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

      function itemSlug(name) {
        return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, LIMITS.ID_MAX);
      }
      function sanitizeUrl(url) {
        if (!url || typeof url !== 'string') return '';
        var trimmed = url.trim().slice(0, LIMITS.PHOTO_URL_MAX);
        return trimmed.indexOf('https://') === 0 ? trimmed : '';
      }
      function clampQty(qty) {
        var n = Math.floor(Number(qty) || 1);
        return Math.max(LIMITS.QTY_MIN, Math.min(LIMITS.QTY_MAX, n));
      }
      function dispatch(name, detail) {
        window.dispatchEvent(new CustomEvent(name, { detail: detail }));
      }
      function readLocalCartForSync() {
        try {
          var raw = JSON.parse(window.localStorage.getItem(cartStorageKey) || '[]');
          if (!Array.isArray(raw)) return [];
          return raw.filter(function (item) {
            return item && typeof item.name === 'string' && isCatalogueProduct(item.name) && Number.isFinite(Number(item.quantity)) && Number(item.quantity) >= 1;
          }).map(function (item) {
            var livePrice = catalogue[item.name].price;
            return { id: item.name.toLowerCase() + '|' + livePrice, name: item.name, price: livePrice, quantity: clampQty(item.quantity) };
          });
        } catch (e) { return []; }
      }
      function readLocalWishForSync() {
        try {
          var raw = JSON.parse(window.localStorage.getItem(WISH_KEY) || '[]');
          if (!Array.isArray(raw)) return [];
          return raw.filter(function (item) {
            return item && typeof item.name === 'string' && typeof item.href === 'string' && LIMITS.HREF_PATTERN.test(item.href) && isCatalogueProduct(item.name);
          }).map(function (item) {
            return {
              name: item.name,
              href: item.href.slice(0, LIMITS.HREF_MAX),
              image: typeof item.image === 'string' && LIMITS.IMAGE_PATTERN.test(item.image) ? item.image.slice(0, LIMITS.IMAGE_MAX) : catalogue[item.name].image,
              price: catalogue[item.name].price
            };
          });
        } catch (e) { return []; }
      }

      var fallbackCatalogMap = new Map();
      var fallbackCatalogLoaded = false;
      function setFallbackCatalogDocs(docsBySku) {
        var sessionCache = {};
        var changed = false;
        SKU_ORDER.forEach(function (sku) {
          var rec = toCatalogRecord(sku, docsBySku[sku]);
          fallbackCatalogMap.set(sku, rec);
          if (catalogue[rec.name] && catalogue[rec.name].price !== rec.price) {
            catalogue[rec.name].price = rec.price;
            changed = true;
          }
          sessionCache[sku] = {
            price: rec.price,
            compareAtPrice: rec.compareAtPrice,
            stock: rec.stock,
            lowStockThreshold: rec.lowStockThreshold,
            cardTag: rec.cardTag,
            priceComparisons: rec.priceComparisons,
            updatedAtMs: Date.now()
          };
        });
        try { window.sessionStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(sessionCache)); } catch (e) {}
        if (changed) {
          var syncedCart = readLocalCartForSync();
          try { window.localStorage.setItem(cartStorageKey, JSON.stringify(syncedCart)); } catch (e) {}
          dispatch('redpoly:cart-updated', { items: syncedCart });
        }
        dispatch('redpoly:catalog-updated', { products: getFallbackCatalogList(), map: getFallbackCatalogMap() });
      }
      function getFallbackCatalogList() {
        return SKU_ORDER.map(function (sku) {
          return fallbackCatalogMap.get(sku) || toCatalogRecord(sku, null);
        });
      }
      function getFallbackCatalogMap() {
        var out = {};
        SKU_ORDER.forEach(function (sku) {
          var rec = fallbackCatalogMap.get(sku) || toCatalogRecord(sku, null);
          out[sku] = rec;
          out[rec.name] = rec;
        });
        return out;
      }
      SKU_ORDER.forEach(function (sku) {
        fallbackCatalogMap.set(sku, initialCatalogSnapshot[sku] || toCatalogRecord(sku, null));
      });
      try {
        fsMod.onSnapshot(fsMod.collection(db, 'products'), function (snap) {
          var docsBySku = {};
          snap.forEach(function (docSnap) {
            if (Object.prototype.hasOwnProperty.call(SKU_TO_NAME, docSnap.id)) {
              docsBySku[docSnap.id] = docSnap.data();
            }
          });
          fallbackCatalogLoaded = true;
          setFallbackCatalogDocs(docsBySku);
        }, function () {});
      } catch (e) {}

      var currentUser = null;
      var authReady = false;
      var currentProfile = null;
      var currentOrders = [];
      var unsubCart = null;
      var unsubWish = null;
      var unsubOrders = null;

      function stopListeners() {
        if (unsubCart) { unsubCart(); unsubCart = null; }
        if (unsubWish) { unsubWish(); unsubWish = null; }
        if (unsubOrders) { unsubOrders(); unsubOrders = null; }
      }

      async function ensureUserDocuments(user) {
        var userPath = 'users/' + user.uid;
        var profilePath = 'users/' + user.uid + '/private/profile';
        var fallbackName = user.email ? user.email.split('@')[0] : 'REDPOLY Member';
        var displayName = (user.displayName || fallbackName).trim().slice(0, LIMITS.DISPLAY_NAME_MAX) || 'REDPOLY Member';
        var photoURL = sanitizeUrl(user.photoURL);
        var email = (user.email || '').trim().slice(0, LIMITS.EMAIL_MAX);

        try {
          var userRef = fsMod.doc(db, 'users', user.uid);
          var userSnap = await fsMod.getDoc(userRef);
          if (!userSnap.exists()) {
            await fsMod.setDoc(userRef, {
              uid: user.uid,
              displayName: displayName,
              photoURL: photoURL,
              createdAt: fsMod.serverTimestamp(),
              updatedAt: fsMod.serverTimestamp()
            });
          } else {
            var existing = userSnap.data();
            if (existing.displayName !== displayName || (existing.photoURL || '') !== photoURL) {
              await fsMod.updateDoc(userRef, {
                displayName: displayName,
                photoURL: photoURL,
                updatedAt: fsMod.serverTimestamp()
              });
            }
          }
        } catch (error) {
          handleFirestoreError(error, 'write', userPath);
        }

        try {
          var profileRef = fsMod.doc(db, 'users', user.uid, 'private', 'profile');
          var profileSnap = await fsMod.getDoc(profileRef);
          if (!profileSnap.exists()) {
            var initialProfile = {
              uid: user.uid,
              email: email,
              fullName: displayName.slice(0, LIMITS.FULL_NAME_MAX),
              phone: '',
              address: '',
              pinCode: '',
              city: '',
              state: ''
            };
            await fsMod.setDoc(profileRef, Object.assign({}, initialProfile, { updatedAt: fsMod.serverTimestamp() }));
            return initialProfile;
          }
          var data = profileSnap.data();
          return {
            uid: user.uid,
            email: typeof data.email === 'string' && data.email ? data.email : email,
            fullName: typeof data.fullName === 'string' ? data.fullName : displayName,
            phone: typeof data.phone === 'string' ? data.phone : '',
            address: typeof data.address === 'string' ? data.address : '',
            pinCode: typeof data.pinCode === 'string' ? data.pinCode : '',
            city: typeof data.city === 'string' ? data.city : '',
            state: typeof data.state === 'string' ? data.state : ''
          };
        } catch (error) {
          handleFirestoreError(error, 'get', profilePath);
        }
      }

      async function mergeAndSubscribeCart(uid) {
        var cartPath = 'users/' + uid + '/cart';
        var q = fsMod.query(fsMod.collection(db, 'users', uid, 'cart'), fsMod.where('uid', '==', uid));
        try {
          var existingSnap = await fsMod.getDocs(q);
          var remoteMap = new Map();
          existingSnap.forEach(function (docSnap) {
            var d = docSnap.data();
            if (typeof d.name === 'string' && isCatalogueProduct(d.name)) {
              remoteMap.set(docSnap.id, true);
            }
          });
          var localItems = readLocalCartForSync();
          for (var i = 0; i < localItems.length; i++) {
            var item = localItems[i];
            var slug = itemSlug(item.name);
            if (!LIMITS.ID_PATTERN.test(slug) || remoteMap.has(slug)) continue;
            await fsMod.setDoc(fsMod.doc(db, 'users', uid, 'cart', slug), {
              uid: uid,
              name: item.name,
              price: catalogue[item.name].price,
              quantity: clampQty(item.quantity),
              updatedAt: fsMod.serverTimestamp()
            });
          }
        } catch (error) {
          handleFirestoreError(error, 'list', cartPath);
        }
        unsubCart = fsMod.onSnapshot(q, function (snapshot) {
          var synced = [];
          snapshot.forEach(function (docSnap) {
            var d = docSnap.data();
            if (typeof d.name === 'string' && isCatalogueProduct(d.name)) {
              var livePrice = catalogue[d.name].price;
              synced.push({
                id: d.name.toLowerCase() + '|' + livePrice,
                name: d.name,
                price: livePrice,
                quantity: clampQty(d.quantity)
              });
            }
          });
          try { window.localStorage.setItem(cartStorageKey, JSON.stringify(synced)); } catch (e) {}
          dispatch('redpoly:cart-updated', { items: synced });
        }, function (error) {
          handleFirestoreError(error, 'list', cartPath);
        });
      }

      async function mergeAndSubscribeWishlist(uid) {
        var wishPath = 'users/' + uid + '/wishlist';
        var q = fsMod.query(fsMod.collection(db, 'users', uid, 'wishlist'), fsMod.where('uid', '==', uid));
        try {
          var existingSnap = await fsMod.getDocs(q);
          var remoteSet = new Set();
          existingSnap.forEach(function (docSnap) { remoteSet.add(docSnap.id); });
          var localItems = readLocalWishForSync();
          for (var i = 0; i < localItems.length; i++) {
            var item = localItems[i];
            var slug = itemSlug(item.name);
            if (!LIMITS.ID_PATTERN.test(slug) || remoteSet.has(slug)) continue;
            await fsMod.setDoc(fsMod.doc(db, 'users', uid, 'wishlist', slug), {
              uid: uid,
              name: item.name,
              href: item.href,
              image: item.image,
              price: catalogue[item.name].price,
              createdAt: fsMod.serverTimestamp()
            });
          }
        } catch (error) {
          handleFirestoreError(error, 'list', wishPath);
        }
        unsubWish = fsMod.onSnapshot(q, function (snapshot) {
          var synced = [];
          snapshot.forEach(function (docSnap) {
            var d = docSnap.data();
            if (typeof d.name === 'string' && typeof d.href === 'string' && LIMITS.HREF_PATTERN.test(d.href) && isCatalogueProduct(d.name)) {
              synced.push({
                name: d.name,
                href: d.href,
                image: typeof d.image === 'string' ? d.image : catalogue[d.name].image,
                price: catalogue[d.name].price
              });
            }
          });
          try { window.localStorage.setItem(WISH_KEY, JSON.stringify(synced)); } catch (e) {}
          dispatch('redpoly:wishlist-updated', { items: synced });
        }, function (error) {
          handleFirestoreError(error, 'list', wishPath);
        });
      }

      function subscribeOrders(uid) {
        var ordersPath = 'users/' + uid + '/orders';
        var q = fsMod.query(fsMod.collection(db, 'users', uid, 'orders'), fsMod.where('uid', '==', uid));
        unsubOrders = fsMod.onSnapshot(q, async function (snapshot) {
          var orders = [];
          for (var i = 0; i < snapshot.docs.length; i++) {
            var docSnap = snapshot.docs[i];
            var d = docSnap.data();
            var ts = d.createdAt;
            var createdAtMs = ts && typeof ts.toMillis === 'function' ? ts.toMillis() : Date.now();
            var lineItems = [];
            var itemsPath = 'users/' + uid + '/orders/' + docSnap.id + '/items';
            try {
              var itemsSnap = await fsMod.getDocs(fsMod.query(fsMod.collection(db, 'users', uid, 'orders', docSnap.id, 'items'), fsMod.where('uid', '==', uid)));
              itemsSnap.forEach(function (itemDoc) {
                var itemData = itemDoc.data();
                if (typeof itemData.name === 'string') {
                  lineItems.push({ name: itemData.name, price: Number(itemData.price), quantity: Number(itemData.quantity) });
                }
              });
            } catch (error) {
              handleFirestoreError(error, 'list', itemsPath);
            }
            var statusVal = normalizeOrderStatus(d.status);
            var deliveredTs = d.deliveredAt;
            var deliveredAtMs = deliveredTs && typeof deliveredTs.toMillis === 'function' ? deliveredTs.toMillis() : 0;
            orders.push({
              id: docSnap.id,
              uid: String(d.uid || uid),
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
              status: statusVal,
              trackingCode: String(d.trackingCode || ''),
              trackingCarrier: String(d.trackingCarrier || ''),
              deliveredAtMs: deliveredAtMs,
              createdAtMs: createdAtMs,
              items: lineItems
            });
          }
          orders.sort(function (a, b) { return b.createdAtMs - a.createdAtMs; });
          currentOrders = orders;
          dispatch('redpoly:orders-updated', { orders: orders });
        }, function (error) {
          handleFirestoreError(error, 'list', ordersPath);
        });
      }

      authMod.onAuthStateChanged(auth, async function (user) {
        stopListeners();
        currentUser = user;
        authReady = true;
        if (!user) {
          currentProfile = null;
          currentOrders = [];
          dispatch('redpoly:auth-changed', { user: null, profile: null });
          dispatch('redpoly:orders-updated', { orders: [] });
          return;
        }
        try {
          currentProfile = await ensureUserDocuments(user);
          dispatch('redpoly:auth-changed', {
            user: {
              uid: user.uid,
              displayName: user.displayName || currentProfile.fullName || 'REDPOLY Member',
              email: user.email || currentProfile.email,
              photoURL: sanitizeUrl(user.photoURL),
              emailVerified: user.emailVerified
            },
            profile: currentProfile
          });
          if (!fallbackCatalogLoaded) await api.loadPublicCatalog();
          await mergeAndSubscribeCart(user.uid);
          await mergeAndSubscribeWishlist(user.uid);
          subscribeOrders(user.uid);
        } catch (error) {
          console.error('Failed to initialize signed-in REDPOLY session:', error);
          dispatch('redpoly:auth-error', { message: 'Signed in, but could not sync account data. Please try refreshing.' });
        }
      });

      var ADMIN_EMAIL = 'ashketchupkeke@gmail.com';
      function isAdminUser() {
        return Boolean(currentUser && currentUser.emailVerified && currentUser.email === ADMIN_EMAIL);
      }

      var api = {
        isReady: function () { return authReady; },
        isCatalogReady: function () { return fallbackCatalogLoaded; },
        isAdmin: isAdminUser,
        getCatalog: getFallbackCatalogList,
        getCatalogMap: getFallbackCatalogMap,
        getProduct: function (skuOrName) {
          var m = getFallbackCatalogMap();
          var key = String(skuOrName || '').trim();
          return m[key] || m[key.toUpperCase()] || null;
        },
        loadPublicCatalog: async function () {
          try {
            var snap = await fsMod.getDocs(fsMod.collection(db, 'products'));
            var docsBySku = {};
            snap.forEach(function (docSnap) {
              if (Object.prototype.hasOwnProperty.call(SKU_TO_NAME, docSnap.id)) docsBySku[docSnap.id] = docSnap.data();
            });
            fallbackCatalogLoaded = true;
            setFallbackCatalogDocs(docsBySku);
          } catch (e) {}
          return getFallbackCatalogList();
        },
        getUser: function () {
          return currentUser ? {
            uid: currentUser.uid,
            displayName: currentUser.displayName || (currentProfile && currentProfile.fullName) || 'REDPOLY Member',
            email: currentUser.email || (currentProfile && currentProfile.email) || '',
            photoURL: sanitizeUrl(currentUser.photoURL),
            emailVerified: currentUser.emailVerified
          } : null;
        },
        getProfile: function () { return currentProfile; },
        getOrders: function () { return currentOrders; },
        signInWithGoogle: async function () {
          try {
            var result = await authMod.signInWithPopup(auth, googleProvider);
            return result.user;
          } catch (error) {
            var code = error && error.code ? String(error.code) : '';
            if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null;
            throw error;
          }
        },
        signOut: async function () { await authMod.signOut(auth); },
        joinCrew: async function (email, source) {
          var cleanEmail = String(email || '').trim().toLowerCase().slice(0, LIMITS.EMAIL_MAX);
          if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            throw new Error('Please enter a valid email address.');
          }
          var cleanSource = source === 'storefront' ? 'storefront' : 'homepage-crew';
          var subId = 'crew_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
          var path = 'crewSubscribers/' + subId;
          var payload = {
            email: cleanEmail,
            source: cleanSource,
            createdAt: fsMod.serverTimestamp()
          };
          if (currentUser && LIMITS.ID_PATTERN.test(currentUser.uid)) {
            payload.uid = currentUser.uid;
            var cleanName = String(currentUser.displayName || '').trim().slice(0, 120);
            if (cleanName) payload.displayName = cleanName;
          }
          try {
            await fsMod.setDoc(fsMod.doc(db, 'crewSubscribers', subId), payload);
            return { email: cleanEmail };
          } catch (error) {
            handleFirestoreError(error, 'create', path);
          }
        },
        syncCartItem: async function (item) {
          if (!currentUser || !currentUser.emailVerified || !isCatalogueProduct(item.name)) return;
          if (!fallbackCatalogLoaded) await api.loadPublicCatalog();
          var livePrice = catalogue[item.name].price;
          var slug = itemSlug(item.name);
          if (!LIMITS.ID_PATTERN.test(slug)) return;
          var path = 'users/' + currentUser.uid + '/cart/' + slug;
          try {
            var ref = fsMod.doc(db, 'users', currentUser.uid, 'cart', slug);
            var existing = await fsMod.getDoc(ref);
            if (existing.exists()) {
              await fsMod.updateDoc(ref, { price: livePrice, quantity: clampQty(item.quantity), updatedAt: fsMod.serverTimestamp() });
            } else {
              await fsMod.setDoc(ref, { uid: currentUser.uid, name: item.name, price: livePrice, quantity: clampQty(item.quantity), updatedAt: fsMod.serverTimestamp() });
            }
          } catch (error) { handleFirestoreError(error, 'write', path); }
        },
        removeCartItem: async function (name) {
          if (!currentUser || !currentUser.emailVerified) return;
          var slug = itemSlug(name);
          if (!LIMITS.ID_PATTERN.test(slug)) return;
          var path = 'users/' + currentUser.uid + '/cart/' + slug;
          try { await fsMod.deleteDoc(fsMod.doc(db, 'users', currentUser.uid, 'cart', slug)); }
          catch (error) { handleFirestoreError(error, 'delete', path); }
        },
        saveWishlistItem: async function (item) {
          if (!currentUser || !currentUser.emailVerified || !isCatalogueProduct(item.name) || !LIMITS.HREF_PATTERN.test(item.href)) return;
          if (!fallbackCatalogLoaded) await api.loadPublicCatalog();
          var livePrice = catalogue[item.name].price;
          var slug = itemSlug(item.name);
          if (!LIMITS.ID_PATTERN.test(slug)) return;
          var path = 'users/' + currentUser.uid + '/wishlist/' + slug;
          try {
            await fsMod.setDoc(fsMod.doc(db, 'users', currentUser.uid, 'wishlist', slug), {
              uid: currentUser.uid,
              name: item.name,
              href: item.href.slice(0, LIMITS.HREF_MAX),
              image: typeof item.image === 'string' && LIMITS.IMAGE_PATTERN.test(item.image) ? item.image.slice(0, LIMITS.IMAGE_MAX) : catalogue[item.name].image,
              price: livePrice,
              createdAt: fsMod.serverTimestamp()
            });
          } catch (error) { handleFirestoreError(error, 'write', path); }
        },
        removeWishlistItem: async function (name) {
          if (!currentUser || !currentUser.emailVerified) return;
          var slug = itemSlug(name);
          if (!LIMITS.ID_PATTERN.test(slug)) return;
          var path = 'users/' + currentUser.uid + '/wishlist/' + slug;
          try { await fsMod.deleteDoc(fsMod.doc(db, 'users', currentUser.uid, 'wishlist', slug)); }
          catch (error) { handleFirestoreError(error, 'delete', path); }
        },
        saveDeliveryProfile: async function (profile) {
          if (!currentUser || !currentUser.emailVerified) throw new Error('Sign in with Google to save your delivery profile.');
          var uid = currentUser.uid;
          var path = 'users/' + uid + '/private/profile';
          var cleanPhone = String(profile.phone || '').trim();
          var cleanPin = String(profile.pinCode || '').trim();
          if (cleanPhone && !LIMITS.PHONE_PATTERN.test(cleanPhone)) throw new Error('Enter a valid 10-digit Indian mobile number.');
          if (cleanPin && !LIMITS.PIN_PATTERN.test(cleanPin)) throw new Error('Enter a valid 6-digit Indian PIN code.');
          var sanitized = {
            uid: uid,
            email: (profile.email || currentUser.email || '').trim().slice(0, LIMITS.EMAIL_MAX),
            fullName: String(profile.fullName || '').trim().slice(0, LIMITS.FULL_NAME_MAX),
            phone: cleanPhone,
            address: String(profile.address || '').trim().slice(0, LIMITS.ADDRESS_MAX),
            pinCode: cleanPin,
            city: String(profile.city || '').trim().slice(0, LIMITS.CITY_MAX),
            state: String(profile.state || '').trim().slice(0, LIMITS.STATE_MAX)
          };
          try {
            await fsMod.setDoc(fsMod.doc(db, 'users', uid, 'private', 'profile'), Object.assign({}, sanitized, { updatedAt: fsMod.serverTimestamp() }), { merge: true });
            currentProfile = sanitized;
            dispatch('redpoly:profile-updated', { profile: sanitized });
            return sanitized;
          } catch (error) { handleFirestoreError(error, 'write', path); }
        },
        placeOrder: async function (input) {
          if (!currentUser || !currentUser.emailVerified) return;
          var uid = currentUser.uid;
          var orderId = String(input.reference || '').toLowerCase().replace(/[^a-z0-9\-]/g, '');
          if (!LIMITS.ID_PATTERN.test(orderId)) throw new Error('Invalid order reference');
          var mergedBySlug = new Map();
          (input.items || []).forEach(function (item) {
            if (!item || typeof item.name !== 'string' || !isCatalogueProduct(item.name)) return;
            var slug = itemSlug(item.name);
            if (!Object.prototype.hasOwnProperty.call(SKU_TO_NAME, slug)) return;
            var prev = mergedBySlug.get(slug);
            var q = clampQty(item.quantity);
            if (prev) prev.quantity = clampQty(prev.quantity + q);
            else mergedBySlug.set(slug, { slug: slug, name: item.name, price: Number(item.price), quantity: q });
          });
          var validItems = Array.from(mergedBySlug.values());
          if (!validItems.length) throw new Error('No valid catalogue items in order');
          var orderPath = 'users/' + uid + '/orders/' + orderId;
          var orderRef = fsMod.doc(db, 'users', uid, 'orders', orderId);
          var customerName = String(input.customerName || '').trim().slice(0, LIMITS.FULL_NAME_MAX);
          var email = String(input.email || '').trim().slice(0, LIMITS.EMAIL_MAX);
          var phone = String(input.phone || '').trim();
          var address = String(input.address || '').trim().slice(0, LIMITS.ADDRESS_MAX);
          var pin = String(input.pin || '').trim();
          var city = String(input.city || '').trim().slice(0, LIMITS.CITY_MAX);
          var state = String(input.state || '').trim().slice(0, LIMITS.STATE_MAX);
          var itemCount = validItems.reduce(function (sum, item) { return sum + item.quantity; }, 0);
          try {
            await fsMod.runTransaction(db, async function (tx) {
              var stockPlans = [];
              for (var i = 0; i < validItems.length; i += 1) {
                var item = validItems[i];
                var prodRef = fsMod.doc(db, 'products', item.slug);
                var prodSnap = await tx.get(prodRef);
                if (prodSnap.exists()) {
                  var d = prodSnap.data();
                  var livePrice = Math.round(Number(d.price));
                  if (Number.isFinite(livePrice) && livePrice !== Number(item.price)) {
                    if (catalogue[item.name]) catalogue[item.name].price = livePrice;
                    throw new Error('Price for ' + item.name + ' was updated to ₹' + livePrice.toLocaleString('en-IN') + '. Please review your total and try again.');
                  }
                  var liveStock = Math.max(0, Math.floor(Number(d.stock != null ? d.stock : 0)));
                  if (liveStock <= 0) throw new Error(item.name + ' is currently out of stock.');
                  if (liveStock < item.quantity) throw new Error('Only ' + liveStock + ' left in stock for ' + item.name + '. Please adjust quantity.');
                  stockPlans.push({ item: item, prodRef: prodRef, exists: true, nextStock: liveStock - item.quantity });
                } else {
                  if (!inCatalogue(item.name, item.price)) throw new Error('Invalid price for ' + item.name + '.');
                  stockPlans.push({ item: item, prodRef: prodRef, exists: false, nextStock: 0 });
                }
              }
              tx.set(orderRef, {
                uid: uid, reference: input.reference, customerName: customerName, email: email, phone: phone,
                address: address, pin: pin, city: city, state: state,
                shippingMethod: input.shippingMethod, shippingCost: Number(input.shippingCost),
                freeShipping: Boolean(input.freeShipping), freeGift: Boolean(input.freeGift),
                subtotal: Number(input.subtotal), gstRate: Number(input.gstRate), gst: Number(input.gst),
                total: Number(input.total), itemCount: itemCount, status: 'placed', createdAt: fsMod.serverTimestamp()
              });
              stockPlans.forEach(function (plan) {
                tx.set(fsMod.doc(db, 'users', uid, 'orders', orderId, 'items', plan.item.slug), {
                  uid: uid, orderId: orderId, name: plan.item.name, price: Number(plan.item.price), quantity: plan.item.quantity
                });
                tx.delete(fsMod.doc(db, 'users', uid, 'cart', plan.item.slug));
                if (plan.exists) {
                  tx.update(plan.prodRef, { stock: plan.nextStock, updatedAt: fsMod.serverTimestamp() });
                }
              });
              if (input.saveProfile) {
                tx.set(fsMod.doc(db, 'users', uid, 'private', 'profile'), {
                  uid: uid, email: email, fullName: customerName, phone: phone, address: address, pinCode: pin, city: city, state: state, updatedAt: fsMod.serverTimestamp()
                }, { merge: true });
              }
            });
          } catch (error) {
            if (error instanceof Error && !error.code) throw error;
            handleFirestoreError(error, 'write', orderPath);
          }
        },
        listAllOrders: async function () {
          if (!isAdminUser()) throw new Error('Admin access required to view all store orders.');
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
                    lineItems.push({ name: itemData.name, price: Number(itemData.price), quantity: Number(itemData.quantity) });
                  }
                });
              } catch (itemErr) {
                handleFirestoreError(itemErr, 'list', docSnap.ref.path + '/items');
              }
              var statusVal = normalizeOrderStatus(d.status);
              var deliveredTs = d.deliveredAt;
              var deliveredAtMs = deliveredTs && typeof deliveredTs.toMillis === 'function' ? deliveredTs.toMillis() : 0;
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
                status: statusVal,
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
              if (typeof d.name === 'string') {
                var slug = itemSlug(d.name);
                if (Object.prototype.hasOwnProperty.call(SKU_TO_NAME, slug)) {
                  orderItems.push({ slug: slug, name: d.name, quantity: clampQty(d.quantity) });
                }
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
                ? patch.items.filter(function (i) { return isCatalogueProduct(i.name); }).map(function (i) { return { name: i.name, price: Number(i.price) || catalogue[i.name].price, quantity: clampQty(i.quantity) }; })
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
                if (!Object.prototype.hasOwnProperty.call(SKU_TO_NAME, sSlug)) continue;
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
        listProductReviews: async function (productSlug) {
          if (!isValidProductSlug(productSlug)) return { approved: [], mine: [] };
          var reviewsPath = 'products/' + productSlug + '/reviews';
          try {
            var approvedSnap = await fsMod.getDocs(fsMod.query(fsMod.collection(db, 'products', productSlug, 'reviews'), fsMod.where('status', '==', 'approved')));
            var approved = [];
            approvedSnap.forEach(function (docSnap) { approved.push(toReviewRecord(docSnap.id, docSnap.data(), productSlug)); });
            approved.sort(function (a, b) { return b.createdAtMs - a.createdAtMs; });
            var mine = [];
            if (currentUser) {
              var mineSnap = await fsMod.getDocs(fsMod.query(fsMod.collection(db, 'products', productSlug, 'reviews'), fsMod.where('uid', '==', currentUser.uid)));
              mineSnap.forEach(function (docSnap) { mine.push(toReviewRecord(docSnap.id, docSnap.data(), productSlug)); });
              mine.sort(function (a, b) { return b.createdAtMs - a.createdAtMs; });
            }
            return { approved: approved, mine: mine };
          } catch (error) {
            handleFirestoreError(error, 'list', reviewsPath);
          }
        },
        submitProductReview: async function (input) {
          if (!currentUser || !currentUser.emailVerified) throw new Error('Sign in with your verified Google account to submit a review.');
          if (!isValidProductSlug(input.productSlug)) throw new Error('Invalid product.');
          var orderId = String(input.orderId || '').trim();
          var itemSlugVal = String(input.itemSlug || '').trim();
          if (!LIMITS.ID_PATTERN.test(orderId)) throw new Error('Invalid order identifier.');
          if (!itemSlugMatchesProduct(itemSlugVal, input.productSlug)) throw new Error('Purchased item does not match this product.');
          var uid = currentUser.uid;
          var reviewId = uid + '__' + orderId + '__' + input.productSlug;
          if (!LIMITS.ID_PATTERN.test(reviewId)) throw new Error('Invalid review identifier.');
          var authorName = String(input.authorName || currentUser.displayName || 'REDPOLY Buyer').trim().slice(0, 80);
          var title = String(input.title || '').trim().slice(0, 120);
          var body = String(input.body || '').trim().slice(0, 1000);
          var rating = Math.max(1, Math.min(5, Math.round(Number(input.rating || 5))));
          var productName = String(input.productName || '').trim().slice(0, 80);
          var orderReference = String(input.orderReference || '').trim();
          if (!authorName) throw new Error('Please enter your name.');
          if (!title) throw new Error('Please enter a short review headline.');
          if (body.length < 5) throw new Error('Review must be at least 5 characters.');
          if (!/^RED-DEMO-[0-9]{6}$/.test(orderReference)) throw new Error('Invalid order reference.');
          var reviewPath = 'products/' + input.productSlug + '/reviews/' + reviewId;
          try {
            await fsMod.setDoc(fsMod.doc(db, 'products', input.productSlug, 'reviews', reviewId), {
              uid: uid, orderId: orderId, orderReference: orderReference, productSlug: input.productSlug, itemSlug: itemSlugVal,
              productName: productName, authorName: authorName, rating: rating, title: title, body: body,
              status: 'pending', verifiedPurchase: true, createdAt: fsMod.serverTimestamp()
            });
            return {
              id: reviewId, uid: uid, orderId: orderId, orderReference: orderReference, productSlug: input.productSlug, itemSlug: itemSlugVal,
              productName: productName, authorName: authorName, rating: rating, title: title, body: body,
              status: 'pending', verifiedPurchase: true, createdAtMs: Date.now(), moderatedAtMs: 0
            };
          } catch (error) {
            handleFirestoreError(error, 'create', reviewPath);
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
          if (!isValidProductSlug(productSlug) || !LIMITS.ID_PATTERN.test(reviewId)) throw new Error('Invalid review identifier.');
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
          if (!isValidProductSlug(productSlug) || !LIMITS.ID_PATTERN.test(reviewId)) throw new Error('Invalid review identifier.');
          var reviewPath = 'products/' + productSlug + '/reviews/' + reviewId;
          try {
            await fsMod.deleteDoc(fsMod.doc(db, 'products', productSlug, 'reviews', reviewId));
          } catch (error) {
            handleFirestoreError(error, 'delete', reviewPath);
          }
        }
      };

      window.RedpolyFirebase = api;
      dispatch('redpoly:firebase-ready', { user: api.getUser(), profile: currentProfile });
      return api;
    })().catch(function (err) {
      firebaseBootstrapPromise = null;
      throw err;
    });
    return firebaseBootstrapPromise;
  }
  window.RedpolyEnsureFirebase = ensureFirebaseClient;
  if (!window.RedpolyFirebase) {
    ensureFirebaseClient().catch(function (err) {
      console.error('Firebase CDN bridge bootstrap failed:', err);
    });
  }

  function initAccountChrome() {
    if (!homeHeader) return;
    var googleSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5H1.2v3.1C3.2 21.4 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.2 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.2C.4 8.2 0 10.1 0 12s.4 3.8 1.2 5.4l4-3.1z"/><path fill="#EA4335" d="M12 4.7c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.2 2.6 1.2 6.6l4 3.1c1-2.9 3.7-5 6.8-5z"/></svg>';
    var authToggle = document.createElement('button');
    authToggle.type = 'button';
    authToggle.className = 'auth-toggle';
    authToggle.setAttribute('aria-haspopup', 'dialog');
    authToggle.setAttribute('aria-label', 'Sign in with Google');
    authToggle.innerHTML = googleSvg + '<span class="auth-toggle__label">SIGN IN</span>';
    homeHeader.insertBefore(authToggle, cartToggle);

    var accountPanel = document.createElement('dialog');
    accountPanel.className = 'account-panel';
    accountPanel.setAttribute('aria-labelledby', 'account-panel-title');
    accountPanel.innerHTML = '<button class="account-panel__close" type="button" aria-label="Close account dialog">×</button><p class="account-panel__eyebrow">REDPOLY CREW ACCOUNT</p><h2 id="account-panel-title">SIGN IN WITH GOOGLE</h2><div id="account-panel-body"></div><p class="account-panel__status" id="account-panel-status" role="status" aria-live="polite"></p>';
    document.body.appendChild(accountPanel);

    var accountTitle = accountPanel.querySelector('#account-panel-title');
    var accountBody = accountPanel.querySelector('#account-panel-body');
    var accountStatus = accountPanel.querySelector('#account-panel-status');
    var accountClose = accountPanel.querySelector('.account-panel__close');

    function moneyFmt(amount) { return '₹' + Number(amount).toLocaleString('en-IN'); }
    function closeAccount() {
      if (accountPanel.open && accountPanel.close) accountPanel.close();
      else accountPanel.removeAttribute('open');
    }
    function setAccountStatus(msg, isOk) {
      accountStatus.textContent = msg || '';
      accountStatus.classList.toggle('is-ok', Boolean(isOk));
    }

    function updateAuthButton(user) {
      authToggle.textContent = '';
      if (user) {
        authToggle.classList.add('is-signed-in');
        authToggle.hidden = true;
        authToggle.setAttribute('aria-hidden', 'true');
        authToggle.setAttribute('aria-label', 'Signed in as ' + (user.displayName || user.email || 'REDPOLY Member'));
      } else {
        authToggle.hidden = false;
        authToggle.removeAttribute('aria-hidden');
        authToggle.classList.remove('is-signed-in');
        authToggle.setAttribute('aria-label', 'Sign in with Google');
        authToggle.innerHTML = googleSvg + '<span class="auth-toggle__label">SIGN IN</span>';
      }
    }

    function renderAccountModal() {
      var fb = window.RedpolyFirebase;
      var user = fb ? fb.getUser() : null;
      var profile = fb ? fb.getProfile() : null;
      var orders = fb ? fb.getOrders() : [];
      updateAuthButton(user);
      accountBody.textContent = '';

      if (!user) {
        accountTitle.textContent = 'SIGN IN WITH GOOGLE';
        var copy = document.createElement('p');
        copy.className = 'account-panel__copy';
        copy.textContent = 'Use your Google account to sync your cart, saved toys, delivery details, and REDPOLY demo order history across devices.';
        var perks = document.createElement('ul');
        perks.className = 'account-panel__perks';
        ['Sync shopping cart across browser tabs and devices', 'Keep your Saved toys list tied to your account', 'Pre-fill checkout and track your REDPOLY orders'].forEach(function (text) {
          var li = document.createElement('li');
          li.textContent = text;
          perks.appendChild(li);
        });
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'google-signin-btn';
        btn.innerHTML = googleSvg + '<span>CONTINUE WITH GOOGLE</span>';
        btn.addEventListener('click', async function () {
          btn.disabled = true;
          if (!window.RedpolyFirebase) {
            setAccountStatus('Loading authentication…', true);
            try {
              await ensureFirebaseClient();
            } catch (loadErr) {
              console.error(loadErr);
            }
          }
          if (!window.RedpolyFirebase) {
            btn.disabled = false;
            setAccountStatus('Could not initialize Firebase authentication. Please check your connection and refresh.', false);
            return;
          }
          setAccountStatus('Opening Google sign-in…', true);
          try {
            var signedIn = await window.RedpolyFirebase.signInWithGoogle();
            if (signedIn) {
              setAccountStatus('Signed in as ' + (signedIn.displayName || signedIn.email), true);
              showToast('Signed in with Google');
            } else {
              setAccountStatus('', false);
            }
          } catch (err) {
            var code = err && err.code ? String(err.code) : '';
            var msg = err && err.message ? err.message : 'Google sign-in failed.';
            if (code === 'auth/unauthorized-domain' || msg.indexOf('unauthorized-domain') !== -1) {
              setAccountStatus('This domain (' + window.location.hostname + ') must be added to Firebase Console → Authentication → Settings → Authorized domains.', false);
            } else if (code === 'auth/popup-blocked' || msg.indexOf('popup-blocked') !== -1) {
              setAccountStatus('Popup was blocked by your browser. Please allow popups and try again.', false);
            } else if (code === 'auth/operation-not-allowed') {
              setAccountStatus('Google Sign-In is not enabled in Firebase Authentication for this project.', false);
            } else {
              setAccountStatus('Could not sign in with Google. Please try again.', false);
            }
          } finally {
            btn.disabled = false;
          }
        });
        accountBody.appendChild(copy);
        accountBody.appendChild(perks);
        accountBody.appendChild(btn);
        var guestPageLink = document.createElement('a');
        guestPageLink.className = 'account-panel__page-link';
        guestPageLink.href = '/account';
        guestPageLink.textContent = 'OPEN FULL MY ACCOUNT PAGE →';
        accountBody.appendChild(guestPageLink);
        return;
      }

      accountTitle.textContent = 'YOUR ACCOUNT';
      var card = document.createElement('div');
      card.className = 'account-user-card';
      var info = document.createElement('div');
      info.className = 'account-user-card__info';
      if (user.photoURL) {
        var avatar = document.createElement('img');
        avatar.className = 'account-user-card__avatar';
        avatar.src = user.photoURL;
        avatar.alt = '';
        avatar.referrerPolicy = 'no-referrer';
        info.appendChild(avatar);
      } else {
        var init = document.createElement('span');
        init.className = 'account-user-card__initial';
        init.textContent = (user.displayName || 'R').charAt(0).toUpperCase();
        info.appendChild(init);
      }
      var textWrap = document.createElement('div');
      textWrap.className = 'account-user-card__text';
      var nameEl = document.createElement('strong');
      nameEl.textContent = user.displayName || 'REDPOLY Member';
      var emailEl = document.createElement('span');
      emailEl.textContent = user.email || '';
      textWrap.appendChild(nameEl);
      textWrap.appendChild(emailEl);
      info.appendChild(textWrap);

      var signOutBtn = document.createElement('button');
      signOutBtn.type = 'button';
      signOutBtn.className = 'account-signout-btn';
      signOutBtn.textContent = 'SIGN OUT';
      signOutBtn.addEventListener('click', async function () {
        if (!window.RedpolyFirebase) return;
        signOutBtn.disabled = true;
        try {
          await window.RedpolyFirebase.signOut();
          setAccountStatus('Signed out.', true);
          showToast('Signed out');
        } catch (err) {
          setAccountStatus('Could not sign out. Please try again.', false);
        } finally {
          signOutBtn.disabled = false;
        }
      });
      card.appendChild(info);
      card.appendChild(signOutBtn);
      accountBody.appendChild(card);

      var pageLink = document.createElement('a');
      pageLink.className = 'account-panel__page-link';
      pageLink.href = '/account';
      pageLink.textContent = 'OPEN FULL MY ACCOUNT PAGE (ADDRESS, ORDERS & FAVORITES) →';
      accountBody.appendChild(pageLink);

      // Delivery profile section
      var profileSection = document.createElement('section');
      profileSection.className = 'account-section';
      profileSection.innerHTML = '<div class="account-section__title"><h3>DELIVERY DETAILS</h3><span class="account-section__badge">CLOUD SYNCED</span></div>';
      var form = document.createElement('form');
      form.className = 'account-profile-grid';
      form.noValidate = true;
      var fields = [
        { name: 'fullName', label: 'FULL NAME', val: (profile && profile.fullName) || user.displayName || '', max: 120, wide: true, ph: 'Your full name' },
        { name: 'phone', label: 'MOBILE (10 DIGITS)', val: (profile && profile.phone) || '', max: 10, wide: false, ph: '9876543210' },
        { name: 'pinCode', label: 'PIN CODE', val: (profile && profile.pinCode) || '', max: 6, wide: false, ph: '400001' },
        { name: 'address', label: 'ADDRESS', val: (profile && profile.address) || '', max: 300, wide: true, ph: 'House, street, area' },
        { name: 'city', label: 'CITY', val: (profile && profile.city) || '', max: 100, wide: false, ph: 'City' },
        { name: 'state', label: 'STATE', val: (profile && profile.state) || '', max: 100, wide: false, ph: 'State' }
      ];
      fields.forEach(function (f) {
        var lbl = document.createElement('label');
        lbl.className = 'account-field' + (f.wide ? ' account-field--wide' : '');
        lbl.textContent = f.label;
        var inp = document.createElement('input');
        inp.name = f.name;
        inp.value = f.val;
        inp.maxLength = f.max;
        inp.placeholder = f.ph;
        lbl.appendChild(inp);
        form.appendChild(lbl);
      });
      var saveProfileBtn = document.createElement('button');
      saveProfileBtn.type = 'submit';
      saveProfileBtn.className = 'account-save-btn account-field--wide';
      saveProfileBtn.textContent = 'SAVE DELIVERY DETAILS';
      form.appendChild(saveProfileBtn);
      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (!window.RedpolyFirebase) return;
        saveProfileBtn.disabled = true;
        setAccountStatus('Saving delivery details…', true);
        try {
          await window.RedpolyFirebase.saveDeliveryProfile({
            email: user.email || '',
            fullName: form.elements.fullName.value,
            phone: form.elements.phone.value,
            address: form.elements.address.value,
            pinCode: form.elements.pinCode.value,
            city: form.elements.city.value,
            state: form.elements.state.value
          });
          setAccountStatus('Delivery details saved to your Google account.', true);
          showToast('Delivery details saved');
        } catch (err) {
          setAccountStatus(err && err.message ? err.message : 'Could not save details.', false);
        } finally {
          saveProfileBtn.disabled = false;
        }
      });
      profileSection.appendChild(form);
      accountBody.appendChild(profileSection);

      // Order history section
      var ordersSection = document.createElement('section');
      ordersSection.className = 'account-section';
      ordersSection.innerHTML = '<div class="account-section__title"><h3>ORDER HISTORY</h3><span class="account-section__badge">' + orders.length + '</span></div>';
      if (!orders.length) {
        var emptyOrders = document.createElement('p');
        emptyOrders.className = 'account-empty-orders';
        emptyOrders.textContent = 'No orders placed under this account yet. Demo orders completed while signed in appear here.';
        ordersSection.appendChild(emptyOrders);
      } else {
        var list = document.createElement('ul');
        list.className = 'account-orders-list';
        orders.forEach(function (order) {
          var li = document.createElement('li');
          li.className = 'account-order-card';
          var top = document.createElement('div');
          top.className = 'account-order-card__top';
          var ref = document.createElement('span');
          ref.className = 'account-order-card__ref';
          ref.textContent = order.reference + ' · ' + String(order.status || 'placed').toUpperCase();
          var total = document.createElement('strong');
          total.className = 'account-order-card__total';
          total.textContent = moneyFmt(order.total);
          top.appendChild(ref);
          top.appendChild(total);
          var meta = document.createElement('p');
          meta.className = 'account-order-card__meta';
          var dateStr = order.createdAtMs ? new Date(order.createdAtMs).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
          meta.textContent = dateStr + ' · ' + String(order.shippingMethod || 'standard').toUpperCase() + ' · PIN ' + order.pin;
          var itemsLine = document.createElement('p');
          itemsLine.className = 'account-order-card__items';
          itemsLine.textContent = (order.items && order.items.length)
            ? order.items.map(function (i) { return i.name + ' × ' + i.quantity; }).join(', ')
            : order.itemCount + ' item(s)';
          li.appendChild(top);
          li.appendChild(meta);
          li.appendChild(itemsLine);
          list.appendChild(li);
        });
        ordersSection.appendChild(list);
      }
      accountBody.appendChild(ordersSection);
    }

    authToggle.addEventListener('click', function () {
      setAccountStatus('', false);
      renderAccountModal();
      if (accountPanel.showModal) accountPanel.showModal();
      else accountPanel.setAttribute('open', '');
    });
    accountClose.addEventListener('click', closeAccount);
    accountPanel.addEventListener('click', function (event) { if (event.target === accountPanel) closeAccount(); });
    window.addEventListener('redpoly:firebase-ready', renderAccountModal);
    window.addEventListener('redpoly:auth-changed', renderAccountModal);
    window.addEventListener('redpoly:profile-updated', renderAccountModal);
    window.addEventListener('redpoly:orders-updated', renderAccountModal);
    window.addEventListener('redpoly:auth-error', function (event) {
      if (event.detail && event.detail.message) setAccountStatus(event.detail.message, false);
    });
    renderAccountModal();
  }
  initAccountChrome();

  function initShopChrome() {
    var cartLayer = document.createElement('div');
    cartLayer.className = 'cart-layer';
    cartLayer.hidden = true;
    cartLayer.innerHTML = '<button class="cart-backdrop" type="button" aria-label="Close shopping cart"></button><aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabindex="-1"><header class="cart-drawer__header"><div><p>YOUR REDPOLY CART</p><h2 id="cart-title">SHOPPING CART <span class="cart-drawer__count">0</span></h2></div><button class="cart-drawer__close" type="button" aria-label="Close shopping cart">×</button></header><div class="cart-drawer__items" id="cart-items"></div><p class="cart-empty" id="cart-empty">Your cart is empty. Pick something from the shop to get started.</p><button class="cart-undo" id="cart-undo" type="button" hidden>UNDO REMOVAL</button><footer class="cart-drawer__footer"><section class="cart-reward-progress" aria-label="Cart rewards"><p class="cart-reward-progress__title">CART REWARDS</p><div class="cart-reward" id="shipping-reward"><span class="cart-reward__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M2.5 6.5h12v10h-12zM14.5 10h4l3 3v3.5h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg></span><div class="cart-reward__body"><div class="cart-reward__copy"><strong>FREE SHIPPING</strong><span id="shipping-reward-copy">Add more to unlock free Standard &amp; Express shipping</span></div><div class="cart-reward__track" id="shipping-reward-track" role="progressbar" aria-label="Progress toward free shipping" aria-valuemin="0" aria-valuemax="2000" aria-valuenow="0"><span></span></div></div></div><div class="cart-reward" id="gift-reward"><span class="cart-reward__icon cart-reward__icon--gift" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11h17v9.5h-17z"/><path d="M2.5 7.5h19V11h-19z"/><path d="M12 7.5v13"/><path d="M12 7.5c-1.6 0-4.2-.6-4.2-2.6 0-1.4 1.2-2.2 2.4-2.2 1.6 0 1.8 2 1.8 4.8Zm0 0c1.6 0 4.2-.6 4.2-2.6 0-1.4-1.2-2.2-2.4-2.2-1.6 0-1.8 2-1.8 4.8Z"/></svg></span><div class="cart-reward__body"><div class="cart-reward__copy"><strong>FREE GIFT</strong><span id="gift-reward-copy">Add more to unlock a free gift</span></div><div class="cart-reward__track" id="gift-reward-track" role="progressbar" aria-label="Progress toward a free gift" aria-valuemin="0" aria-valuemax="3500" aria-valuenow="0"><span></span></div></div></div></section><p class="cart-subtotal"><span>ITEMS (INCL. GST)</span><strong id="cart-subtotal">₹0</strong></p><button class="cart-checkout" id="cart-checkout" type="button" disabled>PROCEED TO CHECKOUT <span aria-hidden="true">↗</span></button><p class="cart-checkout-note" id="cart-checkout-note" role="status" aria-live="polite" tabindex="-1">This is demo checkout only; no payment is collected. Your cart is saved in this browser.</p></footer></aside></div>';
    document.body.appendChild(cartLayer);
    var cartDrawer = cartLayer.querySelector('.cart-drawer');
    var cartItemsNode = cartLayer.querySelector('#cart-items');
    var cartEmptyNode = cartLayer.querySelector('#cart-empty');
    var cartSubtotalNode = cartLayer.querySelector('#cart-subtotal');
    var cartCheckout = cartLayer.querySelector('#cart-checkout');
    var cartUndo = cartLayer.querySelector('#cart-undo');
    var shippingRewardCopy = cartLayer.querySelector('#shipping-reward-copy');
    var shippingRewardTrack = cartLayer.querySelector('#shipping-reward-track');
    var giftRewardCopy = cartLayer.querySelector('#gift-reward-copy');
    var giftRewardTrack = cartLayer.querySelector('#gift-reward-track');
    var cartReturnFocus = null;
    var lastRemovedItem = null;
    var mobileCartBar = null;
    var mobileCartPerk = null;
    var mobileCartTotal = null;
    var mobileCartSummaryBtn = null;
    var mobileCartCta = null;
    var mobileCartBlocked = false;
    if (document.getElementById('shop') && !document.querySelector('.char-buy-row .add-btn')) {
      mobileCartBar = document.createElement('div');
      mobileCartBar.className = 'mobile-cart-bar';
      mobileCartBar.setAttribute('role', 'region');
      mobileCartBar.setAttribute('aria-label', 'Shopping cart quick bar');
      mobileCartBar.setAttribute('aria-hidden', 'true');
      mobileCartSummaryBtn = document.createElement('button');
      mobileCartSummaryBtn.type = 'button';
      mobileCartSummaryBtn.className = 'mobile-cart-bar__summary';
      mobileCartSummaryBtn.tabIndex = -1;
      mobileCartPerk = document.createElement('span');
      mobileCartPerk.className = 'mobile-cart-bar__perk';
      mobileCartTotal = document.createElement('strong');
      mobileCartTotal.className = 'mobile-cart-bar__total';
      mobileCartSummaryBtn.appendChild(mobileCartPerk);
      mobileCartSummaryBtn.appendChild(mobileCartTotal);
      mobileCartCta = document.createElement('button');
      mobileCartCta.type = 'button';
      mobileCartCta.className = 'mobile-cart-bar__cta';
      mobileCartCta.tabIndex = -1;
      mobileCartCta.innerHTML = 'CHECKOUT <span aria-hidden="true">→</span>';
      mobileCartSummaryBtn.addEventListener('click', function () { openCart(); });
      mobileCartCta.addEventListener('click', function () {
        if (mobileCartBlocked || !cartItems.length) {
          openCart();
        } else {
          window.location.href = '/checkout';
        }
      });
      mobileCartBar.appendChild(mobileCartSummaryBtn);
      mobileCartBar.appendChild(mobileCartCta);
      document.body.appendChild(mobileCartBar);
    }
    var liveCatalogState = initialCatalogSnapshot;
    function getLiveCatalogMap() {
      var fb = window.RedpolyFirebase;
      if (fb && typeof fb.getCatalogMap === 'function') {
        return fb.getCatalogMap();
      }
      return liveCatalogState;
    }
    function getLiveRecord(skuOrName) {
      var map = getLiveCatalogMap();
      var key = String(skuOrName || '').trim();
      return map[key] || map[key.toUpperCase()] || null;
    }
    function getCartSuggestions() {
      return Object.keys(catalogue).map(function (name) {
        var rec = getLiveRecord(name);
        return {
          name: name,
          price: rec ? rec.price : catalogue[name].price,
          href: catalogue[name].href,
          outOfStock: Boolean(rec && rec.initialized && rec.stock === 0)
        };
      });
    }
    function money(amount) { return '₹' + Number(amount).toLocaleString('en-IN'); }
    function persistCart() {
      try { window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems)); } catch (ignoreSaveError) { /* Cart remains usable for this page view. */ }
      window.dispatchEvent(new CustomEvent('redpoly:cart-local-sync', { detail: { items: cartItems.slice() } }));
    }
    function renderCart() {
      var quantity = cartItems.reduce(function (total, item) { return total + item.quantity; }, 0);
      var subtotal = cartItems.reduce(function (total, item) { return total + item.price * item.quantity; }, 0);
      function updateReward(copy, track, threshold, rewardName) {
        var reached = subtotal >= threshold;
        var remaining = Math.max(0, threshold - subtotal);
        var reward = copy.closest('.cart-reward');
        if (reward) reward.classList.toggle('is-unlocked', reached);
        copy.textContent = reached ? rewardName + ' unlocked!' : 'Add ' + money(remaining) + ' more to unlock ' + rewardName.toLowerCase() + '.';
        var progress = Math.min(100, (subtotal / threshold) * 100);
        track.setAttribute('aria-valuenow', String(Math.min(subtotal, threshold)));
        track.setAttribute('aria-valuetext', reached ? rewardName + ' unlocked' : money(remaining) + ' remaining');
        track.firstElementChild.style.width = progress + '%';
      }
      updateReward(shippingRewardCopy, shippingRewardTrack, 2000, 'Free shipping');
      updateReward(giftRewardCopy, giftRewardTrack, 3500, 'Free gift');
      var countEls = cartLayer.querySelectorAll('.cart-drawer__count');
      Array.prototype.forEach.call(countEls, function (el) { el.textContent = quantity; });
      cartToggle.querySelector('.cart-toggle__count').textContent = quantity;
      cartToggle.setAttribute('aria-label', 'Open shopping cart, ' + quantity + (quantity === 1 ? ' item' : ' items'));
      cartItemsNode.textContent = '';
      cartItemsNode.style.flex = cartItems.length ? '1' : '0';
      cartEmptyNode.hidden = cartItems.length > 0;
      cartCheckout.disabled = cartItems.length === 0;
      cartSubtotalNode.textContent = money(subtotal);
      var anyStockBlocked = false;
      cartItems.forEach(function (item) {
        var rec = getLiveRecord(item.name);
        var stockManaged = Boolean(rec && rec.initialized);
        var availStock = stockManaged ? rec.stock : null;
        var isOut = stockManaged && availStock === 0;
        var exceedsStock = stockManaged && item.quantity > availStock;
        if (isOut || exceedsStock) anyStockBlocked = true;

        var row = document.createElement('article'); row.className = 'cart-item';
        var image = document.createElement('img'); image.className = 'cart-item__image'; image.loading = 'lazy';
        image.src = catalogue[item.name] ? catalogue[item.name].image : '';
        image.alt = item.name;
        var details = document.createElement('div'); details.className = 'cart-item__details';
        var name = document.createElement('h3'); name.textContent = item.name;
        var lineTotal = document.createElement('p'); lineTotal.textContent = money(item.price) + ' each · ' + money(item.price * item.quantity) + ' line total';
        details.appendChild(name); details.appendChild(lineTotal);
        if (isOut) {
          var outNote = document.createElement('p');
          outNote.className = 'cart-item__stock cart-item__stock--out';
          outNote.textContent = 'OUT OF STOCK: remove to check out';
          details.appendChild(outNote);
        } else if (exceedsStock) {
          var overNote = document.createElement('p');
          overNote.className = 'cart-item__stock cart-item__stock--out';
          overNote.textContent = 'ONLY ' + availStock + ' LEFT IN STOCK: reduce quantity';
          details.appendChild(overNote);
        } else if (stockManaged && availStock <= rec.lowStockThreshold) {
          var lowNote = document.createElement('p');
          lowNote.className = 'cart-item__stock cart-item__stock--low';
          lowNote.textContent = 'ONLY ' + availStock + ' LEFT IN STOCK!';
          details.appendChild(lowNote);
        }
        var controls = document.createElement('div'); controls.className = 'cart-item__controls';
        [['decrease','−','Decrease quantity of ' + item.name],['increase','+','Increase quantity of ' + item.name]].forEach(function (control) {
          var button = document.createElement('button'); button.type='button'; button.className='cart-quantity-button'; button.setAttribute('data-cart-action',control[0]); button.setAttribute('data-cart-id',item.id); button.setAttribute('aria-label',control[2]); button.textContent=control[1];
          if (control[0] === 'increase' && stockManaged && item.quantity >= availStock) {
            button.disabled = true;
          }
          controls.appendChild(button);
          if (control[0] === 'decrease') { var amount = document.createElement('span'); amount.className='cart-item__quantity'; amount.textContent=item.quantity; controls.insertBefore(amount, controls.lastChild); }
        });
        var remove = document.createElement('button'); remove.type='button'; remove.className='cart-item__remove'; remove.setAttribute('data-cart-action','remove'); remove.setAttribute('data-cart-id',item.id); remove.textContent='REMOVE'; controls.appendChild(remove);
        row.appendChild(image); row.appendChild(details); row.appendChild(controls); cartItemsNode.appendChild(row);
      });
      if (anyStockBlocked) {
        cartCheckout.disabled = true;
      }
      cartUndo.hidden = !lastRemovedItem;
      cartUndo.textContent = lastRemovedItem ? 'UNDO REMOVAL · ' + lastRemovedItem.item.name : 'UNDO REMOVAL';
      var availableSuggestions = getCartSuggestions().filter(function (suggestion) {
        return !suggestion.outOfStock && !cartItems.some(function (item) { return item.name === suggestion.name; });
      });
      if (availableSuggestions.length) {
        var suggestionPanel = document.createElement('section'); suggestionPanel.className = 'cart-recommendations';
        var suggestionTitle = document.createElement('h3'); suggestionTitle.textContent = 'ADD TO YOUR CART'; suggestionPanel.appendChild(suggestionTitle);
        availableSuggestions.slice(0, 2).forEach(function (suggestion) {
          var row = document.createElement('div'); row.className = 'cart-recommendation';
          var link = document.createElement('a'); link.href = suggestion.href; link.textContent = suggestion.name;
          var add = document.createElement('button'); add.type = 'button'; add.className = 'cart-recommendation__add'; add.textContent = '+ ' + money(suggestion.price);
          add.setAttribute('aria-label', 'Add ' + suggestion.name + ' for ' + money(suggestion.price));
          add.addEventListener('click', function () { addCartItem(add); });
          add.setAttribute('data-name', suggestion.name); add.setAttribute('data-price', String(suggestion.price));
          row.appendChild(link); row.appendChild(add); suggestionPanel.appendChild(row);
        });
        cartItemsNode.appendChild(suggestionPanel);
      }
      if (mobileCartBar) {
        mobileCartBlocked = anyStockBlocked;
        var hasCartItems = quantity > 0;
        mobileCartBar.classList.toggle('is-visible', hasCartItems);
        mobileCartBar.setAttribute('aria-hidden', hasCartItems ? 'false' : 'true');
        mobileCartSummaryBtn.tabIndex = hasCartItems ? 0 : -1;
        if (mobileCartCta) mobileCartCta.tabIndex = hasCartItems ? 0 : -1;
        document.body.classList.toggle('has-mobile-cart-bar', hasCartItems);
        if (hasCartItems) {
          if (subtotal < 2000) {
            mobileCartPerk.textContent = 'ADD ' + money(2000 - subtotal) + ' FOR FREE EXPRESS';
          } else if (subtotal < 3500) {
            mobileCartPerk.textContent = '✓ FREE EXPRESS · +' + money(3500 - subtotal) + ' FOR GIFT';
          } else {
            mobileCartPerk.textContent = '✓ FREE EXPRESS + FREE GIFT UNLOCKED';
          }
          mobileCartTotal.textContent = quantity + (quantity === 1 ? ' ITEM · ' : ' ITEMS · ') + money(subtotal);
          mobileCartSummaryBtn.setAttribute('aria-label', 'Open cart, ' + quantity + (quantity === 1 ? ' item, ' : ' items, ') + money(subtotal));
        }
      }
    }
    function openCart() {
      cartReturnFocus = document.activeElement;
      cartLayer.hidden = false;
      document.body.classList.add('cart-open');
      cartToggle.setAttribute('aria-expanded','true');
      requestAnimationFrame(function () { cartLayer.classList.add('cart-layer--open'); cartDrawer.focus(); });
    }
    function closeCart() {
      cartLayer.classList.remove('cart-layer--open');
      document.body.classList.remove('cart-open');
      cartToggle.setAttribute('aria-expanded','false');
      cartLayer.hidden = true;
      if (cartReturnFocus && cartReturnFocus.focus) cartReturnFocus.focus();
    }
    function addCartItem(button, feedbackButton) {
      var name = button.getAttribute('data-name') || '';
      if (!isCatalogueProduct(name)) return;
      var rec = getLiveRecord(name);
      var price = rec ? rec.price : (Number(button.getAttribute('data-price')) || catalogue[name].price);
      if (rec && rec.initialized) {
        if (rec.stock <= 0) {
          showToast(name + ' is out of stock');
          return;
        }
        var currentInCart = cartItems.reduce(function (sum, entry) {
          return entry.name === name ? sum + entry.quantity : sum;
        }, 0);
        if (currentInCart + 1 > rec.stock) {
          showToast('Only ' + rec.stock + ' left in stock for ' + name);
          return;
        }
      }
      var id = name.toLowerCase() + '|' + price;
      var existing = cartItems.find(function (item) { return item.id === id; });
      if (existing) existing.quantity += 1;
      else {
        existing = { id:id, name:name, price:price, quantity:1 };
        cartItems.push(existing);
      }
      persistCart(); renderCart(); openCart();
      if (window.RedpolyFirebase) window.RedpolyFirebase.syncCartItem(existing).catch(function (err) { console.error(err); });
      var feedback = feedbackButton || button;
      if (!Object.prototype.hasOwnProperty.call(feedback.dataset, 'originalHtml')) {
        feedback.dataset.originalHtml = feedback.innerHTML;
      }
      clearTimeout(feedback._addedTimer);
      feedback.classList.add('added'); feedback.innerHTML = '✓ ADDED';
      feedback._addedTimer = setTimeout(function () {
        feedback.classList.remove('added');
        feedback.innerHTML = feedback.dataset.originalHtml;
        delete feedback.dataset.originalHtml;
      }, 1600);
    }
    cartToggle.addEventListener('click', openCart);
    cartUndo.addEventListener('click', function () {
      if (!lastRemovedItem) return;
      var rec = getLiveRecord(lastRemovedItem.item.name);
      if (rec && rec.initialized && rec.stock <= 0) {
        showToast(lastRemovedItem.item.name + ' is out of stock');
        return;
      }
      var existing = cartItems.find(function (entry) { return entry.id === lastRemovedItem.item.id; });
      if (existing) existing.quantity += lastRemovedItem.item.quantity;
      else {
        existing = lastRemovedItem.item;
        cartItems.splice(Math.min(lastRemovedItem.index, cartItems.length), 0, existing);
      }
      lastRemovedItem = null; persistCart(); renderCart();
      if (window.RedpolyFirebase) window.RedpolyFirebase.syncCartItem(existing).catch(function (err) { console.error(err); });
    });
    cartLayer.querySelector('.cart-backdrop').addEventListener('click', closeCart);
    cartLayer.querySelector('.cart-drawer__close').addEventListener('click', closeCart);
    cartLayer.addEventListener('click', function (event) {
      var control = event.target.closest('[data-cart-action]');
      if (!control) return;
      var item = cartItems.find(function (entry) { return entry.id === control.getAttribute('data-cart-id'); });
      if (!item) return;
      var action = control.getAttribute('data-cart-action');
      if (action === 'increase') {
        var rec = getLiveRecord(item.name);
        if (rec && rec.initialized && item.quantity + 1 > rec.stock) {
          showToast('Only ' + rec.stock + ' left in stock for ' + item.name);
          return;
        }
        item.quantity += 1;
        if (window.RedpolyFirebase) window.RedpolyFirebase.syncCartItem(item).catch(function (err) { console.error(err); });
      } else if (action === 'decrease') {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          lastRemovedItem = { item: { id:item.id, name:item.name, price:item.price, quantity:1 }, index:cartItems.indexOf(item) };
          cartItems = cartItems.filter(function (entry) { return entry.id !== item.id; });
          if (window.RedpolyFirebase) window.RedpolyFirebase.removeCartItem(item.name).catch(function (err) { console.error(err); });
        } else if (window.RedpolyFirebase) {
          window.RedpolyFirebase.syncCartItem(item).catch(function (err) { console.error(err); });
        }
      } else if (action === 'remove') {
        lastRemovedItem = { item: { id:item.id, name:item.name, price:item.price, quantity:item.quantity }, index:cartItems.indexOf(item) };
        cartItems = cartItems.filter(function (entry) { return entry.id !== item.id; });
        if (window.RedpolyFirebase) window.RedpolyFirebase.removeCartItem(item.name).catch(function (err) { console.error(err); });
      }
      persistCart(); renderCart();
    });
    cartCheckout.addEventListener('click', function () {
      if (cartItems.length) window.location.href = '/checkout';
    });
    document.addEventListener('keydown', function (event) {
      if (cartLayer.hidden) return;
      if (event.key === 'Escape') { closeCart(); return; }
      if (event.key !== 'Tab') return;
      var focusable = Array.prototype.slice.call(cartDrawer.querySelectorAll('button:not(:disabled),[href],input:not(:disabled)'));
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable[focusable.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) { event.preventDefault(); focusable[0].focus(); }
    });
    window.addEventListener('storage', function (event) {
      if (event.key !== cartStorageKey) return;
      try {
        var synced = JSON.parse(event.newValue || '[]');
        cartItems = Array.isArray(synced) ? synced.filter(function (item) { return item && typeof item.name === 'string' && isCatalogueProduct(item.name) && Number(item.quantity) >= 1; }).map(function (item) { var livePrice = catalogue[item.name] ? catalogue[item.name].price : Number(item.price); return { id:item.name.toLowerCase() + '|' + livePrice, name:item.name, price:livePrice, quantity:Math.floor(Number(item.quantity)) }; }) : [];
      } catch (ignoreStorageEvent) { cartItems = []; }
      renderCart();
    });
    window.addEventListener('redpoly:cart-updated', function (event) {
      if (!event.detail || !Array.isArray(event.detail.items)) return;
      cartItems = event.detail.items.slice();
      renderCart();
    });
    window.addEventListener('redpoly:cart-local-sync', function (event) {
      if (!event.detail || event.detail.source !== 'checkout' || !Array.isArray(event.detail.items)) return;
      cartItems = event.detail.items.slice();
      lastRemovedItem = null;
      renderCart();
    });
    window.addEventListener('redpoly:open-cart', openCart);
    renderCart();
    var editCartUrl = new URL(window.location.href);
    if (editCartUrl.searchParams.get('editCart') === '1') {
      editCartUrl.searchParams.delete('editCart');
      window.history.replaceState(null, '', editCartUrl.pathname + editCartUrl.search + editCartUrl.hash);
      openCart();
    }

    // Mobile sticky buy bar for product detail pages (not the multi-product homepage).
    var heroBuy = document.querySelector('.char-buy-row .add-btn');
    var stickyPriceNode = null;
    var stickyButtonRef = null;
    if (heroBuy) {
      var stickyBar = document.createElement('div'); stickyBar.className='mobile-buy-bar';
      var stickyPrice = document.createElement('div'); stickyPrice.className='mobile-buy-bar__price';
      stickyPrice.innerHTML='<small>YOUR PICK</small><strong></strong>';
      var priceNode = document.querySelector('.char-buy-row .char-price strong');
      if (priceNode) stickyPrice.querySelector('strong').textContent=priceNode.textContent;
      stickyPriceNode = stickyPrice.querySelector('strong');
      var stickyButton = heroBuy.cloneNode(false); stickyButton.innerHTML='ADD TO CART';
      stickyButtonRef = stickyButton;
      stickyButton.classList.remove('add-btn');
      stickyButton.classList.add('mobile-buy-bar__button');
      stickyButton.type = 'button';
      stickyButton.tabIndex = -1;
      stickyButton.setAttribute('aria-label','Add ' + (heroBuy.getAttribute('data-name') || 'product') + ' to cart');
      stickyButton.addEventListener('click', function () { addCartItem(heroBuy, stickyButton); });
      stickyBar.appendChild(stickyPrice); stickyBar.appendChild(stickyButton); document.body.appendChild(stickyBar);
      var finalCta = document.querySelector('.char-final-cta');
      var scrollFrame = false;
      function syncStickyBuy() {
        scrollFrame = false;
        // On phones the bar only appears once the main buy button has scrolled away above the viewport,
        // so it never doubles up with the buy button that is still on screen, and it steps aside for
        // the cart drawer and the closing call to action.
        var buyRect = heroBuy.getBoundingClientRect();
        var buyPassed = buyRect.bottom <= 0;
        var atFinal = finalCta && finalCta.getBoundingClientRect().top < window.innerHeight && finalCta.getBoundingClientRect().bottom > 0;
        var visible = buyPassed && !atFinal && window.innerWidth <= 760;
        stickyBar.classList.toggle('mobile-buy-bar--visible', visible);
        stickyBar.setAttribute('aria-hidden', visible ? 'false' : 'true');
        stickyButton.tabIndex = visible ? 0 : -1;
      }
      function requestStickySync() { if (!scrollFrame) { scrollFrame=true; requestAnimationFrame(syncStickyBuy); } }
      window.addEventListener('scroll',requestStickySync,{passive:true}); window.addEventListener('resize',requestStickySync); syncStickyBuy();
    }

    // Product gallery: full mockup, close-up crop, and an accessible lightbox zoom.
    document.querySelectorAll('.accessory-stage .accessory-product-image').forEach(function (image) {
      var stage = image.closest('.accessory-stage');
      var controls = document.createElement('div'); controls.className='accessory-gallery-controls'; controls.setAttribute('role','group'); controls.setAttribute('aria-label','Product image views');
      [['full','FULL VIEW'],['detail','CLOSE-UP']].forEach(function (view,index) {
        var button=document.createElement('button'); button.type='button'; button.className='gallery-thumb'+(index===0?' is-active':''); button.setAttribute('data-gallery-view',view[0]); button.setAttribute('aria-label',view[1] === 'FULL VIEW' ? 'Show full product mockup' : 'Show a close-up crop of the mockup'); button.setAttribute('aria-pressed',index===0?'true':'false');
        var thumb=document.createElement('img'); thumb.src=image.src; thumb.alt=''; if(view[0]==='detail') thumb.className='gallery-thumb__crop'; button.appendChild(thumb); var label=document.createElement('span'); label.textContent=view[1]; button.appendChild(label); controls.appendChild(button);
      });
      var zoomButton=document.createElement('button'); zoomButton.type='button'; zoomButton.className='gallery-zoom-button'; zoomButton.textContent='ZOOM'; zoomButton.setAttribute('aria-label','Open a larger view of this product image'); controls.appendChild(zoomButton); stage.appendChild(controls);
      controls.addEventListener('click',function(event){
        var viewButton=event.target.closest('[data-gallery-view]'); if(!viewButton)return;
        image.closest('.accessory-gallery__viewport').setAttribute('data-view',viewButton.getAttribute('data-gallery-view'));
        controls.querySelectorAll('[data-gallery-view]').forEach(function(button){var active=button===viewButton;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',active?'true':'false');});
      });
      var zoom=document.createElement('dialog'); zoom.className='product-zoom'; zoom.setAttribute('aria-label','Zoomed product image');
      var close=document.createElement('button'); close.type='button'; close.className='product-zoom__close'; close.textContent='CLOSE ×'; close.setAttribute('aria-label','Close zoomed product image');
      var zoomImage=document.createElement('img'); zoomImage.src=image.src; zoomImage.alt=image.alt;
      zoom.appendChild(close); zoom.appendChild(zoomImage); document.body.appendChild(zoom);
      close.addEventListener('click',function(){zoom.close();}); zoomButton.addEventListener('click',function(){if(zoom.showModal)zoom.showModal();else zoom.setAttribute('open','');});
      zoom.addEventListener('click',function(event){if(event.target===zoom)zoom.close();});
    });

    // Product stage photos are shown plain. The HD gallery button and the media viewer on each
    // product page are the route to the larger images, so no control strip sits over the artwork.
    // The wrapper is kept because the per-product hero sizing and float animations target it.
    document.querySelectorAll('.char-stage .char-stage__figure').forEach(function (image) {
      var stage = image.closest('.char-stage');
      var viewport = document.createElement('div');
      viewport.className = 'figure-gallery__viewport';
      stage.insertBefore(viewport, image);
      viewport.appendChild(image);
    });
    // A PIN-format helper is ready for shipping rules; it deliberately doesn't invent an ETA or serviceability.
    document.querySelectorAll('.accessory-policy-panel .wrap').forEach(function (policyWrap,index) {
      var checker=document.createElement('form'); checker.className='delivery-checker'; checker.noValidate=true;
      var id='delivery-pin-'+index;
      checker.innerHTML='<div><p class="delivery-checker__eyebrow">DELIVERY CHECK</p><label for="'+id+'">Enter your 6-digit PIN code</label><p class="delivery-checker__hint">Estimated delivery: Standard 4 days · Express 2 days to valid PIN codes.</p></div><div class="delivery-checker__form"><input id="'+id+'" name="postal-code" inputmode="numeric" autocomplete="postal-code" pattern="[1-9][0-9]{5}" maxlength="6" placeholder="e.g. 400001" aria-describedby="'+id+'-status" /><button type="submit">CHECK PIN</button><p id="'+id+'-status" class="delivery-checker__status" role="status" aria-live="polite"></p></div>';
      policyWrap.appendChild(checker);
      var input=checker.querySelector('input'); var status=checker.querySelector('.delivery-checker__status');
      checker.addEventListener('submit',function(event){event.preventDefault();var pin=input.value.trim();if(!/^[1-9][0-9]{5}$/.test(pin)){status.textContent='Enter a valid 6-digit Indian PIN code.';input.setAttribute('aria-invalid','true');return;}input.removeAttribute('aria-invalid');status.textContent='Estimated delivery to PIN code ' + pin + ': Standard 4 days · Express 2 days. Both Standard and Express shipping are free on orders of ₹2,000 or more, and orders of ₹3,500 or more get a free gift.';});
    });

    // Product search, category filtering, sorting, and accessible quick views on listing cards.
    var productCards = Array.prototype.slice.call(document.querySelectorAll('#figures .p-card, #accessories .p-card, .accessory-shelf .p-card'));
    var searchInput = document.getElementById('product-search');
    var categoryFilter = document.getElementById('product-category');
    var sortFilter = document.getElementById('product-sort');
    var resultCount = document.getElementById('product-results');
    var noResults = document.getElementById('product-no-results');
    productCards.forEach(function (card, index) {
      card.setAttribute('data-category', card.closest('#accessories, .accessory-shelf') ? 'accessories' : 'figures');
      card.setAttribute('data-feature-order', String(index));
    });
    function updateProductListing() {
      if (!searchInput || !categoryFilter || !sortFilter) return;
      var query = searchInput.value.trim().toLocaleLowerCase();
      var category = categoryFilter.value;
      var sort = sortFilter.value;
      var visibleCount = 0;
      productCards.forEach(function (card) {
        var title = (card.querySelector('.p-card__product-link') || card.querySelector('h3'));
        var sub = card.querySelector('.p-card__sub');
        var searchText = ((title ? title.textContent : '') + ' ' + (sub ? sub.textContent : '')).toLocaleLowerCase();
        var matches = (!query || searchText.indexOf(query) !== -1) && (category === 'all' || card.getAttribute('data-category') === category);
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });
      document.querySelectorAll('#figures .cards, #accessories .cards').forEach(function (grid) {
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.p-card'));
        cards.sort(function (a, b) {
          var nameA = (a.querySelector('.p-card__product-link') || a.querySelector('h3')).textContent.replace('↗', '').trim();
          var nameB = (b.querySelector('.p-card__product-link') || b.querySelector('h3')).textContent.replace('↗', '').trim();
          var buttonA = a.querySelector('.add-btn');
          var buttonB = b.querySelector('.add-btn');
          var priceA = Number(buttonA && buttonA.getAttribute('data-price')) || 0;
          var priceB = Number(buttonB && buttonB.getAttribute('data-price')) || 0;
          if (sort === 'price-low') return priceA - priceB;
          if (sort === 'price-high') return priceB - priceA;
          if (sort === 'name') return nameA.localeCompare(nameB);
          return Number(a.getAttribute('data-feature-order')) - Number(b.getAttribute('data-feature-order'));
        });
        cards.forEach(function (card) { grid.appendChild(card); });
      });
      var figuresSection = document.getElementById('figures');
      var accessoriesSection = document.getElementById('accessories');
      if (figuresSection) figuresSection.hidden = !productCards.some(function (card) { return card.getAttribute('data-category') === 'figures' && !card.hidden; });
      if (accessoriesSection) accessoriesSection.hidden = !productCards.some(function (card) { return card.getAttribute('data-category') === 'accessories' && !card.hidden; });
      if (resultCount) resultCount.textContent = 'Showing ' + visibleCount + ' of ' + productCards.length + ' products';
      if (noResults) noResults.hidden = visibleCount > 0;
    }
    if (searchInput && categoryFilter && sortFilter) {
      searchInput.addEventListener('input', updateProductListing);
      categoryFilter.addEventListener('change', updateProductListing);
      sortFilter.addEventListener('change', updateProductListing);
      updateProductListing();
    }

    var quickView = document.createElement('dialog'); quickView.className = 'quick-view'; quickView.setAttribute('aria-labelledby', 'quick-view-title');
    var quickClose = document.createElement('button'); quickClose.type = 'button'; quickClose.className = 'quick-view__close'; quickClose.setAttribute('aria-label', 'Close product quick view'); quickClose.textContent = '×'; quickView.appendChild(quickClose);
    var quickLayout = document.createElement('div'); quickLayout.className = 'quick-view__layout';
    var quickImage = document.createElement('img'); quickImage.className = 'quick-view__image'; quickImage.alt = '';
    var quickCopy = document.createElement('div'); quickCopy.className = 'quick-view__copy';
    var quickEyebrow = document.createElement('p'); quickEyebrow.className = 'quick-view__eyebrow'; quickEyebrow.textContent = 'REDPOLY';
    var quickTitle = document.createElement('h2'); quickTitle.id = 'quick-view-title';
    var quickSubtitle = document.createElement('p'); quickSubtitle.className = 'quick-view__subtitle';
    var quickPrice = document.createElement('p'); quickPrice.className = 'quick-view__price';
    var quickActions = document.createElement('div'); quickActions.className = 'quick-view__actions';
    var quickAdd = document.createElement('button'); quickAdd.type = 'button'; quickAdd.className = 'add-btn quick-view__add'; quickAdd.textContent = 'ADD TO CART';
    var quickDetails = document.createElement('a'); quickDetails.className = 'quick-view__details'; quickDetails.textContent = 'VIEW PRODUCT DETAILS';
    quickActions.appendChild(quickAdd); quickActions.appendChild(quickDetails);
    quickCopy.appendChild(quickEyebrow); quickCopy.appendChild(quickTitle); quickCopy.appendChild(quickSubtitle); quickCopy.appendChild(quickPrice); quickCopy.appendChild(quickActions);
    quickLayout.appendChild(quickImage); quickLayout.appendChild(quickCopy); quickView.appendChild(quickLayout); document.body.appendChild(quickView);
    quickClose.addEventListener('click', function () { quickView.close(); });
    quickView.addEventListener('click', function (event) { if (event.target === quickView) quickView.close(); });
    productCards.forEach(function (card) {
      var imageBox = card.querySelector('.p-card__img');
      var image = card.querySelector('.p-card__image-link img');
      if (!imageBox || !image) return;
      var trigger = document.createElement('button'); trigger.type = 'button'; trigger.className = 'quick-view-trigger'; trigger.textContent = 'QUICK VIEW';
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-label', 'Quick view ' + ((card.querySelector('.p-card__product-link') || card.querySelector('h3')).textContent.replace('↗', '').trim()));
      trigger.addEventListener('click', function () {
        var titleLink = card.querySelector('.p-card__product-link') || card.querySelector('h3');
        var sub = card.querySelector('.p-card__sub');
        var price = card.querySelector('.add-btn');
        quickImage.src = image.src; quickImage.alt = image.alt;
        quickTitle.textContent = titleLink.textContent.replace('↗', '').trim();
        quickSubtitle.textContent = sub ? sub.textContent : '';
        quickPrice.textContent = (card.querySelector('.p-card__price') || {}).textContent || '';
        quickAdd.setAttribute('data-name', price ? price.getAttribute('data-name') : quickTitle.textContent);
        quickAdd.setAttribute('data-price', price ? price.getAttribute('data-price') : '');
        quickAdd.setAttribute('aria-label', 'Add ' + quickTitle.textContent + ' to cart');
        quickDetails.href = (card.querySelector('.p-card__product-link') || card.querySelector('.p-card__image-link')).href;
        if (quickView.showModal) quickView.showModal(); else quickView.setAttribute('open', '');
      });
      imageBox.appendChild(trigger);
    });
    quickAdd.addEventListener('click', function () { if (quickView.close) quickView.close(); });

    // Add to cart and open the drawer.
    document.querySelectorAll('.add-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { addCartItem(btn); });
    });

    // Wishlist: hearts are remembered on this device and listed behind the heart button in the header.
    var wishKey = 'redpoly-wishlist-v1';
    // Only same-site paths are accepted for links and images read back from storage.
    function isSitePath(value) { return typeof value === 'string' && value.charAt(0) === '/' && value.charAt(1) !== '/'; }
    function parseWish(raw) {
      try {
        var stored = JSON.parse(raw || '[]');
        if (!Array.isArray(stored)) return [];
        return stored.filter(function (item) {
          return item && typeof item.name === 'string' && isSitePath(item.href) && inCatalogue(item.name, item.price);
        }).map(function (item) {
          return { name:item.name, href:item.href, image:isSitePath(item.image) ? item.image : '', price:Number(item.price) };
        });
      } catch (ignoreWishParse) { return []; }
    }
    var wishItems = [];
    try { wishItems = parseWish(window.localStorage.getItem(wishKey)); } catch (ignoreWishStorage) { wishItems = []; }
    function persistWish() {
      try { window.localStorage.setItem(wishKey, JSON.stringify(wishItems)); } catch (ignoreWishSave) { /* Hearts still work for this page view. */ }
      window.dispatchEvent(new CustomEvent('redpoly:wishlist-local-sync', { detail: { items: wishItems.slice() } }));
    }
    function isWished(name) { return wishItems.some(function (item) { return item.name === name; }); }

    var wishButtons = [];
    function syncWishButton(button) {
      if (!button || !button.wishData) return;
      var saved = isWished(button.wishData.name);
      button.classList.toggle('is-favorite', saved);
      button.setAttribute('aria-pressed', saved ? 'true' : 'false');
      var label = button.querySelector('.char-save__label');
      if (label) label.textContent = saved ? 'SAVED' : 'SAVE FOR LATER';
    }
    function renderWish() {
      wishButtons.forEach(syncWishButton);
    }
    function toggleWish(data, quiet) {
      var saved = isWished(data.name);
      if (saved) {
        wishItems = wishItems.filter(function (item) { return item.name !== data.name; });
        if (window.RedpolyFirebase) window.RedpolyFirebase.removeWishlistItem(data.name).catch(function (err) { console.error(err); });
      } else {
        var entry = { name:data.name, href:data.href, image:data.image, price:data.price };
        wishItems.push(entry);
        if (window.RedpolyFirebase) window.RedpolyFirebase.saveWishlistItem(entry).catch(function (err) { console.error(err); });
      }
      persistWish(); renderWish();
      if (!quiet) showToast(saved ? data.name + ' removed from favorites' : data.name + ' saved to favorites');
    }
    function registerWishButton(button, data) {
      button.wishData = data;
      wishButtons.push(button);
      // Read the data at click time so a product page can change its pick (Cute Dinos colours).
      button.addEventListener('click', function () { toggleWish(button.wishData || data); });
    }
    function localPath(url) { try { var parsed = new URL(url, window.location.href); return parsed.pathname + parsed.search; } catch (ignoreUrl) { return ''; } }
    var heartMarkup = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.5-9-9c-1.2-2.7.5-6 3.5-6C9 5 11 7 12 8.5 13 7 15 5 17.5 5c3 0 4.7 3.3 3.5 6-2 4.5-9 9-9 9z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
    var pageBuyRow = null;
    var pageBuy = null;
    var pageSaveButton = null;
    if (document.querySelector('.add-btn')) {
      // Shelf cards: every product gets a heart, including the accessories.
      document.querySelectorAll('.p-card').forEach(function (card) {
        var buy = card.querySelector('.add-btn[data-name][data-price]');
        var link = card.querySelector('.p-card__product-link') || card.querySelector('.p-card__image-link');
        var imageBox = card.querySelector('.p-card__img');
        var image = card.querySelector('.p-card__image-link img');
        if (!buy || !link || !imageBox) return;
        var heart = card.querySelector('.heart');
        if (!heart) {
          heart = document.createElement('button'); heart.type = 'button'; heart.className = 'heart'; heart.innerHTML = heartMarkup;
          imageBox.appendChild(heart);
        }
        var name = buy.getAttribute('data-name');
        heart.setAttribute('aria-label', 'Save ' + name + ' for later');
        registerWishButton(heart, { name:name, href:localPath(link.getAttribute('href')), image:image ? localPath(image.getAttribute('src')) : '', price:Number(buy.getAttribute('data-price')) });
      });
      // Homepage categorized shop cards (.shop-card): add a wishlist heart to every card.
      document.querySelectorAll('.shop-card').forEach(function (card) {
        var buy = card.querySelector('.shop-card__add[data-name][data-price], .add-btn[data-name][data-price]');
        var mediaLink = card.querySelector('.shop-card__media');
        var image = mediaLink ? mediaLink.querySelector('img') : null;
        if (!buy || !mediaLink) return;
        var heart = card.querySelector('.shop-card__heart');
        if (!heart) {
          heart = document.createElement('button');
          heart.type = 'button';
          heart.className = 'heart shop-card__heart';
          heart.innerHTML = heartMarkup;
          card.appendChild(heart);
        }
        var name = buy.getAttribute('data-name');
        heart.setAttribute('aria-label', 'Save ' + name + ' for later');
        registerWishButton(heart, {
          name: name,
          href: localPath(mediaLink.getAttribute('href')),
          image: image ? localPath(image.getAttribute('src')) : '',
          price: Number(buy.getAttribute('data-price'))
        });
      });
      // Product pages: a save button under the buy row.
      pageBuyRow = document.querySelector('.char-buy-row');
      pageBuy = pageBuyRow ? pageBuyRow.querySelector('.add-btn[data-name][data-price]') : null;
      if (pageBuy) {
        var pageImage = document.querySelector('.char-stage__figure') || document.querySelector('.accessory-product-image');
        var saveButton = document.createElement('button'); saveButton.type = 'button'; saveButton.className = 'char-save';
        saveButton.innerHTML = heartMarkup + '<span class="char-save__label">SAVE FOR LATER</span>';
        pageBuyRow.insertAdjacentElement('afterend', saveButton);
        registerWishButton(saveButton, { name:pageBuy.getAttribute('data-name'), href:window.location.pathname.replace(/\.html$/, ''), image:pageImage ? localPath(pageImage.getAttribute('src')) : '', price:Number(pageBuy.getAttribute('data-price')) });
        pageSaveButton = saveButton;
      }
    }

    function applyButtonStockState(btn, rec, defaultLabel, outLabel) {
      if (!btn) return;
      var out = Boolean(rec && rec.initialized && rec.stock === 0);
      if (rec) btn.setAttribute('data-price', String(rec.price));
      if (!Object.prototype.hasOwnProperty.call(btn.dataset, 'baseHtml')) {
        btn.dataset.baseHtml = btn.innerHTML.trim() || defaultLabel || 'ADD TO CART';
      }
      if (!Object.prototype.hasOwnProperty.call(btn.dataset, 'baseLabel')) {
        btn.dataset.baseLabel = btn.textContent.trim() || defaultLabel || 'ADD TO CART';
      }
      if (out) {
        clearTimeout(btn._addedTimer);
        delete btn.dataset.originalHtml;
        btn.classList.remove('added');
        btn.classList.add('is-out-of-stock');
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
        btn.textContent = outLabel || 'OUT OF STOCK';
      } else {
        var wasOut = btn.classList.contains('is-out-of-stock');
        btn.classList.remove('is-out-of-stock');
        btn.disabled = false;
        btn.removeAttribute('aria-disabled');
        if (wasOut && !btn.classList.contains('added')) {
          btn.innerHTML = btn.dataset.baseHtml || btn.dataset.baseLabel;
        }
      }
    }

    function formatStockText(rec) {
      if (!rec || !rec.initialized) return '';
      if (rec.stock === 0) return 'OUT OF STOCK';
      if (rec.stock <= rec.lowStockThreshold) return 'ONLY ' + rec.stock + ' LEFT!';
      return '';
    }

    function renderComparisonTags(container, rec) {
      if (!container) return;
      container.textContent = '';
      var items = rec && Array.isArray(rec.priceComparisons) ? rec.priceComparisons.filter(function (c) {
        return c && c.platform && Number(c.price) > 0;
      }) : [];
      if (!items.length) {
        container.hidden = true;
        return;
      }
      container.hidden = false;
      items.forEach(function (comp) {
        var tag = document.createElement('span');
        tag.className = 'char-market-compare__tag';
        tag.textContent = money(comp.price) + ' on ' + comp.platform;
        container.appendChild(tag);
      });
    }

    function syncStorefrontFromCatalog(nextMap) {
      if (nextMap && typeof nextMap === 'object') {
        liveCatalogState = nextMap;
        Object.keys(catalogue).forEach(function (name) {
          var live = getLiveRecord(name);
          if (live && Number.isFinite(live.price) && live.price > 0) {
            catalogue[name].price = live.price;
          }
        });
      }

      // Sync cart items & local wishlist prices if any price changed live
      var cartChanged = false;
      cartItems = cartItems.map(function (entry) {
        var live = getLiveRecord(entry.name);
        if (live && live.price > 0 && live.price !== entry.price) {
          cartChanged = true;
          return {
            id: entry.name.toLowerCase() + '|' + live.price,
            name: entry.name,
            price: live.price,
            quantity: entry.quantity
          };
        }
        return entry;
      });
      if (cartChanged) {
        persistCart();
      }
      renderCart();

      var wishChanged = false;
      wishItems = wishItems.map(function (entry) {
        var live = getLiveRecord(entry.name);
        if (live && live.price > 0 && live.price !== entry.price) {
          wishChanged = true;
          return Object.assign({}, entry, { price: live.price });
        }
        return entry;
      });
      if (wishChanged) {
        persistWish();
      }

      // 1) Homepage Hero spotlight (.hero-product -> BUBBLE GUN)
      var heroProduct = document.querySelector('.hero-product');
      if (heroProduct) {
        var heroRec = getLiveRecord('BUBBLE GUN');
        var heroPriceBold = heroProduct.querySelector('.hero-product__price b');
        if (heroPriceBold && heroRec) {
          heroPriceBold.textContent = money(heroRec.price);
        }
        var heroSecondaryPrice = document.querySelector('[data-hero-bubble-price]');
        if (heroSecondaryPrice && heroRec) {
          heroSecondaryPrice.textContent = money(heroRec.price);
        }
        var heroStockEl = heroProduct.querySelector('.hero-product__stock');
        var heroStockMsg = formatStockText(heroRec);
        if (heroStockMsg) {
          if (!heroStockEl) {
            heroStockEl = document.createElement('span');
            heroStockEl.className = 'hero-product__stock';
            var priceRow = heroProduct.querySelector('.hero-product__price');
            if (priceRow) priceRow.appendChild(heroStockEl);
          }
          heroStockEl.textContent = heroStockMsg;
          heroStockEl.classList.toggle('is-out', Boolean(heroRec && heroRec.stock === 0));
          heroStockEl.hidden = false;
        } else if (heroStockEl) {
          heroStockEl.hidden = true;
        }
      }

      // 2) Homepage shop cards (.shop-card)
      document.querySelectorAll('.shop-card').forEach(function (card) {
        var addBtn = card.querySelector('.shop-card__add[data-name], .add-btn[data-name]');
        if (!addBtn) return;
        var skuName = addBtn.getAttribute('data-name') || '';
        var rec = getLiveRecord(skuName);
        if (!rec) return;

        // B6 Corner sticker (.shop-card__tag)
        var mediaBox = card.querySelector('.shop-card__media');
        var tagEl = card.querySelector('.shop-card__tag');
        var tagText = String(rec.cardTag || '').trim();
        if (tagText) {
          if (!tagEl && mediaBox) {
            tagEl = document.createElement('span');
            tagEl.className = 'shop-card__tag';
            mediaBox.appendChild(tagEl);
          }
          if (tagEl) {
            tagEl.textContent = tagText;
            tagEl.hidden = false;
          }
        } else if (tagEl) {
          tagEl.hidden = true;
        }

        // Price + compareAtPrice strike-through
        var priceWrap = card.querySelector('.shop-card__price');
        var priceStrong = priceWrap ? priceWrap.querySelector('strong') : null;
        if (priceStrong) {
          priceStrong.textContent = money(rec.price);
        }
        if (priceWrap) {
          var mrpEl = priceWrap.querySelector('.shop-card__mrp');
          if (rec.compareAtPrice > rec.price) {
            if (!mrpEl) {
              mrpEl = document.createElement('s');
              mrpEl.className = 'shop-card__mrp';
              priceWrap.insertBefore(mrpEl, priceStrong ? priceStrong.nextSibling : null);
            }
            mrpEl.textContent = money(rec.compareAtPrice);
            mrpEl.hidden = false;
          } else if (mrpEl) {
            mrpEl.hidden = true;
          }
        }

        // Cute Dinos card aside ("₹549 for all three") tracks CUTE DINOS TRIO
        if (skuName === 'CUTE DINOS GREEN') {
          var trioRec = getLiveRecord('CUTE DINOS TRIO');
          var asideEl = card.querySelector('.shop-card__aside');
          if (asideEl && trioRec) {
            asideEl.textContent = money(trioRec.price) + ' for all three';
          }
        }

        // Magnetic Blocks card aside ("25, 36, 42 or 64 pcs · ₹319–₹799") tracks min/max live prices
        if (skuName === 'MAGNETIC BLOCKS 25 PCS') {
          var rec64 = getLiveRecord('MAGNETIC BLOCKS 64 PCS');
          var magAsideEl = card.querySelector('.shop-card__aside');
          if (magAsideEl && rec64) {
            magAsideEl.textContent = '25, 36, 42 or 64 pcs · up to ' + money(rec64.price);
          }
        }

        // Drift King card aside tracks live marketplace comparison price if configured
        if (skuName === 'DRIFT KING') {
          var dkAsideEl = card.querySelector('.shop-card__aside');
          if (dkAsideEl) {
            var dkComp = Array.isArray(rec.priceComparisons) && rec.priceComparisons.length ? rec.priceComparisons[0] : null;
            dkAsideEl.textContent = dkComp
              ? '12 cm · USB charge · ' + money(dkComp.price) + ' on ' + dkComp.platform
              : '12 cm · USB charge · Follow & Escape modes';
          }
        }

        // Baby Lingo card aside tracks live marketplace comparison price if configured
        if (skuName === 'BABY LINGO') {
          var blAsideEl = card.querySelector('.shop-card__aside');
          if (blAsideEl) {
            var blComp = Array.isArray(rec.priceComparisons) && rec.priceComparisons.length ? rec.priceComparisons[0] : null;
            blAsideEl.textContent = blComp
              ? 'Indian accent · 100 cards · ' + money(blComp.price) + ' on ' + blComp.platform
              : 'Indian accent · 100 bilingual cards';
          }
        }

        // B4 Stock pill on shop card
        var stockText = formatStockText(rec);
        var cardStock = card.querySelector('.shop-card__stock');
        if (stockText) {
          if (!cardStock && mediaBox) {
            cardStock = document.createElement('span');
            cardStock.className = 'shop-card__stock';
            mediaBox.appendChild(cardStock);
          }
          if (cardStock) {
            cardStock.textContent = stockText;
            cardStock.classList.toggle('is-out', rec.stock === 0);
            cardStock.hidden = false;
          }
        } else if (cardStock) {
          cardStock.hidden = true;
        }

        card.classList.toggle('is-out-of-stock', Boolean(rec.initialized && rec.stock === 0));
        applyButtonStockState(addBtn, rec, 'ADD TO CART', 'OUT OF STOCK');
      });

      // 3) Cute Dinos variant inputs (if on /cute-dinos)
      var dinoPicker = document.getElementById('dino-picker');
      if (dinoPicker) {
        dinoPicker.querySelectorAll('input[name="dino-colour"]').forEach(function (input) {
          var r = getLiveRecord(input.getAttribute('data-name'));
          if (r) input.setAttribute('data-price', String(r.price));
        });
        var singleRef = getLiveRecord('CUTE DINOS GREEN');
        var trioRef = getLiveRecord('CUTE DINOS TRIO');
        dinoPicker.querySelectorAll('input[name="dino-pack"]').forEach(function (input) {
          if (input.value === 'trio' && trioRef) {
            input.setAttribute('data-price', String(trioRef.price));
            var packSub = input.closest('label') ? input.closest('label').querySelector('.dino-pack__sub') : null;
            if (packSub && singleRef && singleRef.price * 3 > trioRef.price) {
              packSub.textContent = 'Save ' + money(singleRef.price * 3 - trioRef.price);
            } else if (packSub) {
              packSub.textContent = 'All 3 dinosaurs';
            }
          } else if (input.value === 'single' && singleRef) {
            input.setAttribute('data-price', String(singleRef.price));
          }
        });
      }

      // 3b) Magnetic Blocks variant inputs (if on /magnetic-blocks)
      var magneticPicker = document.getElementById('magnetic-picker');
      if (magneticPicker) {
        magneticPicker.querySelectorAll('input[name="magnetic-pack"]').forEach(function (input) {
          var r = getLiveRecord(input.getAttribute('data-name'));
          if (!r) return;
          input.setAttribute('data-price', String(r.price));
          var packLabel = input.closest('label');
          var amountNode = packLabel ? packLabel.querySelector('.magnetic-pack__amount') : null;
          if (amountNode) amountNode.textContent = money(r.price);
        });
      }

      // 4) Product page buy row, MRP, stock pill, non-linked market comparison tags, final CTA & sticky bar
      if (pageBuy) {
        var activeSku = pageBuy.getAttribute('data-name') || '';
        var activeRec = getLiveRecord(activeSku);
        if (activeRec) {
          var pagePriceStrong = document.querySelector('.char-buy-row .char-price strong');
          if (pagePriceStrong) {
            pagePriceStrong.textContent = money(activeRec.price);
          }
          var charPriceBox = document.querySelector('.char-buy-row .char-price');
          if (charPriceBox) {
            var taxEl = charPriceBox.querySelector('.char-price__tax');
            var pageMrp = charPriceBox.querySelector('.char-price__mrp');
            if (activeRec.compareAtPrice > activeRec.price) {
              if (!pageMrp) {
                pageMrp = document.createElement('s');
                pageMrp.className = 'char-price__mrp';
                charPriceBox.insertBefore(pageMrp, taxEl || null);
              }
              pageMrp.textContent = money(activeRec.compareAtPrice);
              pageMrp.hidden = false;
            } else if (pageMrp) {
              pageMrp.hidden = true;
            }
          }

          var pageStockMsg = formatStockText(activeRec);
          var pageStockEl = document.querySelector('.char-stock-pill');
          if (pageStockMsg) {
            if (!pageStockEl) {
              pageStockEl = document.createElement('p');
              pageStockEl.className = 'char-stock-pill';
              pageStockEl.setAttribute('role', 'status');
              pageBuyRow.insertAdjacentElement('afterend', pageStockEl);
            }
            pageStockEl.textContent = activeRec.stock === 0 ? 'CURRENTLY OUT OF STOCK' : 'ONLY ' + activeRec.stock + ' LEFT IN STOCK!';
            pageStockEl.classList.toggle('is-out', activeRec.stock === 0);
            pageStockEl.hidden = false;
          } else if (pageStockEl) {
            pageStockEl.hidden = true;
          }

          var compareWrap = document.querySelector('.char-market-compare');
          if (!compareWrap) {
            compareWrap = document.createElement('div');
            compareWrap.className = 'char-market-compare';
            compareWrap.setAttribute('aria-label', 'Marketplace price comparison');
            var anchor = pageStockEl && !pageStockEl.hidden ? pageStockEl : pageBuyRow;
            anchor.insertAdjacentElement('afterend', compareWrap);
          }
          renderComparisonTags(compareWrap, activeRec);

          applyButtonStockState(pageBuy, activeRec, 'ADD TO CART', 'OUT OF STOCK');
          var finalBuy = document.querySelector('.char-buy--final');
          if (finalBuy) {
            var finalSku = document.getElementById('magnetic-picker')
              ? activeSku
              : (finalBuy.getAttribute('data-name') || activeSku);
            var finalRec = getLiveRecord(finalSku) || activeRec;
            finalBuy.setAttribute('data-name', finalSku);
            if (document.getElementById('magnetic-picker')) {
              var magFinalText = 'ADD TO CART · ' + money(finalRec.price);
              finalBuy.dataset.baseLabel = magFinalText;
              finalBuy.dataset.baseHtml = magFinalText + ' <span aria-hidden="true">↗</span>';
              if (!finalBuy.disabled && !finalBuy.classList.contains('added') && !finalBuy.classList.contains('is-out-of-stock')) {
                finalBuy.innerHTML = finalBuy.dataset.baseHtml;
              }
            }
            applyButtonStockState(finalBuy, finalRec, finalBuy.textContent.trim() || 'ADD TO CART', 'OUT OF STOCK');
          }
          if (stickyPriceNode) {
            stickyPriceNode.textContent = money(activeRec.price);
          }
          if (stickyButtonRef) {
            stickyButtonRef.setAttribute('data-name', activeSku);
            applyButtonStockState(stickyButtonRef, activeRec, 'ADD TO CART', 'OUT OF STOCK');
          }
          if (pageSaveButton && pageSaveButton.wishData) {
            pageSaveButton.wishData.name = activeSku;
            pageSaveButton.wishData.price = activeRec.price;
            syncWishButton(pageSaveButton);
          }
        }
      }
    }

    window.addEventListener('redpoly:catalog-updated', function (event) {
      syncStorefrontFromCatalog(event.detail && event.detail.map ? event.detail.map : null);
      if (document.getElementById('dino-picker')) {
        window.dispatchEvent(new CustomEvent('redpoly:cute-dinos-catalog-sync'));
      }
      if (document.getElementById('magnetic-picker')) {
        window.dispatchEvent(new CustomEvent('redpoly:magnetic-blocks-catalog-sync'));
      }
      renderWish();
    });
    window.addEventListener('redpoly:product-variant-changed', function () {
      syncStorefrontFromCatalog(getLiveCatalogMap());
      renderWish();
    });
    window.addEventListener('storage', function (event) {
      if (event.key !== wishKey) return;
      wishItems = parseWish(event.newValue); renderWish();
    });
    window.addEventListener('redpoly:wishlist-updated', function (event) {
      if (!event.detail || !Array.isArray(event.detail.items)) return;
      wishItems = event.detail.items.slice();
      renderWish();
    });
    syncStorefrontFromCatalog(getLiveCatalogMap());
    renderWish();
  }
  initShopChrome();


  // Phone menu: one tidy row in the header, with the section links behind the menu button.
  var siteHeader = document.querySelector('.site-header');
  var menuToggle = document.getElementById('site-menu-toggle');
  var siteMenu = document.getElementById('site-menu');
  if (siteHeader && menuToggle && siteMenu) {
    if (homeHeader) homeHeader.appendChild(menuToggle);
    var setMenu = function (open) {
      siteHeader.classList.toggle('is-menu-open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    menuToggle.addEventListener('click', function () { setMenu(!siteHeader.classList.contains('is-menu-open')); });
    siteMenu.addEventListener('click', function (event) { if (event.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && siteHeader.classList.contains('is-menu-open')) { setMenu(false); menuToggle.focus(); } });
    document.addEventListener('click', function (event) { if (!siteHeader.contains(event.target)) setMenu(false); });
  }

  // Crew form.
  var form = document.getElementById('crewForm');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var emailInput = document.getElementById('crewEmail');
      var submitBtn = form.querySelector('button[type="submit"]');
      var rawEmail = emailInput && emailInput.value ? emailInput.value.trim() : '';
      if (!rawEmail) return;
      var origLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'JOINING…';
      }
      try {
        var fb = window.RedpolyFirebase && typeof window.RedpolyFirebase.joinCrew === 'function'
          ? window.RedpolyFirebase
          : await ensureFirebaseClient();
        if (!fb || typeof fb.joinCrew !== 'function') {
          throw new Error('Signup service is still loading. Try again.');
        }
        await fb.joinCrew(rawEmail, 'homepage-crew');
        showToast('Welcome to the crew - check your inbox!');
        form.reset();
      } catch (err) {
        console.error(err);
        showToast(err && err.message && err.message.charAt(0) !== '{' ? err.message : 'Could not join right now. Please try again.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = origLabel || 'JOIN NOW →';
        }
      }
    });
  }

  // Split only selected text nodes into accessible, staggered words for kinetic type.
  var textEls = Array.prototype.slice.call(document.querySelectorAll(
    '.hero__copy, .limited__title, .limited__sub, .limited__copy, .section-head__title, .section-head__sub, .crew__left h2, .p-card__body h3'
  ));
  if (!reduceMotion) {
    textEls.forEach(function (el) {
      el.classList.add('text-reveal');
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      var nodes = [];
      while (walker.nextNode()) {
        if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
      }
      var wordIndex = 0;
      nodes.forEach(function (node) {
        var pieces = node.nodeValue.split(/(\s+)/);
        var fragment = document.createDocumentFragment();
        pieces.forEach(function (piece) {
          if (!piece) return;
          if (/^\s+$/.test(piece)) {
            fragment.appendChild(document.createTextNode(piece));
          } else {
            var word = document.createElement('span');
            word.className = 'motion-word';
            word.style.setProperty('--word-index', wordIndex++);
            word.textContent = piece;
            fragment.appendChild(word);
          }
        });
        node.parentNode.replaceChild(fragment, node);
      });
    });
  }

  // Scroll reveals: cards stagger, copy reveals with its own word rhythm, and the torn edge wipes once.
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(
    '.p-card, .c-card, .limited__center, .limited__right, .section-head, .limited__left, .crew__inner'
  ));
  document.querySelectorAll('.cards .p-card').forEach(function (el, i) {
    el.style.setProperty('--reveal-index', i);
  });
  document.querySelectorAll('.collections__grid .c-card').forEach(function (el, i) {
    el.style.setProperty('--reveal-index', i);
  });
  var limitedSection = document.querySelector('.limited');
  revealEls.forEach(function (el) { el.setAttribute('data-reveal', ''); });
  var targets = revealEls.concat(textEls);
  if (limitedSection) targets.push(limitedSection);
  targets = targets.filter(function (el, i) { return targets.indexOf(el) === i; });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        if (entry.target === limitedSection) {
          entry.target.classList.add('is-visible');
        } else if (entry.target.classList.contains('text-reveal')) {
          entry.target.classList.add('text-in');
        } else {
          entry.target.classList.add('in');
        }
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
    textEls.forEach(function (el) { el.classList.add('text-in'); });
    if (limitedSection) limitedSection.classList.add('is-visible');
  }

  // Pointer tilt on desktop product cards; intentionally disabled for touch/reduced motion.
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!reduceMotion && finePointer) {
    document.querySelectorAll('.p-card').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--tilt-x', (x * 7).toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', (y * -6).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  // Character product pages: staged scroll reveals and a subtle 3D response to desktop pointer movement.
  var productReveals = Array.prototype.slice.call(document.querySelectorAll(
    '.char-story__eyebrow, .char-story__grid > *, .char-detail-card, .char-final-cta > *'
  ));
  if (!reduceMotion && productReveals.length) {
    productReveals.forEach(function (el, i) {
      el.classList.add('char-reveal');
      el.style.setProperty('--char-delay', (i % 3) * 110 + 'ms');
    });
    if ('IntersectionObserver' in window) {
      var productObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('char-reveal--in');
          productObserver.unobserve(entry.target);
        });
      }, { threshold: 0.16, rootMargin: '0px 0px -5% 0px' });
      productReveals.forEach(function (el) { productObserver.observe(el); });
    } else {
      productReveals.forEach(function (el) { el.classList.add('char-reveal--in'); });
    }
  }

  var productStage = document.querySelector('.char-stage');
  if (productStage && !reduceMotion && finePointer) {
    productStage.addEventListener('pointermove', function (event) {
      var rect = productStage.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      productStage.style.setProperty('--stage-tilt-x', (x * 5).toFixed(2) + 'deg');
      productStage.style.setProperty('--stage-tilt-y', (y * -4).toFixed(2) + 'deg');
    });
    productStage.addEventListener('pointerleave', function () {
      productStage.style.setProperty('--stage-tilt-x', '0deg');
      productStage.style.setProperty('--stage-tilt-y', '0deg');
    });
  }
  function parseYouTubeId(url) {
    var m = String(url || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : '';
  }

  // Comic media card on a product page: opens a rounded viewer with previous and next slides.
  (function () {
    var viewer = document.getElementById('media-viewer');
    var slidesNode = document.getElementById('media-viewer-slides');
    var openers = document.querySelectorAll('[data-media-open]');
    if (!viewer || !slidesNode || !openers.length) return;
    var stage = viewer.querySelector('#media-viewer-stage');
    var caption = viewer.querySelector('#media-viewer-caption');
    var indexNode = viewer.querySelector('#media-viewer-index');
    var totalNode = viewer.querySelector('#media-viewer-total');
    var slides = Array.prototype.map.call(slidesNode.querySelectorAll('li'), function (item) {
      var rawType = item.getAttribute('data-type') || 'image';
      var src = item.getAttribute('data-src') || '';
      var ytId = rawType === 'youtube' ? (parseYouTubeId(src) || src) : parseYouTubeId(src);
      return {
        type: ytId ? 'youtube' : (rawType === 'video' ? 'video' : 'image'),
        src: src,
        youtubeId: ytId,
        alt: item.getAttribute('data-alt') || '',
        poster: item.getAttribute('data-poster') || '',
        caption: item.getAttribute('data-caption') || ''
      };
    });
    if (!slides.length) return;
    var index = 0;
    var opener = null;

    function clearStage() {
      var video = stage.querySelector('video');
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.textContent = '';
        video.load();
      }
      var frame = stage.querySelector('iframe');
      if (frame) {
        frame.src = 'about:blank';
      }
      stage.textContent = '';
    }

    function render() {
      clearStage();
      var slide = slides[index];
      var media;
      if (slide.type === 'youtube' && slide.youtubeId) {
        media = document.createElement('div');
        media.className = 'media-viewer__embed';
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + encodeURIComponent(slide.youtubeId) + '?rel=0&playsinline=1&autoplay=1';
        iframe.title = slide.alt || slide.caption || 'Product demonstration video';
        iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share');
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.allowFullscreen = true;
        media.appendChild(iframe);
      } else if (slide.type === 'video') {
        media = document.createElement('video');
        media.controls = true;
        media.defaultMuted = true;
        media.muted = true;
        media.loop = true;
        media.preload = 'metadata';
        media.setAttribute('playsinline', '');
        media.setAttribute('aria-label', slide.alt || slide.caption);
        if (slide.poster) media.poster = slide.poster;
        if (!reduceMotion) media.autoplay = true;
        var source = document.createElement('source');
        source.src = slide.src;
        source.type = 'video/mp4';
        media.appendChild(source);
      } else {
        media = document.createElement('img');
        media.src = slide.src;
        media.alt = slide.alt;
        media.loading = 'lazy';
      }
      stage.appendChild(media);
      caption.textContent = slide.caption;
      indexNode.textContent = String(index + 1);
      totalNode.textContent = String(slides.length);
    }

    function open(event) {
      opener = event.currentTarget;
      var preferredType = opener.getAttribute('data-media-open');
      index = Math.max(0, slides.findIndex(function (slide) {
        return preferredType === 'video' ? (slide.type === 'video' || slide.type === 'youtube') : slide.type === preferredType;
      }));
      render();
      viewer.hidden = false;
      document.documentElement.classList.add('viewer-open');
      viewer.querySelector('.media-viewer__close').focus();
    }

    function close() {
      clearStage();
      viewer.hidden = true;
      document.documentElement.classList.remove('viewer-open');
      if (opener) opener.focus();
    }

    function step(direction) {
      index = (index + direction + slides.length) % slides.length;
      render();
    }

    Array.prototype.forEach.call(openers, function (button) { button.addEventListener('click', open); });
    Array.prototype.forEach.call(viewer.querySelectorAll('[data-media-close]'), function (button) {
      button.addEventListener('click', close);
    });
    viewer.querySelector('[data-media-prev]').addEventListener('click', function () { step(-1); });
    viewer.querySelector('[data-media-next]').addEventListener('click', function () { step(1); });
    viewer.addEventListener('click', function (event) { if (event.target === viewer) close(); });
    document.addEventListener('keydown', function (event) {
      if (viewer.hidden) return;
      if (event.key === 'Escape') { event.preventDefault(); close(); return; }
      if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); return; }
      if (event.key === 'ArrowRight') { event.preventDefault(); step(1); return; }
      if (event.key !== 'Tab') return;
      var focusable = Array.prototype.filter.call(
        viewer.querySelectorAll('button, video, iframe, [tabindex]:not([tabindex="-1"])'),
        function (element) { return !element.disabled && element.offsetParent !== null; }
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  })();

  // ---------- PRODUCT DETAILS PORTRAIT VIDEO (GALLERY-SYNCED) ----------
  (function initPortraitGalleryVideo() {
    var portrait = document.querySelector('.char-file__portrait');
    var slidesNode = document.getElementById('media-viewer-slides');
    if (!portrait || !slidesNode) return;

    var ytSlide = slidesNode.querySelector('li[data-type="youtube"][data-src]');
    if (ytSlide) {
      var ytId = parseYouTubeId(ytSlide.dataset.src) || ytSlide.dataset.src;
      if (!ytId) return;
      portrait.classList.add('has-portrait-video');
      var ytToggle = portrait.querySelector('.char-file__video-toggle');
      if (!ytToggle) {
        ytToggle = document.createElement('button');
        ytToggle.className = 'char-file__video-toggle';
        ytToggle.type = 'button';
        ytToggle.setAttribute('aria-pressed', 'false');
        ytToggle.textContent = 'Play demo';
        portrait.appendChild(ytToggle);
      }
      var ytEmbed = null;
      function closeYt() {
        if (!ytEmbed) return;
        var f = ytEmbed.querySelector('iframe');
        if (f) f.src = 'about:blank';
        ytEmbed.remove();
        ytEmbed = null;
        ytToggle.textContent = 'Play demo';
        ytToggle.setAttribute('aria-pressed', 'false');
      }
      ytToggle.addEventListener('click', function () {
        if (ytEmbed) {
          closeYt();
          return;
        }
        ytEmbed = document.createElement('div');
        ytEmbed.className = 'char-file__embed';
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + encodeURIComponent(ytId) + '?rel=0&playsinline=1&autoplay=1&mute=1';
        iframe.title = ytSlide.dataset.alt || 'Product demonstration video';
        iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share');
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.allowFullscreen = true;
        ytEmbed.appendChild(iframe);
        portrait.insertBefore(ytEmbed, ytToggle);
        ytToggle.textContent = 'Close demo';
        ytToggle.setAttribute('aria-pressed', 'true');
      });
      var ytGallery = document.getElementById('media-viewer');
      if (ytGallery && 'MutationObserver' in window) {
        new MutationObserver(function () {
          if (!ytGallery.hidden) closeYt();
        }).observe(ytGallery, { attributes: true, attributeFilter: ['hidden'] });
      }
      return;
    }

    var videoSlide = slidesNode.querySelector('li[data-type="video"][data-src]');
    var video = portrait.querySelector('video.char-file__video');
    var videoSrc = (video && (video.dataset.src || video.getAttribute('src'))) || (videoSlide && videoSlide.dataset.src) || '';
    if (!videoSrc) return;

    portrait.classList.add('has-portrait-video');

    if (!video) {
      video = document.createElement('video');
      video.className = 'char-file__video';
      video.id = 'portrait-demo-video';
      video.setAttribute('data-src', videoSrc);
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('muted', '');
      video.loop = true;
      video.setAttribute('loop', '');
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.preload = 'none';
      var poster = videoSlide && videoSlide.dataset.poster;
      if (poster) video.poster = poster;
      video.setAttribute('aria-label', (videoSlide && videoSlide.dataset.alt) || 'Product demonstration video');
      var stamp = portrait.querySelector('.char-file__stamp');
      portrait.insertBefore(video, stamp || null);
    } else {
      if (!video.id) video.id = 'portrait-demo-video';
      video.muted = true;
      video.defaultMuted = true;
      if (!video.dataset.src && !video.hasAttribute('src')) {
        video.setAttribute('data-src', videoSrc);
      }
    }

    var toggle = portrait.querySelector('.char-file__video-toggle');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.className = 'char-file__video-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-controls', video.id);
      toggle.setAttribute('aria-pressed', 'false');
      toggle.textContent = 'Play demo';
      portrait.insertBefore(toggle, video.nextSibling);
    }

    if (video.dataset.portraitManaged === '1') return;
    video.dataset.portraitManaged = '1';

    var gallery = document.getElementById('media-viewer');
    var storyVideo = document.querySelector('.char-video video');
    var reduceMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
    var inView = false;
    var userChoice = null;

    function updateToggle() {
      toggle.textContent = video.error ? 'Retry demo' : video.paused ? 'Play demo' : 'Pause demo';
      toggle.setAttribute('aria-pressed', video.paused ? 'false' : 'true');
    }

    function play() {
      if (!video.paused) return;
      if (!video.hasAttribute('src')) video.src = video.dataset.src || videoSrc;
      video.muted = true;
      video.play().catch(updateToggle);
    }

    function syncPlayback() {
      var wantsPlayback = userChoice === null ? !reduceMotionQuery.matches : userChoice;
      var storyPlaying = Boolean(storyVideo && !storyVideo.paused && !storyVideo.ended);
      if (wantsPlayback && inView && !document.hidden && (!gallery || gallery.hidden) && !storyPlaying && !video.error) {
        play();
      } else if (!video.paused) {
        video.pause();
      }
    }

    video.addEventListener('play', updateToggle);
    video.addEventListener('pause', updateToggle);
    video.addEventListener('playing', function () {
      video.classList.add('has-frame');
      updateToggle();
    });
    video.addEventListener('error', function () {
      video.classList.remove('has-frame');
      updateToggle();
    });
    toggle.addEventListener('click', function () {
      userChoice = video.paused;
      if (userChoice) {
        if (storyVideo && !storyVideo.paused) storyVideo.pause();
        if (video.error) video.load();
        play();
      } else {
        video.pause();
      }
    });
    toggle.hidden = false;
    updateToggle();

    if (storyVideo) {
      storyVideo.addEventListener('play', syncPlayback);
      storyVideo.addEventListener('pause', syncPlayback);
      storyVideo.addEventListener('ended', syncPlayback);
    }
    document.addEventListener('visibilitychange', syncPlayback);
    if (reduceMotionQuery.addEventListener) reduceMotionQuery.addEventListener('change', syncPlayback);
    if (gallery && 'MutationObserver' in window) {
      new MutationObserver(syncPlayback).observe(gallery, { attributes: true, attributeFilter: ['hidden'] });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[entries.length - 1].intersectionRatio >= 0.15;
        syncPlayback();
      }, { threshold: 0.15 }).observe(portrait);
    } else {
      inView = true;
      syncPlayback();
    }
  })();

  // ---------- ACTIVE ORDER PROGRESS BUBBLE ----------
  (function initActiveOrderBubble() {
    if (document.body.classList.contains('dashboard-page') || document.body.classList.contains('account-page')) return;

    var FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;
    var RING_CIRCUMFERENCE = 113.097;
    var ORDER_STEPS = {
      placed: { label: 'Order Created', percent: 0 },
      created: { label: 'Order Created', percent: 0 },
      processed: { label: 'Order Processed', percent: 15 },
      shipped: { label: 'Order Shipped', percent: 50 },
      out_for_delivery: { label: 'Order Out for Delivery', percent: 90 },
      delivered: { label: 'Order Delivered', percent: 100 },
      fulfilled: { label: 'Order Delivered', percent: 100 },
      cancelled: { label: 'Cancelled', percent: 0 }
    };
    var PRODUCT_PATHS = {
      'bubble-gun': '/bubble-gun',
      'stunt-pet': '/stunt-pet',
      'mini-cool-car': '/mini-cool-car',
      'gel-storm': '/gel-storm',
      'mecha-rover': '/mecha-rover',
      'pixel-splash': '/pixel-splash',
      'cute-dinos-green': '/cute-dinos',
      'cute-dinos-red': '/cute-dinos',
      'cute-dinos-teal': '/cute-dinos',
      'cute-dinos-trio': '/cute-dinos',
      'magnetic-blocks-25-pcs': '/magnetic-blocks',
      'magnetic-blocks-36-pcs': '/magnetic-blocks',
      'magnetic-blocks-42-pcs': '/magnetic-blocks',
      'magnetic-blocks-64-pcs': '/magnetic-blocks',
      'rise-one-x-4x4': '/rise-one-x-4x4',
      'drift-king': '/drift-king',
      'baby-lingo': '/baby-lingo'
    };

    function itemToSlug(name) {
      return String(name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    function stepFor(status) {
      return ORDER_STEPS[status] || ORDER_STEPS.created;
    }

    function isDelivered(status) {
      return status === 'delivered' || status === 'fulfilled';
    }

    function filterTrackableOrders(orders) {
      var now = Date.now();
      return (orders || []).filter(function (order) {
        if (!order || order.status === 'cancelled') return false;
        if (!isDelivered(order.status)) return true;
        var deliveredRef = order.deliveredAtMs || order.createdAtMs || 0;
        return deliveredRef > 0 && (now - deliveredRef) <= FIVE_DAYS_MS;
      }).sort(function (a, b) {
        var aActive = isDelivered(a.status) ? 0 : 1;
        var bActive = isDelivered(b.status) ? 0 : 1;
        if (aActive !== bActive) return bActive - aActive;
        return (b.createdAtMs || 0) - (a.createdAtMs || 0);
      });
    }

    var root = null;
    var triggerBtn = null;
    var popover = null;
    var listEl = null;
    var countNode = null;
    var ringFill = null;
    var ringPct = null;
    var statusLabelEl = null;
    var titleEl = null;
    var lastOrders = [];
    var barObserver = null;

    function syncLiftedState() {
      if (!root) return;
      var mobileBarVisible = Boolean(document.querySelector('.mobile-buy-bar.mobile-buy-bar--visible'));
      var mobileCartVisible = Boolean(document.querySelector('.mobile-cart-bar.is-visible'));
      var checkoutBarVisible = Boolean(document.querySelector('.checkout-paybar.is-visible'));
      root.classList.toggle('is-lifted', mobileBarVisible || mobileCartVisible || checkoutBarVisible);
    }

    function ensureShell() {
      if (root) return;
      root = document.createElement('div');
      root.className = 'order-bubble';
      root.hidden = true;

      popover = document.createElement('div');
      popover.className = 'order-bubble__popover';
      popover.id = 'order-bubble-popover';
      popover.hidden = true;
      popover.setAttribute('role', 'dialog');
      popover.setAttribute('aria-label', 'Active order tracker');

      var popHead = document.createElement('div');
      popHead.className = 'order-bubble__pop-head';
      var popTitle = document.createElement('h3');
      popTitle.textContent = 'LIVE ORDERS';
      var closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'order-bubble__pop-close';
      closeBtn.setAttribute('aria-label', 'Close order tracker');
      closeBtn.textContent = '×';
      closeBtn.addEventListener('click', function () {
        setOpen(false);
        triggerBtn.focus();
      });
      popHead.appendChild(popTitle);
      popHead.appendChild(closeBtn);

      listEl = document.createElement('div');
      listEl.className = 'order-bubble__list';

      var popFoot = document.createElement('div');
      popFoot.className = 'order-bubble__pop-foot';
      var footNote = document.createElement('span');
      footNote.textContent = 'REDPOLY TRACKER';
      var accountLink = document.createElement('a');
      accountLink.href = '/account#orders';
      accountLink.textContent = 'VIEW ALL IN ACCOUNT ↗';
      popFoot.appendChild(footNote);
      popFoot.appendChild(accountLink);

      popover.appendChild(popHead);
      popover.appendChild(listEl);
      popover.appendChild(popFoot);

      triggerBtn = document.createElement('button');
      triggerBtn.type = 'button';
      triggerBtn.className = 'order-bubble__trigger';
      triggerBtn.setAttribute('aria-expanded', 'false');
      triggerBtn.setAttribute('aria-controls', 'order-bubble-popover');

      var ringWrap = document.createElement('span');
      ringWrap.className = 'order-bubble__ring';
      ringWrap.setAttribute('aria-hidden', 'true');
      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 44 44');
      var track = document.createElementNS(svgNS, 'circle');
      track.setAttribute('class', 'order-bubble__ring-track');
      track.setAttribute('cx', '22');
      track.setAttribute('cy', '22');
      track.setAttribute('r', '18');
      ringFill = document.createElementNS(svgNS, 'circle');
      ringFill.setAttribute('class', 'order-bubble__ring-fill');
      ringFill.setAttribute('cx', '22');
      ringFill.setAttribute('cy', '22');
      ringFill.setAttribute('r', '18');
      ringFill.setAttribute('stroke-dasharray', String(RING_CIRCUMFERENCE));
      ringFill.setAttribute('stroke-dashoffset', String(RING_CIRCUMFERENCE));
      svg.appendChild(track);
      svg.appendChild(ringFill);
      ringPct = document.createElement('span');
      ringPct.className = 'order-bubble__pct';
      ringPct.textContent = '0%';
      ringWrap.appendChild(svg);
      ringWrap.appendChild(ringPct);

      var copyWrap = document.createElement('span');
      copyWrap.className = 'order-bubble__meta';
      titleEl = document.createElement('span');
      titleEl.className = 'order-bubble__eyebrow';
      statusLabelEl = document.createElement('strong');
      statusLabelEl.className = 'order-bubble__status';
      copyWrap.appendChild(titleEl);
      copyWrap.appendChild(statusLabelEl);

      countNode = document.createElement('span');
      countNode.className = 'order-bubble__badge';
      countNode.hidden = true;

      triggerBtn.appendChild(ringWrap);
      triggerBtn.appendChild(copyWrap);
      triggerBtn.appendChild(countNode);

      triggerBtn.addEventListener('click', function () {
        setOpen(popover.hidden);
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && popover && !popover.hidden) {
          setOpen(false);
          triggerBtn.focus();
        }
      });

      document.addEventListener('click', function (event) {
        if (!root || popover.hidden) return;
        if (!root.contains(event.target)) setOpen(false);
      });

      root.appendChild(popover);
      root.appendChild(triggerBtn);
      document.body.appendChild(root);

      var mobileBar = document.querySelector('.mobile-buy-bar');
      var mobileCartBarEl = document.querySelector('.mobile-cart-bar');
      var checkoutBar = document.querySelector('.checkout-paybar');
      if (window.MutationObserver && (mobileBar || mobileCartBarEl || checkoutBar)) {
        barObserver = new MutationObserver(syncLiftedState);
        if (mobileBar) barObserver.observe(mobileBar, { attributes: true, attributeFilter: ['class'] });
        if (mobileCartBarEl) barObserver.observe(mobileCartBarEl, { attributes: true, attributeFilter: ['class'] });
        if (checkoutBar) barObserver.observe(checkoutBar, { attributes: true, attributeFilter: ['class'] });
      }
      window.addEventListener('scroll', syncLiftedState, { passive: true });
      syncLiftedState();
    }

    function setOpen(open) {
      if (!popover || !triggerBtn) return;
      popover.hidden = !open;
      triggerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function renderBubble(orders) {
      lastOrders = filterTrackableOrders(orders);
      if (!lastOrders.length) {
        if (root) {
          setOpen(false);
          root.hidden = true;
        }
        return;
      }

      ensureShell();
      var primary = lastOrders[0];
      var step = stepFor(primary.status);
      var pct = Math.max(0, Math.min(100, step.percent));
      var visualPct = pct === 0 ? 4 : pct;
      var offset = RING_CIRCUMFERENCE * (1 - visualPct / 100);

      ringFill.setAttribute('stroke-dashoffset', offset.toFixed(2));
      ringPct.textContent = pct + '%';
      titleEl.textContent = primary.reference || 'ACTIVE ORDER';
      statusLabelEl.textContent = step.label;
      root.classList.toggle('is-delivered', isDelivered(primary.status));

      if (lastOrders.length > 1) {
        countNode.textContent = String(lastOrders.length);
        countNode.hidden = false;
      } else {
        countNode.hidden = true;
      }

      listEl.textContent = '';
      lastOrders.forEach(function (order) {
        var oStep = stepFor(order.status);
        var card = document.createElement('div');
        card.className = 'order-bubble__card' + (isDelivered(order.status) ? ' is-delivered' : '');

        var cardTop = document.createElement('div');
        cardTop.className = 'order-bubble__card-top';
        var refEl = document.createElement('span');
        refEl.className = 'order-bubble__ref';
        refEl.textContent = order.reference || order.id;
        var pctEl = document.createElement('span');
        pctEl.textContent = oStep.percent + '%';
        cardTop.appendChild(refEl);
        cardTop.appendChild(pctEl);
        card.appendChild(cardTop);

        var stageEl = document.createElement('div');
        stageEl.className = 'order-bubble__stage';
        stageEl.textContent = oStep.label;
        card.appendChild(stageEl);

        var trackBar = document.createElement('div');
        trackBar.className = 'order-bubble__bar';
        var fillBar = document.createElement('span');
        fillBar.style.width = Math.max(4, oStep.percent) + '%';
        trackBar.appendChild(fillBar);
        card.appendChild(trackBar);

        if (order.trackingCode) {
          var trackingLine = document.createElement('p');
          trackingLine.className = 'order-bubble__trk';
          trackingLine.appendChild(document.createTextNode((order.trackingCarrier ? order.trackingCarrier + ' ' : 'Tracking ') + ' '));
          var codeEl = document.createElement('code');
          codeEl.textContent = order.trackingCode;
          trackingLine.appendChild(codeEl);
          card.appendChild(trackingLine);
        }

        if (isDelivered(order.status) && Array.isArray(order.items) && order.items.length) {
          var reviewRow = document.createElement('div');
          reviewRow.className = 'order-bubble__card-links';
          var seenPages = {};
          order.items.forEach(function (item) {
            var slug = itemToSlug(item.name);
            var href = PRODUCT_PATHS[slug];
            if (!href || seenPages[href]) return;
            seenPages[href] = true;
            var link = document.createElement('a');
            link.className = 'order-bubble__link';
            link.href = href + '#product-reviews';
            link.textContent = 'Review ' + item.name + ' ↗';
            reviewRow.appendChild(link);
          });
          if (reviewRow.childNodes.length) card.appendChild(reviewRow);
        }

        listEl.appendChild(card);
      });

      root.hidden = false;
      syncLiftedState();
    }

    function refreshBubble() {
      var fb = window.RedpolyFirebase;
      var user = fb && typeof fb.getUser === 'function' ? fb.getUser() : null;
      if (!user || !user.emailVerified || typeof fb.getOrders !== 'function') {
        renderBubble([]);
        return;
      }
      var orders = fb.getOrders();
      renderBubble(Array.isArray(orders) ? orders : []);
    }

    window.addEventListener('redpoly:firebase-ready', refreshBubble);
    window.addEventListener('redpoly:auth-changed', refreshBubble);
    window.addEventListener('redpoly:orders-updated', refreshBubble);
    ensureFirebaseClient().then(refreshBubble).catch(function () { /* Fail closed cleanly. */ });
  })();

  // ---------- VERIFIED PRODUCT REVIEWS ----------
  (function initProductReviews() {
    var section = document.getElementById('product-reviews');
    if (!section) return;

    var productSlug = String(section.getAttribute('data-product-slug') || '').trim();
    if (!productSlug) return;

    var ELIGIBLE_ITEM_SLUGS = {
      'bubble-gun': ['bubble-gun'],
      'stunt-pet': ['stunt-pet'],
      'mini-cool-car': ['mini-cool-car'],
      'gel-storm': ['gel-storm'],
      'mecha-rover': ['mecha-rover'],
      'pixel-splash': ['pixel-splash'],
      'cute-dinos': ['cute-dinos-green', 'cute-dinos-red', 'cute-dinos-teal', 'cute-dinos-trio'],
      'magnetic-blocks': ['magnetic-blocks-25-pcs', 'magnetic-blocks-36-pcs', 'magnetic-blocks-42-pcs', 'magnetic-blocks-64-pcs'],
      'rise-one-x-4x4': ['rise-one-x-4x4'],
      'drift-king': ['drift-king'],
      'baby-lingo': ['baby-lingo']
    };
    var matchingItemSlugs = ELIGIBLE_ITEM_SLUGS[productSlug] || [productSlug];

    function toItemSlug(name) {
      return String(name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    function isDelivered(status) {
      return status === 'delivered' || status === 'fulfilled';
    }

    function formatStars(rating) {
      var n = Math.max(1, Math.min(5, Math.round(Number(rating || 5))));
      return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
    }

    function formatReviewDate(ms) {
      if (!ms) return 'RECENTLY';
      try {
        return new Date(ms).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
      } catch (_err) {
        return '';
      }
    }

    function buildStructure() {
      section.textContent = '';

      var wrap = document.createElement('div');
      wrap.className = 'product-reviews__wrap';

      var head = document.createElement('div');
      head.className = 'product-reviews__head';
      var headCopy = document.createElement('div');
      var eyebrow = document.createElement('p');
      eyebrow.className = 'product-reviews__eyebrow';
      eyebrow.textContent = 'VERIFIED CUSTOMER REVIEWS';
      var title = document.createElement('h2');
      title.className = 'product-reviews__title';
      title.id = 'product-reviews-title';
      title.textContent = 'WHAT BUYERS SAY';
      headCopy.appendChild(eyebrow);
      headCopy.appendChild(title);

      var summary = document.createElement('div');
      summary.className = 'product-reviews__summary';
      summary.hidden = true;
      head.appendChild(headCopy);
      head.appendChild(summary);
      wrap.appendChild(head);

      var approvedWrap = document.createElement('div');
      approvedWrap.className = 'product-reviews__approved';
      approvedWrap.hidden = true;
      var approvedGrid = document.createElement('div');
      approvedGrid.className = 'product-reviews__grid';
      approvedWrap.appendChild(approvedGrid);
      wrap.appendChild(approvedWrap);

      var buyerSlot = document.createElement('div');
      buyerSlot.className = 'product-reviews__buyer-slot';
      wrap.appendChild(buyerSlot);
      section.appendChild(wrap);

      return {
        summary: summary,
        approvedList: approvedWrap,
        approvedGrid: approvedGrid,
        buyerSlot: buyerSlot
      };
    }

    var ui = buildStructure();
    var currentUser = null;
    var stateData = { approved: [], mine: [], eligibleOrders: [] };

    function renderReviewCard(review, options) {
      if (options && options.own) {
        var ownCard = document.createElement('article');
        ownCard.className = 'review-own-card';

        var ownHead = document.createElement('div');
        ownHead.className = 'review-own-card__head';
        var ownMeta = document.createElement('span');
        ownMeta.textContent = 'YOUR REVIEW · ' + formatStars(review.rating) + (review.orderReference ? ' · ' + review.orderReference : '');
        var ownBadge = document.createElement('span');
        ownBadge.className = review.status === 'rejected'
          ? 'review-own-card__badge review-own-card__badge--rejected'
          : 'review-own-card__badge';
        ownBadge.textContent = review.status === 'rejected' ? 'NOT PUBLISHED' : 'PENDING MODERATION';
        ownHead.appendChild(ownMeta);
        ownHead.appendChild(ownBadge);
        ownCard.appendChild(ownHead);

        var ownTitle = document.createElement('strong');
        ownTitle.textContent = review.title;
        var ownBody = document.createElement('p');
        ownBody.textContent = review.body;
        ownCard.appendChild(ownTitle);
        ownCard.appendChild(ownBody);
        return ownCard;
      }

      var card = document.createElement('article');
      card.className = 'review-card';

      var top = document.createElement('div');
      top.className = 'review-card__top';

      var stars = document.createElement('span');
      stars.className = 'review-card__stars';
      stars.setAttribute('aria-label', review.rating + ' out of 5 stars');
      stars.textContent = formatStars(review.rating);

      var badge = document.createElement('span');
      badge.className = 'review-card__verified';
      badge.textContent = 'VERIFIED BUYER';

      top.appendChild(stars);
      top.appendChild(badge);
      card.appendChild(top);

      var headline = document.createElement('h3');
      headline.className = 'review-card__headline';
      headline.textContent = review.title;
      card.appendChild(headline);

      var body = document.createElement('p');
      body.className = 'review-card__comment';
      body.textContent = review.body;
      card.appendChild(body);

      var meta = document.createElement('div');
      meta.className = 'review-card__meta';
      var author = document.createElement('span');
      var showVariantSuffix = review.productName && (productSlug === 'cute-dinos' || productSlug === 'magnetic-blocks');
      author.textContent = review.authorName + (showVariantSuffix ? ' · ' + review.productName : '');
      var date = document.createElement('span');
      date.textContent = formatReviewDate(review.createdAtMs);
      meta.appendChild(author);
      meta.appendChild(date);
      card.appendChild(meta);

      return card;
    }

    function renderComposer(orderCandidates) {
      var box = document.createElement('div');
      box.className = 'product-reviews__composer';

      var head = document.createElement('div');
      head.className = 'product-reviews__composer-head';
      var heading = document.createElement('h3');
      heading.textContent = 'WRITE A VERIFIED REVIEW';
      var pill = document.createElement('span');
      pill.className = 'product-reviews__order-pill';
      pill.textContent = 'DELIVERED · ' + orderCandidates[0].order.reference;
      head.appendChild(heading);
      head.appendChild(pill);
      box.appendChild(head);

      var form = document.createElement('form');
      form.className = 'review-form';
      form.noValidate = true;

      var orderSelect = null;
      if (orderCandidates.length > 1) {
        var orderLabel = document.createElement('label');
        orderLabel.className = 'review-field';
        orderLabel.textContent = 'DELIVERED ORDER';
        orderSelect = document.createElement('select');
        orderCandidates.forEach(function (cand, idx) {
          var opt = document.createElement('option');
          opt.value = String(idx);
          opt.textContent = cand.order.reference + ' · ' + cand.item.name;
          orderSelect.appendChild(opt);
        });
        orderSelect.addEventListener('change', function () {
          var chosen = orderCandidates[Number(orderSelect.value || 0)] || orderCandidates[0];
          pill.textContent = 'DELIVERED · ' + chosen.order.reference;
        });
        orderLabel.appendChild(orderSelect);
        form.appendChild(orderLabel);
      }

      var selectedRating = 5;
      var starRow = document.createElement('div');
      starRow.className = 'review-stars-input';
      starRow.setAttribute('role', 'radiogroup');
      starRow.setAttribute('aria-label', 'Star rating');
      var ratingCap = document.createElement('span');
      ratingCap.className = 'review-stars-input__label';
      ratingCap.textContent = 'RATING';
      starRow.appendChild(ratingCap);
      var starButtons = [];

      function syncStars() {
        starButtons.forEach(function (btn, idx) {
          var val = idx + 1;
          var active = val <= selectedRating;
          btn.classList.toggle('is-active', active);
          btn.setAttribute('aria-checked', val === selectedRating ? 'true' : 'false');
        });
      }

      for (var r = 1; r <= 5; r += 1) {
        (function (val) {
          var starBtn = document.createElement('button');
          starBtn.type = 'button';
          starBtn.className = 'review-star-btn is-active';
          starBtn.setAttribute('role', 'radio');
          starBtn.setAttribute('aria-label', val + (val === 1 ? ' star' : ' stars'));
          starBtn.setAttribute('aria-checked', val === 5 ? 'true' : 'false');
          starBtn.textContent = '★';
          starBtn.addEventListener('click', function () {
            selectedRating = val;
            syncStars();
          });
          starButtons.push(starBtn);
          starRow.appendChild(starBtn);
        })(r);
      }
      form.appendChild(starRow);

      var nameField = document.createElement('label');
      nameField.className = 'review-field';
      nameField.textContent = 'YOUR NAME';
      var nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.maxLength = 80;
      nameInput.required = true;
      nameInput.value = (orderCandidates[0].order.customerName || (currentUser && currentUser.displayName) || '').trim();
      nameField.appendChild(nameInput);
      form.appendChild(nameField);

      var titleField = document.createElement('label');
      titleField.className = 'review-field';
      titleField.textContent = 'HEADLINE';
      var titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.maxLength = 120;
      titleInput.required = true;
      titleInput.placeholder = 'e.g. Fast delivery and super sturdy build';
      titleField.appendChild(titleInput);
      form.appendChild(titleField);

      var bodyField = document.createElement('label');
      bodyField.className = 'review-field';
      bodyField.textContent = 'YOUR REVIEW';
      var bodyInput = document.createElement('textarea');
      bodyInput.rows = 3;
      bodyInput.maxLength = 1000;
      bodyInput.required = true;
      bodyInput.placeholder = 'Share how it performed out of the box.';
      bodyField.appendChild(bodyInput);
      form.appendChild(bodyField);

      var foot = document.createElement('div');
      foot.className = 'review-form__foot';

      var submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.className = 'review-submit-btn';
      submitBtn.textContent = 'SUBMIT REVIEW';

      var statusNote = document.createElement('p');
      statusNote.className = 'review-form__status';
      statusNote.hidden = true;
      statusNote.setAttribute('aria-live', 'polite');

      foot.appendChild(submitBtn);
      foot.appendChild(statusNote);
      form.appendChild(foot);

      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        statusNote.hidden = true;
        var chosenIdx = orderSelect ? Number(orderSelect.value || 0) : 0;
        var target = orderCandidates[chosenIdx] || orderCandidates[0];
        var authorVal = nameInput.value.trim();
        var titleVal = titleInput.value.trim();
        var bodyVal = bodyInput.value.trim();

        if (!authorVal) {
          statusNote.textContent = 'Please enter your display name.';
          statusNote.className = 'review-form__status is-error';
          statusNote.hidden = false;
          nameInput.focus();
          return;
        }
        if (!titleVal) {
          statusNote.textContent = 'Please enter a short review headline.';
          statusNote.className = 'review-form__status is-error';
          statusNote.hidden = false;
          titleInput.focus();
          return;
        }
        if (bodyVal.length < 5) {
          statusNote.textContent = 'Please write at least 5 characters for your review.';
          statusNote.className = 'review-form__status is-error';
          statusNote.hidden = false;
          bodyInput.focus();
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'SUBMITTING...';
        try {
          var created = await window.RedpolyFirebase.submitProductReview({
            orderId: target.order.id,
            orderReference: target.order.reference,
            productSlug: productSlug,
            itemSlug: target.itemSlug,
            productName: target.item.name,
            authorName: authorVal,
            rating: selectedRating,
            title: titleVal,
            body: bodyVal
          });
          stateData.mine.unshift(created);
          renderAll();
        } catch (err) {
          statusNote.textContent = err && err.message ? err.message : 'Could not submit review right now.';
          statusNote.className = 'review-form__status is-error';
          statusNote.hidden = false;
          submitBtn.disabled = false;
          submitBtn.textContent = 'SUBMIT REVIEW';
        }
      });

      box.appendChild(form);
      return box;
    }

    function renderAll() {
      var approved = stateData.approved || [];
      var mine = stateData.mine || [];
      var eligibleOrders = stateData.eligibleOrders || [];

      var reviewedOrderIds = {};
      mine.forEach(function (rev) { reviewedOrderIds[rev.orderId] = true; });
      var unreviewed = eligibleOrders.filter(function (cand) { return !reviewedOrderIds[cand.order.id]; });

      var hasVisibleApproved = approved.length > 0;
      var hasVisibleOwn = mine.length > 0;
      var hasComposer = unreviewed.length > 0;

      if (!hasVisibleApproved && !hasVisibleOwn && !hasComposer) {
        section.hidden = true;
        return;
      }

      section.hidden = false;

      if (hasVisibleApproved) {
        var avg = approved.reduce(function (sum, item) { return sum + Number(item.rating || 5); }, 0) / approved.length;
        ui.summary.textContent = '';
        var avgScore = document.createElement('span');
        avgScore.className = 'product-reviews__score';
        avgScore.textContent = avg.toFixed(1);
        var avgCopy = document.createElement('div');
        avgCopy.className = 'product-reviews__summary-copy';
        var avgStars = document.createElement('strong');
        avgStars.textContent = formatStars(Math.round(avg));
        var avgCount = document.createElement('span');
        avgCount.textContent = approved.length + (approved.length === 1 ? ' VERIFIED REVIEW' : ' VERIFIED REVIEWS');
        avgCopy.appendChild(avgStars);
        avgCopy.appendChild(avgCount);
        ui.summary.appendChild(avgScore);
        ui.summary.appendChild(avgCopy);
        ui.summary.hidden = false;

        ui.approvedGrid.textContent = '';
        approved.forEach(function (rev) {
          ui.approvedGrid.appendChild(renderReviewCard(rev, { own: false }));
        });
        ui.approvedList.hidden = false;
      } else {
        ui.summary.hidden = true;
        ui.approvedList.hidden = true;
        ui.approvedGrid.textContent = '';
      }

      ui.buyerSlot.textContent = '';
      mine.forEach(function (rev) {
        if (rev.status !== 'approved') {
          ui.buyerSlot.appendChild(renderReviewCard(rev, { own: true }));
        } else {
          var liveNote = document.createElement('div');
          liveNote.className = 'review-own-card';
          var liveHead = document.createElement('div');
          liveHead.className = 'review-own-card__head';
          liveHead.textContent = 'Your verified review for order ' + (rev.orderReference || rev.orderId) + ' is published above.';
          liveNote.appendChild(liveHead);
          ui.buyerSlot.appendChild(liveNote);
        }
      });

      if (hasComposer) {
        ui.buyerSlot.appendChild(renderComposer(unreviewed));
      }
    }

    function syncEligibleOrdersOnly() {
      var fb = window.RedpolyFirebase;
      var user = fb && typeof fb.getUser === 'function' ? fb.getUser() : null;
      currentUser = user && user.emailVerified ? user : null;
      stateData.eligibleOrders = [];
      if (currentUser && fb && typeof fb.getOrders === 'function') {
        var orders = fb.getOrders() || [];
        orders.forEach(function (order) {
          if (!order || !isDelivered(order.status) || !Array.isArray(order.items)) return;
          for (var i = 0; i < order.items.length; i += 1) {
            var item = order.items[i];
            var slug = toItemSlug(item.name);
            if (matchingItemSlugs.indexOf(slug) !== -1) {
              stateData.eligibleOrders.push({ order: order, item: item, itemSlug: slug });
              break;
            }
          }
        });
      }
      renderAll();
    }

    var lastLoadedAuthKey = '__init__';
    async function refreshReviews(forceFetch) {
      var fb = window.RedpolyFirebase;
      if (!fb || typeof fb.listProductReviews !== 'function') return;
      var user = typeof fb.getUser === 'function' ? fb.getUser() : null;
      currentUser = user && user.emailVerified ? user : null;
      var nextAuthKey = currentUser ? currentUser.uid : 'anon';

      if (forceFetch || nextAuthKey !== lastLoadedAuthKey) {
        lastLoadedAuthKey = nextAuthKey;
        try {
          var res = await fb.listProductReviews(productSlug);
          stateData.approved = (res && res.approved) || [];
          stateData.mine = currentUser ? ((res && res.mine) || []) : [];
        } catch (_ignoreReviewErr) {
          stateData.approved = [];
          stateData.mine = [];
        }
      }

      syncEligibleOrdersOnly();
    }

    window.addEventListener('redpoly:firebase-ready', function () { refreshReviews(false); });
    window.addEventListener('redpoly:auth-changed', function () { refreshReviews(true); });
    window.addEventListener('redpoly:orders-updated', syncEligibleOrdersOnly);
    ensureFirebaseClient().then(function () {
      refreshReviews(false);
    }).catch(function () {
      section.hidden = true;
    });
  })();

  // Homepage storefront category tabs, directory cards & live Firestore sync
  (function initShopCategories() {
    var shelvesWrap = document.getElementById('shop-shelves');
    if (!shelvesWrap) return;

    var tabsWrap = document.querySelector('.shop-tabs');
    var catsWrap = document.querySelector('.shop-categories');
    var filterBar = document.getElementById('shop-filter-bar');
    var filterStatus = document.getElementById('shop-filter-status');
    var filterReset = document.getElementById('shop-filter-reset');
    var shopSection = document.getElementById('shop');

    var DEFAULT_CATS = [
      { slug: 'guns', name: 'Guns', shortDesc: 'Gel, water & automatic bubble blasters', shelfDesc: 'Gel blasters, automatic water guns, and backyard bubble action.', accentColor: '#FF6B1A', sortOrder: 1, visible: true, thumbnailUrl: '' },
      { slug: 'cars', name: 'Cars', shortDesc: 'RC drift, spray, stunt & transform cars', shelfDesc: 'Remote-control drift racers, exhaust mist sprayers, stunt cars & transformable rescue trucks.', accentColor: '#1C7ED6', sortOrder: 2, visible: true, thumbnailUrl: '' },
      { slug: 'educational', name: 'Educational', shortDesc: 'Bilingual first words & magnetic STEM', shelfDesc: 'Screen-free bilingual learning and magnetic STEM construction sets.', accentColor: '#0E9F6E', sortOrder: 3, visible: true, thumbnailUrl: '' },
      { slug: 'fun', name: 'Fun', shortDesc: 'Rolling voice pets & push-and-go dinos', shelfDesc: 'Voice-activated rolling characters and chunky push-and-go dinosaurs.', accentColor: '#7C3AED', sortOrder: 4, visible: true, thumbnailUrl: '' }
    ];
    var GROUP_PRIMARY_SKU = {
      'magnetic-blocks': 'magnetic-blocks-25-pcs',
      'cute-dinos': 'cute-dinos-green'
    };
    var DEFAULT_GROUP_CATS = {
      'gel-storm': 'guns',
      'pixel-splash': 'guns',
      'bubble-gun': 'guns',
      'rise-one-x-4x4': 'cars',
      'drift-king': 'cars',
      'mini-cool-car': 'cars',
      'mecha-rover': 'cars',
      'baby-lingo': 'educational',
      'magnetic-blocks': 'educational',
      'stunt-pet': 'fun',
      'cute-dinos': 'fun'
    };

    // Snapshot original 11 .shop-card DOM elements in initial order so wishlist hearts, cart listeners & live badges stay attached
    var initialCards = [];
    Array.prototype.forEach.call(shelvesWrap.querySelectorAll('.shop-card'), function (cardEl) {
      var mediaLink = cardEl.querySelector('.shop-card__media');
      var href = mediaLink ? String(mediaLink.getAttribute('href') || '') : '';
      var groupSlug = href.replace(/^\//, '').split(/[?#]/)[0].trim().toLowerCase();
      if (!groupSlug) return;
      initialCards.push({
        groupSlug: groupSlug,
        primarySku: GROUP_PRIMARY_SKU[groupSlug] || groupSlug,
        el: cardEl
      });
    });

    var categoryNameBySlug = { guns: 'Guns', cars: 'Cars', educational: 'Educational', fun: 'Fun' };
    var activeCategory = 'all';
    var hasRenderedDynamic = false;

    function getTabs() {
      return tabsWrap ? Array.prototype.slice.call(tabsWrap.querySelectorAll('[data-shop-filter]')) : [];
    }
    function getCatCards() {
      return catsWrap ? Array.prototype.slice.call(catsWrap.querySelectorAll('[data-shop-cat]')) : [];
    }
    function getShelves() {
      return Array.prototype.slice.call(shelvesWrap.querySelectorAll('[data-category-shelf]'));
    }

    function applyCategory(category, opts) {
      var next = categoryNameBySlug[category] ? category : 'all';
      activeCategory = next;
      var visibleCount = 0;

      getShelves().forEach(function (shelf) {
        var shelfCat = shelf.getAttribute('data-category-shelf');
        var show = next === 'all' || shelfCat === next;
        shelf.hidden = !show;
        shelf.classList.toggle('is-solo', next !== 'all' && show);
        if (show) {
          visibleCount += shelf.querySelectorAll('.shop-card').length;
        }
      });

      getTabs().forEach(function (tab) {
        var isActive = tab.getAttribute('data-shop-filter') === next;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        if (isActive && tab.parentElement && tab.parentElement.scrollWidth > tab.parentElement.clientWidth) {
          var parent = tab.parentElement;
          var targetScroll = tab.offsetLeft - (parent.clientWidth - tab.offsetWidth) / 2;
          parent.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
        }
      });

      getCatCards().forEach(function (card) {
        var catKey = card.getAttribute('data-shop-cat');
        var catName = (categoryNameBySlug[catKey] || catKey || '').toUpperCase();
        var isActive = catKey === next;
        card.classList.toggle('is-active', isActive);
        card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        var cta = card.querySelector('.shop-cat-card__cta');
        if (cta) {
          cta.textContent = isActive
            ? 'VIEWING ' + catName + ' · SHOW ALL'
            : 'BROWSE ' + catName + ' →';
        }
      });

      if (filterBar && filterStatus) {
        if (next === 'all') {
          filterBar.hidden = true;
          filterStatus.textContent = '';
        } else {
          filterBar.hidden = false;
          filterStatus.textContent = 'SHOWING ' + (categoryNameBySlug[next] || next).toUpperCase() + ' · ' + visibleCount + (visibleCount === 1 ? ' TOY' : ' TOYS');
        }
      }

      if (opts && opts.scrollToShelves && shelvesWrap) {
        var target = next === 'all' ? (shopSection || shelvesWrap) : shelvesWrap;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function buildSkuCategoryLookup() {
      var bySku = {};
      var fb = window.RedpolyFirebase;
      if (fb && typeof fb.getCatalogMap === 'function') {
        var map = fb.getCatalogMap() || {};
        Object.keys(map).forEach(function (k) {
          var rec = map[k];
          if (rec && rec.sku && typeof rec.category === 'string' && rec.category.trim()) {
            bySku[rec.sku] = rec.category.trim().toLowerCase();
          }
        });
      }
      return bySku;
    }

    function syncStorefrontCategories() {
      if (!initialCards.length) return;
      var fb = window.RedpolyFirebase;
      var rawCats = (fb && typeof fb.getCategories === 'function' && fb.getCategories().length)
        ? fb.getCategories()
        : DEFAULT_CATS;

      var allCats = rawCats.slice().sort(function (a, b) {
        return (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0) || String(a.name || '').localeCompare(String(b.name || ''));
      });
      var allCatMap = {};
      allCats.forEach(function (c) { allCatMap[c.slug] = c; });

      var visibleCats = allCats.filter(function (c) { return c.visible !== false; });
      if (!visibleCats.length) visibleCats = allCats.slice();
      if (!visibleCats.length) visibleCats = DEFAULT_CATS.slice();

      var visibleCatMap = {};
      categoryNameBySlug = {};
      visibleCats.forEach(function (c) {
        visibleCatMap[c.slug] = c;
        categoryNameBySlug[c.slug] = c.name;
      });

      var skuCatLookup = buildSkuCategoryLookup();
      var cardsByCat = {};
      visibleCats.forEach(function (c) { cardsByCat[c.slug] = []; });

      var totalVisibleToys = 0;
      initialCards.forEach(function (entry) {
        var assignedSlug = skuCatLookup[entry.primarySku] || DEFAULT_GROUP_CATS[entry.groupSlug] || visibleCats[0].slug;
        if (visibleCatMap[assignedSlug]) {
          cardsByCat[assignedSlug].push(entry.el);
          totalVisibleToys += 1;
        } else if (allCatMap[assignedSlug] && allCatMap[assignedSlug].visible === false) {
          // Assigned category is explicitly hidden by admin; do not display card on homepage
        } else {
          cardsByCat[visibleCats[0].slug].push(entry.el);
          totalVisibleToys += 1;
        }
      });

      // Rebuild tabs
      if (tabsWrap) {
        tabsWrap.textContent = '';
        var allBtn = document.createElement('button');
        allBtn.type = 'button';
        allBtn.className = 'shop-tab';
        allBtn.setAttribute('role', 'tab');
        allBtn.setAttribute('data-shop-filter', 'all');
        allBtn.appendChild(document.createTextNode('ALL TOYS '));
        var allCnt = document.createElement('span');
        allCnt.className = 'shop-tab__count';
        allCnt.textContent = '(' + totalVisibleToys + ')';
        allBtn.appendChild(allCnt);
        tabsWrap.appendChild(allBtn);

        visibleCats.forEach(function (c) {
          var cnt = (cardsByCat[c.slug] || []).length;
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'shop-tab';
          btn.setAttribute('role', 'tab');
          btn.setAttribute('data-shop-filter', c.slug);
          btn.appendChild(document.createTextNode(String(c.name || c.slug).toUpperCase() + ' '));
          var spanCnt = document.createElement('span');
          spanCnt.className = 'shop-tab__count';
          spanCnt.textContent = '(' + cnt + ')';
          btn.appendChild(spanCnt);
          tabsWrap.appendChild(btn);
        });
      }

      // Rebuild category directory cards
      if (catsWrap) {
        catsWrap.textContent = '';
        visibleCats.forEach(function (c, idx) {
          var cnt = (cardsByCat[c.slug] || []).length;
          var cardBtn = document.createElement('button');
          cardBtn.type = 'button';
          cardBtn.className = 'shop-cat-card';
          cardBtn.setAttribute('data-shop-cat', c.slug);
          cardBtn.setAttribute('aria-pressed', 'false');
          if (c.accentColor) {
            cardBtn.style.setProperty('--cat-accent', c.accentColor);
          }

          if (c.thumbnailUrl && (/^(\/|https?:\/\/)/.test(c.thumbnailUrl))) {
            var thumb = document.createElement('img');
            thumb.className = 'shop-cat-card__thumb';
            thumb.src = c.thumbnailUrl;
            thumb.alt = c.name + ' collection';
            thumb.loading = 'lazy';
            thumb.decoding = 'async';
            cardBtn.appendChild(thumb);
          }

          var meta = document.createElement('span');
          meta.className = 'shop-cat-card__meta';
          var idxSpan = document.createElement('span');
          idxSpan.textContent = String(idx + 1).padStart(2, '0');
          var cntSpan = document.createElement('span');
          cntSpan.textContent = cnt + (cnt === 1 ? ' TOY' : ' TOYS');
          meta.appendChild(idxSpan);
          meta.appendChild(cntSpan);
          cardBtn.appendChild(meta);

          var title = document.createElement('strong');
          title.className = 'shop-cat-card__title';
          title.textContent = String(c.name || c.slug).toUpperCase();
          cardBtn.appendChild(title);

          if (c.shortDesc) {
            var desc = document.createElement('p');
            desc.className = 'shop-cat-card__desc';
            desc.textContent = c.shortDesc;
            cardBtn.appendChild(desc);
          }

          var cta = document.createElement('span');
          cta.className = 'shop-cat-card__cta';
          cta.textContent = 'BROWSE ' + String(c.name || c.slug).toUpperCase() + ' →';
          cardBtn.appendChild(cta);

          catsWrap.appendChild(cardBtn);
        });
      }

      // Rebuild shelves moving existing .shop-card DOM nodes intact
      shelvesWrap.textContent = '';
      visibleCats.forEach(function (c, idx) {
        var catCardsList = cardsByCat[c.slug] || [];
        var shelf = document.createElement('section');
        shelf.className = 'shop-shelf';
        shelf.id = 'shop-' + c.slug;
        shelf.setAttribute('data-category-shelf', c.slug);
        shelf.setAttribute('aria-labelledby', 'shelf-' + c.slug + '-heading');

        var head = document.createElement('div');
        head.className = 'shop-shelf__head';

        var titleWrap = document.createElement('div');
        titleWrap.className = 'shop-shelf__title-wrap';
        var indexEl = document.createElement('span');
        indexEl.className = 'shop-shelf__index';
        indexEl.setAttribute('aria-hidden', 'true');
        indexEl.textContent = String(idx + 1).padStart(2, '0');
        titleWrap.appendChild(indexEl);

        var titleCopy = document.createElement('div');
        var h3 = document.createElement('h3');
        h3.id = 'shelf-' + c.slug + '-heading';
        h3.textContent = String(c.name || c.slug).toUpperCase();
        titleCopy.appendChild(h3);
        if (c.shelfDesc) {
          var pDesc = document.createElement('p');
          pDesc.className = 'shop-shelf__desc';
          pDesc.textContent = c.shelfDesc;
          titleCopy.appendChild(pDesc);
        }
        titleWrap.appendChild(titleCopy);
        head.appendChild(titleWrap);

        var countEl = document.createElement('span');
        countEl.className = 'shop-shelf__count';
        countEl.textContent = catCardsList.length + (catCardsList.length === 1 ? ' PRODUCT' : ' PRODUCTS');
        head.appendChild(countEl);
        shelf.appendChild(head);

        if (catCardsList.length) {
          var grid = document.createElement('div');
          grid.className = 'shop-shelf__grid';
          catCardsList.forEach(function (cardNode) {
            grid.appendChild(cardNode);
          });
          shelf.appendChild(grid);
        } else {
          var emptyNote = document.createElement('p');
          emptyNote.className = 'shop-shelf__empty';
          emptyNote.textContent = 'New toys coming soon to ' + c.name + '.';
          shelf.appendChild(emptyNote);
        }

        shelvesWrap.appendChild(shelf);
      });

      if (filterReset) {
        filterReset.textContent = 'SHOW ALL ' + totalVisibleToys + (totalVisibleToys === 1 ? ' TOY' : ' TOYS');
      }

      var isFirstSync = !hasRenderedDynamic;
      hasRenderedDynamic = true;
      var targetCat = activeCategory;
      if (targetCat === 'all' && isFirstSync) {
        var fromUrl = readCategoryFromUrl();
        if (fromUrl !== 'all') targetCat = fromUrl;
      }
      applyCategory(targetCat, { scrollToShelves: false });
    }

    if (tabsWrap) {
      tabsWrap.addEventListener('click', function (ev) {
        var tab = ev.target && ev.target.closest ? ev.target.closest('[data-shop-filter]') : null;
        if (!tab) return;
        var cat = tab.getAttribute('data-shop-filter') || 'all';
        applyCategory(cat, { scrollToShelves: false });
      });
    }

    if (catsWrap) {
      catsWrap.addEventListener('click', function (ev) {
        var card = ev.target && ev.target.closest ? ev.target.closest('[data-shop-cat]') : null;
        if (!card) return;
        var cat = card.getAttribute('data-shop-cat') || 'all';
        var next = activeCategory === cat ? 'all' : cat;
        applyCategory(next, { scrollToShelves: next !== 'all' });
      });
    }

    if (filterReset) {
      filterReset.addEventListener('click', function () {
        applyCategory('all', { scrollToShelves: false });
      });
    }

    function readCategoryFromUrl() {
      var hash = (window.location.hash || '').replace(/^#/, '').toLowerCase();
      if (hash.indexOf('shop-') === 0) {
        var fromHash = hash.slice(5);
        if (categoryNameBySlug[fromHash]) return fromHash;
      }
      try {
        var params = new URLSearchParams(window.location.search);
        var fromQuery = (params.get('category') || '').toLowerCase();
        if (categoryNameBySlug[fromQuery]) return fromQuery;
      } catch (_ignoreUrlErr) {}
      return 'all';
    }

    window.addEventListener('redpoly:categories-updated', syncStorefrontCategories);
    window.addEventListener('redpoly:catalog-updated', syncStorefrontCategories);
    window.addEventListener('redpoly:firebase-ready', syncStorefrontCategories);

    if (window.RedpolyFirebase && typeof window.RedpolyFirebase.getCategories === 'function' && window.RedpolyFirebase.getCategories().length) {
      syncStorefrontCategories();
    }

    var initialCat = readCategoryFromUrl();
    if (initialCat !== 'all') {
      applyCategory(initialCat, { scrollToShelves: false });
    }

    window.addEventListener('hashchange', function () {
      var fromHash = readCategoryFromUrl();
      if (fromHash !== 'all') {
        applyCategory(fromHash, { scrollToShelves: true });
      }
    });
  })();
})();
