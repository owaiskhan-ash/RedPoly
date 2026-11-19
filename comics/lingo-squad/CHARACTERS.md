# LINGO SQUAD — Locked Character Guide

**Purpose:** every new comic page, cover, promo panel or sticker must show these four products **exactly as the toys are sold**. Nothing here is a redesign. Each character below is a real REDPOLY product, so the product photo is the law and this document is the reading of that law.

**Companion files**

- `cast-sheet.webp` — one-page visual lock sheet, built from the real product cut-outs.
- `characters.json` — the same data, machine-readable, for prompt pipelines.
- `STORY.md` — the Issue 04 story ("CLICKBAIT") plus title options.

---

## 0. The three rules that never bend

1. **The product photo is the master.** When generating, always feed the real cut-out as an image reference (image-to-image / reference slot). Never generate a character from text alone and never "improve" a model. If the page art disagrees with the photo, the photo wins.
2. **Locked counts and colours.** Feature counts (plates, screws, buttons, wheels) and hex values below are fixed. A missing plate or an extra screw is a failed generation, even if the page looks nice.
3. **Approved animation liberties only.** Cartoons need acting, so exactly three liberties are allowed:
   - the dinos may get a **simple black mouth line** for dialogue (the toy has none, so keep it thin, no teeth, no lips);
   - **blinks, squash-and-stretch, wheel spin, skid marks and motion lines**;
   - **Lingo's screen face may change expression** (eyes and mouth only — the hardware never changes).

   Everything else — proportions, seams, panels, plates, wheels, colour blocking — is untouchable.

**Absolute never-list (applies to every character):** no human hands, no fingers, no gloves, no shoes, no clothes, no hats, no armour, no weapons, no extra limbs, no eyebrows, no irises, no eyelashes, no logos, no text on bodies, no product-box lettering on the character, no cross-over redesigns with other REDPOLY toys.

---

## 1. The world these characters live in

**Page format:** 3:4 portrait, 1536 × 2048. **Look:** the existing Sector Zero page style. A cream page field (`#F9F1D2`), a strict 2 × 2 panel grid with thick hand-inked black borders, deep night-navy scene panels (sky `#2E3A44`, shadow `#141A20`), cyan tech glow (`#35C8D8`) as the only light source, halftone dot shading, rough ink contours, and cream speech balloons with black outlines. Emphasis words in dialogue are set in orange (`#E8712A`), teal (`#2E9CA6`), red-ish (`#C8342B`) or olive (`#4E7A2E`) caps.

**Camera:** low, toy-eye camera. These are desk toys in a huge dark lab, so the world should feel enormous: crate walls like cliffs, a chasm wider than three dinos, a Magnet Core tall as a building. Scale is a joke engine, not a detail.

**Sound effects:** chunky, short, onomatopoeic — `CLACK`, `CLICK`, `WHUMMM`, `SKRRRT`, `THUD`. Never glossy digital buzzwords.

---

## 2. LINGO — the guide (Baby Lingo)

**Product:** Baby Lingo, bilingual English + Hindi first-words learning robot, 6 months+, 100 double-sided flashcards with barcode strips.
**Reference:** `assets/images/redpoly/products/baby-lingo.png` (cut-out), `baby-lingo-studio.jpg` (in-hand scale), `baby-lingo-cards.jpg` (cards), `baby-lingo-box.jpg`.

### Personality
The team's walking encyclopedia and self-appointed narrator. Genuinely brilliant, genuinely **extra**. Answers a yes/no question with a lecture. Says "fun fact" and then says an unfun fact. Corrects everyone's grammar mid-escape. Uses Hindi words naturally and then immediately defines them, because teaching is a reflex. Believes the crew would be dead without him, and is only slightly wrong.

**Voice:** warm, teacher-bright, slightly smug. Two-beat delivery: fact, then flourish.
**Catchphrases:** "Namaste, doston!" · "Fun fact:" · "As your guide, I should mention…" · "Vocabulary word!" · "In Hindi we say…" · "I have a card for this."
**Comedy function:** the explainer who makes the danger worse by explaining it. His magnets (see story licence) make him the accidental hero.

