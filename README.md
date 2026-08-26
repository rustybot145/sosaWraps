# SosaWraps — website

Static site. No build step, no dependencies.

    index.html      the site
    book.html       quote form
    styles.css      one stylesheet, both pages
    app.js          one script, both pages
    images/         logo, favicon, and images/work for build photos
    video/          hero.mp4 — not referenced by the page any more, see below
    api/book.js     quote request -> email (Vercel serverless)
    _originals/     the untouched files that were dropped in — nothing serves from here

## Run it

    cd sosawraps && python3 -m http.server 8099

Then http://localhost:8099

## Where the content came from

Scraped from [@sosawraps](https://www.instagram.com/sosawraps/) — the bio
(vinyl wraps, window tints, chrome deletes, headlight/taillight tinting,
Harrisonburg VA, 2+ years) and the reel captions. Nothing on the page claims a
number that didn't come from him.

## Layout

The hero follows the same format as Vivid Customs: full `100svh`, the column
centred, one 1.5rem gap between every element (label, headline, sub, buttons)
rather than four different margins, and a two-axis scrim - dark down the left
where the type sits, clear through the middle where the car is, dark at both
ends. No stats row. Buttons are pills at Vivid's sizing (`.85rem 1.75rem`,
`.9375rem`, `999px`), the primary in his red rather than white - swap
`--red` for `--txt` on `.btn` if you want Vivid's white pill exactly.

Type stays Schibsted Grotesk and Karla.

## Design — the nebula

Behind everything, fixed, on every page: red in black, churning. `.neb` is
six clouds and a drifting dust field. No lines anywhere.

- Each cloud's **wrapper drifts** on one clock (22-44s) while the **shape
  inside it turns** on another (37-73s). Because those don't divide into each
  other the masses shear past one another instead of just fading in and out,
  and that shear is what reads as slow fluid rather than a gradient.
- Three clouds are red on `mix-blend-mode: screen`, so overlaps glow. One is
  near-black on `multiply` and carves the black back in - without it the red
  flattens into a wash. The fifth is a chrome breath, for the logo.
- **Dust** is seeded in `app.js`, not tiled, so the field never reads as a
  pattern. Count follows the viewport: ~215 on a desktop, ~60 on a phone. The
  field is 200% tall and slides one screen up over 44s, so the loop point
  never lands on a visible edge.
- Grain is an SVG `feTurbulence`, non-directional, so nothing in the layer has
  an edge or a direction.

Transforms and opacity only. No canvas, no images, no library. It stops dead
under `prefers-reduced-motion` (the dust isn't even seeded), and phones get
smaller blur radii and one fewer cloud.

Page mean sits around RGB 24/15/17 - mainly black, with the red arriving and
leaving rather than sitting there.

The hero is his C8 Corvette, the finished-car part of the clip only, muted and
looped under an angled scrim.

The logo's chrome is the palette. `--chrome` is one gradient with peaks every
~20%, used on the two headlines that carry the page and slowly rolled across
them. Schibsted Grotesk for headings, Karla for body, sentence case throughout.

## The work grid

Four 9:16 photo cards, two to a row, car name on top and finish underneath.
`WORK` at the top of `app.js` drives it:

    { src: "images/work/m3-tint.jpg", title: "BMW M3 Competition",
      sub: "20% ceramic - sides & back" }

Two came off his Instagram photo posts (the M3 and the Camaro - the only two
non-reel posts on the profile), two are frames from the clips in `_originals`.
No reel covers: those all carry burned-in text like "HOW IT CAME IN", which is
why they don't belong on a card.

An entry with `video:` **plays in the card**, muted and looped. Nothing loads
or decodes until the tile scrolls into view and it pauses again when it leaves,
so four videos on one page cost about as much as one - `rollWhenSeen` in
`app.js` does that for the hero and the tiles alike. Under
`prefers-reduced-motion` the tile falls back to its still.

The still doubles as the video's poster, so cut it from the clip's first frame
and there's no jump on load.

Empty the array and the section draws `SLOTS` empty frames, so it never renders
a hole.

## Mobile

Same shape as Slick Stars, Royalty Lighting and Vivid Customs:

- Every `:hover` rule is inside `@media (hover: hover) and (pointer: fine)`. On
  a phone a bare `:hover` costs a tap — Safari spends the first one applying
  the hover state and only acts on the second. There are no unguarded ones;
  `node _check` style CSSOM walks are the way to confirm that if it changes.
- `scroll-margin-top` on every section so anchor jumps clear the fixed nav.
- `.nav__links` hidden under 900px, logo drops to 26px under 520px, and the
  nav button keeps a 44px tap target.
- Hero CTAs go full width and stack under 520px, and so do the closer and
  quote-form buttons.
- Process steps put the number beside the step instead of above it.
- Work frames stay two-up at every width — that is the format.
- Footer stacks, and its links get a 44px hit area.

## The work grid

`WORK` at the top of `app.js` drives it — four 9:16 frames, two to a row. Each
entry takes a still and optionally a clip that opens in the lightbox:

    { src: "images/work/c8-side.jpg", title: "Satin Black", sub: "C8 Corvette — full side",
      video: "video/work/c8-satin.mp4" }

Everything in there now is cut out of the two clips that were dropped in the
folder — the satin black C8 and the Velvet Gloss Red Camry. Two cars, two
frames each. Shoot or crop new stills 9:16 (720×1280 or 1080×1920) so they fill
the frame, drop them in `images/work/` and `video/work/`, and add a line.

Empty the array and the section draws `SLOTS` empty frames instead, so it never
renders a hole.

## Before it goes live

1. **A real logo file.** `images/logo.png` is the screenshot that was dropped
   in, 127×88, with the dark backdrop flood-filled out from the borders so the
   chrome inside the letters survived. It is used nowhere larger than 46px tall
   for that reason. Ask Sosa for the original PNG or SVG and drop it in over
   both `logo.png` and `logo@2x.png`.
2. **Photos and clips** for the four work slots. See CONTENT-TODO.
3. **A chrome delete and a tint photo** — both have service cards and nothing
   showing them. See CONTENT-TODO.
4. **Phone number.** `app.js` line 6, `SHOP_PHONE`. Left empty, the quote form
   copies the request to the clipboard and opens the Instagram DM instead. Set
   it to `+1XXXXXXXXXX` and it texts the shop directly.
5. **`video/hero.mp4`** is a 14s cut of the Velvet Gloss Red reel, left over
   from the video hero that got removed. Nothing links to it. Either delete it,
   or add it to `WORK` as a clip on one of the slots.
6. **`/api/book`.** The form POSTs there first and falls back if it 404s, so
   the site works fine deployed as plain static files. To turn the email on,
   set **`RESEND_API_KEY`** and **`BOOKING_TO`** in the Vercel project's
   environment variables (Settings → Environment Variables). **Never put the
   key in a file in this repo.** `BOOKING_FROM` is an optional override.

   Until a domain is verified in Resend, `onboarding@resend.dev` only delivers
   to the Resend account's own address.

   Test it without sending anything: `node api/book.test.js`
