# REDPOLY — Monsoon Mischief

**Description:** REDPOLY is a small storefront. [Visit redpoly.justsimpleapps.online](https://redpoly.justsimpleapps.online/).

## Products on sale

| Product | Page | Price (incl. GST) |
| --- | --- | --- |
| Bubble Gun (12-hole automatic bubble blaster, with 1 bottle of bubble water) | `/bubble-gun` (`products/bubble-gun.html`) | ₹499 |
| Stunt Pet (voice-control rolling rabbit toy with light and music; needs 3 AA batteries, not included) | `/stunt-pet` (`products/stunt-pet.html`) | ₹599 |

Comic Issue 1 stays online at `/stories` (files in `comics/` and `stories/`).

### Adding a product

1. Add a page in `products/` and a rewrite for its short URL in `vercel.json`.
2. Add the product name, price and thumbnail to the `catalogue` list in **both** `main.js` and `checkout.js`. Bags and saved lists only keep items that are in this list at the listed price.
3. Put a cut-out photo (transparent PNG) in `assets/images/redpoly/products/`.
4. Add a block or card for it on the home page (`index.html`, section `#shop`).
5. For a second photo on the product page (for example the item in its box), add `data-alt-src`, `data-alt-label`, `data-alt-text` and `data-label` to the `.char-stage__figure` image. `main.js` then shows one button per photo.

The checkout is still a demo: no payment is collected and no order is created.

## Character IP

All REDPOLY character names, designs, and artwork are reserved. No reuse is permitted without prior written permission. See [CHARACTER-IP-LICENSE.md](CHARACTER-IP-LICENSE.md) for the full terms.
