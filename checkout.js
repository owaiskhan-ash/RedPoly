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
    window.location.href='/thank-you';
  });
})();
