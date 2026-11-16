(function () {
  var cartKey = 'redpoly-cart-v1';
  var orderKey = 'redpoly-demo-order-v1';
  var shippingMethodKey = 'redpoly-shipping-method-v1';
  var freeGiftId = 'redpoly-free-keychain';
  // Reward thresholds on the item subtotal. Keep these in step with the bag drawer in main.js.
  var freeStandardFrom = 1499;
  var freeExpressFrom = 5000;
  var freeGiftFrom = 6000;
  // GST rate in percent, applied to the item subtotal. Change it here only; the labels follow.
  var gstRate = 12;
  var items = [];

  function readBag() {
    try {
      var parsed = JSON.parse(localStorage.getItem(cartKey) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (item) {
        return item && typeof item.name === 'string' && Number.isFinite(Number(item.price)) &&
          (Number(item.price) > 0 || (item.id === freeGiftId && Number(item.price) === 0)) && Number(item.quantity) > 0;
      }).map(function (item) {
        var price = Number(item.price);
        return { id:typeof item.id === 'string' ? item.id : item.name.toLowerCase() + '|' + price, name:item.name, price:price, quantity:Math.floor(Number(item.quantity)) };
      });
    } catch (ignoreStorage) { return []; }
  }
  function saveBag() {
    try {
      localStorage.setItem(cartKey, JSON.stringify(items.map(function (item) {
        var entry = { id:item.id, name:item.name, price:item.price, quantity:item.quantity };
        if (item.id === freeGiftId) entry.isReward = true;
        return entry;
      })));
    } catch (ignoreSave) { /* The bag still works for this page view. */ }
  }
  items = readBag();

  var list = document.getElementById('checkout-items');
  var countNode = document.getElementById('checkout-count');
  var undoButton = document.getElementById('checkout-undo');
  var bagStatus = document.getElementById('checkout-bag-status');
  var subtotalNode = document.getElementById('checkout-subtotal');
  var gstNode = document.getElementById('checkout-gst');
  var gstLabelNode = document.getElementById('checkout-gst-label');
  var shippingLabelNode = document.getElementById('checkout-shipping-label');
  var shippingCostNode = document.getElementById('checkout-shipping-cost');
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
  var emptyBagMessage = 'Add an item to your bag before trying the demo checkout.';
  var lookupTimer = null;
  var activeLookup = null;
  var lookupSequence = 0;
  var lastAutoFilledPin = '';
  var lastRemoved = null;
  var placeButtonInView = false;
  var leaving = false;
  var subtotal = 0;
  try {
    var savedShippingMethod = sessionStorage.getItem(shippingMethodKey);
    if (savedShippingMethod === 'standard' || savedShippingMethod === 'express') {
      var savedOption = document.querySelector('input[name="shipping-method"][value="' + savedShippingMethod + '"]');
      if (savedOption) savedOption.checked = true;
    }
  } catch (ignoreShippingRead) { /* Default to Standard if browser storage is unavailable. */ }
  function money(amount) { return '₹' + Number(amount).toLocaleString('en-IN'); }

  var checkoutImageByName = {
    'BARSAAT':'/assets/images/redpoly/characters/barsaat.png',
    'AGNI':'/assets/images/redpoly/characters/agni-product.png',
    'NOOR':'/assets/images/redpoly/characters/noor.png',
    'AARAV':'/assets/images/redpoly/characters/aarav.png',
    'PINS + ART PRINT':'/assets/images/redpoly/accessories/pins-and-art-print.jpg',
    'ACTION KEYCHAINS':'/assets/images/redpoly/accessories/action-keychains.jpg',
    'CHARACTER MUG':'/assets/images/redpoly/accessories/character-mug.jpg',
    'IPHONE 15 CASE':'/assets/images/redpoly/accessories/iphone-15-case.jpg'
  };

  // The complimentary keychain follows the item subtotal, exactly as it does in the bag drawer.
  function syncGift() {
    var paid = items.reduce(function (total, item) { return total + (item.id === freeGiftId ? 0 : item.price * item.quantity); }, 0);
    var giftIndex = items.findIndex(function (item) { return item.id === freeGiftId; });
    if (paid >= freeGiftFrom && giftIndex === -1) {
      items.push({ id:freeGiftId, name:'COMPLIMENTARY CREATURE KEYCHAIN', price:0, quantity:1 });
      return 'added';
    }
    if (paid < freeGiftFrom && giftIndex !== -1) {
      items = items.filter(function (item) { return item.id !== freeGiftId; });
      return 'removed';
    }
    if (giftIndex !== -1) { items[giftIndex].quantity = 1; items[giftIndex].price = 0; }
    return '';
  }

  function updatePayBar() {
    payBar.classList.toggle('is-visible', items.length > 0 && !placeButtonInView && !leaving);
  }

  function renderBag() {
    subtotal = 0;
    var pieces = 0;
    list.textContent = '';
    items.forEach(function (item) {
      var isGift = item.id === freeGiftId;
      subtotal += item.price * item.quantity;
      pieces += item.quantity;
      var row = document.createElement('article'); row.className = 'checkout-line' + (isGift ? ' checkout-line--reward' : '');
      var image = document.createElement('img'); image.className = 'checkout-line__image'; image.alt = ''; image.loading = 'lazy';
      image.src = isGift ? checkoutImageByName['ACTION KEYCHAINS'] : (item.name.indexOf('CREATURE CLUB TRIO') === 0 ? '/assets/images/redpoly/collections/accessories.jpg' : (checkoutImageByName[item.name] || '/assets/images/redpoly/collections/accessories.jpg'));
      var copy = document.createElement('div'); copy.className = 'checkout-line__copy';
      var title = document.createElement('h3'); title.textContent = item.name;
      var each = document.createElement('p'); each.textContent = isGift ? 'COMPLIMENTARY REWARD' : money(item.price) + ' EACH';
      copy.appendChild(title); copy.appendChild(each);
      if (!isGift) {
        var controls = document.createElement('div'); controls.className = 'checkout-line__controls';
        var stepper = document.createElement('div'); stepper.className = 'checkout-stepper'; stepper.setAttribute('role', 'group'); stepper.setAttribute('aria-label', 'Quantity of ' + item.name);
        [['decrease', '−', item.quantity === 1 ? 'Remove ' + item.name + ' from your bag' : 'Decrease quantity of ' + item.name], ['increase', '+', 'Increase quantity of ' + item.name]].forEach(function (control) {
          var button = document.createElement('button'); button.type = 'button'; button.className = 'checkout-stepper__button'; button.textContent = control[1];
          button.setAttribute('data-bag-action', control[0]); button.setAttribute('data-bag-id', item.id); button.setAttribute('aria-label', control[2]);
          stepper.appendChild(button);
          if (control[0] === 'decrease') { var amount = document.createElement('span'); amount.className = 'checkout-stepper__amount'; amount.textContent = item.quantity; amount.setAttribute('aria-label', 'Quantity ' + item.quantity); stepper.appendChild(amount); }
        });
        var remove = document.createElement('button'); remove.type = 'button'; remove.className = 'checkout-line__remove'; remove.textContent = 'REMOVE';
        remove.setAttribute('data-bag-action', 'remove'); remove.setAttribute('data-bag-id', item.id); remove.setAttribute('aria-label', 'Remove ' + item.name + ' from your bag');
        controls.appendChild(stepper); controls.appendChild(remove); copy.appendChild(controls);
      }
      var total = document.createElement('strong'); total.className = 'checkout-line__total'; total.textContent = isGift ? 'FREE' : money(item.price * item.quantity);
      row.appendChild(image); row.appendChild(copy); row.appendChild(total); list.appendChild(row);
    });
    countNode.textContent = pieces ? pieces + (pieces === 1 ? ' ITEM' : ' ITEMS') : '';
    emptyNode.hidden = items.length > 0;
    placeButton.disabled = items.length === 0;
    payBarButton.disabled = items.length === 0;
    undoButton.hidden = !lastRemoved;
    undoButton.textContent = lastRemoved ? 'UNDO REMOVAL · ' + lastRemoved.item.name : 'UNDO REMOVAL';
    if (!items.length) status.textContent = emptyBagMessage;
    else if (status.textContent === emptyBagMessage) status.textContent = '';
    updateCheckoutTotals();
    updatePayBar();
  }

  function updateCheckoutTotals() {
    var selectedMethod = document.querySelector('input[name="shipping-method"]:checked');
    var method = selectedMethod ? selectedMethod.value : 'standard';
    var standardFree = subtotal >= freeStandardFrom;
    var expressFree = subtotal >= freeExpressFrom;
    var freeShipping = method === 'express' ? expressFree : standardFree;
    var gst = Math.round(subtotal * gstRate / 100);
    var shipping = freeShipping ? 0 : (method === 'express' ? 120 : 30);
    var deliveryDays = method === 'express' ? 2 : 4;
    standardPriceNode.textContent = standardFree ? 'FREE' : '₹30';
    expressPriceNode.textContent = expressFree ? 'FREE' : '₹120';
    subtotalNode.textContent = money(subtotal);
    gstLabelNode.textContent = 'GST (' + gstRate + '%)';
    gstNode.textContent = money(gst);
    shippingLabelNode.textContent = 'SHIPPING · ' + method.toUpperCase();
    shippingCostNode.textContent = !items.length ? '—' : (freeShipping ? 'FREE' : money(shipping));
    finalTotalNode.textContent = money(items.length ? subtotal + gst + shipping : 0);
    payBarTotal.textContent = finalTotalNode.textContent;
    deliveryEstimateTitle.textContent = deliveryDays + '-DAY ' + method.toUpperCase() + ' DELIVERY';
    deliveryEstimateCopy.textContent = 'Estimated to valid PIN codes across India';
    document.querySelectorAll('.shipping-option').forEach(function (option) {
      var input = option.querySelector('input');
      option.classList.toggle('is-selected', !!input && input.checked);
    });
    if (!items.length) shippingStatus.textContent = 'Standard shipping is free on bags of ' + money(freeStandardFrom) + ' or more.';
    else if (expressFree) shippingStatus.textContent = 'Free shipping unlocked on both Standard and Express.';
    else if (standardFree) shippingStatus.textContent = 'Free Standard shipping unlocked. Express is free from ' + money(freeExpressFrom) + '.';
    else shippingStatus.textContent = 'Add ' + money(freeStandardFrom - subtotal) + ' more for free Standard shipping.';
    return { method:method, freeShipping:freeShipping, gst:gst, shipping:shipping, deliveryDays:deliveryDays, total:subtotal + gst + shipping };
  }
  shippingOptions.forEach(function (input) { input.addEventListener('change', function () {
    try { sessionStorage.setItem(shippingMethodKey, input.value); } catch (ignoreShippingWrite) { /* Selection still updates for this page view. */ }
    updateCheckoutTotals();
  }); });

  // Bag editing: change a quantity or remove a line without leaving checkout.
  function commitBag(message) {
    var gift = syncGift();
    saveBag();
    renderBag();
    bagStatus.textContent = message + (gift === 'added' ? ' A complimentary keychain was added.' : gift === 'removed' ? ' The complimentary keychain was removed.' : '');
  }
  list.addEventListener('click', function (event) {
    var control = event.target.closest('[data-bag-action]');
    if (!control || leaving) return;
    var id = control.getAttribute('data-bag-id');
    var action = control.getAttribute('data-bag-action');
    var item = items.find(function (entry) { return entry.id === id; });
    if (!item || item.id === freeGiftId) return;
    var message;
    if (action === 'increase') { item.quantity += 1; message = item.name + ' quantity is now ' + item.quantity + '.'; }
    else if (action === 'decrease' && item.quantity > 1) { item.quantity -= 1; message = item.name + ' quantity is now ' + item.quantity + '.'; }
    else {
      lastRemoved = { item:{ id:item.id, name:item.name, price:item.price, quantity:item.quantity }, index:items.indexOf(item) };
      items = items.filter(function (entry) { return entry.id !== id; });
      message = item.name + ' removed from your bag.';
    }
    commitBag(message);
    // The list is rebuilt on every change, so hand keyboard focus back to the matching control.
    var next = Array.prototype.find.call(list.querySelectorAll('[data-bag-action="' + action + '"]'), function (button) { return button.getAttribute('data-bag-id') === id; });
    if (next) next.focus(); else if (!undoButton.hidden) undoButton.focus();
  });
  undoButton.addEventListener('click', function () {
    if (!lastRemoved || leaving) return;
    var restored = lastRemoved.item;
    var existing = items.find(function (entry) { return entry.id === restored.id; });
    if (existing) existing.quantity += restored.quantity;
    else items.splice(Math.min(lastRemoved.index, items.length), 0, restored);
    lastRemoved = null;
    commitBag(restored.name + ' is back in your bag.');
    var back = Array.prototype.find.call(list.querySelectorAll('[data-bag-action="increase"]'), function (button) { return button.getAttribute('data-bag-id') === restored.id; });
    if (back) back.focus();
  });
  window.addEventListener('storage', function (event) {
    if (event.key !== cartKey || leaving) return;
    items = readBag(); lastRemoved = null; renderBag();
  });

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

  if (syncGift()) saveBag();
  renderBag();

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
  placeButton.addEventListener('click', function () {
    if (!items.length) { status.textContent='Your bag is empty. Add an accessory or figure first.'; return; }
    if (!form.reportValidity()) return;
    var pin = form.querySelector('[name="postal-code"]').value.trim();
    var reference='RED-DEMO-' + String(Math.floor(100000 + Math.random()*900000));
    var totals=updateCheckoutTotals();
    var demoOrder={ reference:reference, pin:pin, deliveryDays:totals.deliveryDays, subtotal:subtotal, gstRate:gstRate, gst:totals.gst, shippingMethod:totals.method, shippingCost:totals.shipping, freeShipping:totals.freeShipping, total:totals.total, items:items };
    try {
      sessionStorage.setItem(orderKey,JSON.stringify(demoOrder));
      localStorage.removeItem(cartKey);
      sessionStorage.removeItem(shippingMethodKey);
    } catch (ignoreOrderStorage) {
      status.textContent='Your demo order summary could not be saved in this browser. Please try again.';
      return;
    }
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    leaving = true;
    placeButton.disabled = true;
    payBarButton.disabled = true;
    placeButton.setAttribute('aria-busy', 'true');
    updatePayBar();
    status.textContent = 'Moving to your demo thank-you page…';
    document.body.classList.add('checkout-page--leaving');
    window.setTimeout(function () { window.location.href='/thank-you'; }, reducedMotion ? 20 : 510);
  });
})();
