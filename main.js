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
  var cartStorageKey = 'redpoly-cart-v1';
  var cartItems = [];
  try {
    var storedCart = JSON.parse(window.localStorage.getItem(cartStorageKey) || '[]');
    if (Array.isArray(storedCart)) cartItems = storedCart.filter(function (item) {
      return item && typeof item.id === 'string' && typeof item.name === 'string' &&
        Number.isFinite(Number(item.price)) && Number(item.price) > 0 && Number.isFinite(Number(item.quantity)) && Number(item.quantity) > 0;
    }).map(function (item) {
      return { id: item.id, name: item.name, price: Number(item.price), quantity: Math.floor(Number(item.quantity)) };
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
  cartLayer.innerHTML = '<button class="cart-backdrop" type="button" aria-label="Close shopping bag"></button><aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabindex="-1"><header class="cart-drawer__header"><div><p>YOUR CREATURE CLUB BAG</p><h2 id="cart-title">SHOPPING BAG <span class="cart-drawer__count">0</span></h2></div><button class="cart-drawer__close" type="button" aria-label="Close shopping bag">×</button></header><div class="cart-drawer__items" id="cart-items"></div><p class="cart-empty" id="cart-empty">Your bag is waiting for a little creature energy.</p><footer class="cart-drawer__footer"><p class="cart-subtotal"><span>SUBTOTAL</span><strong id="cart-subtotal">₹0</strong></p><p class="cart-shipping-note">Shipping charges are calculated at checkout.</p><button class="cart-checkout" id="cart-checkout" type="button" disabled>PROCEED TO CHECKOUT <span aria-hidden="true">↗</span></button><p class="cart-checkout-note" id="cart-checkout-note" role="status" aria-live="polite" tabindex="-1">Online checkout and payment are not connected yet. Your bag is saved in this browser.</p></footer></aside></div>';
  document.body.appendChild(cartLayer);
  var cartDrawer = cartLayer.querySelector('.cart-drawer');
  var cartItemsNode = cartLayer.querySelector('#cart-items');
  var cartEmptyNode = cartLayer.querySelector('#cart-empty');
  var cartSubtotalNode = cartLayer.querySelector('#cart-subtotal');
  var cartCheckout = cartLayer.querySelector('#cart-checkout');
  var cartReturnFocus = null;
  function money(amount) { return '₹' + Number(amount).toLocaleString('en-IN'); }
  function persistCart() {
    try { window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems)); } catch (ignoreSaveError) { /* Cart remains usable for this page view. */ }
  }
  function renderCart() {
    var quantity = cartItems.reduce(function (total, item) { return total + item.quantity; }, 0);
    var subtotal = cartItems.reduce(function (total, item) { return total + item.price * item.quantity; }, 0);
    var countEls = cartLayer.querySelectorAll('.cart-drawer__count');
    Array.prototype.forEach.call(countEls, function (el) { el.textContent = quantity; });
    cartToggle.querySelector('.cart-toggle__count').textContent = quantity;
    cartToggle.setAttribute('aria-label', 'Open shopping bag, ' + quantity + (quantity === 1 ? ' item' : ' items'));
    cartItemsNode.textContent = '';
    cartItemsNode.style.flex = cartItems.length ? '1' : '0';
    cartEmptyNode.hidden = cartItems.length > 0;
    cartCheckout.disabled = cartItems.length === 0;
    cartSubtotalNode.textContent = money(subtotal);
    cartItems.forEach(function (item) {
      var row = document.createElement('article'); row.className = 'cart-item';
      var details = document.createElement('div'); details.className = 'cart-item__details';
      var name = document.createElement('h3'); name.textContent = item.name;
      var lineTotal = document.createElement('p'); lineTotal.textContent = money(item.price) + ' each';
      details.appendChild(name); details.appendChild(lineTotal);
      var controls = document.createElement('div'); controls.className = 'cart-item__controls';
      [['decrease','−','Decrease quantity of ' + item.name],['increase','+','Increase quantity of ' + item.name]].forEach(function (control) {
        var button = document.createElement('button'); button.type='button'; button.className='cart-quantity-button'; button.setAttribute('data-cart-action',control[0]); button.setAttribute('data-cart-id',item.id); button.setAttribute('aria-label',control[2]); button.textContent=control[1]; controls.appendChild(button);
        if (control[0] === 'decrease') { var amount = document.createElement('span'); amount.className='cart-item__quantity'; amount.textContent=item.quantity; controls.insertBefore(amount, controls.lastChild); }
      });
      var remove = document.createElement('button'); remove.type='button'; remove.className='cart-item__remove'; remove.setAttribute('data-cart-action','remove'); remove.setAttribute('data-cart-id',item.id); remove.textContent='REMOVE'; controls.appendChild(remove);
      row.appendChild(details); row.appendChild(controls); cartItemsNode.appendChild(row);
    });
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
  function addCartItem(button) {
    var name = button.getAttribute('data-name') || 'FIGURE';
    var price = Number(button.getAttribute('data-price')) || 3299;
    var id = name.toLowerCase() + '|' + price;
    var existing = cartItems.find(function (item) { return item.id === id; });
    if (existing) existing.quantity += 1;
    else cartItems.push({ id:id, name:name, price:price, quantity:1 });
    persistCart(); renderCart(); openCart();
    var original = button.innerHTML;
    button.classList.add('added'); button.innerHTML = '✓ ADDED';
    setTimeout(function () { button.classList.remove('added'); button.innerHTML = original; }, 1600);
  }
  cartToggle.addEventListener('click', openCart);
  cartLayer.querySelector('.cart-backdrop').addEventListener('click', closeCart);
  cartLayer.querySelector('.cart-drawer__close').addEventListener('click', closeCart);
  cartLayer.addEventListener('click', function (event) {
    var control = event.target.closest('[data-cart-action]');
    if (!control) return;
    var item = cartItems.find(function (entry) { return entry.id === control.getAttribute('data-cart-id'); });
    if (!item) return;
    var action = control.getAttribute('data-cart-action');
    if (action === 'increase') item.quantity += 1;
    else if (action === 'decrease') { item.quantity -= 1; if (item.quantity <= 0) cartItems = cartItems.filter(function (entry) { return entry.id !== item.id; }); }
    else if (action === 'remove') cartItems = cartItems.filter(function (entry) { return entry.id !== item.id; });
    persistCart(); renderCart();
  });
  cartCheckout.addEventListener('click', function () {
    var note = cartLayer.querySelector('#cart-checkout-note');
    note.textContent = 'Your bag is saved in this browser, but online checkout is not available yet. No order has been placed.';
    note.focus && note.focus();
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

  // Mobile sticky buy bar for product detail pages (not the multi-product homepage).
  var heroBuy = document.querySelector('.char-buy-row .add-btn');
  if (heroBuy) {
    var stickyBar = document.createElement('div'); stickyBar.className='mobile-buy-bar';
    var stickyPrice = document.createElement('div'); stickyPrice.className='mobile-buy-bar__price';
    stickyPrice.innerHTML='<small>YOUR PICK</small><strong></strong>';
    var priceNode = document.querySelector('.char-buy-row .char-price strong');
    if (priceNode) stickyPrice.querySelector('strong').textContent=priceNode.textContent;
    var stickyButton = heroBuy.cloneNode(false); stickyButton.innerHTML='ADD TO BAG'; stickyButton.classList.add('mobile-buy-bar__button');
    stickyButton.setAttribute('aria-label','Add ' + (heroBuy.getAttribute('data-name') || 'product') + ' to bag');
    stickyBar.appendChild(stickyPrice); stickyBar.appendChild(stickyButton); document.body.appendChild(stickyBar);
    var finalCta = document.querySelector('.char-final-cta');
    var scrollFrame = false;
    function syncStickyBuy() {
      scrollFrame = false;
      var passedBuy = heroBuy.getBoundingClientRect().bottom < 0;
      var atFinal = finalCta && finalCta.getBoundingClientRect().top < window.innerHeight && finalCta.getBoundingClientRect().bottom > 0;
      stickyBar.classList.toggle('mobile-buy-bar--visible', passedBuy && !atFinal);
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

  // A PIN-format helper is ready for shipping rules; it deliberately doesn't invent an ETA or serviceability.
  document.querySelectorAll('.accessory-policy-panel .wrap').forEach(function (policyWrap,index) {
    var checker=document.createElement('form'); checker.className='delivery-checker'; checker.noValidate=true;
    var id='delivery-pin-'+index;
    checker.innerHTML='<div><p class="delivery-checker__eyebrow">DELIVERY CHECK</p><label for="'+id+'">Enter your 6-digit PIN code</label><p class="delivery-checker__hint">We will show serviceability, delivery timing and shipping fees once shipping lookup is connected.</p></div><div class="delivery-checker__form"><input id="'+id+'" name="postal-code" inputmode="numeric" autocomplete="postal-code" pattern="[1-9][0-9]{5}" maxlength="6" placeholder="e.g. 400001" aria-describedby="'+id+'-status" /><button type="submit">CHECK PIN</button><p id="'+id+'-status" class="delivery-checker__status" role="status" aria-live="polite"></p></div>';
    policyWrap.appendChild(checker);
    var input=checker.querySelector('input'); var status=checker.querySelector('.delivery-checker__status');
    checker.addEventListener('submit',function(event){event.preventDefault();var pin=input.value.trim();if(!/^[1-9][0-9]{5}$/.test(pin)){status.textContent='Enter a valid 6-digit Indian PIN code.';input.setAttribute('aria-invalid','true');return;}input.removeAttribute('aria-invalid');status.textContent='PIN format looks valid. A live delivery estimate and fee are not available until shipping rules or a carrier lookup are connected.';});
  });

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
