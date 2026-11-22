/* Shared variant picker for product pages that sell one product in several designs.
   Any page can use it: mark the picker with data-variant-picker, give it data-slug (the page
   path without the slash) and data-param (the query-string name), and put one radio input per
   design inside it. Each input carries the cart name, price, photo and labels as data attributes,
   so the page still sells the first design at the right price if this file never loads. */
(function () {
  'use strict';
  var picker = document.querySelector('[data-variant-picker]');
  if (!picker) return;

  var inputs = picker.querySelectorAll('input[type="radio"][data-name]');
  var buy = document.querySelector('.char-buy-row .char-buy.add-btn');
  if (!inputs.length || !buy) return;

  var slug = picker.getAttribute('data-slug') || window.location.pathname.replace(/^\/+|\/+$/g, '');
  var param = picker.getAttribute('data-param') || 'variant';
  var figure = document.querySelector('.char-stage__figure');
  var priceLabel = document.querySelector('[data-variant-price-label]');
  var priceNode = document.querySelector('[data-variant-price]');
  var stateNode = picker.querySelector('[data-variant-state]');
  var includedNode = document.querySelector('[data-variant-included]');
  var finalHeading = document.querySelector('[data-variant-final-heading]');
  var finalBuy = document.querySelector('.char-buy--final');
  var galleryThumbs = document.querySelectorAll('.char-media__thumb img');
  var saveButton = null;

  function money(amount) { return '₹' + Number(amount).toLocaleString('en-IN'); }
  function chosen() {
    for (var i = 0; i < inputs.length; i += 1) {
      if (inputs[i].checked) return inputs[i];
    }
    return inputs[0];
  }
  function syncUrl(value) {
    if (!window.history || !window.history.replaceState) return;
    try {
      var url = new URL(window.location.href);
      url.searchParams.set(param, value);
      window.history.replaceState(null, '', url.pathname + '?' + url.searchParams.toString() + url.hash);
    } catch (ignoreUrlError) { /* The picker still works without a changing URL. */ }
  }

  function sync(fromUser) {
    var active = chosen();
    var name = active.getAttribute('data-name');
    var price = Number(active.getAttribute('data-price'));
    var shortLabel = active.getAttribute('data-short') || active.value.toUpperCase();
    var label = active.getAttribute('data-label') || shortLabel;
    var say = active.getAttribute('data-say') || name;
    var image = active.getAttribute('data-image');
    var alt = active.getAttribute('data-alt');
    var thumb = active.getAttribute('data-thumb') || image;
    var boxText = active.getAttribute('data-box');
    var buyLabel = 'Add ' + say + ' to cart for ' + price + ' rupees';

    if (figure && image) {
      if (figure.getAttribute('src') !== image) figure.setAttribute('src', image);
      if (alt) figure.setAttribute('alt', alt);
    }
    Array.prototype.forEach.call(galleryThumbs, function (img) {
      if (thumb && img.getAttribute('src') !== thumb) img.setAttribute('src', thumb);
    });
    if (priceLabel) priceLabel.textContent = label;
    if (priceNode) priceNode.textContent = money(price);
    if (stateNode) stateNode.textContent = shortLabel + ' · ' + money(price);
    if (includedNode && boxText) includedNode.textContent = boxText;

    buy.setAttribute('data-name', name);
    buy.setAttribute('data-price', String(price));
    buy.setAttribute('aria-label', buyLabel);

    if (finalHeading) {
      finalHeading.textContent = '';
      finalHeading.appendChild(document.createTextNode('TAKE THE ' + shortLabel + ' HOME'));
      finalHeading.appendChild(document.createElement('br'));
      var priceLine = document.createElement('span');
      priceLine.textContent = 'FOR ' + money(price) + '.';
      finalHeading.appendChild(priceLine);
    }
    if (finalBuy) {
      finalBuy.setAttribute('data-name', name);
      finalBuy.setAttribute('data-price', String(price));
      finalBuy.setAttribute('aria-label', buyLabel);
    }

    var stickyPrice = document.querySelector('.mobile-buy-bar__price strong');
    var stickyButton = document.querySelector('.mobile-buy-bar__button');
    if (stickyPrice) stickyPrice.textContent = money(price);
    if (stickyButton) {
      stickyButton.setAttribute('data-name', name);
      stickyButton.setAttribute('data-price', String(price));
      stickyButton.setAttribute('aria-label', buyLabel);
    }

    // main.js reads wishData when the heart is clicked, so the saved list follows the live pick.
    if (!saveButton) saveButton = document.querySelector('.char-save');
    if (saveButton && saveButton.wishData) {
      saveButton.wishData.name = name;
      saveButton.wishData.price = price;
      saveButton.wishData.href = '/' + slug + '?' + param + '=' + active.value;
      saveButton.wishData.image = thumb;
    }

    if (fromUser) syncUrl(active.value);
    window.dispatchEvent(new CustomEvent('redpoly:product-variant-changed', {
      detail: { name: name, price: price, variant: active.value }
    }));
  }

  // Deep links from the cart or a saved list, for example /sip-buddies?buddy=cat
  try {
    var wanted = (new URLSearchParams(window.location.search).get(param) || '').toLowerCase().trim();
    if (wanted) {
      Array.prototype.forEach.call(inputs, function (input) {
        if (input.value.toLowerCase() === wanted) input.checked = true;
      });
    }
  } catch (ignoreParams) { /* Keep the first design. */ }

  Array.prototype.forEach.call(inputs, function (input) {
    input.addEventListener('change', function () { sync(true); });
  });
  window.addEventListener('redpoly:variant-picker-catalog-sync', function () { sync(false); });

  // Warm the other photos in the background so switching design feels instant, but skip it on
  // slow or data-saving connections.
  var connection = navigator.connection || navigator.mozConnection || {};
  var slowConnection = connection.saveData === true || /(^|-)2g$/.test(connection.effectiveType || '');
  if (!slowConnection) {
    var warm = window.requestIdleCallback || function (run) { window.setTimeout(run, 1500); };
    warm(function () {
      Array.prototype.forEach.call(inputs, function (input) {
        var src = input.getAttribute('data-image');
        if (src) { var preload = new Image(); preload.src = src; }
      });
    });
  }

  sync(false);
})();
