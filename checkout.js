(function () {
  var cartKey = 'redpoly-cart-v1';
  var orderKey = 'redpoly-demo-order-v1';
  var freeGiftId = 'redpoly-free-keychain';
  var items = [];
  try {
    var parsed = JSON.parse(localStorage.getItem(cartKey) || '[]');
    if (Array.isArray(parsed)) items = parsed.filter(function (item) {
      return item && typeof item.name === 'string' && Number.isFinite(Number(item.price)) &&
        (Number(item.price) > 0 || (item.id === freeGiftId && Number(item.price) === 0)) && Number(item.quantity) > 0;
    }).map(function (item) {
      return { id:item.id, name:item.name, price:Number(item.price), quantity:Math.floor(Number(item.quantity)) };
    });
  } catch (ignoreStorage) { items = []; }

  var list = document.getElementById('checkout-items');
  var subtotalNode = document.getElementById('checkout-subtotal');
  var gstNode = document.getElementById('checkout-gst');
  var shippingCostNode = document.getElementById('checkout-shipping-cost');
  var finalTotalNode = document.getElementById('checkout-final-total');
  var shippingStatus = document.getElementById('shipping-method-status');
  var shippingOptions = Array.prototype.slice.call(document.querySelectorAll('input[name="shipping-method"]'));
  var standardPriceNode = document.getElementById('shipping-standard-price');
  var expressPriceNode = document.getElementById('shipping-express-price');
  var emptyNode = document.getElementById('checkout-empty');
  var placeButton = document.getElementById('place-demo-order');
  var form = document.getElementById('demo-checkout-form');
  var status = document.getElementById('checkout-status');
  var pinInput = document.getElementById('checkout-pin');
  var cityInput = document.getElementById('checkout-city');
  var stateInput = document.getElementById('checkout-state');
  var pinStatus = document.getElementById('pin-lookup-status');
  var lookupTimer = null;
  var activeLookup = null;
  var lookupSequence = 0;
  var lastAutoFilledPin = '';
  var subtotal = 0;
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
  items.forEach(function (item) {
    subtotal += item.price * item.quantity;
    var row = document.createElement('article'); row.className='checkout-line' + (item.id === freeGiftId ? ' checkout-line--reward' : '');
    var image = document.createElement('img'); image.className='checkout-line__image'; image.alt=item.name; image.loading='lazy';
    image.src = item.id === freeGiftId ? checkoutImageByName['ACTION KEYCHAINS'] : (item.name.indexOf('CREATURE CLUB TRIO') === 0 ? '/assets/images/redpoly/collections/accessories.jpg' : (checkoutImageByName[item.name] || '/assets/images/redpoly/collections/accessories.jpg'));
    var copy = document.createElement('div');
    var title = document.createElement('h3'); title.textContent=item.name;
    var qty = document.createElement('p'); qty.textContent=item.id === freeGiftId ? 'COMPLIMENTARY REWARD' : 'QUANTITY ' + item.quantity + ' · ' + money(item.price) + ' EACH';
    copy.appendChild(title); copy.appendChild(qty);
    var total = document.createElement('strong'); total.textContent=item.id === freeGiftId ? 'FREE' : money(item.price * item.quantity);
    row.appendChild(image); row.appendChild(copy); row.appendChild(total); list.appendChild(row);
  });
  emptyNode.hidden=items.length>0;
  placeButton.disabled=items.length===0;
  if (!items.length) status.textContent='Add an item to your bag before trying the demo checkout.';

  function updateCheckoutTotals() {
    var selectedMethod = document.querySelector('input[name="shipping-method"]:checked');
    var method = selectedMethod ? selectedMethod.value : 'standard';
    var freeShipping = subtotal >= 5000;
    var gst = Math.round(subtotal * 0.18);
    var shipping = freeShipping ? 0 : (method === 'express' ? 120 : 30);
    standardPriceNode.textContent = freeShipping ? 'FREE' : '₹30';
    expressPriceNode.textContent = freeShipping ? 'FREE' : '₹120';
    subtotalNode.textContent = money(subtotal);
    gstNode.textContent = money(gst);
    shippingCostNode.textContent = freeShipping ? 'FREE' : money(shipping);
    finalTotalNode.textContent = money(subtotal + gst + shipping);
    document.querySelectorAll('.shipping-option').forEach(function (option) {
      var input=option.querySelector('input');
      option.classList.toggle('is-selected', !!input && input.checked);
    });
    shippingStatus.textContent = freeShipping ? 'Free shipping unlocked — Standard and Express are both free!' : 'Add ' + money(5000 - subtotal) + ' more to unlock free shipping on both methods.';
    return { method:method, freeShipping:freeShipping, gst:gst, shipping:shipping, total:subtotal+gst+shipping };
  }
  shippingOptions.forEach(function (input) { input.addEventListener('change', updateCheckoutTotals); });
  updateCheckoutTotals();

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
    var demoOrder={ reference:reference, pin:pin, deliveryDays:2, subtotal:subtotal, gst:totals.gst, shippingMethod:totals.method, shippingCost:totals.shipping, freeShipping:totals.freeShipping, total:totals.total, items:items };
    try {
      sessionStorage.setItem(orderKey,JSON.stringify(demoOrder));
      localStorage.removeItem(cartKey);
    } catch (ignoreOrderStorage) {
      status.textContent='Your demo order summary could not be saved in this browser. Please try again.';
      return;
    }
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    placeButton.disabled = true;
    placeButton.setAttribute('aria-busy', 'true');
    status.textContent = 'Moving to your demo thank-you page…';
    document.body.classList.add('checkout-page--leaving');
    window.setTimeout(function () { window.location.href='/thank-you'; }, reducedMotion ? 20 : 510);
  });
})();
