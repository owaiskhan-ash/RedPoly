# Lingo Squad — character bible & Issue 04 pitch

The product-locked cast guide for the next REDPOLY comic: **Baby Lingo**, the three **Cute Dinos** (Rino, Tino, Gino) and the **Magnetic Blocks**. Everything here is derived from the real product photos, so every generated page matches what we actually sell.

| File | What it is |
| --- | --- |
| `cast-sheet.webp` | One-page visual lock sheet. Five cells, real product cut-outs, palette chips, art rules. Show this to anyone (or any model) before drawing. |
| `CHARACTERS.md` | The full guide: silhouette, exact feature counts, hex palettes, faces, motion, comedy function, copy-paste prompt blocks, never-lists, page style, scale table, continuity and a pre-flight checklist. |
| `characters.json` | Same specs in machine-readable form — references, palettes, prompts, negative prompts — ready for a generation pipeline. |
| `STORY.md` | Issue 04 pitch **CLICKBAIT**: logline, a full eight-page, 32-panel script with dialogue and puns, a spare joke bank, two alternate pitches, twelve title options and production notes. |

## The cast in one line each

- **LINGO** (Baby Lingo) — the guide. Brilliant, warm, and *extra*: explains the danger while standing in it.
- **RINO** (red dino) — YOLO. No arms, no brakes, no steering, no plan. Cannot start himself; asks to be pressed.
- **TINO** (teal dino) — overthinker. Has planned the funeral. Is frightened of the blocks because they are inanimate.
- **GINO** (green dino) — nerd. Exact counts, exact angles, exact disappointment.
- **MAGNETIC BLOCKS** — objects. No faces, no voices, no movement of their own. All comedy is physics.

## How to use this for a new page

1. Open `cast-sheet.webp` and feed the real product cut-outs from `assets/images/redpoly/products/` into the image reference slots — never generate a character from text alone.
2. Paste the matching character block from `CHARACTERS.md` §2–6 (or the `prompt` field in `characters.json`) and the `global_negative_prompt`.
3. Keep the page grammar from `CHARACTERS.md` §1: cream field, strict 2 × 2 grid, thick black borders, night-navy scenes, cyan-only tech glow, halftone shading.
4. Run the seven-point pre-flight check at the end of `CHARACTERS.md` before accepting the page.

## Status

- Guide and cast sheet: done.
- Story: scripted, no art yet.
- Site integration: nothing is wired into the reader until pages exist. When they do, use the Issue 02/03 pattern — `comics/issue-004-clickbait/pages/page-0N.webp`, an `issue.json` manifest with a `shop` list per page, a `cover.webp`, and a `catalog.json` entry with `"number": "04"`.
