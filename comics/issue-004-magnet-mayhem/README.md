# Issue 04: Magnet Mayhem

The guide takes the crew on a tour of Magnet Canyon, where the magnetic blocks are bigger than the safety margins. All eight pages are published.

- `pages/page-01.webp` to `pages/page-08.webp` are the finished art at 1792 x 2400, converted from the supplied PNGs at quality 82. The issue runs 32 panels, four per page.
- `cover.webp` is cropped from the last panel of page 01 (Reno stuck to a block cube, next to the guide) at 700 x 700.
- `issue.json` is the reader manifest. Every page carries a `shop` list; the tour is built on Magnetic Blocks, so the 42 and 64 PCS packs lead the chips, with Cute Dinos alongside.
- The supplied art had `ISSUE 01` printed in the bottom margin of every page. The cream band was repainted and the label retypeset as `ISSUE 04 • PAGE 0X`; the artwork, panel borders, and page numbers were left untouched. Only the printed label was corrected, so a future replacement of these pages should keep the same 76 px band at the very bottom of the page.
- `pageCount` and `panelCount` in `catalog.json` follow the manifest: eight pages, four panels each. The reader counts the `pages` array, so any future page only needs a manifest entry.

## Publishing history

The issue went live with the first six pages as Issue 04, and pages 07 and 08 were appended to the same manifest once the art arrived, so the shelf never gained a Part 2.
