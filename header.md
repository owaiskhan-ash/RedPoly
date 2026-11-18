# Header

There is **one** header on the site, and every page carries exactly the same markup for it.

## The markup

```html
<header class="site-header">
  <div class="site-header__inner wrap">
    <a class="site-header__brand" href="/" aria-label="REDPOLY home">…logo…<span>TOYS</span></a>
    <nav class="site-header__nav" aria-label="Main navigation">
      <a href="/#shop">SHOP</a>
      <a href="/stories">COMIC</a>
      <a href="/help">HELP</a>
      <a href="/help#shipping">POLICIES</a>
    </nav>
    <button class="site-header__menu" id="site-menu-toggle" …>…</button>
  </div>
  <nav class="site-menu wrap" id="site-menu" aria-label="Menu">…same four links…</nav>
</header>
```

Styles live in `styles.css` (`site-header`, plus the phone menu rules), with the cart/saved button
chrome in `accessories.css`. `main.js` adds the cart and saved buttons into
`.site-header__inner` on every page, so the markup above stays identical everywhere.

## Pages that carry it

`index.html`, `products/*.html` (7), `checkout.html`, `thank-you.html`, `help.html`, `stories/index.html` — 12 pages.

## Notes

- Links are absolute (`/#shop`, `/stories`, `/help`), not `#shop`-style fragments, because the header
  now appears on pages that have no shop section to jump to.
- Every page loads `main.js` so the phone menu works and the cart button appears. On pages with no
  shop controls (the help desk) the cart button is still shown but the drawer machinery is not built.
- There is no back-to-top button anywhere in the site; none should be added.
