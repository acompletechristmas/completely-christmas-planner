## The redesign brief

Right now the site reads a little "AI-generated Christmas": bright twilight-blue background, glowing gold text, lots of card boxes, playful display fonts (Caveat Brush / Pacifico), heavy gradients and snowfall. It's warm but not premium. The goal is to make it feel like something designed by a studio for a UK lifestyle brand — closer to Airbnb, Notion, Toast, or a John Lewis Christmas microsite.

I'll keep every feature you've already built (planner, gifts, pets, teachers, food, days out, entertainment, save, assistant, inspire). This is a **presentation-layer rework**, not a rebuild.

---

## 1. New palette (sophisticated Christmas)

Retire the twilight-blue background and the neon gold glow. New tokens in `src/styles.css`:

- **Cream** `#F7F3EC` — default page background (calm, warm, editorial)
- **Ink** `#1B2A22` — near-black forest, used for text
- **Forest** `#1F3A2E` — primary deep green (buttons, headers)
- **Burgundy** `#6B1F2A` — accent for emphasis, hover
- **Gold** `#B8873A` — restrained metallic, used sparingly (hairlines, small marks — never neon)
- **Stone** `#E8E1D4` — card / divider tint
- **Mist** `#FAFAF7` — elevated surfaces

Colour is used **sparingly**: cream page, ink text, forest for primary actions, burgundy/gold as pinpoints. No radial glow gradients as the default backdrop.

## 2. New typography

- Display: **Fraunces** (modern serif with warmth — Airbnb/editorial feel)
- Body: **Inter Tight** (clean, humane sans, tighter than plain Inter)

Retire Caveat Brush and Pacifico from the primary type scale (they feel handcrafted-cute, not premium). They can survive as an optional flourish on one or two hero words if we want a signature — but headings default to Fraunces.

Hierarchy: hero 56–72px, section titles 32–40px, card titles 20px, body 16–17px, generous line-height (1.55).

## 3. Layout & structure

- **Sticky top nav** with logo left, primary sections centre (Plan, Gifts, Food, Days Out, Inspire), account right. Frosted-cream backdrop on scroll.
- **Homepage** rebuilt around one question — "How can this make your Christmas easier?"
  - Editorial hero: large serif headline, one calm lifestyle image, one primary CTA ("Start planning"), a small "X sleeps to Christmas" line.
  - "Start here" — 3 large tiles (Plan gifts / Plan the food / Plan the fun) with real photography, not 10 icon cards.
  - "Explore" — a refined grid of the remaining tools (Pets, Teachers, Days Out, Entertainment, Save money, Assistant) — 6 tiles max, generous whitespace, one image + short label each.
  - "This week" — seasonal auto-highlight strip (e.g. "Post cards by Wednesday", "Order the turkey").
  - Quiet footer.
- **Interior pages** use the same shell — sticky nav, cream bg, generous margins, one hero image, then content. Fewer boxes: replace repetitive "feature card grids" with a single clean two-column list where appropriate.

## 4. Cards, buttons, motion

- Cards: soft shadow (`0 1px 2px, 0 8px 24px -12px`), 16px radius, 1px stone border, no gradient fills. Hover: lift 2px + shadow deepen. That's it.
- Buttons: solid forest with cream text OR ghost with forest border. Big hit area, 999px radius on primary. Burgundy for a single destructive/emphasis case.
- Motion: fade-up on section reveal, 200ms hover transitions, no pulsing gold glow, no `twinkle`, no `gold-glow`.
- Snowfall: keep, but reduce to ~25 flakes, softer, and add a discreet toggle in the footer to switch it off (persisted in localStorage).

## 5. Imagery

The current AI card images (card-plan.jpg, card-inspire.jpg, etc.) are cute but read as AI. I'll regenerate a **matched set** with a consistent art direction: soft natural light, muted cream/forest/burgundy palette, styled-lifestyle rather than fantasy — closer to a magazine shoot than a Christmas card. One consistent aspect ratio (4:3), one consistent grain/tone.

Set to regenerate: hero, card-plan, card-inspire, card-magic, card-save, card-entertainment, card-food, card-teachers, card-pets, card-reminders, card-assistant (11 images).

## 6. Copy pass

Rewrite the homepage + section intros in a warmer, friend-of-the-family tone:
- "Your calm, sorted, slightly-smug Christmas starts here."
- "Everything you need. Nothing you don't."
- Trim any 3-sentence intros to one.

I won't touch the planner's internal wording in this pass (that's a separate polish).

---

## Files touched

- `src/styles.css` — new palette, new fonts (`Fraunces`, `Inter Tight`), retire glow/twinkle utilities, refactor card/button base styles.
- `src/routes/__root.tsx` — swap font `<link>`, update meta theme-color.
- `src/components/SiteNav.tsx` — **new** sticky top nav used across public pages.
- `src/components/SiteFooter.tsx` — **new** quiet footer with snowfall toggle.
- `src/components/Snowfall.tsx` — honour a `disabled` prop from a small context / localStorage hook.
- `src/routes/index.tsx` — rebuilt homepage (editorial hero, 3 primary tiles, 6-tile explore grid, this-week strip).
- `src/components/PageShell.tsx` — new spacing, remove heavy gradients, use SiteNav.
- Interior public routes (`pets.tsx`, `teachers.index.tsx`, `food.tsx`, `days-out.tsx`, `entertainment.tsx`, `save.tsx`, `inspire.tsx`, `gift-finder.tsx`, `assistant.tsx`, `partners.tsx`, `vip.tsx`) — adopt the new shell + refined card grid. Content copy stays; layout/tone updates.
- `src/routes/_authenticated/planner.tsx` — adopt new palette + nav treatment. Planner sub-pages inherit automatically. I won't restructure planner internals in this pass.
- `src/assets/` — replace the 11 AI card images with the new matched set.

## Out of scope (call out and confirm later)

- Planner internal UX (list/people/timeline pages) — big enough to be its own pass.
- Any DB/schema changes.
- Sign-in flow visual changes beyond the palette inheriting.

## Technical notes

- Fonts loaded via `<link>` in `__root.tsx` head (not `@import` in css — Tailwind v4 Lightning CSS can't fetch remote `@import`s).
- Palette values kept in `oklch()` for consistency with the existing token system, but the visible hex targets above.
- Snowfall toggle: `useSnowfallEnabled()` hook reads `localStorage['snowfall']`, defaults on, `<Snowfall>` returns `null` when disabled.
- Motion via existing `tw-animate-css` + `animate-fade-in` — no new dependency.

---

**Estimated size:** ~15 files edited, 2 new components, 11 images regenerated. This is a real redesign, not a re-skin, but it's contained to presentation code.

Shall I proceed?