# Social share image price audit

Checked on 19 November 2026 against `main.js` / `checkout.js` catalogue prices, the product
page JSON-LD offers and the home page shop cards. Method: every `og:image` / `twitter:image`
file was opened and the printed price badge read at high zoom, then compared with the price the
site charges for that product.

Re-run the machine part of this audit any time with:

```bash
npm run check:prices
```

## Result: all share images carry the correct price

| Product | Site price (incl. GST) | Share image | Price printed in the image | Verdict |
| --- | --- | --- | --- | --- |
| Baby Lingo | ₹799 | `social/baby-lingo-og.png` | **ONLY ₹799 · INCL. GST** (plus "₹899 on Amazon") | ✅ correct |
| Bubble Gun | ₹499 | `social/bubble-gun-og.png` | **ONLY ₹499** | ✅ correct |
| Cute Dinos | ₹249 / trio ₹549 | `social/cute-dinos-og.png` | **ONLY ₹249 · 3 FOR ₹549** | ✅ correct |
| Drift King | ₹799 | `social/drift-king-og.png` | **ONLY ₹799 · INCL. GST** (plus "₹859 on Amazon") | ✅ correct |
| Magnetic Blocks | ₹399 – ₹799 | `social/magnetic-blocks-og.png` | **FROM ₹399 · UP TO 64 PCS** | ✅ correct |
| Mini Cool Car | ₹749 | `social/mini-cool-car-og.png` | **ONLY ₹749 · INCL. GST** | ✅ correct |
| Pixel Splash | ₹1,749 | `social/pixel-splash-og.png` | **AUTOMATIC WATER BLASTER · ₹1,749 INCL. GST** | ✅ correct |
| Rise one X 4X4 | ₹1,499 | `social/rise-one-x-4x4-og.png` | **ONLY ₹1,499 · INCL. GST** | ✅ correct |
| Stunt Pet | ₹599 | `social/stunt-pet-og.png` | **ONLY ₹599 · INCL. GST** | ✅ correct |
| Gel Storm | ₹1,999 | `products/gel-storm-scene-1.jpg` (photo) | no price printed | ✅ nothing to be wrong |
| Mecha Rover | ₹499 | `products/mecha-rover-catalog.jpg` (photo) | no price printed | ✅ nothing to be wrong |

Amazon comparison prices quoted on the Baby Lingo (₹899) and Drift King (₹859) cards also match
the "on Amazon" comparison shown on those two product pages.

No share image needed regenerating, so no artwork was changed in this pass.

## Also verified in the same pass

- 11 product pages · 17 SKUs: JSON-LD offer price, `product:price:amount`, and every
  `data-price` on the ADD TO CART buttons agree on each page.
- `main.js` and `checkout.js` catalogues agree with each other and with the pages (this matters
  because a saved cart drops items whose price no longer matches).
- Home page shop cards print the same price they add to the cart at.
- Share copy (`og:description`, `og:image:alt`, `twitter:description`) only quotes prices that
  exist on that product's page.
- All nine branded share cards are present, 1200x630 PNG, and referenced by an `og:image`.

## Two things worth a decision later (not pricing bugs)

1. **Gel Storm and Mecha Rover** use a plain product photo for `og:image` instead of a branded
   1200x630 card, so a shared link shows an uncropped portrait/square photo. They could be given
   cards in the same style as the other nine.
2. **The home page** (`index.html`) shares `social/bubble-gun-og.png`, so a shared homepage link
   looks like a Bubble Gun (₹499) product card. A REDPOLY-branded card would represent the store
   better.

Finally, `scripts/check-pricing.mjs` (wired into `npm run lint`) now fails the build if any of
these numbers drift apart again.
