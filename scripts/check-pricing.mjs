#!/usr/bin/env node
/**
 * Price consistency check for the REDPOLY storefront.
 *
 * Every place a price is written for a product has to agree: the product page
 * (JSON-LD offer + product:price:amount meta + the ADD TO CART buttons), the
 * catalogue in main.js / checkout.js, the home page shop cards, and the copy in
 * the social share tags (og:description, og:image:alt, twitter:description).
 *
 * It also checks the share cards themselves: each product page's og:image must
 * exist in the repo, and the branded 1200x630 cards live in
 * assets/images/redpoly/social/ with a size check.
 *
 * Run with `npm run check:prices`. Exits non-zero on any mismatch.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8');
const problems = [];
const notes = [];

/**
 * Shipping and reward thresholds are store-wide numbers, not product prices.
 * They are allowed to appear in page copy and share copy without a catalogue
 * entry, and are audited against the same list in main.js / checkout.js.
 */
const STORE_NUMBERS = new Set([30, 120, 2000, 3500]);

const toNumber = (value) => Number(String(value).replace(/[^\d]/g, ''));
const localPath = (url) =>
  url.replace(/^https?:\/\/[^/]+/, '').replace(/^\//, '').split('?')[0];
const rupees = (text) =>
  [...String(text).matchAll(/₹\s?([\d,]+)/g)].map((m) => toNumber(m[1]));
const meta = (html, selector) => {
  const re = new RegExp(`<meta\\s+(?:property|name)="${selector}"\\s+content="([^"]*)"`, 'i');
  const match = html.match(re);
  return match ? match[1] : null;
};

/* ---------------------------------------------------------------- pages -- */

const pageFiles = readdirSync(join(root, 'products')).filter((f) => f.endsWith('.html'));
const pages = new Map();

for (const file of pageFiles) {
  const slug = file.replace(/\.html$/, '');
  const html = read(join('products', file));

  const jsonLd = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
    .map((m) => JSON.parse(m[1]))
    .filter((data) => data['@type'] === 'Product')[0];
  if (!jsonLd) {
    problems.push(`${file}: no Product JSON-LD block`);
    continue;
  }
  const offers = Array.isArray(jsonLd.offers) ? jsonLd.offers : [jsonLd.offers];
  const offerPrices = new Set(offers.map((offer) => toNumber(offer.price)));

  const metaPrice = meta(html, 'product:price:amount');
  if (metaPrice === null) problems.push(`${file}: missing product:price:amount meta`);
  else if (!offerPrices.has(toNumber(metaPrice))) {
    problems.push(`${file}: product:price:amount ₹${metaPrice} is not a JSON-LD offer price (${[...offerPrices].join(', ')})`);
  }

  const buttonPrices = new Set(
    [...html.matchAll(/data-price="(\d+)"/g)].map((m) => Number(m[1])),
  );
  for (const price of buttonPrices) {
    if (!offerPrices.has(price)) {
      problems.push(`${file}: ADD TO CART data-price ₹${price} is not a JSON-LD offer price (${[...offerPrices].join(', ')})`);
    }
  }

  const ogImage = meta(html, 'og:image');
  if (!ogImage) {
    problems.push(`${file}: missing <meta property="og:image">`);
  } else if (!existsSync(join(root, localPath(ogImage)))) {
    problems.push(`${file}: og:image ${ogImage} does not exist in the repo`);
  }

  pages.set(slug, {
    file,
    html,
    prices: new Set([...offerPrices, ...buttonPrices]),
    ogImage,
    textPrices: new Set(rupees(html)),
  });
}

/* ------------------------------------------------------------ catalogue -- */

const parseCatalogue = (rel, pattern) => {
  const source = read(rel);
  const entries = new Map();
  for (const match of source.matchAll(pattern)) {
    entries.set(match[1], { price: Number(match[2]), href: match[3] });
  }
  if (!entries.size) problems.push(`${rel}: could not read the catalogue`);
  return entries;
};

const storefront = parseCatalogue('main.js', /'([^']+)':\s*\{\s*price:\s*(\d+),\s*href:\s*'([^']+)'/g);
const checkout = parseCatalogue('checkout.js', /'([^']+)':\s*\{\s*price:\s*(\d+),\s*image:/g);

