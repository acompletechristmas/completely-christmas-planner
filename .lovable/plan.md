# My Christmas Watchlist — human-curated catalogue and recommendation rebuild

Plan only. Nothing built. The actual film list stays yours to curate; this plan defines the shape it will be poured into and the engine that reads it.

## 1. What the current catalogue actually is

`src/lib/watchlist/catalogue.ts` — 117 entries, one flat array of `WatchlistIdea`:

```
key, title, year?, type, blurb, audiences[], moods[], ageBand, timings[], minutes?, tags[]
```

- `audiences` is usually one of three shared presets (`ALL`, `FAMILY_MIX`, `ADULT_ONLY`, `ADULT_CHILD`), so most titles carry identical audience data.
- `moods` is a flat unordered list; no notion of "this is a *defining* romance" vs "has a romantic thread".
- `ageBand` (`all | 5+ | 8+ | 12+ | adult`) is internally invented guidance, not an official rating — fine, but it is doing double duty as both suitability and adultness.
- `tags[]` is free text used only for display.
- No Christmas-relevance concept: Bridget Jones's Diary sits beside The Holiday with the same standing.
- Data quality issues already present: duplicate titles under different keys (Klaus/`kringle_kringle`, It's a Wonderful Life, Miracle on 34th Street, Noelle each appear twice), and several requested titles are missing entirely (Love Hard, Last Christmas is present, Daddy's Home 2, Violent Night, Bad Santa is present, Spirited, Arthur Christmas present, The Noel Diary, Four Christmases, Just Friends, Serendipity, Something from Tiffany's, Falling for Christmas, A Castle for Christmas, The Night Before, A Very Harold & Kumar Christmas, The Christmas Chronicles).

## 2. How scoring currently works

`src/lib/watchlist/recommend.ts`:

1. Filter by age band (youngest household member, or the audience the user picked).
2. Filter to titles listing at least one selected audience.
3. Score = (2 per matching audience) + (~1 per matching mood) + 1.5 timing match + small celebration-style and "newer than 2015" nudges.
4. Sort, then diversify: max 3 per primary mood, max 5 per type, cap 24.
5. `surpriseWatchlistItem` returns the 5th item.

## 3. Why The Holiday and Love Actually get buried

- **Tag counting, not judgement.** A weak TV movie tagged `romantic, cosy, feel_good` scores exactly like The Holiday tagged `romantic, cosy, feel_good`. There is no way to say "this one matters more".
- **Shared audience presets flatten the audience signal**, so audience score is near-identical across a whole band of titles.
- **Alphabetical tie-break** decides real rankings once scores tie, which they constantly do.
- **The diversity cap punishes the best titles**: only 3 items may share a primary mood, so the fourth great romance is dropped regardless of quality — and `moods[0]` ordering is arbitrary in the data.
- **A tiny post-2015 bump** systematically lifts recent streaming filler above genuine classics.
- **No Christmas-relevance separation**, so a film with one Christmas scene competes on equal footing.

## 4. Reused vs new

Reused unchanged: `key`, `title`, `year`, `type`, `blurb`, `minutes`, timing vocabulary, the `Audience` idea, the saved `watchlist_items` table, `watchlistItemToSavedFields`, `useWatchlist`, `AddWatchItem`, `WatchRow`, `WatchlistFilters`.

Changed/added on the catalogue entry: contextual strength map, Christmas relevance, expanded audience vocabulary, collections, suitability floor, optional editorial note.

**No database migration.** The catalogue is static TypeScript reference data; saved items already have their own table and only store `title`, `content_type`, `release_year`, `moods`, `timing`, `suggestion_key`. Existing saved rows stay valid — `suggestion_key` continues to be the exclusion key.

## 5. Proposed shape for one master title

```ts
export interface CatalogueTitle {
  key: string;                    // stable, never reused
  title: string;
  year?: number;
  type: ContentType;              // unchanged
  blurb: string;                  // original one-liner
  minutes?: number;

  christmas: ChristmasRelevance;  // "core" | "strong_setting" | "christmas_adjacent"

  /** Hard floor. Suitability only — never a quality signal, never an official rating. */
  suitability: AgeBand;           // unchanged vocabulary: all | 5+ | 8+ | 12+ | adult

  /**
   * The whole of human curation lives here. Any context key (genre, mood,
   * audience or collection) may be given a strength. Absent = not recommended
   * for that context. "unsuitable" hard-blocks it.
   */
  strength: Partial<Record<ContextKey, Strength>>;

  /** Occasions this suits: christmas_eve, christmas_day, december... (unchanged vocabulary) */
  timings?: Timing[];

  /** Optional human note shown as the "why" line, overrides the generated one. */
  note?: string;
}

export type Strength = "essential" | "strong" | "extra" | "unsuitable";
```

Example rows (illustrative only — you curate the real ones):

```ts
{ key: "the_holiday", title: "The Holiday", year: 2006, type: "film",
  christmas: "core", suitability: "12+",
  strength: { romance: "essential", couple: "essential", cosy: "essential",
              adults: "strong", comedy: "extra", modern_classic: "strong",
              christmas_romance: "essential" },
  timings: ["december", "christmas_eve"] }

{ key: "daddys_home_2", title: "Daddy's Home 2", year: 2017, type: "film",
  christmas: "core", suitability: "12+",
  strength: { comedy: "strong", family: "strong", teenagers: "strong",
              adult_children: "strong", multigenerational: "strong",
              young_children: "unsuitable" } }

{ key: "bad_santa", title: "Bad Santa", year: 2003, type: "film",
  christmas: "core", suitability: "adult",
  strength: { adult_christmas: "essential", dark_comedy: "essential",
              alternative: "strong", young_children: "unsuitable",
              older_children: "unsuitable", teenagers: "unsuitable" } }

{ key: "bridget_jones_diary", title: "Bridget Jones's Diary", year: 2001, type: "film",
  christmas: "christmas_adjacent", suitability: "adult",
  strength: { romance: "strong", comedy: "strong", british: "strong",
              nostalgic: "extra", adults: "strong", secret_christmas: "essential" } }
```

One record per title. Crossovers are extra keys in `strength`, never extra rows.

## 6. Controlled vocabularies

**Audience** (`AudienceKey`): `young_children`, `older_children`, `teenagers`, `young_adults`, `adult_children`, `adults`, `couple`, `adults_no_children`, `mixed_ages`, `multigenerational`, `alone`.

**Genre / mood / feel** (`MoodKey`): `romance`, `comedy`, `cosy`, `magical`, `nostalgic`, `emotional`, `feel_good`, `action`, `dark_comedy`, `musical`, `animation`, `classic`, `modern`, `british`, `alternative`, `family`, `adult_christmas`. Deliberately short; extendable by adding one line.

**Christmas relevance**: `core`, `strong_setting`, `christmas_adjacent`.

**Strength**: `essential`, `strong`, `extra`, `unsuitable`.

**Collections** (`CollectionKey`, curated, not genres): `secret_christmas`, `christmas_eve_favourites`, `christmas_day_afternoon`, `kids_in_bed`, `with_teenagers`, `with_grown_up_children`, `everyone_agrees`, `cosy_night`, `christmas_romance`, `christmas_classics`, `modern_classic`. Each is defined once in a small `collections.ts` with a title, subtitle and the context key it filters by — the films themselves are pulled from the same master catalogue.

`ContextKey = AudienceKey | MoodKey | CollectionKey` — a single flat namespace so a curator writes `strength: { romance: "essential" }` without thinking about which bucket it is.

## 7. How curation interacts with the engine

Scoring becomes: **suitability gate → curated strength → context multipliers → gentle diversification**.

1. **Gate (hard, non-negotiable).** Drop the title if `suitability` exceeds the effective age band, or if any selected context maps to `"unsuitable"`. Family-with-young-children never sees Bad Santa or Violent Night.
2. **Curated base score.** For each context the user selected (audience + mood + occasion + collection), take its strength: `essential = 100`, `strong = 60`, `extra = 25`, absent = 0. Sum across matched contexts. This dominates by an order of magnitude — no amount of generic metadata can out-score one `essential`.
3. **Christmas relevance multiplier.** `core ×1.0`, `strong_setting ×0.85`, `christmas_adjacent ×0.55` — unless the user explicitly chose the `secret_christmas` collection, where the multiplier is inverted so adjacent titles lead.
4. **Household fit.** Small additive bonus (max ~15) when the title is strong for the audiences inferred from People/planner settings, so an unrefined visit still feels personal.
5. **Occasion fit.** Small additive bonus (~10) for a matching timing.
6. **Diversification, softened.** Replace the hard "max 3 per mood" with: never drop an `essential` for the selected context, and only cap `extra`-strength titles. Guarantees The Holiday, Love Actually, Last Christmas and Love Hard all appear together for a romance request.
7. **Deterministic tie-break** on curated strength count, then `christmas`, then title.

No AI, no network, no randomness, zero per-user cost. "Surprise me" becomes a deterministic pick seeded from the current refinements rather than "index 4".

## 8. Secret Christmas Films without a second catalogue

`secret_christmas` is a `CollectionKey` used exactly like a mood: a title opts in via `strength: { secret_christmas: "essential" }`. Selecting it in Help me choose sets the collection context and inverts the relevance multiplier so `christmas_adjacent` titles rise. Bridget Jones's Diary remains one record that is simultaneously romance, comedy, British, adults and a Secret Christmas Film.

## 9. Help me choose — current state and change

Today `ChooseForMe.tsx` shows three long pill rows (9 audiences, 15 moods, 7 timings) plus Surprise me, and its results panel. It ignores People/settings unless the user picks nothing.

Proposed refinement (same component, same layout language, no questionnaire):

- **Who's watching?** — short row: `Everyone`, `Adults`, `Kids`, `Couple`, `Just me`, plus a "Choose people" affordance that maps selected People's age ranges onto audience keys. Defaults pre-selected from the household so the page is already useful on arrival.
- **In the mood for?** — one row of 7: Funny, Romantic, Cosy, Magical, Action, Nostalgic, Something different.
- **When?** — collapsed by default; keeps the existing timing vocabulary.
- **Collections strip** — horizontally scrollable curated cards (Secret Christmas Films, Christmas Eve favourites, For when the kids have gone to bed…), each setting one collection context.
- Result cards gain a small "Essential Christmas romance" / "Secret Christmas film" badge driven by curated strength, and the `note` field when present.
- "Add to my watchlist" behaviour is untouched.

## 10. Saved data compatibility

`watchlist_items` is unchanged. `watchlistItemToSavedFields` keeps writing `title`, `content_type`, `release_year`, `suggestion_key`, `source: "recommendation"`, `moods`, `timing` — the `moods` written are the mood-namespace keys the title is strongest for, so existing saved rows with old mood keys still render (labels fall back to the raw key, as today). Old `suggestion_key` values continue to exclude re-suggestion for any title whose key we keep; keys are preserved wherever a title survives curation.

## 11. Expected behaviour (pilot titles)

| Request | Should lead with |
| --- | --- |
| couple + romance | The Holiday, Love Actually, Last Christmas, Love Hard |
| family, young children + magical | The Polar Express, Arthur Christmas — never Bad Santa/Violent Night |
| family with teenagers + comedy | Home Alone, Elf, Daddy's Home 2 |
| parents + grown-up children + comedy | Daddy's Home 2, Love Actually, Spirited |
| adults + dark comedy | Bad Santa, Violent Night |
| adults + action | Violent Night |
| mixed-age family, everyone can watch | Elf, Home Alone, Arthur Christmas |
| Secret Christmas Films | Bridget Jones's Diary, While You Were Sleeping, When Harry Met Sally… |

## 12. Files that change

- `src/lib/watchlist/vocabulary.ts` — **new**: audience, mood, relevance, strength, collection keys + labels.
- `src/lib/watchlist/collections.ts` — **new**: collection definitions (title, subtitle, context key, relevance handling).
- `src/lib/watchlist/catalogue.ts` — new `CatalogueTitle` type; contents replaced by the 15 approved pilot titles only. The existing 117 entries are **not** mechanically converted and are not treated as authoritative.
- `src/lib/watchlist/recommend.ts` — new gate/score/diversify pipeline.
- `src/lib/watchlist/constants.ts` — label lookups fall back to the new vocabulary; timing vocabulary unchanged.
- `src/components/watchlist/ChooseForMe.tsx` — refined controls + collections strip + badges.
- `src/lib/watchlist/recommend.test.ts` — rewritten for the pilot set.
- No migration. No other route, table or feature touched.

## 13. Tests

1. Suitability gate: no `adult`-band title, and nothing marked `unsuitable` for the *selected* viewers, reaches a young-children context.
2. Selected viewers win: a young child in the household does not block teen/adult recommendations when the user selects adults or teenagers as the viewing group.
3. Curated dominance: an `essential` context always outranks a title matching more generic keys.
4. Named expectations: each row of the table in §11 asserts its leading titles appear in the top results.
5. Christmas relevance: an adjacent title never outranks a `core` title at equal strength — except under `secret_christmas`, where it does.
6. Catalogue integrity: unique keys, no duplicate titles.
7. Collections: every collection returns only titles opting into it, from the single catalogue array.
8. Determinism: identical input returns identical output across runs.
9. Saved exclusion: `excludeSavedKeys` still removes previously saved suggestions.

## 14. Build scope for this task — architecture and pilot only

Build now:

1. `vocabulary.ts` — audience, mood/genre, Christmas relevance, strength, collection keys.
2. `collections.ts` — collection architecture including `secret_christmas`, membership driven from the same master title records.
3. New catalogue type supporting `christmas`, `suitability`, contextual `strength`, `timings`, optional `note`.
4. Convert **only** these 15 human-approved pilot titles: The Holiday, Love Actually, Last Christmas, Love Hard, Bridget Jones's Diary, While You Were Sleeping, When Harry Met Sally…, Elf, Home Alone, Daddy's Home 2, Arthur Christmas, The Polar Express, Bad Santa, Violent Night, Spirited.
5. Rewrite `recommend.ts` around viewer suitability, contextual human strength, Christmas relevance, household fit, timing and gentle diversity — curation dominates generic matching.
6. Secret Christmas Films collection over the same records.
7. `ChooseForMe.tsx` updated only as far as needed to exercise the new structure and collections.
8. Tests proving the behaviour with the pilot titles.

Not built now: converting the remaining 117 entries, preserving duplicates, inferring strengths beyond the pilot set, catalogue expansion, streaming availability, JustWatch, any AI or external API, any change to `watchlist_items`, any migration.

### Suitability clarification

`unsuitable` is not a blanket removal. The safety constraint comes from the **actual intended viewers**: the youngest relevant viewer when the choice is for the whole group, or the specific viewers the user selects when they refine. A younger household member outside the selected viewing group never suppresses valid teen or adult recommendations. `unsuitable` acts as an extra hard block only against the audiences actually in play.

### Internal age guidance

`suitability` is internal A Complete Christmas viewing guidance only. It is never displayed as an official age rating and no BBFC or other certification is implied or invented.


## 15. Where can I watch this?

Not now, and no platform fields added. The recommendation of record: keep availability in a **separate future module** (`src/lib/watchlist/availability/`) keyed by catalogue `key`, resolved at render time and never persisted into the catalogue. That way an official JustWatch partnership can be dropped in later as a lookup layer without touching the catalogue shape or the scoring engine. The only structural accommodation needed today is the stable `key` per title — which we already have.
