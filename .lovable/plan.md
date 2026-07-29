## Rebuild `/planner/people` to match the mockup exactly

Replace the current People & Presents index with the reference visual. No other pages change. Instructional overlay from the mockup is not included.

### Scope
- File: `src/routes/_authenticated/planner.people.index.tsx` (full rewrite of the layout).
- Reuse existing hooks: `usePeople`, `usePlannerList<GiftRow>("gifts")`.
- No schema changes. No new routes. Existing `/planner/people/$personId` link stays.

### Layout (top → bottom)

1. **Header block**
   - Eyebrow icon + "PEOPLE & PRESENTS" in gold small-caps.
   - Serif "My People & Presents" title.
   - Subline: "Everyone on your list — with every idea, present and price in one place."
   - Right side: 4 rounded square action buttons in this order:
     - **Add person** (filled gold, active state)
     - **Add present** (dark navy, gold outline)
     - **Find gift ideas** (dark navy, gold outline)
     - **Find an event** (dark navy, gold outline)
   - Icons: user-plus, gift, sparkles, calendar.

2. **Summary statistics strip** (single dark card, 6 columns)
   - Presents Added (gift icon) — count + green mini bar + %
   - Bought (bag icon) — count + bar + %
   - Wrapped (bow icon) — count + bar + %
   - Sent / Given (plane icon) — count + bar + %
   - Spent (£ icon) — amount + bar + %
   - % Complete — circular gold/green progress ring
   - Progress bars tinted gold→green.

3. **Filter tabs** (pill row)
   - All people (n) [active, gold fill]
   - To buy (n) [red count]
   - To wrap (n) [orange count]
   - To send (n) [blue count]
   - All done (n) [green count]
   - Client-side filter over the person list.

4. **Person cards** (stacked, full-width rows)
   - Left: gold-ringed circle with initial.
   - Name (serif) + subline "Relationship · £X budget" or "Relationship".
   - 4 stat pips in a row: Added, Bought, Wrapped, Sent/Given — each with icon, count, % bar underneath.
   - Right block: `£X SPENT` or `£X OF £Y SPENT`, plus a status pill:
     - "To buy" (red pill) — nothing bought yet
     - "To wrap" (orange pill) — bought but not all wrapped
     - "All done!" (green pill) — everything sent/given
     - none when partial-in-progress? Show chevron.
   - Right chevron on incomplete cards.
   - Card state visuals (match existing bible + mockup):
     - Not started → cream card
     - Bought → cream card, "To wrap" tag
     - Wrapped → cream + gold satin ribbon corner
     - All done → gold card + red bow + wax seal (green "All done!" pill)
   - "FOR CHRISTMAS" tiny red corner banner on the fully-completed card (top-left ribbon flag) — as shown on Lauren in the mockup.

5. **Bottom summary strip** (4 coloured tiles inside a dark card)
   - `<green gift>` `N ALL DONE — Enjoy the magic!`
   - `<red bag>` `N TO BUY — Time to shop!`
   - `<orange bow>` `N TO WRAP — Almost there!`
   - `<blue plane>` `N TO SEND — Don't forget!`

### Data logic (per person, current year gifts where `is_chosen` true)
- added = presents.length
- bought = ordered count
- wrapped = wrapped count
- sentGiven = (sent || given) count
- spent = sum(price where ordered)
- budget = person.gift_budget
- state: allDone if added>0 && sentGiven===added; wrapped if bought===added && wrapped===added; bought if bought===added; else in-progress/none.
- Global stats aggregate across all people.

### Styling
- Follow DESIGN_BIBLE: Midnight bg, Snow White cards, Champagne Gold accents, Rich Red only for bow/seal/ribbon flag, Forest Green for "done" states.
- Serif (Fraunces) for names/title, Inter Tight for UI.
- Rounded-2xl cards, gold hairline borders, soft shadows.
- Mobile-first: stats strip wraps to 3×2, action buttons wrap to 2×2, person card pips wrap under name.

### Wiring
- **Add person** → opens existing inline add form (kept, moved into a compact modal-style panel that appears under header when clicked).
- **Add present** → navigate to `/planner/gifts`.
- **Find gift ideas** → navigate to `/gift-finder`.
- **Find an event** → navigate to `/planner/outings`.
- Person card click → `/planner/people/$personId` (unchanged).

### Out of scope
- No changes to the person detail page, DB, or other planner routes.
- Instructional annotations from the reference image are not rendered.
