(function () {
  var cartKey = 'redpoly-cart-v1';
  var orderKey = 'redpoly-demo-order-v1';
  var shippingMethodKey = 'redpoly-shipping-method-v1';
  // Free-shipping and free-gift thresholds on the item subtotal. Keep these in step with the cart drawer in main.js.
  var freeStandardFrom = 2000;
  var freeExpressFrom = 5000;
  var freeGiftFrom = 3500;
  // Products on sale. Keep in step with the catalogue in main.js. Anything else in a saved cart is dropped.
  var catalogue = {
    'BUBBLE GUN': { price:499, image:'/assets/images/redpoly/products/bubble-gun-thumb.webp?v=bubble-20261121' },
    'STUNT PET': { price:599, image:'/assets/images/redpoly/products/stunt-pet-thumb.webp?v=pet-20261122' },
    'MINI COOL CAR': { price:749, image:'/assets/images/redpoly/products/mini-cool-car-thumb.webp?v=car-20261117' },
    'GEL STORM': { price:1999, image:'/assets/images/redpoly/products/gel-storm-thumb.webp?v=gel-20261121' },
    'MECHA ROVER': { price:499, image:'/assets/images/redpoly/products/mecha-rover-thumb.webp?v=mecha-20261120' },
    'PIXEL SPLASH': { price:1749, image:'/assets/images/redpoly/products/pixel-splash-thumb.webp?v=pixel-20261117-v3' },
    'CUTE DINOS GREEN': { price:249, image:'/assets/images/redpoly/products/cute-dinos-green-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS RED': { price:249, image:'/assets/images/redpoly/products/cute-dinos-red-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS TEAL': { price:249, image:'/assets/images/redpoly/products/cute-dinos-teal-thumb.webp?v=dinos-20261116' },
    'CUTE DINOS TRIO': { price:549, image:'/assets/images/redpoly/products/cute-dinos-trio-thumb.webp?v=dinos-20261116' }
  };
  function inCatalogue(name, price) { return Object.prototype.hasOwnProperty.call(catalogue, name) && catalogue[name].price === Number(price); }
  // GST rate in percent. Shelf prices already include it, so checkout shows the GST share
  // inside the total instead of adding it on top. Change the rate here only; the labels follow.
  var gstRate = 12;
  var items = [];

  function readCart() {
    try {
      var parsed = JSON.parse(localStorage.getItem(cartKey) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (item) {
        return item && typeof item.name === 'string' && inCatalogue(item.name, item.price) && Number(item.quantity) >= 1;
      }).map(function (item) {
        var price = Number(item.price);
        return { id:item.name.toLowerCase() + '|' + price, name:item.name, price:price, quantity:Math.floor(Number(item.quantity)) };
      });
    } catch (ignoreStorage) { return []; }
  }
  function saveCart() {
    try {
      localStorage.setItem(cartKey, JSON.stringify(items.map(function (item) {
        return { id:item.id, name:item.name, price:item.price, quantity:item.quantity };
      })));
    } catch (ignoreSave) { /* The cart still works for this page view. */ }
  }
  items = readCart();

  var list = document.getElementById('checkout-items');
  var countNode = document.getElementById('checkout-count');
  var undoButton = document.getElementById('checkout-undo');
  var cartStatus = document.getElementById('checkout-cart-status');
  var subtotalNode = document.getElementById('checkout-subtotal');
  var gstNode = document.getElementById('checkout-gst');
  var gstLabelNode = document.getElementById('checkout-gst-label');
  var shippingLabelNode = document.getElementById('checkout-shipping-label');
  var shippingCostNode = document.getElementById('checkout-shipping-cost');
  var giftNode = document.getElementById('checkout-gift');
  var finalTotalNode = document.getElementById('checkout-final-total');
  var shippingStatus = document.getElementById('shipping-method-status');
  var shippingOptions = Array.prototype.slice.call(document.querySelectorAll('input[name="shipping-method"]'));
  var standardPriceNode = document.getElementById('shipping-standard-price');
  var expressPriceNode = document.getElementById('shipping-express-price');
  var deliveryEstimateTitle = document.getElementById('delivery-estimate-title');
  var deliveryEstimateCopy = document.getElementById('delivery-estimate-copy');
  var emptyNode = document.getElementById('checkout-empty');
  var placeButton = document.getElementById('place-demo-order');
  var payBar = document.getElementById('checkout-paybar');
  var payBarTotal = document.getElementById('checkout-paybar-total');
  var payBarButton = document.getElementById('checkout-paybar-button');
  var form = document.getElementById('demo-checkout-form');
  var status = document.getElementById('checkout-status');
  var pinInput = document.getElementById('checkout-pin');
  var cityInput = document.getElementById('checkout-city');
  var stateInput = document.getElementById('checkout-state');
  var pinStatus = document.getElementById('pin-lookup-status');
  var emptyCartMessage = 'Add an item to your cart before trying the demo checkout.';
  var lookupTimer = null;
  var activeLookup = null;
  var lookupSequence = 0;
  var lastAutoFilledPin = '';
  var lastRemoved = null;
  var placeButtonInView = false;
  var leaving = false;
  var subtotal = 0;
  var accountBox = document.getElementById('checkout-account');
  var saveProfileChecked = true;
  var googleIconSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A11.9 11.9 0 0 0 12 0 12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z"/></svg>';

  function applyProfileAutofill(user, profile) {
    if (!form) return;
    var nameInput = form.querySelector('[name="customer-name"]');
    var emailInput = form.querySelector('[name="email"]');
    var phoneInput = form.querySelector('[name="phone"]');
    var addressInput = form.querySelector('[name="address"]');
    if (nameInput && !nameInput.value.trim()) {
      nameInput.value = (profile && profile.fullName) || (user && user.displayName) || '';
    }
    if (emailInput && !emailInput.value.trim()) {
      emailInput.value = (profile && profile.email) || (user && user.email) || '';
    }
    if (phoneInput && !phoneInput.value.trim() && profile && profile.phone) {
      phoneInput.value = profile.phone;
    }
    if (addressInput && !addressInput.value.trim() && profile && profile.address) {
      addressInput.value = profile.address;
    }
    if (pinInput && !pinInput.value.trim() && profile && profile.pinCode) {
      pinInput.value = profile.pinCode;
    }
    if (cityInput && !cityInput.value.trim() && profile && profile.city) {
      cityInput.value = profile.city;
    }
    if (stateInput && !stateInput.value.trim() && profile && profile.state) {
      stateInput.value = profile.state;
    }
  }

  function renderCheckoutAccount() {
    if (!accountBox) return;
    var fb = window.RedpolyFirebase;
    var user = fb ? fb.getUser() : null;
    var profile = fb ? fb.getProfile() : null;
    accountBox.textContent = '';

    var row = document.createElement('div');
    row.className = 'checkout-account__row';

    var copy = document.createElement('div');
    copy.className = 'checkout-account__copy';
    var strong = document.createElement('strong');
    var span = document.createElement('span');

    if (user) {
      strong.textContent = 'SIGNED IN AS ' + (user.displayName || 'REDPOLY MEMBER');
      span.textContent = (user.email || '') + ' · Your cart and demo order history sync to your Google account.';
      copy.appendChild(strong);
      copy.appendChild(span);

      var signOutBtn = document.createElement('button');
      signOutBtn.type = 'button';
      signOutBtn.className = 'checkout-account__btn';
      signOutBtn.textContent = 'SIGN OUT';
      signOutBtn.addEventListener('click', function () {
        if (!window.RedpolyFirebase) return;
        signOutBtn.disabled = true;
        window.RedpolyFirebase.signOut().catch(function (err) {
          console.error(err);
          signOutBtn.disabled = false;
        });
      });

      row.appendChild(copy);
      row.appendChild(signOutBtn);
      accountBox.appendChild(row);

      var saveLabel = document.createElement('label');
      saveLabel.className = 'checkout-account__save';
      var saveBox = document.createElement('input');
      saveBox.type = 'checkbox';
      saveBox.id = 'checkout-save-profile';
      saveBox.checked = saveProfileChecked;
      saveBox.addEventListener('change', function () {
        saveProfileChecked = saveBox.checked;
      });
      var saveText = document.createElement('span');
      saveText.textContent = 'Save delivery details to my REDPOLY account';
      saveLabel.appendChild(saveBox);
      saveLabel.appendChild(saveText);
      accountBox.appendChild(saveLabel);

      applyProfileAutofill(user, profile);
    } else {
      strong.textContent = 'EXPRESS CHECKOUT WITH GOOGLE';
      span.textContent = 'Sign in with Google to autofill saved delivery details and keep your order history in the cloud.';
      copy.appendChild(strong);
      copy.appendChild(span);

      var signInBtn = document.createElement('button');
      signInBtn.type = 'button';
      signInBtn.className = 'checkout-account__btn';
      signInBtn.innerHTML = googleIconSvg + '<span>SIGN IN WITH GOOGLE</span>';
      signInBtn.addEventListener('click', function () {
        if (!window.RedpolyFirebase) {
          if (status) status.textContent = 'Could not load /firebase-client.js. Please refresh or ensure the latest build is deployed.';
          return;
        }
        signInBtn.disabled = true;
        window.RedpolyFirebase.signInWithGoogle().catch(function (err) {
          console.error(err);
          var code = err && err.code ? String(err.code) : '';
          var msg = err && err.message ? err.message : '';
          if (!status) return;
          if (code === 'auth/unauthorized-domain' || msg.indexOf('unauthorized-domain') !== -1) {
            status.textContent = 'This domain (' + window.location.hostname + ') must be added to Firebase Console → Authentication → Settings → Authorized domains.';
          } else if (code === 'auth/popup-blocked' || msg.indexOf('popup-blocked') !== -1) {
            status.textContent = 'Popup was blocked by your browser. Please allow popups and try again.';
          } else {
            status.textContent = 'Could not complete Google sign-in. Please try again.';
          }
        }).finally(function () {
          signInBtn.disabled = false;
        });
      });

      row.appendChild(copy);
      row.appendChild(signInBtn);
      accountBox.appendChild(row);
    }
  }
  try {
    var savedShippingMethod = sessionStorage.getItem(shippingMethodKey);
    if (savedShippingMethod === 'standard' || savedShippingMethod === 'express') {
      var savedOption = document.querySelector('input[name="shipping-method"][value="' + savedShippingMethod + '"]');
      if (savedOption) savedOption.checked = true;
    }
  } catch (ignoreShippingRead) { /* Default to Standard if browser storage is unavailable. */ }
  function money(amount) { return '₹' + Number(amount).toLocaleString('en-IN'); }

  function updatePayBar() {
    payBar.classList.toggle('is-visible', items.length > 0 && !placeButtonInView && !leaving);
  }

  function renderCart() {
    subtotal = 0;
    var pieces = 0;
    list.textContent = '';
    items.forEach(function (item) {
      subtotal += item.price * item.quantity;
      pieces += item.quantity;
      var row = document.createElement('article'); row.className = 'checkout-line';
      var image = document.createElement('img'); image.className = 'checkout-line__image'; image.alt = ''; image.loading = 'lazy';
      image.src = catalogue[item.name].image;
      var copy = document.createElement('div'); copy.className = 'checkout-line__copy';
      var title = document.createElement('h3'); title.textContent = item.name;
      var each = document.createElement('p'); each.textContent = money(item.price) + ' EACH';
      copy.appendChild(title); copy.appendChild(each);
      {
        var controls = document.createElement('div'); controls.className = 'checkout-line__controls';
        var stepper = document.createElement('div'); stepper.className = 'checkout-stepper'; stepper.setAttribute('role', 'group'); stepper.setAttribute('aria-label', 'Quantity of ' + item.name);
        [['decrease', '−', item.quantity === 1 ? 'Remove ' + item.name + ' from your cart' : 'Decrease quantity of ' + item.name], ['increase', '+', 'Increase quantity of ' + item.name]].forEach(function (control) {
          var button = document.createElement('button'); button.type = 'button'; button.className = 'checkout-stepper__button'; button.textContent = control[1];
          button.setAttribute('data-cart-action', control[0]); button.setAttribute('data-cart-id', item.id); button.setAttribute('aria-label', control[2]);
          stepper.appendChild(button);
          if (control[0] === 'decrease') { var amount = document.createElement('span'); amount.className = 'checkout-stepper__amount'; amount.textContent = item.quantity; amount.setAttribute('aria-label', 'Quantity ' + item.quantity); stepper.appendChild(amount); }
        });
        var remove = document.createElement('button'); remove.type = 'button'; remove.className = 'checkout-line__remove'; remove.textContent = 'REMOVE';
        remove.setAttribute('data-cart-action', 'remove'); remove.setAttribute('data-cart-id', item.id); remove.setAttribute('aria-label', 'Remove ' + item.name + ' from your cart');
        controls.appendChild(stepper); controls.appendChild(remove); copy.appendChild(controls);
      }
      var total = document.createElement('strong'); total.className = 'checkout-line__total'; total.textContent = money(item.price * item.quantity);
      row.appendChild(image); row.appendChild(copy); row.appendChild(total); list.appendChild(row);
    });
    countNode.textContent = pieces ? pieces + (pieces === 1 ? ' ITEM' : ' ITEMS') : '';
    emptyNode.hidden = items.length > 0;
    placeButton.disabled = items.length === 0;
    payBarButton.disabled = items.length === 0;
    undoButton.hidden = !lastRemoved;
    undoButton.textContent = lastRemoved ? 'UNDO REMOVAL · ' + lastRemoved.item.name : 'UNDO REMOVAL';
    if (!items.length) status.textContent = emptyCartMessage;
    else if (status.textContent === emptyCartMessage) status.textContent = '';
    updateCheckoutTotals();
    updatePayBar();
  }

  function updateCheckoutTotals() {
    var selectedMethod = document.querySelector('input[name="shipping-method"]:checked');
    var method = selectedMethod ? selectedMethod.value : 'standard';
    var standardFree = subtotal >= freeStandardFrom;
    var expressFree = subtotal >= freeExpressFrom;
    var freeShipping = method === 'express' ? expressFree : standardFree;
    var gst = Math.round(subtotal * gstRate / (100 + gstRate));
    var shipping = freeShipping ? 0 : (method === 'express' ? 120 : 30);
    var deliveryDays = method === 'express' ? 2 : 4;
    standardPriceNode.textContent = standardFree ? 'FREE' : '₹30';
    expressPriceNode.textContent = expressFree ? 'FREE' : '₹120';
    subtotalNode.textContent = money(subtotal);
    gstLabelNode.textContent = 'INCLUDES GST (' + gstRate + '%)';
    gstNode.textContent = money(gst);
    if (giftNode) giftNode.textContent = !items.length ? '-' : (subtotal >= freeGiftFrom ? 'INCLUDED' : money(freeGiftFrom - subtotal) + ' AWAY');
    shippingLabelNode.textContent = 'SHIPPING · ' + method.toUpperCase();
    shippingCostNode.textContent = !items.length ? '-' : (freeShipping ? 'FREE' : money(shipping));
    finalTotalNode.textContent = money(items.length ? subtotal + shipping : 0);
    payBarTotal.textContent = finalTotalNode.textContent;
    deliveryEstimateTitle.textContent = deliveryDays + '-DAY ' + method.toUpperCase() + ' DELIVERY';
    deliveryEstimateCopy.textContent = 'Estimated to valid PIN codes across India';
    document.querySelectorAll('.shipping-option').forEach(function (option) {
      var input = option.querySelector('input');
      option.classList.toggle('is-selected', !!input && input.checked);
    });
    if (!items.length) shippingStatus.textContent = 'Standard shipping is free on orders of ' + money(freeStandardFrom) + ' or more, and orders over ' + money(freeGiftFrom) + ' get a free gift.';
    else if (expressFree) shippingStatus.textContent = 'Free shipping unlocked on both Standard and Express.';
    else if (standardFree) shippingStatus.textContent = 'Free Standard shipping unlocked. Express is free from ' + money(freeExpressFrom) + '.';
    else shippingStatus.textContent = 'Add ' + money(freeStandardFrom - subtotal) + ' more for free Standard shipping.';
    return { method:method, freeShipping:freeShipping, gst:gst, shipping:shipping, deliveryDays:deliveryDays, total:subtotal + shipping };
  }
  shippingOptions.forEach(function (input) { input.addEventListener('change', function () {
    try { sessionStorage.setItem(shippingMethodKey, input.value); } catch (ignoreShippingWrite) { /* Selection still updates for this page view. */ }
    updateCheckoutTotals();
  }); });

  // Cart editing: change a quantity or remove a line without leaving checkout.
  function commitCart(message) {
    saveCart();
    renderCart();
    cartStatus.textContent = message;
  }
  list.addEventListener('click', function (event) {
    var control = event.target.closest('[data-cart-action]');
    if (!control || leaving) return;
    var id = control.getAttribute('data-cart-id');
    var action = control.getAttribute('data-cart-action');
    var item = items.find(function (entry) { return entry.id === id; });
    if (!item) return;
    var message;
    if (action === 'increase') {
      item.quantity += 1;
      message = item.name + ' quantity is now ' + item.quantity + '.';
      if (window.RedpolyFirebase) window.RedpolyFirebase.syncCartItem(item).catch(function (err) { console.error(err); });
    } else if (action === 'decrease' && item.quantity > 1) {
      item.quantity -= 1;
      message = item.name + ' quantity is now ' + item.quantity + '.';
      if (window.RedpolyFirebase) window.RedpolyFirebase.syncCartItem(item).catch(function (err) { console.error(err); });
    } else {
      lastRemoved = { item:{ id:item.id, name:item.name, price:item.price, quantity:item.quantity }, index:items.indexOf(item) };
      items = items.filter(function (entry) { return entry.id !== id; });
      message = item.name + ' removed from your cart.';
      if (window.RedpolyFirebase) window.RedpolyFirebase.removeCartItem(item.name).catch(function (err) { console.error(err); });
    }
    commitCart(message);
    // The list is rebuilt on every change, so hand keyboard focus back to the matching control.
    var next = Array.prototype.find.call(list.querySelectorAll('[data-cart-action="' + action + '"]'), function (button) { return button.getAttribute('data-cart-id') === id; });
    if (next) next.focus(); else if (!undoButton.hidden) undoButton.focus();
  });
  undoButton.addEventListener('click', function () {
    if (!lastRemoved || leaving) return;
    var restored = lastRemoved.item;
    var existing = items.find(function (entry) { return entry.id === restored.id; });
    if (existing) existing.quantity += restored.quantity;
    else {
      existing = restored;
      items.splice(Math.min(lastRemoved.index, items.length), 0, existing);
    }
    lastRemoved = null;
    commitCart(restored.name + ' is back in your cart.');
    if (window.RedpolyFirebase) window.RedpolyFirebase.syncCartItem(existing).catch(function (err) { console.error(err); });
    var back = Array.prototype.find.call(list.querySelectorAll('[data-cart-action="increase"]'), function (button) { return button.getAttribute('data-cart-id') === restored.id; });
    if (back) back.focus();
  });
  window.addEventListener('storage', function (event) {
    if (event.key !== cartKey || leaving) return;
    items = readCart(); lastRemoved = null; renderCart();
  });
  window.addEventListener('redpoly:cart-updated', function (event) {
    if (leaving || !event.detail || !Array.isArray(event.detail.items)) return;
    items = event.detail.items.slice();
    lastRemoved = null;
    renderCart();
  });
  window.addEventListener('redpoly:firebase-ready', renderCheckoutAccount);
  window.addEventListener('redpoly:auth-changed', renderCheckoutAccount);
  window.addEventListener('redpoly:profile-updated', renderCheckoutAccount);

  // Phone pay bar: keeps the total and the order button in reach until the main button is reached.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var entry = entries[entries.length - 1];
      // Reached = on screen or already scrolled past, so the bar never sits over the footer.
      placeButtonInView = entry.isIntersecting || entry.boundingClientRect.top < 0;
      updatePayBar();
    }).observe(placeButton);
  }
  payBarButton.addEventListener('click', function () { placeButton.click(); });

  renderCart();
  renderCheckoutAccount();

  pinInput.addEventListener('input', function () {
    var pin = pinInput.value.trim();
    lookupSequence += 1;
    var sequence = lookupSequence;
    window.clearTimeout(lookupTimer);
    if (activeLookup) activeLookup.abort();
    activeLookup = null;

    if (lastAutoFilledPin && pin !== lastAutoFilledPin) {
      cityInput.value = '';
      stateInput.value = '';
      cityInput.readOnly = false;
      stateInput.readOnly = false;
      lastAutoFilledPin = '';
    }
    if (!pin) {
      pinStatus.textContent = 'Enter a 6-digit PIN to look up city and state. If lookup is unavailable, fill them in manually.';
      return;
    }
    if (!/^[1-9][0-9]{5}$/.test(pin)) {
      pinStatus.textContent = pin.length < 6 ? 'Enter all 6 digits to look up your city and state.' : 'Enter a valid 6-digit Indian PIN code.';
      return;
    }

    pinStatus.textContent = 'Looking up city and state…';
    lookupTimer = window.setTimeout(function () {
      var controller = window.AbortController ? new AbortController() : null;
      activeLookup = controller;
      var options = controller ? { signal: controller.signal } : {};
      window.fetch('https://api.postalpincode.in/pincode/' + encodeURIComponent(pin), options)
        .then(function (response) {
          if (!response.ok) throw new Error('PIN lookup request failed');
          return response.json();
        })
        .then(function (result) {
          if (sequence !== lookupSequence || pinInput.value.trim() !== pin) return;
          var offices = result && result[0] && result[0].Status === 'Success' && result[0].PostOffice;
          var office = offices && offices.find(function (entry) { return entry && entry.Country === 'India' && entry.State && (entry.District || entry.Block || entry.Name); });
          if (!office) {
            pinStatus.textContent = 'No location found for this PIN. Please enter city and state manually.';
            return;
          }
          cityInput.value = office.District || office.Block || office.Name;
          stateInput.value = office.State;
          cityInput.readOnly = true;
          stateInput.readOnly = true;
          lastAutoFilledPin = pin;
          pinStatus.textContent = '';
        })
        .catch(function () {
          if (sequence !== lookupSequence || pinInput.value.trim() !== pin) return;
          pinStatus.textContent = 'PIN lookup is unavailable right now. Please enter city and state manually.';
        });
    }, 180);
  });

  form.addEventListener('submit', function (event) { event.preventDefault(); });
  placeButton.addEventListener('click', async function () {
    if (!items.length) { status.textContent='Your cart is empty. Add a product first.'; return; }
    if (!form.reportValidity()) return;
    var customerName = form.querySelector('[name="customer-name"]').value.trim();
    var email = form.querySelector('[name="email"]').value.trim();
    var phone = form.querySelector('[name="phone"]').value.trim();
    var address = form.querySelector('[name="address"]').value.trim();
    var pin = form.querySelector('[name="postal-code"]').value.trim();
    var city = form.querySelector('[name="city"]').value.trim();
    var state = form.querySelector('[name="state"]').value.trim();
    var reference='RED-DEMO-' + String(Math.floor(100000 + Math.random()*900000));
    var totals=updateCheckoutTotals();
    var freeGift = subtotal >= freeGiftFrom;
    var demoOrder={ reference:reference, pin:pin, deliveryDays:totals.deliveryDays, subtotal:subtotal, gstRate:gstRate, gstIncluded:true, gst:totals.gst, shippingMethod:totals.method, shippingCost:totals.shipping, freeShipping:totals.freeShipping, freeGift:freeGift, total:totals.total, items:items };

    placeButton.disabled = true;
    payBarButton.disabled = true;
    placeButton.setAttribute('aria-busy', 'true');

    var fb = window.RedpolyFirebase;
    if (fb && fb.getUser()) {
      status.textContent = 'Saving order to your REDPOLY account…';
      try {
        await fb.placeOrder({
          reference: reference,
          customerName: customerName,
          email: email,
          phone: phone,
          address: address,
          pin: pin,
          city: city,
          state: state,
          shippingMethod: totals.method,
          shippingCost: totals.shipping,
          freeShipping: totals.freeShipping,
          freeGift: freeGift,
          subtotal: subtotal,
          gstRate: gstRate,
          gst: totals.gst,
          total: totals.total,
          items: items,
          saveProfile: saveProfileChecked
        });
      } catch (err) {
        console.error(err);
        placeButton.disabled = false;
        payBarButton.disabled = false;
        placeButton.removeAttribute('aria-busy');
        status.textContent = 'Could not save your order to the cloud. Please check your details and try again.';
        return;
      }
    }

    try {
      sessionStorage.setItem(orderKey,JSON.stringify(demoOrder));
      localStorage.removeItem(cartKey);
      sessionStorage.removeItem(shippingMethodKey);
    } catch (ignoreOrderStorage) {
      placeButton.disabled = false;
      payBarButton.disabled = false;
      placeButton.removeAttribute('aria-busy');
      status.textContent='Your demo order summary could not be saved in this browser. Please try again.';
      return;
    }
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    leaving = true;
    updatePayBar();
    status.textContent = 'Moving to your demo thank-you page…';
    document.body.classList.add('checkout-page--leaving');
    window.setTimeout(function () { window.location.href='/thank-you'; }, reducedMotion ? 20 : 510);
  });
})();