for (const [name, entry] of storefront) {
  const other = checkout.get(name);
  if (!other) {
    problems.push(`checkout.js: catalogue is missing "${name}" (present in main.js)`);
    continue;
  }
  if (other.price !== entry.price) {
    problems.push(`"${name}": main.js says ₹${entry.price} but checkout.js says ₹${other.price}`);
  }
  const slug = entry.href.replace(/^\//, '').split('?')[0];
  const page = pages.get(slug);
  if (!page) {
    problems.push(`"${name}": catalogue href ${entry.href} has no products/${slug}.html`);
    continue;
  }
  if (!page.prices.has(entry.price)) {
    problems.push(`"${name}": catalogue price ₹${entry.price} is not on products/${slug}.html (${[...page.prices].join(', ')})`);
  }
}
for (const name of checkout.keys()) {
  if (!storefront.has(name)) problems.push(`main.js: catalogue is missing "${name}" (present in checkout.js)`);
}

/* --------------------------------------------------------- home page ----- */

const indexHtml = read('index.html');
const cards = [...indexHtml.matchAll(/data-name="([^"]+)"\s+data-price="(\d+)"/g)];
if (!cards.length) problems.push('index.html: no shop card data-price attributes found');
for (const [, name, price] of cards) {
  const entry = storefront.get(name);
  if (!entry) {
    problems.push(`index.html: card "${name}" is not in the main.js catalogue`);
    continue;
  }
  if (entry.price !== Number(price)) {
    problems.push(`index.html: card "${name}" says ₹${price} but the catalogue says ₹${entry.price}`);
  }
}
const cardedSlugs = new Set(
  cards.map(([, name]) => {
    const href = storefront.get(name)?.href ?? '';
    return href.replace(/^\//, '').split('?')[0];
  }),
);
for (const slug of pages.keys()) {
  if (!cardedSlugs.has(slug)) notes.push(`index.html has no shop card linking to /${slug}`);
}

// The price printed on each card must match the button next to it.
for (const chunk of indexHtml.split('<article class="shop-card"').slice(1)) {
  const card = chunk.split('</article>')[0];
  const name = card.match(/data-name="([^"]+)"/)?.[1];
  const buttonPrice = card.match(/data-price="(\d+)"/)?.[1];
  const printed = card.match(/shop-card__price"><strong>₹([\d,]+)<\/strong>/)?.[1];
  if (!name || !buttonPrice) continue;
  if (printed && toNumber(printed) !== Number(buttonPrice)) {
    problems.push(`index.html: "${name}" shows ₹${printed} but adds to the cart at ₹${buttonPrice}`);
  }
}

/* ------------------------------------------------------- share metadata -- */

for (const [slug, page] of pages) {
  const shareFields = [
    ['og:description', meta(page.html, 'og:description')],
    ['og:image:alt', meta(page.html, 'og:image:alt')],
    ['twitter:description', meta(page.html, 'twitter:description')],
  ];
  for (const [field, value] of shareFields) {
    if (!value) continue;
    for (const price of rupees(value)) {
      if (STORE_NUMBERS.has(price)) continue;
      if (!page.textPrices.has(price)) {
        problems.push(`products/${page.file}: ${field} mentions ₹${price}, which does not appear anywhere on that page`);
      }
    }
  }
}

/* ---------------------------------------------------------- share cards -- */

const socialDir = 'assets/images/redpoly/social';
const socialCards = existsSync(join(root, socialDir))
  ? readdirSync(join(root, socialDir)).filter((f) => f.endsWith('.png'))
  : [];

const pngSize = (rel) => {
  const buffer = readFileSync(join(root, rel));
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};

const usedCards = new Set();
for (const page of pages.values()) {
  if (!page.ogImage) continue;
  const file = localPath(page.ogImage);
  if (file.startsWith(socialDir)) usedCards.add(file);
  else notes.push(`products/${page.file}: share image is a product photo (${file}), not a branded 1200x630 card`);
}
for (const file of socialCards) {
  const rel = `${socialDir}/${file}`;
  const { width, height } = pngSize(rel);
  if (width !== 1200 || height !== 630) {
    problems.push(`${rel}: share card is ${width}x${height}, expected 1200x630`);
  }
  if (!usedCards.has(rel)) notes.push(`${rel}: share card is not referenced by any og:image`);
}

/* ------------------------------------------------------------ checkout -- */

for (const rel of ['main.js', 'checkout.js']) {
  const source = read(rel);
  const freeShipping = source.match(/FREE_SHIPPING(?:_THRESHOLD)?\s*[:=]\s*(\d+)/)?.[1];
  const freeGift = source.match(/FREE_GIFT(?:_THRESHOLD)?\s*[:=]\s*(\d+)/)?.[1];
  if (freeShipping && Number(freeShipping) !== 2000) {
    problems.push(`${rel}: free shipping threshold ₹${freeShipping} does not match ₹2,000`);
  }
  if (freeGift && Number(freeGift) !== 3500) {
    problems.push(`${rel}: free gift threshold ₹${freeGift} does not match ₹3,500`);
  }
}

/* ---------------------------------------------------------------- report -- */

const money = (amount) => `₹${amount.toLocaleString('en-IN')}`;
const width = Math.max(...[...storefront.keys()].map((name) => name.length), 7);
console.log('REDPOLY price check\n');
console.log('SKU'.padEnd(width + 2) + 'PRICE'.padStart(8) + '  PAGE');
for (const [name, entry] of storefront) {
  console.log(name.padEnd(width + 2) + money(entry.price).padStart(8) + '  ' + entry.href);
}

console.log(`\n${pages.size} product pages · ${storefront.size} SKUs · ${socialCards.length} share cards checked`);

if (notes.length) {
  console.log('\nNotes:');
  for (const note of notes) console.log(`  · ${note}`);
}

if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.log(`  ✗ ${problem}`);
  process.exitCode = 1;
} else {
  console.log('\n✓ All prices agree across pages, catalogue, home page cards and share copy.');
}
