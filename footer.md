# Footer link rules

Every footer on the site carries the same six links, in the same order, with the same wording. The help page at `/help` is the one place those six things live, so the first link always points at the page itself and the other five jump to its sections.

## The canonical set

```
HELP + POLICIES   /help
SHIPPING          /help#shipping
RETURNS           /help#returns
CANCELLATION      /help#cancellation
PRIVACY           /help#privacy
TERMS             /help#terms
```

Rules:

- The first link reads **HELP + POLICIES**, not "Help + Contact". The help page also holds the contact card and the business details, so one label covers it.
- The fourth link reads **CANCELLATION** in full. Do not shorten it to "CANCEL" to make a row fit; shorten the type instead.
- Keep the order. Someone who has learnt the order on one page should not have to learn it again on the next.
- The `aria-label` on the wrapping `nav` is `Help and policies` everywhere.

## Where it appears

| Page | Class on the `nav` |
| --- | --- |
| `index.html` | `foot__links` |
| `products/*.html` (7 pages) | `char-footer__links` |
| `checkout.html`, `thank-you.html` | `checkout-footer__links` |
| `help.html` | none (bare `nav` inside `.help-footer`) |
| `stories/index.html` | no policy nav; it carries the brand line and GSTIN only |

The five sections on `/help` are `#contact` (the "HELP + POLICIES" target), `#shipping`, `#returns`, `#cancellation`, `#privacy`, `#terms`. The help page's own sticky chip row lists the five policy sections and sits directly above them.

## Changing a label

Edit every footer in the table above in the same commit. The classes differ per page, so a change to one page will not carry to the others on its own.
