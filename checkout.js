(function () {
  var cartKey = 'redpoly-cart-v1';
  var orderKey = 'redpoly-demo-order-v1';
  var items = [];
  try {
    var parsed = JSON.parse(localStorage.getItem(cartKey) || '[]');
    if (Array.isArray(parsed)) items = parsed.filter(function (item) {
      return item && typeof item.name === 'string' && Number(item.price) > 0 && Number(item.quantity) > 0;
    }).map(function (item) {
      return { name: item.name, price: Number(item.price), quantity: Math.floor(Number(item.quantity)) };
    });
  } catch (ignoreStorage) { items = []; }

  var list = document.getElementById('checkout-items');
  var subtotalNode = document.getElementById('checkout-subtotal');
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

  items.forEach(function (item) {
    subtotal += item.price * item.quantity;
    var row = document.createElement('article'); row.className='checkout-line';
    var copy = document.createElement('div');
    var title = document.createElement('h3'); title.textContent=item.name;
    var qty = document.createElement('p'); qty.textContent='QUANTITY ' + item.quantity + ' · ' + money(item.price) + ' EACH';
    copy.appendChild(title); copy.appendChild(qty);
    var total = document.createElement('strong'); total.textContent=money(item.price * item.quantity);
    row.appendChild(copy); row.appendChild(total); list.appendChild(row);
  });
  subtotalNode.textContent=money(subtotal);
  emptyNode.hidden=items.length>0;
  placeButton.disabled=items.length===0;
  if (!items.length) status.textContent='Add an item to your bag before trying the demo checkout.';

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
          pinStatus.textContent = 'City and state detected: ' + cityInput.value + ', ' + stateInput.value + '. You can change the PIN to look up another location.';
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
    var demoOrder={ reference:reference, pin:pin, deliveryDays:2, subtotal:subtotal, items:items };
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
    window.setTimeout(function () { window.location.href='/thank-you'; }, reducedMotion ? 20 : 170);
  });
})();
