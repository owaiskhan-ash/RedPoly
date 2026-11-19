# REDPOLY: Monsoon Mischief

**Description:** REDPOLY is a small storefront. [Visit redpoly.justsimpleapps.online](https://redpoly.justsimpleapps.online/).

## Products on sale

| Product | Page | Price (incl. GST) |
| --- | --- | --- |
| Drift King (12 cm multi-mode 2.4G mini RC drift coupe with Follow Mode, Escape Mode, LED lights &amp; music, Fun Mode gamepad &amp; USB charging cable, ages 4+) | `/drift-king` (`products/drift-king.html`) | ₹799 |
| Baby Lingo (bilingual English + Hindi first-words learning robot for babies 6 months+, 100 double-sided flashcards) | `/baby-lingo` (`products/baby-lingo.html`) | ₹799 |
| Rise one X 4X4 (2.4 GHz spray drift F1 car with mecanum wheels, gamepad + wrist gesture controller, ages 6+) | `/rise-one-x-4x4` (`products/rise-one-x-4x4.html`) | ₹1,499 |
| Magnetic Blocks (STEM magnetic sticks & balls; 25 PCS, 36 PCS, 42 PCS or 64 PCS packs, ages 3+) | `/magnetic-blocks` (`products/magnetic-blocks.html`) | ₹399 – ₹799 |
| Bubble Gun (12-hole automatic bubble blaster, with 1 bottle of bubble water) | `/bubble-gun` (`products/bubble-gun.html`) | ₹499 |
| Stunt Pet (voice-control rolling rabbit toy with light and music; needs 3 AA batteries, not included) | `/stunt-pet` (`products/stunt-pet.html`) | ₹599 |
| Cute Dinos (press-and-go dinosaur toy on wheels; green, red or teal) | `/cute-dinos` (`products/cute-dinos.html`) | ₹249 |
| Cute Dinos 3-pack (one of each colour) | `/cute-dinos?pack=trio` (same page) | ₹549 |
| Mini Cool Car (1:20 remote-control stunt car) | `/mini-cool-car` (`products/mini-cool-car.html`) | ₹749 |
| Gel Storm (3-in-1 M4 gel blaster, ages 14+) | `/gel-storm` (`products/gel-storm.html`) | ₹1,999 |
| Pixel Splash (automatic pixel-block water blaster with RGB lighting and rechargeable power) | `/pixel-splash` (`products/pixel-splash.html`) | ₹1,749 |
| Mecha Rover (2-in-1 build and transform fire rescue truck and robot, 27 pieces, ages 3+) | `/mecha-rover` (`products/mecha-rover.html`) | ₹499 |

Read CC Does a Spin (Issue 02) and all three parts of Sector Zero (Issue 03) at `/stories`. See [the comics guide](comics/README.md) for the catalog and page art.

### Adding a product

1. Add a page in `products/` and a rewrite for its short URL in `vercel.json`.
2. Add the product name, price and thumbnail to the `catalogue` list in **both** `main.js` and `checkout.js`. Bags and saved lists only keep items that are in this list at the listed price. A product sold in more than one version gets one catalogue entry per version (Cute Dinos has `CUTE DINOS GREEN`, `CUTE DINOS RED`, `CUTE DINOS TEAL` and `CUTE DINOS TRIO`), and the page's own script switches the button's `data-name` and `data-price` to match the pick.
3. Put a cut-out photo (transparent WebP or PNG) in `assets/images/redpoly/products/`.
4. Add a block or card for it on the home page (`index.html`, section `#shop`).
5. For a second photo on the product page (for example the item in its box), add `data-alt-src`, `data-alt-label`, `data-alt-text` and `data-label` to the `.char-stage__figure` image. `main.js` then shows one button per photo.

The checkout is still a demo: no payment is collected and no order is created.

## Character IP

All REDPOLY character names, designs, and artwork are reserved. No reuse is permitted without prior written permission. See [CHARACTER-IP-LICENSE.md](CHARACTER-IP-LICENSE.md) for the full terms.