### Locked visual DNA
- **Silhouette:** one rounded capsule — a friendly backpack with legs. No neck, no separate head, no ears. Widest at the hips, gently domed on top, much shorter and rounder than the dinos.
- **Shell, two tones:** upper hood/crown in muted steel blue `#6E9FBB`, wrapping down the sides; belly, arms and legs in bright cyan `#2FC5D4`. A clean seam runs across the body under the face frame.
- **Face:** a large rounded-square screen, slightly wider than tall, pale `#EDEDED`, held by a thick ivory bezel `#EFE7D6`. Exactly **six recessed screw heads** in the bezel: three along the top edge, three along the bottom edge.
- **Eyes:** exactly two solid black oval eyes, each with one big white glint (upper-left) and one small white dot (lower-right). No whites of the eyes, no irises, no lashes.
- **Mouth:** a black open smile with the bottom filled by a pink tongue `#EC5A7C`. This is the only mouth the character has — it lives on the screen, never on the plastic.
- **Ear pods:** exactly one round cyan disc on each side of the head at eye height, each with a small raised inner ring.
- **Chest panel:** ivory rounded rectangle with exactly **two raised cyan square buttons**, and between them a tiny vertical stack of three marks: a square, a triangle, a dot.
- **Arms:** short ribbed/threaded cylinder arms at the waist, each ending in a **gear/cog-shaped clamp**. These are clamps, not hands — no fingers, ever.
- **Legs:** two stubby cyan cylinders with flared cuffs, a clear gap between them. No toes.
- **Surface:** glossy moulded plastic with one soft highlight down the left edge; a fine moulding seam under the face frame.
- **Scale:** the shortest, widest body in the cast — roughly level with a dino's shoulder, about 60% of a dino's height.

### Expression range (screen only)
Happy (default open smile) · smug (eyes flattened into half-moons, one-sided smile) · panic (small round eyes, wobbly mouth) · thinking (eyes as two dots, mouth a small line) · flat (single straight mouth, eyes unchanged) · scanning (same face plus a cyan rim glow `#7FE4EC` and a faint grid on the screen). **Never** add eyebrows, blush, sweat drops, hearts, X-eyes, or emoji on the screen.

### Motion
Waddles with a side-to-side rock; too-top-heavy, so he tips over and rights himself like a weeble. Can't jump. His gear clamps can pinch and drag small props.

### Story licence (visuals unchanged)
Lingo's speaker magnet attracts Magnetic Blocks. This is a **comic-only** trait: it never adds a visible magnet, cable, antenna or glowing part. Show it with blocks sticking to his shell and belly, and with cyan pull-lines.

### Prompt block
> LINGO: a small rounded capsule-shaped baby learning robot, glossy moulded plastic, two-tone shell — muted steel-blue hood `#6E9FBB` over a bright cyan body `#2FC5D4`. Large rounded-square pale screen face `#EDEDED` with a thick ivory bezel `#EFE7D6` and six tiny recessed screws (three top, three bottom). On the screen: two solid black oval eyes with white glints and a black open smile with a pink tongue. One round cyan ear disc on each side of the head. Ivory chest panel with two raised cyan square buttons and three tiny square/triangle/dot marks between them. Short ribbed cylinder arms ending in gear-shaped clamps, no hands. Two stubby cyan legs with flared cuffs, no toes. No neck, no antenna, no text, no logo.

---

## 3. RINO — the red dino (YOLO)

**Product:** Cute Dinos, red. Press-and-go dinosaur on hidden wheels. Ages 18 months+, no batteries.
**Reference:** `assets/images/redpoly/products/cute-dinos-red.webp`, `cute-dinos-red-scene.jpg`.

### Personality
Forward is a personality. Rino has no brakes, no steering and no plan — because the toy has none either. First to volunteer, last to land. Speaks in caps, invents competitions nobody agreed to, and treats every object as a ramp. Fiercely loyal, secretly terrified of being pressed too gently.

**Voice:** loud, fast, all-caps bursts. **Catchphrases:** "YOLO!" · "Press me!" · "Last one there's a fossil!" · "Send it!" · "I've done the math — no I haven't."

