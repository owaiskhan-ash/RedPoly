# Issue 04: Magnet Mayhem

The guide takes the crew on a tour of Magnet Canyon, where the magnetic blocks are bigger than the safety margins. Six pages published so far, out of eight planned.

- `pages/page-01.webp` to `pages/page-06.webp` are the finished art at 1792 x 2400, converted from the supplied PNGs at quality 82.
- `cover.webp` is cropped from the last panel of page 01 (Reno stuck to a block cube, next to the guide) at 700 x 700.
- `issue.json` is the reader manifest. Every page carries a `shop` list; the tour is built on Magnetic Blocks, so the 42 and 64 PCS packs lead the chips, with Cute Dinos alongside.
- The supplied art had `ISSUE 01` printed in the bottom margin of every page. The cream band was repainted and the label retypeset as `ISSUE 04 • PAGE 0X`; the artwork, panel borders, and page numbers were left untouched. Only the printed label was corrected, so a future replacement of these pages should keep the same 76 px band at the very bottom of the page.
- `panelCount` in `catalog.json` assumes four panels per page, the same as every page of this issue so far.

## Remaining pages

Pages 07 and 08 are still to come. When they arrive, drop them into `pages/` as `page-07.webp` and `page-08.webp`, add their entries to `issue.json` and update `pageCount` / `panelCount` in both `issue.json`'s catalog entry and `catalog.json`. The reader picks up extra pages automatically, because it counts the `pages` array.
