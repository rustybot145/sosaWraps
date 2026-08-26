# Content still needed

## 1. More photos for the work grid
The grid holds four cards. Two are his real Instagram photo posts:

- **BMW M3 Competition** - "2023 M3 Competition 20% Ceramic Sides and Back"
- **Chevrolet Camaro** - "Full Car Wrap on Camaro in Satin black"

Those are the **only two non-reel posts on the profile**. Everything else there
is a reel, and every reel cover has burned-in text ("HOW IT CAME IN", "POV HOOD
WRAP"), so none of them work as a card. The other two cards are frames pulled
from the clips in `_originals` - the C8 Corvette and the Camry.

**To add more:** each of those two posts is a carousel with several photos
behind the cover, and only the cover is reachable from outside Instagram. Open
them, save the rest, drop them in `images/work/`, and add a line each to `WORK`
at the top of `app.js`. Same for anything in his camera roll.

Still missing entirely: a **chrome delete** and a **headlight tint** shot. Both
have service cards describing them and nothing showing them.

## 2. The logo
`images/logo.png` came from a 127×88 screenshot. It is displayed small
everywhere for that reason and will look soft on a retina phone. Ask for the
original file — PNG with real transparency, or SVG if it exists.

## 3. Things to confirm with Sosa before launch

- [ ] **Phone number** for the quote form (`SHOP_PHONE`, `app.js` line 6), and
      the **email address** quotes should land at (`BOOKING_TO`).
- [ ] **Virginia tint law** — the FAQ states 50% front sides, 35% rear sides and
      back glass, AS-1 strip on the windshield. That's the statute as written,
      but he should confirm it's how he quotes it before it's on his site.
- [ ] **The hero line.** "Change the color. Keep the paint." is easy to swap.
- [ ] **Business / storefront branding.** The feed shows a Shebrews Coffee Co.
      install, which isn't in his bio and isn't on the site. If he wants
      commercial work, it needs a service card of its own.
- [ ] **Pricing.** Nothing on the site names a number, on purpose.
- [ ] **Hours, address, service area.** The site says Harrisonburg and nothing
      more. A Google Business Profile link would earn its place in the footer.
- [ ] **His name.** Yojander Sosa is public on the feed but doesn't appear on
      the site.
