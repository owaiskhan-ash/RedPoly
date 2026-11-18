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
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  // Local cart shared across storefront and product pages. Checkout stays clearly marked as pending integration.
  // Free standard shipping starts at ₹2,000 and a free gift at ₹3,500; the same numbers live in checkout.js.
  // The catalogue is the list of products on sale. Add a product here (and in checkout.js) when it gets a page.
  // Anything else found in a saved cart or saved list (for example an item that is no longer sold) is dropped.
  var catalogue = {
    'BUBBLE GUN': { price:499, href:'/bubble-gun', image:'/assets/images/redpoly/products/bubble-gun-thumb.webp?v=bubble-20261121' },
    'STUNT PET': { price:599, href:'/stunt-pet', image:'/assets/images/redpoly/products/stunt-pet-thumb.webp?v=pet-20261122' },
    'MINI COOL CAR': { price:749, href:'/mini-cool-car', image:'/assets/images/redpoly/products/mini-cool-car-thumb.webp?v=car-20261117' },
    'GEL STORM': { price:1999, href:'/gel-storm', image:'/assets/images/redpoly/products/gel-storm-thumb.webp?v=gel-20261121' },
    'MECHA ROVER': { price:499, href:'/mecha-rover', image:'/assets/images/redpoly/products/mecha-rover-thumb.webp?v=mecha-20261120' },
    'PIXEL SPLASH': { price:1749, href:'/pixel-splash', image:'/assets/images/redpoly/products/pixel-splash-thumb.webp?v=pixel-20261117-v3' },
    // Cute Dinos sells as one dino in any of three colours (₹249) or the set of all three (₹549).
    'CUTE DINOS GREEN': { price:249, href:'/cute-dinos?colour=green', image:'/assets/images/redpoly/products/cute-dinos-green-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS RED': { price:249, href:'/cute-dinos?colour=red', image:'/assets/images/redpoly/products/cute-dinos-red-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS TEAL': { price:249, href:'/cute-dinos?colour=teal', image:'/assets/images/redpoly/products/cute-dinos-teal-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS TRIO': { price:549, href:'/cute-dinos?pack=trio', image:'/assets/images/redpoly/products/cute-dinos-trio-thumb.webp?v=dinos-20261116' }
  };
  function inCatalogue(name, price) { return Object.prototype.hasOwnProperty.call(catalogue, name) && catalogue[name].price === Number(price); }
  var cartStorageKey = 'redpoly-cart-v1';
  var cartItems = [];
  try {
    var storedCart = JSON.parse(window.localStorage.getItem(cartStorageKey) || '[]');
    if (Array.isArray(storedCart)) cartItems = storedCart.filter(function (item) {
      return item && typeof item.id === 'string' && typeof item.name === 'string' &&
        inCatalogue(item.name, item.price) && Number.isFinite(Number(item.quantity)) && Number(item.quantity) >= 1;
    }).map(function (item) {
      return { id: item.name.toLowerCase() + '|' + Number(item.price), name: item.name, price: Number(item.price), quantity: Math.floor(Number(item.quantity)) };
    });
    if (Array.isArray(storedCart) && cartItems.length !== storedCart.length) window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
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

  function initShopChrome() {
    var cartLayer = document.createElement('div');
    cartLayer.className = 'cart-layer';
    cartLayer.hidden = true;
    cartLayer.innerHTML = '<button class="cart-backdrop" type="button" aria-label="Close shopping cart"></button><aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabindex="-1"><header class="cart-drawer__header"><div><p>YOUR REDPOLY CART</p><h2 id="cart-title">SHOPPING CART <span class="cart-drawer__count">0</span></h2></div><button class="cart-drawer__close" type="button" aria-label="Close shopping cart">×</button></header><div class="cart-drawer__items" id="cart-items"></div><p class="cart-empty" id="cart-empty">Your cart is empty. Pick something from the shop to get started.</p><button class="cart-undo" id="cart-undo" type="button" hidden>UNDO REMOVAL</button><footer class="cart-drawer__footer"><section class="cart-reward-progress" aria-label="Cart rewards"><p class="cart-reward-progress__title">CART REWARDS</p><div class="cart-reward" id="shipping-reward"><span class="cart-reward__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M2.5 6.5h12v10h-12zM14.5 10h4l3 3v3.5h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg></span><div class="cart-reward__body"><div class="cart-reward__copy"><strong>FREE STANDARD SHIPPING</strong><span id="shipping-reward-copy">Add more to unlock free standard shipping</span></div><div class="cart-reward__track" id="shipping-reward-track" role="progressbar" aria-label="Progress toward free standard shipping" aria-valuemin="0" aria-valuemax="1000" aria-valuenow="0"><span></span></div></div></div><div class="cart-reward" id="gift-reward"><span class="cart-reward__icon cart-reward__icon--gift" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11h17v9.5h-17z"/><path d="M2.5 7.5h19V11h-19z"/><path d="M12 7.5v13"/><path d="M12 7.5c-1.6 0-4.2-.6-4.2-2.6 0-1.4 1.2-2.2 2.4-2.2 1.6 0 1.8 2 1.8 4.8Zm0 0c1.6 0 4.2-.6 4.2-2.6 0-1.4-1.2-2.2-2.4-2.2-1.6 0-1.8 2-1.8 4.8Z"/></svg></span><div class="cart-reward__body"><div class="cart-reward__copy"><strong>FREE GIFT</strong><span id="gift-reward-copy">Add more to unlock a free gift</span></div><div class="cart-reward__track" id="gift-reward-track" role="progressbar" aria-label="Progress toward a free gift" aria-valuemin="0" aria-valuemax="3500" aria-valuenow="0"><span></span></div></div></div></section><p class="cart-subtotal"><span>ITEMS (INCL. GST)</span><strong id="cart-subtotal">₹0</strong></p><button class="cart-checkout" id="cart-checkout" type="button" disabled>PROCEED TO CHECKOUT <span aria-hidden="true">↗</span></button><p class="cart-checkout-note" id="cart-checkout-note" role="status" aria-live="polite" tabindex="-1">This is demo checkout only; no payment is collected. Your cart is saved in this browser.</p></footer></aside></div>';
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
    var cartSuggestions = Object.keys(catalogue).map(function (name) { return { name:name, price:catalogue[name].price, href:catalogue[name].href }; });
    function money(amount) { return '₹' + Number(amount).toLocaleString('en-IN'); }
    function persistCart() {
      try { window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems)); } catch (ignoreSaveError) { /* Cart remains usable for this page view. */ }
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
      updateReward(shippingRewardCopy, shippingRewardTrack, 2000, 'Free standard shipping');
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
      cartItems.forEach(function (item) {
        var row = document.createElement('article'); row.className = 'cart-item';
        var image = document.createElement('img'); image.className = 'cart-item__image'; image.loading = 'lazy';
        image.src = catalogue[item.name] ? catalogue[item.name].image : '';
        image.alt = item.name;
        var details = document.createElement('div'); details.className = 'cart-item__details';
        var name = document.createElement('h3'); name.textContent = item.name;
        var lineTotal = document.createElement('p'); lineTotal.textContent = money(item.price) + ' each · ' + money(item.price * item.quantity) + ' line total';
        details.appendChild(name); details.appendChild(lineTotal);
        var controls = document.createElement('div'); controls.className = 'cart-item__controls';
        [['decrease','−','Decrease quantity of ' + item.name],['increase','+','Increase quantity of ' + item.name]].forEach(function (control) {
          var button = document.createElement('button'); button.type='button'; button.className='cart-quantity-button'; button.setAttribute('data-cart-action',control[0]); button.setAttribute('data-cart-id',item.id); button.setAttribute('aria-label',control[2]); button.textContent=control[1]; controls.appendChild(button);
          if (control[0] === 'decrease') { var amount = document.createElement('span'); amount.className='cart-item__quantity'; amount.textContent=item.quantity; controls.insertBefore(amount, controls.lastChild); }
        });
        var remove = document.createElement('button'); remove.type='button'; remove.className='cart-item__remove'; remove.setAttribute('data-cart-action','remove'); remove.setAttribute('data-cart-id',item.id); remove.textContent='REMOVE'; controls.appendChild(remove);
        row.appendChild(image); row.appendChild(details); row.appendChild(controls); cartItemsNode.appendChild(row);
      });
      cartUndo.hidden = !lastRemovedItem;
      cartUndo.textContent = lastRemovedItem ? 'UNDO REMOVAL · ' + lastRemovedItem.item.name : 'UNDO REMOVAL';
      var availableSuggestions = cartSuggestions.filter(function (suggestion) {
        return !cartItems.some(function (item) { return item.name === suggestion.name; });
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
      var price = Number(button.getAttribute('data-price')) || 0;
      if (!inCatalogue(name, price)) return;
      var id = name.toLowerCase() + '|' + price;
      var existing = cartItems.find(function (item) { return item.id === id; });
      if (existing) existing.quantity += 1;
      else cartItems.push({ id:id, name:name, price:price, quantity:1 });
      persistCart(); renderCart(); openCart();
      var feedback = feedbackButton || button;
      var original = feedback.innerHTML;
      feedback.classList.add('added'); feedback.innerHTML = '✓ ADDED';
      setTimeout(function () { feedback.classList.remove('added'); feedback.innerHTML = original; }, 1600);
    }
    cartToggle.addEventListener('click', openCart);
    cartUndo.addEventListener('click', function () {
      if (!lastRemovedItem) return;
      var existing = cartItems.find(function (entry) { return entry.id === lastRemovedItem.item.id; });
      if (existing) existing.quantity += lastRemovedItem.item.quantity;
      else cartItems.splice(Math.min(lastRemovedItem.index, cartItems.length), 0, lastRemovedItem.item);
      lastRemovedItem = null; persistCart(); renderCart();
    });
    cartLayer.querySelector('.cart-backdrop').addEventListener('click', closeCart);
    cartLayer.querySelector('.cart-drawer__close').addEventListener('click', closeCart);
    cartLayer.addEventListener('click', function (event) {
      var control = event.target.closest('[data-cart-action]');
      if (!control) return;
      var item = cartItems.find(function (entry) { return entry.id === control.getAttribute('data-cart-id'); });
      if (!item) return;
      var action = control.getAttribute('data-cart-action');
      if (action === 'increase') item.quantity += 1;
      else if (action === 'decrease') {
        item.quantity -= 1;
        if (item.quantity <= 0) { lastRemovedItem = { item: { id:item.id, name:item.name, price:item.price, quantity:1 }, index:cartItems.indexOf(item) }; cartItems = cartItems.filter(function (entry) { return entry.id !== item.id; }); }
      } else if (action === 'remove') {
        lastRemovedItem = { item: { id:item.id, name:item.name, price:item.price, quantity:item.quantity }, index:cartItems.indexOf(item) };
        cartItems = cartItems.filter(function (entry) { return entry.id !== item.id; });
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
        cartItems = Array.isArray(synced) ? synced.filter(function (item) { return item && typeof item.name === 'string' && inCatalogue(item.name, item.price) && Number(item.quantity) >= 1; }).map(function (item) { return { id:item.name.toLowerCase() + '|' + Number(item.price), name:item.name, price:Number(item.price), quantity:Math.floor(Number(item.quantity)) }; }) : [];
      } catch (ignoreStorageEvent) { cartItems = []; }
      renderCart();
    });
    renderCart();
    var editCartUrl = new URL(window.location.href);
    if (editCartUrl.searchParams.get('editCart') === '1') {
      editCartUrl.searchParams.delete('editCart');
      window.history.replaceState(null, '', editCartUrl.pathname + editCartUrl.search + editCartUrl.hash);
      openCart();
    }

    // Mobile sticky buy bar for product detail pages (not the multi-product homepage).
    var heroBuy = document.querySelector('.char-buy-row .add-btn');
    if (heroBuy) {
      var stickyBar = document.createElement('div'); stickyBar.className='mobile-buy-bar';
      var stickyPrice = document.createElement('div'); stickyPrice.className='mobile-buy-bar__price';
      stickyPrice.innerHTML='<small>YOUR PICK</small><strong></strong>';
      var priceNode = document.querySelector('.char-buy-row .char-price strong');
      if (priceNode) stickyPrice.querySelector('strong').textContent=priceNode.textContent;
      var stickyButton = heroBuy.cloneNode(false); stickyButton.innerHTML='ADD TO CART';
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
      checker.addEventListener('submit',function(event){event.preventDefault();var pin=input.value.trim();if(!/^[1-9][0-9]{5}$/.test(pin)){status.textContent='Enter a valid 6-digit Indian PIN code.';input.setAttribute('aria-invalid','true');return;}input.removeAttribute('aria-invalid');status.textContent='Estimated delivery to PIN code ' + pin + ': Standard 4 days · Express 2 days. Standard shipping is free on orders of ₹2,000 or more, and orders of ₹3,500 or more get a free gift.';});
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
    }
    function isWished(name) { return wishItems.some(function (item) { return item.name === name; }); }

    if (!document.querySelector('.add-btn')) return;   // help/checkout style pages: no saved-items panel
    var wishToggle = document.createElement('button');
    wishToggle.type = 'button';
    wishToggle.className = 'wish-toggle';
    wishToggle.setAttribute('aria-haspopup', 'dialog');
    wishToggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.5-9-9c-1.2-2.7.5-6 3.5-6C9 5 11 7 12 8.5 13 7 15 5 17.5 5c3 0 4.7 3.3 3.5 6-2 4.5-9 9-9 9z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg><span>SAVED</span><b class="wish-toggle__count">0</b>';
    if (cartToggle.parentNode) cartToggle.parentNode.insertBefore(wishToggle, cartToggle);

    var wishPanel = document.createElement('dialog');
    wishPanel.className = 'wish-panel';
    wishPanel.setAttribute('aria-labelledby', 'wish-panel-title');
    wishPanel.innerHTML = '<button class="wish-panel__close" type="button" aria-label="Close saved items">×</button><p class="wish-panel__eyebrow">KEPT FOR LATER</p><h2 id="wish-panel-title">YOUR SAVED ITEMS</h2><p class="wish-panel__empty">Nothing saved yet. Tap the heart on anything you like and it will wait here, on this device.</p><ul class="wish-panel__list"></ul>';
    document.body.appendChild(wishPanel);
    var wishList = wishPanel.querySelector('.wish-panel__list');
    var wishEmpty = wishPanel.querySelector('.wish-panel__empty');
    var wishButtons = [];
    function closeWish() { if (wishPanel.open && wishPanel.close) wishPanel.close(); else wishPanel.removeAttribute('open'); }
    function syncWishButton(button) {
      var saved = isWished(button.wishData.name);
      button.classList.toggle('is-favorite', saved);
      button.setAttribute('aria-pressed', saved ? 'true' : 'false');
      var label = button.querySelector('.char-save__label');
      if (label) label.textContent = saved ? 'SAVED' : 'SAVE FOR LATER';
    }
    function renderWish() {
      var count = wishItems.length;
      wishToggle.querySelector('.wish-toggle__count').textContent = count;
      wishToggle.classList.toggle('has-items', count > 0);
      wishToggle.setAttribute('aria-label', 'Open saved items, ' + count + (count === 1 ? ' item' : ' items'));
      wishEmpty.hidden = count > 0;
      wishList.textContent = '';
      wishItems.forEach(function (item) {
        var row = document.createElement('li'); row.className = 'wish-item';
        var link = document.createElement('a'); link.className = 'wish-item__link'; link.href = item.href;
        if (item.image) { var image = document.createElement('img'); image.src = item.image; image.alt = ''; link.appendChild(image); }
        var copy = document.createElement('span'); copy.className = 'wish-item__copy';
        var title = document.createElement('strong'); title.textContent = item.name;
        var price = document.createElement('small'); price.textContent = money(item.price) + ' incl. GST';
        copy.appendChild(title); copy.appendChild(price); link.appendChild(copy);
        var actions = document.createElement('span'); actions.className = 'wish-item__actions';
        var add = document.createElement('button'); add.type = 'button'; add.className = 'wish-item__add'; add.textContent = 'ADD TO CART';
        add.setAttribute('data-name', item.name); add.setAttribute('data-price', String(item.price));
        add.setAttribute('aria-label', 'Add ' + item.name + ' to cart');
        add.addEventListener('click', function () { closeWish(); addCartItem(add); });
        var remove = document.createElement('button'); remove.type = 'button'; remove.className = 'wish-item__remove'; remove.textContent = 'REMOVE';
        remove.setAttribute('aria-label', 'Remove ' + item.name + ' from saved items');
        remove.addEventListener('click', function () { toggleWish(item, true); });
        actions.appendChild(add); actions.appendChild(remove);
        row.appendChild(link); row.appendChild(actions); wishList.appendChild(row);
      });
      wishButtons.forEach(syncWishButton);
    }
    function toggleWish(data, quiet) {
      var saved = isWished(data.name);
      if (saved) wishItems = wishItems.filter(function (item) { return item.name !== data.name; });
      else wishItems.push({ name:data.name, href:data.href, image:data.image, price:data.price });
      persistWish(); renderWish();
      if (!quiet) showToast(saved ? data.name + ' removed from saved' : data.name + ' saved for later');
    }
    function registerWishButton(button, data) {
      button.wishData = data;
      wishButtons.push(button);
      // Read the data at click time so a product page can change its pick (Cute Dinos colours).
      button.addEventListener('click', function () { toggleWish(button.wishData || data); });
    }
    function localPath(url) { try { var parsed = new URL(url, window.location.href); return parsed.pathname + parsed.search; } catch (ignoreUrl) { return ''; } }
    var heartMarkup = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.5-9-9c-1.2-2.7.5-6 3.5-6C9 5 11 7 12 8.5 13 7 15 5 17.5 5c3 0 4.7 3.3 3.5 6-2 4.5-9 9-9 9z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
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
    // Product pages: a save button under the buy row.
    var pageBuyRow = document.querySelector('.char-buy-row');
    var pageBuy = pageBuyRow ? pageBuyRow.querySelector('.add-btn[data-name][data-price]') : null;
    if (pageBuy) {
      var pageImage = document.querySelector('.char-stage__figure') || document.querySelector('.accessory-product-image');
      var saveButton = document.createElement('button'); saveButton.type = 'button'; saveButton.className = 'char-save';
      saveButton.innerHTML = heartMarkup + '<span class="char-save__label">SAVE FOR LATER</span>';
      pageBuyRow.insertAdjacentElement('afterend', saveButton);
      registerWishButton(saveButton, { name:pageBuy.getAttribute('data-name'), href:window.location.pathname.replace(/\.html$/, ''), image:pageImage ? localPath(pageImage.getAttribute('src')) : '', price:Number(pageBuy.getAttribute('data-price')) });
    }
    wishToggle.addEventListener('click', function () { renderWish(); if (wishPanel.showModal) wishPanel.showModal(); else wishPanel.setAttribute('open', ''); });
    wishPanel.querySelector('.wish-panel__close').addEventListener('click', closeWish);
    wishPanel.addEventListener('click', function (event) { if (event.target === wishPanel) closeWish(); });
    window.addEventListener('storage', function (event) {
      if (event.key !== wishKey) return;
      wishItems = parseWish(event.newValue); renderWish();
    });
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
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('crewEmail');
      if (email && email.value) {
        showToast('Welcome to the crew - check your inbox!');
        form.reset();
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
      return {
        type: item.getAttribute('data-type') === 'video' ? 'video' : 'image',
        src: item.getAttribute('data-src') || '',
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
      stage.textContent = '';
    }

    function render() {
      clearStage();
      var slide = slides[index];
      var media;
      if (slide.type === 'video') {
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
      index = Math.max(0, slides.findIndex(function (slide) { return slide.type === preferredType; }));
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
        viewer.querySelectorAll('button, video, [tabindex]:not([tabindex="-1"])'),
        function (element) { return !element.disabled && element.offsetParent !== null; }
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  })();
})();
