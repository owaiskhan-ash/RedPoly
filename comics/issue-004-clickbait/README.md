# Issue 04: CLICKBAIT

Eight pages, four panels each, 1536 × 2048 (3:4 portrait). Cast and locks live in `comics/lingo-squad/`; the full script is `comics/lingo-squad/STORY.md`.

## Progress

| Page | Title | Art | Notes |
| --- | --- | --- | --- |
| 01 | The Crate | `pages/page-01.webp` | Lettered. Caption + four balloons from the script. |
| 02 | The Lesson | `pages/page-02.webp` | Lettered. Lecture, the press, and two fridges. |
| 03 | The Count | `pages/page-03.webp` | Lettered. Rows, Tino's mouth, the laminated list, CLATTER. |
| 04 | The Gap | `pages/page-04.webp` | Lettered. Chasm, scroll, JUGAAD, the press request. |
| 05 | Press Me | `pages/page-05.webp` | Lettered. Forty degrees of optimism, FWOOSH, the crate landing. |
| 06 | Build | `pages/page-06.webp` | Lettered. Triangle, headbutt bridge, Lingo becomes the span. |
| 07 | The Core | — | Re-roll needed: a dino renders with arms and two lines duplicate. |
| 08 | Stick With Me | — | Not generated yet (per-turn image cap reached). |

## Page 1 lettering as printed

- Caption: DEEP IN SECTOR ZERO…
- RINO: PRESS ME. PRESS ME.
- GINO: YOU CAN'T PRESS YOURSELF. THAT'S THE "GO".
- TINO: WHAT IF NOBODY PRESSES US AGAIN?
- LINGO: NAMASTE, DOSTON! TODAY: MAGNETISM.
- RINO: OOH. FORBIDDEN LEGO.
- LINGO: SIXTY-FOUR WAYS THIS GOES WRONG. I'VE NUMBERED THEM.
- TINO: THEY'RE NOT MOVING. WHAT IF THEY'RE WAITING?
- Caption: THE BLOCKS SAID NOTHING. THEY NEVER DO.

## Page 2 lettering as printed

- LINGO: OPPOSITES ATTRACT! LIKE POLES REPEL! SAY IT WITH ME!
- GINO: LIKE POLES REPEL. LIKE TINO AND FUN.
- TINO: I FUN VERY CAREFULLY.
- SFX: CLACK CLACK CLACK · RINO: YOLOOOO—
- LINGO: CONGRATULATIONS. YOU ARE NOW 40% REFRIGERATOR.
- RINO: I'M MAGNETIC. · GINO: YOU'RE DECORATIVE.
- TINO: GREAT. TWO FRIDGES. ONE CRISIS.
- Caption: THE BLOCKS REMAINED INANIMATE. SOMEHOW THAT WAS THE SCARY PART.

## Known fixes before the reader goes live

- Pages 03–06: the dinos read as standing on little feet in several panels instead of sitting on their hidden wheels, and Lingo's face drifts slightly off-model. The toys' colours, plates, buttons and block shapes are correct; the rolling chassis needs a re-roll pass. Re-roll these panels with the `reference/dino-wheels.png` crop attached.
- Pages 03 and 06 carry a few lettered lines added during clean-up: Rino's "FINALLY. SOMETHING MOVES.", the page 4 caption "THE GAP: 3.4 METRES. THE PLAN: NONE.", Tino's "I DON'T TRUST TRIANGLES." and Rino's "HE'S FINE."

## Still to do

- Page 07 (re-roll) and page 08 (new).
- Reader wiring once all eight pages exist: `issue.json` with a `shop` list per page, a `cover.webp` crop, and a `catalog.json` entry with `"number": "04"`.
