(function () {
  var orderKey='redpoly-demo-order-v1';
  var message=document.getElementById('thankyou-message');
  var reference=document.getElementById('thankyou-reference');
  var itemsNode=document.getElementById('thankyou-items');
  var totalsNode=document.getElementById('thankyou-totals');
  var delivery=document.getElementById('thankyou-delivery');
  function money(amount){return '₹'+Number(amount).toLocaleString('en-IN');}
  try {
    var order=JSON.parse(sessionStorage.getItem(orderKey)||'null');
    if(!order||!Array.isArray(order.items)||!order.items.length)return;
    reference.textContent='DEMO REF: '+order.reference;
    message.textContent='Thanks for trying the REDPOLY demo checkout. This is a simulated order only; no payment was taken and no real order was placed.';
    itemsNode.textContent='';
    order.items.forEach(function(item){
      var row=document.createElement('div');row.className='thankyou-line'+(item.id==='redpoly-free-keychain'?' thankyou-line--reward':'');
      var name=document.createElement('span');name.textContent=item.id==='redpoly-free-keychain'?'COMPLIMENTARY KEYCHAIN REWARD':item.name+' × '+item.quantity;
      var price=document.createElement('strong');price.textContent=item.id==='redpoly-free-keychain'?'FREE':money(item.price*item.quantity);
      row.appendChild(name);row.appendChild(price);itemsNode.appendChild(row);
    });
    if (typeof order.gst === 'number' && typeof order.total === 'number') {
      [["ITEMS SUBTOTAL",money(order.subtotal)],["GST (18%)",money(order.gst)],["SHIPPING · "+String(order.shippingMethod||'standard').toUpperCase(),order.shippingCost===0?'FREE':money(order.shippingCost)],["DEMO TOTAL",money(order.total)]].forEach(function(pair,index){
        var row=document.createElement('div');row.className='thankyou-total'+(index===3?' thankyou-total--grand':'');
        var label=document.createElement('span');label.textContent=pair[0];var value=document.createElement('strong');value.textContent=pair[1];row.appendChild(label);row.appendChild(value);totalsNode.appendChild(row);
      });
    }
    var deliveryDays = Number(order.deliveryDays) || (order.shippingMethod === 'express' ? 2 : 4);
    delivery.textContent='Estimated delivery: '+deliveryDays+' days via '+String(order.shippingMethod||'standard').toUpperCase()+' to PIN code '+order.pin+'. This is a demo estimate only.';
  } catch(ignoreOrderRead) { /* The thank-you page still clearly identifies itself as a demo. */ }
})();
