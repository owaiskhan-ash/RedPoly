(function () {
  var orderKey='redpoly-demo-order-v1';
  var message=document.getElementById('thankyou-message');
  var reference=document.getElementById('thankyou-reference');
  var itemsNode=document.getElementById('thankyou-items');
  var delivery=document.getElementById('thankyou-delivery');
  function money(amount){return '₹'+Number(amount).toLocaleString('en-IN');}
  try {
    var order=JSON.parse(sessionStorage.getItem(orderKey)||'null');
    if(!order||!Array.isArray(order.items)||!order.items.length)return;
    reference.textContent='DEMO REF: '+order.reference;
    message.textContent='Thanks for trying the REDPOLY demo checkout. This is a simulated order only; no payment was taken and no real order was placed.';
    itemsNode.textContent='';
    order.items.forEach(function(item){
      var row=document.createElement('div');row.className='thankyou-line';
      var name=document.createElement('span');name.textContent=item.name+' × '+item.quantity;
      var price=document.createElement('strong');price.textContent=money(item.price*item.quantity);
      row.appendChild(name);row.appendChild(price);itemsNode.appendChild(row);
    });
    delivery.textContent='Estimated delivery: 2 days to PIN code '+order.pin+'. This is a demo estimate only.';
  } catch(ignoreOrderRead) { /* The thank-you page still clearly identifies itself as a demo. */ }
})();
