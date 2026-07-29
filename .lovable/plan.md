
# Match homepage to approved mockup

Fix the 9 annotated differences on `src/routes/index.tsx` (plus one CSS + one hero-image swap). Nothing else on the site changes. No functionality changes.

## The 9 fixes

**1. Logo — flowing gold script for "Christmas"**
`SiteNav`: replace the italic serif "Christmas" with a proper script face (Great Vibes, loaded via `<link>` in `__root.tsx`) painted with the existing gold gradient. "A Complete" stays small serif above it. Add the "PLAN IT. ENJOY IT. MAKE IT MAGICAL." micro-tagline under it on the homepage only (matches the desktop mock).

**2. Hero image — snowy village, tree, street lamp**
The current `hero-room.jpg` is a fireplace close-up. Generate a new premium image matching the mock: night sky, illuminated Christmas tree centre-right, gothic snowy village + church spire behind, wrought-iron street lamp with red bow far right, presents at the base, deep midnight-blue palette. Save as `src/assets/hero-village.jpg` and swap the import.

**3. "Christmas" headline — same script font**
Replace the current italic serif treatment with Great Vibes at ~1.8× the "Plan your perfect" size, painted with the gold gradient + soft glow (as in the mock).

**4. Decorative divider — gold lines + centred snowflake**
Already close; tighten to two clean thin gold hairlines with a small gold snowflake glyph centred, matching the mock's proportions.

**5. Countdown — luxury gift tag**
Rebuild `CountdownGiftTag`:
- Shaped tag silhouette using an SVG path (scalloped/rounded rectangle with the punched hole cutout, not a plain rounded div)
- Parchment texture (subtle noise + warm cream gradient)
- Satin ribbon threaded through the eyelet (SVG with highlight gradient, not a floating bow)
- Small holly sprig beside "Christmas is coming" (matches mock)
- Small wax seal (deep red circle with embossed heart) replacing the plain heart divider
- Embossed inner border + soft drop shadow
- Deep burgundy numerals in serif (already correct)

**6. Button — softer luxury glow**
Reduce the gold-fill intensity to a subtle brushed gradient with a thin gold hairline border and a soft outer glow only (no hard shine). Keep label + arrow.

**7. Mobile: planner section higher on first screen**
Currently the cream section is off-screen on 390px. Trim hero to `85svh` on mobile (keep 100svh desktop) and reduce hero bottom padding so the curved cream edge + "YOUR COMPLETE CHRISTMAS PLANNER" eyebrow are visible above the fold. Cards can still be tapped-to below.

**8. Planner section heading — gold leaves + premium type**
Replace the current green sprigs with gold laurel-leaf SVGs flanking the eyebrow. Eyebrow set in serif small-caps burgundy. Below it: thin gold hairline — small red heart — thin gold hairline (as in mock).

**9. Planner card icons — premium muted outline icons**
Redraw the four SVG icons (gift, tree, snowflake, heart) at heavier stroke weight with more detail (gift = ribbon crossing + bow loops, tree = tiered branches with a star, snowflake = 6 arms with barbs, heart = single elegant stroke). Use muted burgundy / forest / navy / burgundy tints per the mock.

## Files touched

- `src/routes/index.tsx` — hero image swap, headline font, divider, countdown rebuild, button softening, mobile heights, planner heading, four icon SVGs
- `src/components/SiteNav.tsx` — logo script font + optional homepage tagline
- `src/routes/__root.tsx` — add Great Vibes `<link>` preconnect + stylesheet
- `src/styles.css` — add `--font-script` token + `.script-gold` utility (gold gradient + soft glow)
- `src/assets/hero-village.jpg` — new generated image

## Out of scope

Bottom mobile tab bar, top nav sub-links (PLANNING HQ / PEOPLE & PRESENTS / etc. shown in the desktop mock) — flagging these as separate follow-ups because they touch global navigation and other routes. Confirm if you want them included in this pass.

## Verification before I finish

Screenshot the homepage at 390×844 (mobile) and 1440×900 (desktop) with Playwright and diff against the mockup for: logo script, headline script, tag shape, ribbon eyelet, wax seal, planner section visible above fold on mobile, four icon styles. Iterate only on the specific gap, not the whole page.
