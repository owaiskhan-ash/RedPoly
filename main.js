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

  // Bundle picker: limit the customer to three accessories and reveal the set price.
  var bundleInputs = Array.prototype.slice.call(document.querySelectorAll('.bundle-option input[name="bundle-item"]'));
  var bundleStatus = document.getElementById('bundle-count');
  var bundleButton = document.getElementById('bundle-add');
  function updateBundlePicker() {
    if (!bundleInputs.length || !bundleButton) return;
    var selected = bundleInputs.filter(function (input) { return input.checked; });
    bundleInputs.forEach(function (input) {
      input.disabled = selected.length === 3 && !input.checked;
      input.closest('.bundle-option').classList.toggle('is-selected', input.checked);
    });
    if (bundleStatus) bundleStatus.textContent = selected.length + ' of 3 selected' + (selected.length === 3 ? ' · You save ₹298' : '');
    bundleButton.disabled = selected.length !== 3;
    bundleButton.setAttribute('aria-disabled', selected.length !== 3 ? 'true' : 'false');
    bundleButton.innerHTML = selected.length === 3 ? 'ADD YOUR TRIO — ₹1,499' : 'CHOOSE ' + (3 - selected.length) + ' MORE TO UNLOCK ₹1,499';
    bundleButton.setAttribute('data-name', selected.length === 3 ? 'CREATURE CLUB TRIO: ' + selected.map(function (input) { return input.getAttribute('data-label'); }).join(', ') : 'CREATURE CLUB TRIO');
  }
  bundleInputs.forEach(function (input) { input.addEventListener('change', updateBundlePicker); });
  updateBundlePicker();

  // Local cart shared across storefront and product pages. Checkout stays clearly marked as pending integration.
  // Reward thresholds (free standard shipping ₹1,499, free keychain ₹6,000) are mirrored in checkout.js.
  var cartStorageKey = 'redpoly-cart-v1';
  var freeGiftId = 'redpoly-free-keychain';
  var cartItems = [];
  try {
    var storedCart = JSON.parse(window.localStorage.getItem(cartStorageKey) || '[]');
    if (Array.isArray(storedCart)) cartItems = storedCart.filter(function (item) {
      return item && typeof item.id === 'string' && typeof item.name === 'string' &&
        Number.isFinite(Number(item.price)) && (Number(item.price) > 0 || (item.id === freeGiftId && Number(item.price) === 0)) && Number.isFinite(Number(item.quantity)) && Number(item.quantity) > 0;
    }).map(function (item) {
      return { id: item.id, name: item.name, price: Number(item.price), quantity: Math.floor(Number(item.quantity)), isReward: item.id === freeGiftId };
    });
  } catch (ignoreCartStorage) { cartItems = []; }

  var cartToggle = document.createElement('button');
  cartToggle.type = 'button';
  cartToggle.className = 'cart-toggle';
  cartToggle.setAttribute('aria-haspopup', 'dialog');
  cartToggle.setAttribute('aria-expanded', 'false');
  cartToggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 11.2h10.8L21 8H6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="19" r="1.5" fill="currentColor"/><circle cx="18" cy="19" r="1.5" fill="currentColor"/></svg><span>BAG</span><b class="cart-toggle__count">0</b>';
  var homeHeader = document.querySelector('.site-header__inner');
  var characterHeader = document.querySelector('.char-nav');
  if (homeHeader) homeHeader.appendChild(cartToggle);
  else if (characterHeader) characterHeader.appendChild(cartToggle);

  var cartLayer = document.createElement('div');
  cartLayer.className = 'cart-layer';
  cartLayer.hidden = true;
  cartLayer.innerHTML = '<button class="cart-backdrop" type="button" aria-label="Close shopping bag"></button><aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabindex="-1"><header class="cart-drawer__header"><div><p>YOUR CREATURE CLUB BAG</p><h2 id="cart-title">SHOPPING BAG <span class="cart-drawer__count">0</span></h2></div><button class="cart-drawer__close" type="button" aria-label="Close shopping bag">×</button></header><div class="cart-drawer__items" id="cart-items"></div><p class="cart-empty" id="cart-empty">Your bag is waiting for a little creature energy.</p><button class="cart-undo" id="cart-undo" type="button" hidden>UNDO REMOVAL</button><footer class="cart-drawer__footer"><section class="cart-reward-progress" aria-label="Cart rewards"><p class="cart-reward-progress__title">UNLOCK YOUR EXTRAS</p><div class="cart-reward" id="shipping-reward"><span class="cart-reward__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M2.5 6.5h12v10h-12zM14.5 10h4l3 3v3.5h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg></span><div class="cart-reward__body"><div class="cart-reward__copy"><strong>FREE STANDARD SHIPPING</strong><span id="shipping-reward-copy">Add more to unlock free standard shipping</span></div><div class="cart-reward__track" id="shipping-reward-track" role="progressbar" aria-label="Progress toward free standard shipping" aria-valuemin="0" aria-valuemax="1499" aria-valuenow="0"><span></span></div></div></div><div class="cart-reward" id="keychain-reward"><span class="cart-reward__icon cart-reward__icon--gift" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 10h18v11H3zM2 6h20v4H2zM12 6v15M12 6H8.5a2.5 2.5 0 1 1 2.2-3.7L12 6Zm0 0h3.5a2.5 2.5 0 1 0-2.2-3.7L12 6Z"/></svg></span><div class="cart-reward__body"><div class="cart-reward__copy"><strong>FREE CREATURE KEYCHAIN</strong><span id="keychain-reward-copy">Add more to unlock your free gift</span></div><div class="cart-reward__track" id="keychain-reward-track" role="progressbar" aria-label="Progress toward free keychain" aria-valuemin="0" aria-valuemax="6000" aria-valuenow="0"><span></span></div></div></div></section><p class="cart-subtotal"><span>ITEMS SUBTOTAL</span><strong id="cart-subtotal">₹0</strong></p><button class="cart-checkout" id="cart-checkout" type="button" disabled>PROCEED TO CHECKOUT <span aria-hidden="true">↗</span></button><p class="cart-checkout-note" id="cart-checkout-note" role="status" aria-live="polite" tabindex="-1">This is demo checkout only; no payment is collected. Your bag is saved in this browser.</p></footer></aside></div>';
  document.body.appendChild(cartLayer);
  var cartDrawer = cartLayer.querySelector('.cart-drawer');
  var cartItemsNode = cartLayer.querySelector('#cart-items');
  var cartEmptyNode = cartLayer.querySelector('#cart-empty');
  var cartSubtotalNode = cartLayer.querySelector('#cart-subtotal');
  var cartCheckout = cartLayer.querySelector('#cart-checkout');
  var cartUndo = cartLayer.querySelector('#cart-undo');
  var shippingRewardCopy = cartLayer.querySelector('#shipping-reward-copy');
  var keychainRewardCopy = cartLayer.querySelector('#keychain-reward-copy');
  var shippingRewardTrack = cartLayer.querySelector('#shipping-reward-track');
  var keychainRewardTrack = cartLayer.querySelector('#keychain-reward-track');
  var cartReturnFocus = null;
  var lastRemovedItem = null;
  var cartSuggestions = [
    { name:'PINS + ART PRINT', price:599, href:'/pins-and-art-print' },
    { name:'ACTION KEYCHAINS', price:599, href:'/action-keychains' },
    { name:'CHARACTER MUG', price:599, href:'/character-mug' },
    { name:'IPHONE 15 CASE', price:599, href:'/iphone-15-case' }
  ];
  function money(amount) { return '₹' + Number(amount).toLocaleString('en-IN'); }
  function persistCart() {
    try { window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems)); } catch (ignoreSaveError) { /* Cart remains usable for this page view. */ }
  }
  function renderCart() {
    var subtotalBeforeGift = cartItems.reduce(function (total, item) { return total + (item.id === freeGiftId ? 0 : item.price * item.quantity); }, 0);
    var giftIndex = cartItems.findIndex(function (item) { return item.id === freeGiftId; });
    var giftChanged = false;
    if (subtotalBeforeGift >= 6000 && giftIndex === -1) {
      cartItems.push({ id:freeGiftId, name:'COMPLIMENTARY CREATURE KEYCHAIN', price:0, quantity:1, isReward:true });
      giftChanged = true;
    } else if (subtotalBeforeGift < 6000 && giftIndex !== -1) {
      cartItems = cartItems.filter(function (item) { return item.id !== freeGiftId; });
      giftChanged = true;
    } else if (giftIndex !== -1 && (cartItems[giftIndex].quantity !== 1 || Number(cartItems[giftIndex].price) !== 0)) {
      cartItems[giftIndex].quantity = 1; cartItems[giftIndex].price = 0; cartItems[giftIndex].isReward = true;
      giftChanged = true;
    }
    if (giftChanged) persistCart();
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
    updateReward(shippingRewardCopy, shippingRewardTrack, 1499, 'Free standard shipping');
    updateReward(keychainRewardCopy, keychainRewardTrack, 6000, 'Free creature keychain');
    var countEls = cartLayer.querySelectorAll('.cart-drawer__count');
    Array.prototype.forEach.call(countEls, function (el) { el.textContent = quantity; });
    cartToggle.querySelector('.cart-toggle__count').textContent = quantity;
    cartToggle.setAttribute('aria-label', 'Open shopping bag, ' + quantity + (quantity === 1 ? ' item' : ' items'));
    cartItemsNode.textContent = '';
    cartItemsNode.style.flex = cartItems.length ? '1' : '0';
    cartEmptyNode.hidden = cartItems.length > 0;
    cartCheckout.disabled = cartItems.length === 0;
    cartSubtotalNode.textContent = money(subtotal);
    var cartImageByName = {
      'BARSAAT':'/assets/images/redpoly/characters/barsaat.png',
      'AGNI':'/assets/images/redpoly/characters/agni-product.png',
      'NOOR':'/assets/images/redpoly/characters/noor.png',
      'AARAV':'/assets/images/redpoly/characters/aarav.png',
      'PINS + ART PRINT':'/assets/images/redpoly/accessories/pins-and-art-print.jpg',
      'ACTION KEYCHAINS':'/assets/images/redpoly/accessories/action-keychains.jpg',
      'CHARACTER MUG':'/assets/images/redpoly/accessories/character-mug.jpg',
      'IPHONE 15 CASE':'/assets/images/redpoly/accessories/iphone-15-case.jpg'
    };
    cartItems.forEach(function (item) {
      var row = document.createElement('article'); row.className = 'cart-item' + (item.id === freeGiftId ? ' cart-item--reward' : '');
      var image = document.createElement('img'); image.className = 'cart-item__image'; image.loading = 'lazy';
      image.src = item.id === freeGiftId ? cartImageByName['ACTION KEYCHAINS'] : (item.name.indexOf('CREATURE CLUB TRIO') === 0 ? '/assets/images/redpoly/collections/accessories.jpg' : (cartImageByName[item.name] || '/assets/images/redpoly/collections/accessories.jpg'));
      image.alt = item.name;
      var details = document.createElement('div'); details.className = 'cart-item__details';
      var name = document.createElement('h3'); name.textContent = item.name;
      var lineTotal = document.createElement('p'); lineTotal.textContent = item.id === freeGiftId ? 'COMPLIMENTARY REWARD' : money(item.price) + ' each · ' + money(item.price * item.quantity) + ' line total';
      details.appendChild(name); details.appendChild(lineTotal);
      var controls = document.createElement('div'); controls.className = 'cart-item__controls';
      if (item.id === freeGiftId) {
        var freeLabel = document.createElement('span'); freeLabel.className = 'cart-item__free-label'; freeLabel.textContent = 'FREE'; controls.appendChild(freeLabel);
      } else {
        [['decrease','−','Decrease quantity of ' + item.name],['increase','+','Increase quantity of ' + item.name]].forEach(function (control) {
          var button = document.createElement('button'); button.type='button'; button.className='cart-quantity-button'; button.setAttribute('data-cart-action',control[0]); button.setAttribute('data-cart-id',item.id); button.setAttribute('aria-label',control[2]); button.textContent=control[1]; controls.appendChild(button);
          if (control[0] === 'decrease') { var amount = document.createElement('span'); amount.className='cart-item__quantity'; amount.textContent=item.quantity; controls.insertBefore(amount, controls.lastChild); }
        });
        var remove = document.createElement('button'); remove.type='button'; remove.className='cart-item__remove'; remove.setAttribute('data-cart-action','remove'); remove.setAttribute('data-cart-id',item.id); remove.textContent='REMOVE'; controls.appendChild(remove);
      }
      row.appendChild(image); row.appendChild(details); row.appendChild(controls); cartItemsNode.appendChild(row);
    });
    cartUndo.hidden = !lastRemovedItem;
    cartUndo.textContent = lastRemovedItem ? 'UNDO REMOVAL · ' + lastRemovedItem.item.name : 'UNDO REMOVAL';
    var availableSuggestions = cartSuggestions.filter(function (suggestion) {
      return !cartItems.some(function (item) { return item.name === suggestion.name; });
    });
    if (availableSuggestions.length) {
      var suggestionPanel = document.createElement('section'); suggestionPanel.className = 'cart-recommendations';
      var suggestionTitle = document.createElement('h3'); suggestionTitle.textContent = 'ADD A LITTLE MORE CREATURE ENERGY'; suggestionPanel.appendChild(suggestionTitle);
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
    var name = button.getAttribute('data-name') || 'FIGURE';
    var price = Number(button.getAttribute('data-price')) || 3299;
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
    if (!item || item.id === freeGiftId) return;
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
    try { cartItems = Array.isArray(JSON.parse(event.newValue || '[]')) ? JSON.parse(event.newValue || '[]') : []; } catch (ignoreStorageEvent) { cartItems = []; }
    renderCart();
  });
  renderCart();
  var editBagUrl = new URL(window.location.href);
  if (editBagUrl.searchParams.get('editBag') === '1') {
    editBagUrl.searchParams.delete('editBag');
    window.history.replaceState(null, '', editBagUrl.pathname + editBagUrl.search + editBagUrl.hash);
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
    var stickyButton = heroBuy.cloneNode(false); stickyButton.innerHTML='ADD TO BAG';
    stickyButton.classList.remove('add-btn');
    stickyButton.classList.add('mobile-buy-bar__button');
    stickyButton.type = 'button';
    stickyButton.tabIndex = -1;
    stickyButton.setAttribute('aria-label','Add ' + (heroBuy.getAttribute('data-name') || 'product') + ' to bag');
    stickyButton.addEventListener('click', function () { addCartItem(heroBuy, stickyButton); });
    stickyBar.appendChild(stickyPrice); stickyBar.appendChild(stickyButton); document.body.appendChild(stickyBar);
    var finalCta = document.querySelector('.char-final-cta');
    var scrollFrame = false;
    function syncStickyBuy() {
      scrollFrame = false;
      var passedBuy = heroBuy.getBoundingClientRect().bottom < 0;
      var atFinal = finalCta && finalCta.getBoundingClientRect().top < window.innerHeight && finalCta.getBoundingClientRect().bottom > 0;
      var visible = passedBuy && !atFinal && window.innerWidth <= 760;
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

  // Figure pages reuse the same full/detail/lightbox image controls as accessory galleries.
  document.querySelectorAll('.char-stage .char-stage__figure').forEach(function (image) {
    var stage = image.closest('.char-stage');
    var viewport = document.createElement('div'); viewport.className = 'figure-gallery__viewport'; viewport.setAttribute('data-view', 'full');
    stage.insertBefore(viewport, image); viewport.appendChild(image);
    var controls = document.createElement('div'); controls.className = 'figure-gallery__controls'; controls.setAttribute('role', 'group'); controls.setAttribute('aria-label', 'Figure image views');
    [['full','FULL VIEW'],['detail','DETAIL CROP']].forEach(function (view, index) {
      var button = document.createElement('button'); button.type = 'button'; button.setAttribute('data-figure-view', view[0]); button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false'); button.textContent = view[1]; controls.appendChild(button);
    });
    var zoomButton = document.createElement('button'); zoomButton.type = 'button'; zoomButton.className = 'figure-gallery__zoom'; zoomButton.textContent = 'ZOOM'; zoomButton.setAttribute('aria-label', 'Open a larger view of this figure'); controls.appendChild(zoomButton);
    viewport.appendChild(controls);
    controls.addEventListener('click', function (event) {
      var viewButton = event.target.closest('[data-figure-view]');
      if (!viewButton) return;
      viewport.setAttribute('data-view', viewButton.getAttribute('data-figure-view'));
      controls.querySelectorAll('[data-figure-view]').forEach(function (button) {
        var active = button === viewButton;
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    });
    var zoom = document.createElement('dialog'); zoom.className = 'product-zoom'; zoom.setAttribute('aria-label', 'Zoomed collectible figure');
    var close = document.createElement('button'); close.type = 'button'; close.className = 'product-zoom__close'; close.textContent = 'CLOSE ×'; close.setAttribute('aria-label', 'Close zoomed figure');
    var zoomImage = document.createElement('img'); zoomImage.src = image.src; zoomImage.alt = image.alt;
    zoom.appendChild(close); zoom.appendChild(zoomImage); document.body.appendChild(zoom);
    close.addEventListener('click', function () { zoom.close(); });
    zoomButton.addEventListener('click', function () { if (zoom.showModal) zoom.showModal(); else zoom.setAttribute('open', ''); });
    zoom.addEventListener('click', function (event) { if (event.target === zoom) zoom.close(); });
  });

  // A PIN-format helper is ready for shipping rules; it deliberately doesn't invent an ETA or serviceability.
  document.querySelectorAll('.accessory-policy-panel .wrap').forEach(function (policyWrap,index) {
    var checker=document.createElement('form'); checker.className='delivery-checker'; checker.noValidate=true;
    var id='delivery-pin-'+index;
    checker.innerHTML='<div><p class="delivery-checker__eyebrow">DELIVERY CHECK</p><label for="'+id+'">Enter your 6-digit PIN code</label><p class="delivery-checker__hint">Estimated delivery: Standard 4 days · Express 2 days to valid PIN codes.</p></div><div class="delivery-checker__form"><input id="'+id+'" name="postal-code" inputmode="numeric" autocomplete="postal-code" pattern="[1-9][0-9]{5}" maxlength="6" placeholder="e.g. 400001" aria-describedby="'+id+'-status" /><button type="submit">CHECK PIN</button><p id="'+id+'-status" class="delivery-checker__status" role="status" aria-live="polite"></p></div>';
    policyWrap.appendChild(checker);
    var input=checker.querySelector('input'); var status=checker.querySelector('.delivery-checker__status');
    checker.addEventListener('submit',function(event){event.preventDefault();var pin=input.value.trim();if(!/^[1-9][0-9]{5}$/.test(pin)){status.textContent='Enter a valid 6-digit Indian PIN code.';input.setAttribute('aria-invalid','true');return;}input.removeAttribute('aria-invalid');status.textContent='Estimated delivery to PIN code ' + pin + ': Standard 4 days · Express 2 days. Shipping fees are shown at checkout.';});
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
  var quickEyebrow = document.createElement('p'); quickEyebrow.className = 'quick-view__eyebrow'; quickEyebrow.textContent = 'REDPOLY CREATURE CLUB';
  var quickTitle = document.createElement('h2'); quickTitle.id = 'quick-view-title';
  var quickSubtitle = document.createElement('p'); quickSubtitle.className = 'quick-view__subtitle';
  var quickPrice = document.createElement('p'); quickPrice.className = 'quick-view__price';
  var quickActions = document.createElement('div'); quickActions.className = 'quick-view__actions';
  var quickAdd = document.createElement('button'); quickAdd.type = 'button'; quickAdd.className = 'add-btn quick-view__add'; quickAdd.textContent = 'ADD TO BAG';
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
      quickSubtitle.textContent = sub ? sub.textContent : 'COLLECTIBLE CREATURE';
      quickPrice.textContent = (card.querySelector('.p-card__price') || {}).textContent || '';
      quickAdd.setAttribute('data-name', price ? price.getAttribute('data-name') : quickTitle.textContent);
      quickAdd.setAttribute('data-price', price ? price.getAttribute('data-price') : '599');
      quickAdd.setAttribute('aria-label', 'Add ' + quickTitle.textContent + ' to bag');
      quickDetails.href = (card.querySelector('.p-card__product-link') || card.querySelector('.p-card__image-link')).href;
      if (quickView.showModal) quickView.showModal(); else quickView.setAttribute('open', '');
    });
    imageBox.appendChild(trigger);
  });
  quickAdd.addEventListener('click', function () { if (quickView.close) quickView.close(); });

  // Add to bag and open the drawer.
  document.querySelectorAll('.add-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { addCartItem(btn); });
  });

  // Wishlist hearts.
  document.querySelectorAll('.heart').forEach(function (btn) {
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', function () {
      var favorite = btn.classList.toggle('is-favorite');
      btn.setAttribute('aria-pressed', favorite ? 'true' : 'false');
      var card = btn.closest('.p-card');
      var name = card && card.querySelector('h3') ? card.querySelector('h3').textContent : 'FIGURE';
      showToast(favorite ? name + ' added to wishlist' : name + ' removed from wishlist');
    });
  });

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
})();