### Locked visual DNA
- **Silhouette:** chunky brachiosaurus — round head, long upright neck, egg-shaped body, short pointed tail. **No arms, no hands, no toes.** Four small wheels peeking out under the body skirt.
- **Body colour:** coral red `#FA5A57`.
- **Plates:** exactly **three rounded half-oval plates on the head/neck** and **four down the back**, shrinking toward the tail — all in periwinkle blue `#4F6FA8`.
- **Face:** one big white eye per side (two total), black pupil, white glint, and a thin black brow arc above it; small dark nostril `#2A2A33`; pink cheek dot `#F9A8C0`. No mouth on the toy (see liberties).
- **Markings:** irregular flank patches in two tones — dark navy-blue blobs `#3F5C8C` and pale cyan streaks `#A8E0EA`. They are paint spots, not scales.
- **Seams:** a fine ring seam at the base of the neck, and a faint seam where body halves meet.
- **Wheels:** four small dark-blue wheels, mostly hidden; they only show as little half-moons under the skirt.
- **Surface:** high-gloss toy plastic with big soft specular streaks and no texture.

### Motion
**Press the back → release → rolls straight forward.** Cannot steer, brake, reverse or climb. Only a crash, a ramp or a slope changes his direction. He can wheelie, skid and be launched. He carries things balanced on his back or nudged with his snout. This is the single best comedy engine in the comic: Rino cannot start himself.

### Prompt block
> RINO: a chunky glossy plastic brachiosaurus toy in coral red `#FA5A57`, upright long neck, round head, egg body, short tail, no arms and no hands. Three rounded half-oval plates on the head and neck and four along the back, all periwinkle blue `#4F6FA8`. One big white eye per side with a black pupil, white glint and thin black brow arc; small dark nostril; pink cheek dot `#F9A8C0`. Irregular dark-navy `#3F5C8C` and pale-cyan `#A8E0EA` paint patches on the flank. Ring seam at the base of the neck. Four small dark-blue wheels partly hidden under the body. High-gloss moulded plastic.

---

## 4. TINO — the teal dino (overthinker)

**Product:** Cute Dinos, teal. Same mould as Rino, different colourway.
**Reference:** `assets/images/redpoly/products/cute-dinos-teal.webp`, `cute-dinos-teal-scene.jpg`.

### Personality
Every plan is a risk assessment. Every silence is a warning. Tino has already imagined the worst outcome, narrated it, and packed a snack for it. Loves the crew so much that he has written down what he'd say at each of their funerals. The only one who notices that the blocks are inanimate — and it scares him more.

**Voice:** quiet, precise, escalating. **Catchphrases:** "What if—" · "I've made a list." · "Statistically, someone is about to do something stupid." · "Say it with me: no." · "I'm not scared. I'm prepared. Loudly."

### Locked visual DNA
- Identical geometry to Rino: three head/neck plates, four back plates, no arms, four hidden wheels, ring neck seam.
- **Body:** bright teal `#02C2C6`.
- **Plates + wheels:** indigo-violet `#5B5A9E` (this is the only dino with purple plates — never swap them to blue).
- **Markings:** lime-yellow `#C9E34A` streaks and spots on the flank.
- **Face:** white eye, black pupil, glint, black brow arc, dark nostril, pink cheek `#F9A8C0`.

### Prompt block
> TINO: the same chunky glossy plastic brachiosaurus toy mould as RINO but in bright teal `#02C2C6`, with indigo-violet `#5B5A9E` plates (three on head and neck, four on the back) and matching indigo wheels. Lime-yellow `#C9E34A` paint streaks and spots on the flank. One big white eye per side with black pupil, white glint and thin black brow arc; dark nostril; pink cheek dot. No arms, no hands, no toes.

---

## 5. GINO — the green dino (nerd)

**Product:** Cute Dinos, green. Same mould again.
**Reference:** `assets/images/redpoly/products/cute-dinos-green.webp`, `cute-dinos-green-scene.jpg`.

### Personality
Corrects the numbers, not the people. Gino speaks in exact counts, angles and probabilities, and is personally offended by rounding. Keeps the crew alive by being unbearable about units. Deeply loves being asked a question, even the wrong one.

