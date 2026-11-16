/* Cute Dinos: the colour and pack picker keeps the hero photo, the price, the buy button and
   the page URL in step. Without this file the page still sells the green single dino at ₹249,
   because every price and name is already in the markup. */
(function () {
  'use strict';
  var picker = document.getElementById('dino-picker');
  if (!picker) return;

  var colourGroup = document.getElementById('dino-colours');
  var colourInputs = picker.querySelectorAll('input[name="dino-colour"]');
  var packInputs = picker.querySelectorAll('input[name="dino-pack"]');
  var trioInput = picker.querySelector('input[name="dino-pack"][value="trio"]');
  var figure = document.getElementById('dino-figure');
  var priceLabel = document.getElementById('dino-price-label');
  var priceNode = document.getElementById('dino-price');
  var buy = document.getElementById('dino-add');
  var included = document.getElementById('dino-included');
  var hint = document.getElementById('dino-pick-hint');
  var state = document.getElementById('dino-picker-state');
  var saveButton = document.querySelector('.char-save');
  var stickyPrice = document.querySelector('.mobile-buy-bar__price strong');
  var stickyButton = document.querySelector('.mobile-buy-bar__button');
  if (!colourGroup || !trioInput || !buy) return;

  function money(amount) { return '₹' + Number(amount).toLocaleString('en-IN'); }
  function read(input) {
    return {
      name: input.getAttribute('data-name'),
      price: Number(input.getAttribute('data-price')),
      label: input.getAttribute('data-label'),
      say: input.getAttribute('data-say') || 'Cute Dinos',
      image: input.getAttribute('data-image'),
      alt: input.getAttribute('data-alt'),
      box: input.getAttribute('data-box')
    };
  }
  function checkedColour() {
    for (var index = 0; index < colourInputs.length; index += 1) {
      if (colourInputs[index].checked) return colourInputs[index];
    }
    return colourInputs[0];
  }
  function isTrio() { return trioInput.checked; }
  function current() { return isTrio() ? read(trioInput) : read(checkedColour()); }

  // The chosen colour and pack are mirrored in the address bar so a link can point straight
  // at one dino or at the 3-pack. Nothing here reloads the page.
  function syncUrl() {
    if (!window.history || !window.history.replaceState) return;
    try {
      var url = new URL(window.location.href);
      if (isTrio()) {
        url.searchParams.delete('colour');
        url.searchParams.set('pack', 'trio');
      } else {
        url.searchParams.delete('pack');
        url.searchParams.set('colour', checkedColour().value);
      }
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    } catch (ignoreUrlError) { /* The picker still works without a changing URL. */ }
  }

  function apply(options) {
    var pick = current();
    var trio = isTrio();

    if (figure) {
      if (figure.getAttribute('src') !== pick.image) figure.setAttribute('src', pick.image);
      figure.setAttribute('alt', pick.alt);
    }
    if (priceLabel) priceLabel.textContent = pick.label;
    if (priceNode) priceNode.textContent = money(pick.price);
    if (included) included.textContent = pick.box;
    if (state) state.textContent = pick.label;
    if (hint) hint.textContent = trio
      ? 'One of each colour in the set. Pick a colour to go back to a single dino.'
      : 'Pick one colour for ₹249, or take all three for ₹549.';

    colourGroup.disabled = trio;
    buy.setAttribute('data-name', pick.name);
    buy.setAttribute('data-price', String(pick.price));
    buy.setAttribute('aria-label', 'Add ' + pick.say + ' to cart for ' + pick.price + ' rupees');

    // main.js reads wishData when the heart is clicked, so the saved list follows the live pick.
    if (saveButton && saveButton.wishData) {
      saveButton.wishData = {
        name: pick.name,
        href: '/cute-dinos' + (trio ? '?pack=trio' : '?colour=' + checkedColour().value),
        image: pick.image,
        price: pick.price
      };
    }
    if (stickyPrice) stickyPrice.textContent = money(pick.price);
    if (stickyButton) stickyButton.setAttribute('aria-label', 'Add ' + pick.say + ' to bag for ' + pick.price + ' rupees');
    if (!options || options.updateUrl !== false) syncUrl();
  }

  Array.prototype.forEach.call(colourInputs, function (input) {
    input.addEventListener('change', function () { apply(); });
  });
  Array.prototype.forEach.call(packInputs, function (input) {
    input.addEventListener('change', function () { apply(); });
  });

  // Deep links: /cute-dinos?colour=red or /cute-dinos?pack=trio
  try {
    var params = new URLSearchParams(window.location.search);
    if ((params.get('pack') || '').toLowerCase() === 'trio') trioInput.checked = true;
    var wanted = (params.get('colour') || '').toLowerCase();
    if (wanted) {
      Array.prototype.forEach.call(colourInputs, function (input) {
        if (input.value.toLowerCase() === wanted) input.checked = true;
      });
    }
  } catch (ignoreParams) { /* Keep the default green single dino. */ }

  // Warm the other photos in the background so switching colour feels instant, but skip it on
  // slow or data-saving connections where the extra megabyte is not worth it.
  var connection = navigator.connection || navigator.mozConnection || {};
  var slowConnection = connection.saveData === true || /(^|-)2g$/.test(connection.effectiveType || '');
  if (!slowConnection) {
    var warm = window.requestIdleCallback || function (run) { window.setTimeout(run, 1500); };
    warm(function () {
      Array.prototype.forEach.call(colourInputs, function (input) {
        var preload = new Image();
        preload.src = input.getAttribute('data-image');
      });
      var trioPreload = new Image();
      trioPreload.src = trioInput.getAttribute('data-image');
    });
  }

  // The sticky bar and the save button are built by main.js; pick them up now that it has run.
  saveButton = document.querySelector('.char-save');
  stickyPrice = document.querySelector('.mobile-buy-bar__price strong');
  stickyButton = document.querySelector('.mobile-buy-bar__button');
  apply({ updateUrl: false });
})();
