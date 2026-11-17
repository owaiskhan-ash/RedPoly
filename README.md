# REDPOLY: Monsoon Mischief

**Description:** REDPOLY is a small storefront. [Visit redpoly.justsimpleapps.online](https://redpoly.justsimpleapps.online/).

## Products on sale

| Product | Page | Price (incl. GST) |
| --- | --- | --- |
| Bubble Gun (12-hole automatic bubble blaster, with 1 bottle of bubble water) | `/bubble-gun` (`products/bubble-gun.html`) | ₹499 |
| Stunt Pet (voice-control rolling rabbit toy with light and music; needs 3 AA batteries, not included) | `/stunt-pet` (`products/stunt-pet.html`) | ₹599 |
| Cute Dinos (press-and-go dinosaur toy on wheels; green, red or teal) | `/cute-dinos` (`products/cute-dinos.html`) | ₹249 |
| Cute Dinos 3-pack (one of each colour) | `/cute-dinos?pack=trio` (same page) | ₹549 |

Comic Issue 1 stays online at `/stories` (files in `comics/` and `stories/`).

### Adding a product

1. Add a page in `products/` and a rewrite for its short URL in `vercel.json`.
2. Add the product name, price and thumbnail to the `catalogue` list in **both** `main.js` and `checkout.js`. Bags and saved lists only keep items that are in this list at the listed price. A product sold in more than one version gets one catalogue entry per version (Cute Dinos has `CUTE DINOS GREEN`, `CUTE DINOS RED`, `CUTE DINOS TEAL` and `CUTE DINOS TRIO`), and the page's own script switches the button's `data-name` and `data-price` to match the pick.
3. Put a cut-out photo (transparent PNG) in `assets/images/redpoly/products/`.
4. Add a block or card for it on the home page (`index.html`, section `#shop`).
5. For a second photo on the product page (for example the item in its box), add `data-alt-src`, `data-alt-label`, `data-alt-text` and `data-label` to the `.char-stage__figure` image. `main.js` then shows one button per photo.

The checkout is still a demo: no payment is collected and no order is created.

## Character IP

All REDPOLY character names, designs, and artwork are reserved. No reuse is permitted without prior written permission. See [CHARACTER-IP-LICENSE.md](CHARACTER-IP-LICENSE.md) for the full terms.