**Voice:** flat, factual, faintly disappointed. **Catchphrases:** "Technically—" · "I counted." · "That's not a plan, that's a fridge." · "Sixty-four pieces. Three of us. One of me." · "Correction: we are all going to die. Statistically. Eventually."

### Locked visual DNA
- Same mould. Same plate and wheel layout. Same no-arms rule.
- **Body:** lime green `#C9E600`.
- **Plates + wheels:** blue `#4A6FC4`.
- **Markings:** dark olive `#6E7C1E` patches (no pale streaks — this is the identifying difference from Rino).
- **Face:** white eye, black pupil, glint, black brow arc, dark nostril, pink cheek.

### Prompt block
> GINO: the same chunky glossy plastic brachiosaurus toy mould in lime green `#C9E600`, with blue `#4A6FC4` plates (three on head and neck, four on the back) and matching blue wheels. Dark olive `#6E7C1E` paint patches on the flank. One big white eye per side with black pupil, white glint and thin black brow arc; dark nostril; pink cheek dot. No arms, no hands, no toes.

---

## 6. THE MAGNETIC BLOCKS — inanimate guest stars

**Product:** Magnetic Blocks (magnetic sticks & balls STEM set), 25 / 36 / 42 / 64 PCS, ages 3+.
**Reference:** `assets/images/redpoly/products/magnetic-blocks.png`, `magnetic-blocks-scene.jpg`, box shots.

**Rule one: they are objects.** No eyes, no mouth, no arms, no faces, no speech balloons, no thought bubbles, no walking. They never move on their own. They are never "alive" and never magical. All their acting is physics: clicking together, holding, wobbling, collapsing at the worst possible moment.

### Locked visual DNA
- **Parts:** exactly three part types — straight rods, curved arch rods, and smooth spheres. Rods have faceted octagonal ends with a small visible magnet pin hole; balls are plain and seamless.
- **Sizes:** rods are short and chunky; balls are the same diameter as a rod's width; arches bend about 90°.
- **Palette:** coral red `#F4564F`, sunshine yellow `#F2CE1C`, ocean blue `#0E77A8`, mint `#8AC4B6`, olive-lime `#BCCD43`, magenta `#C2379B`, peach `#F79E7E`.
- **Finish:** glossy plastic, hard white specular streaks, crisp facet highlights, faint seam at each rod tip.
- **Builds shown:** cubes, domes, pyramids, windmills, bridges. Never glued, never fused, never melted.

### Physical comedy kit
Clicking into place (`CLICK`), snapping to Lingo's shell, a tower leaning for one panel then collapsing, a single stray ball rolling into frame at the worst moment, a structure that is *almost* a bridge.

---

## 7. Scale, staging and continuity

| Character | Height vs dino | Moves by | Holds things with |
| --- | --- | --- | --- |
| Lingo | ~0.6× | Waddle | Gear clamps (small items only) |
| Rino / Tino / Gino | 1× | Press-and-go, straight line | Nothing — back, snout, or being tied on |
| Blocks | props | Physics only | — |

**Continuity notes**
- Issues 01–03 spell the red dino **"Reno"** in art and alt text. From this guide on the canon spelling is **RINO**; treat "Reno" as his track nickname until old pages are relettered.
- Poko (Stunt Pet) and CC-01 (Mini Cool Car) remain available legacy cast but are **not** part of the Lingo Squad arc. Do not add them to these pages unless the script calls for them.
- Mecha Rover is a background threat only; it never shares a panel with the blocks in a way that implies the blocks are alive.
- The dinos' wheels and the press-and-go mechanic are canon in dialogue, not just visuals. Every script should use them at least once.

**Pre-flight check before accepting a page**
1. Count plates: 3 + 4 on every dino. Count Lingo's bezel screws: 6. Count Lingo's buttons: 2.
2. Dino colours correct, including plate colour (Tino's plates are violet).
3. No arms, no hands, no toes, no shoes anywhere.
4. Blocks have no faces and are not floating unheld.
5. Lingo's screen face uses only the approved eyes/mouth shapes.
6. Cream margin, 2 × 2 panel grid, black borders, cyan-only tech glow.
7. Nothing on the page implies a different product design than the photo reference.
