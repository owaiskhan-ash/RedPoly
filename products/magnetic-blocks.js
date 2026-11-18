/* Magnetic Blocks pack picker: switches between 25 PCS, 36 PCS, 42 PCS and 64 PCS sets,
   updating the add-to-cart button, box photo, sticky bar, save-for-later item and URL. */
(function () {
  var picker = document.getElementById('magnetic-picker');
  var addButton = document.getElementById('magnetic-add');
  if (!picker || !addButton) return;

  var packs = picker.querySelectorAll('input[name="magnetic-pack"]');
  var priceNode = document.getElementById('magnetic-price');
  var priceLabel = document.getElementById('magnetic-price-label');
  var stateNode = document.getElementById('magnetic-picker-state');
  var includedNode = document.getElementById('magnetic-included');
  var boxImg = document.getElementById('magnetic-box-img');
  var boxLink = document.getElementById('magnetic-box-link');
  var boxBadge = document.getElementById('magnetic-box-badge');
  var finalHeading = document.getElementById('magnetic-final-heading');
  var finalBuy = document.querySelector('.char-buy--final');
  var saveButton = null;

  var PACK_ALIASES = {
    '25': '25pcs',
    '25pcs': '25pcs',
    '25-pcs': '25pcs',
    '36': '36pcs',
    '36pcs': '36pcs',
    '36-pcs': '36pcs',
    '42': '42pcs',
    '42pcs': '42pcs',
    '42-pcs': '42pcs',
    '64': '64pcs',
    '64pcs': '64pcs',
    '64-pcs': '64pcs'
  };

  function money(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN');
  }

  function findPackInput(packValue) {
    for (var i = 0; i < packs.length; i += 1) {
      if (packs[i].value === packValue) return packs[i];
    }
    return packs[0];
  }

  function chosenPack() {
    for (var i = 0; i < packs.length; i += 1) {
      if (packs[i].checked) return packs[i];
    }
    return packs[0];
  }

  function syncUrl(packValue) {
    if (!window.history || !window.history.replaceState) return;
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('pack', packValue);
      window.history.replaceState(null, '', url.pathname + '?' + url.searchParams.toString() + url.hash);
    } catch (_ignoreHistoryErr) {
      /* ignore URL rewrite errors */
    }
  }

  function sync(fromUser) {
    var active = chosenPack();
    if (!active) return;

    var name = active.getAttribute('data-name') || 'MAGNETIC BLOCKS 25 PCS';
    var price = Number(active.getAttribute('data-price') || 399);
    var label = active.getAttribute('data-label') || '25 PCS · STARTER SET';
    var shortLabel = active.getAttribute('data-short') || '25 PCS';
    var say = active.getAttribute('data-say') || 'Magnetic Blocks 25 PCS set';
    var boxText = active.getAttribute('data-box') || '';
    var boxImgSrc = active.getAttribute('data-box-img') || '';
    var boxAlt = active.getAttribute('data-box-alt') || '';
    var thumbSrc = active.getAttribute('data-thumb') || '/assets/images/redpoly/products/magnetic-blocks-25pcs-thumb.webp?v=mag-20261122';

    if (priceNode) priceNode.textContent = money(price);
    if (priceLabel) priceLabel.textContent = label;
    if (stateNode) stateNode.textContent = shortLabel + ' · ' + money(price);
    if (includedNode && boxText) includedNode.textContent = boxText;

    addButton.setAttribute('data-name', name);
    addButton.setAttribute('data-price', String(price));
    addButton.setAttribute('aria-label', 'Add ' + say + ' to cart for ' + price + ' rupees');

    if (boxImg && boxImgSrc) {
      if (boxImg.getAttribute('src') !== boxImgSrc) {
        boxImg.setAttribute('src', boxImgSrc);
      }
      if (boxAlt) boxImg.setAttribute('alt', boxAlt);
    }
    if (boxLink && boxImgSrc) {
      boxLink.setAttribute('href', boxImgSrc);
      boxLink.setAttribute('aria-label', 'Open the ' + shortLabel + ' retail box photo at full size');
    }
    if (boxBadge) {
      boxBadge.textContent = shortLabel + ' RETAIL BOX';
    }

    if (finalHeading) {
      finalHeading.innerHTML = 'TAKE THE ' + shortLabel + ' SET<br /><span>FOR ' + money(price) + '.</span>';
    }
    if (finalBuy) {
      finalBuy.setAttribute('data-name', name);
      finalBuy.setAttribute('data-price', String(price));
      finalBuy.setAttribute('aria-label', 'Add ' + say + ' to cart for ' + price + ' rupees');
      if (!finalBuy.disabled && !finalBuy.classList.contains('added')) {
        finalBuy.textContent = 'ADD TO CART — ' + money(price);
      }
      finalBuy.dataset.baseLabel = 'ADD TO CART — ' + money(price);
    }

    var stickyBar = document.querySelector('.mobile-buy-bar');
    if (stickyBar) {
      var stickyPrice = stickyBar.querySelector('.mobile-buy-bar__price strong');
      var stickyButton = stickyBar.querySelector('.mobile-buy-bar__button');
      if (stickyPrice) stickyPrice.textContent = money(price);
      if (stickyButton) {
        stickyButton.setAttribute('data-name', name);
        stickyButton.setAttribute('data-price', String(price));
        stickyButton.setAttribute('aria-label', 'Add ' + say + ' to cart for ' + price + ' rupees');
      }
    }

    if (!saveButton) saveButton = document.querySelector('.char-save');
    if (saveButton && saveButton.wishData) {
      saveButton.wishData.name = name;
      saveButton.wishData.price = price;
      saveButton.wishData.href = '/magnetic-blocks?pack=' + active.value;
      saveButton.wishData.image = thumbSrc;
    }

    if (fromUser) syncUrl(active.value);
    window.dispatchEvent(new CustomEvent('redpoly:product-variant-changed', {
      detail: { name: name, price: price, pack: active.value }
    }));
  }

  // Deep links from the cart or saved list, e.g. /magnetic-blocks?pack=42pcs
  var params = new URLSearchParams(window.location.search);
  var rawPack = (params.get('pack') || params.get('pcs') || '').toLowerCase().trim();
  if (rawPack && Object.prototype.hasOwnProperty.call(PACK_ALIASES, rawPack)) {
    var targetInput = findPackInput(PACK_ALIASES[rawPack]);
    if (targetInput) {
      for (var k = 0; k < packs.length; k += 1) packs[k].checked = packs[k] === targetInput;
    }
  }

  for (var i = 0; i < packs.length; i += 1) {
    packs[i].addEventListener('change', function () { sync(true); });
  }
  window.addEventListener('redpoly:magnetic-blocks-catalog-sync', function () {
    sync(false);
  });
  sync(false);
})();
