# Footer

There is **one** footer on the site, and every page carries exactly the same markup for it.

## The markup

```html
<footer class="site-footer">
  <div class="site-footer__inner">
    <a class="site-footer__brand" href="/" aria-label="REDPOLY home">…logo…<span>COLLECT. EXPLORE. DISPLAY.</span></a>
    <nav class="site-footer__links" aria-label="Help and policies">
      <a href="/account">MY ACCOUNT</a>
      <a href="/help">HELP + POLICIES</a>
      <a href="/help#shipping">SHIPPING</a>
      <a href="/help#returns">RETURNS</a>
      <a href="/help#cancellation">CANCELLATION</a>
      <a href="/privacy">PRIVACY</a>
      <a href="/terms">TERMS</a>
    </nav>
    <p class="site-footer__legal">GSTIN 27BJGPK5062E1ZB</p>
  </div>
</footer>
```

Styles live in `styles.css` under the `Shared site footer` comment, so one stylesheet file drives the look everywhere. The other stylesheets (`product.css`, `pixel-splash.css`, `checkout.css`, `help.css`, `account.css`, `stories/stories.css`) no longer contain any footer rules.

## Pages that carry it

`index.html`, `products/*.html` (7), `checkout.html`, `thank-you.html`, `help.html`, `privacy.html`, `terms.html`, `account.html`, `stories/index.html` (15 pages).

## Editing it

Change the block above in all 15 pages in the same commit. There is no build step, so the duplication is real: a `git grep 'site-footer__legal'` lists every copy. If the page count keeps growing, generate this block from one fragment at build time instead.

## Not part of the footer

- Page-specific demo warnings ("no payment taken", "no real order created") stay in the page body, where they are relevant.
- The comic reader's own Prev/Next bar (`reader-footer`) is an in-dialog control, not a footer.
