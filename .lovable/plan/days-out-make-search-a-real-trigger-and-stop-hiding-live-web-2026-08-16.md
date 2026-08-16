# Days Out — make Search a real trigger and stop hiding live-web failure

## Verified before planning

- `/days-out` currently derives `submitted` from URL values (`Boolean(q || location || from || to || keywords.length)`) and the React Query key omits any submit counter — so pressing Search with unchanged values reuses the cached client result and nothing appears to happen.
- The provider registry drops a failed provider from `sources` entirely, so a Google failure is indistinguishable from "no live results".
- The Gemini key IS present on the server. I ran one live Google Search-grounding request with it just now:
  - Model: `gemini-flash-latest`, endpoint `v1beta/.../generateContent` with `google_search` tool
  - Result: **HTTP 429 RESOURCE_EXHAUSTED** — "You exceeded your current quota, please check your plan and billing details."

**Google live search is still unavailable because the configured Gemini project does not currently have usable Search grounding quota.** No code change can fix that; it needs billing/quota enabled on that Google AI project (or a key from a billed project). The plan below makes the app behave honestly and correctly either way, and live results will appear automatically once quota exists.

## What will change

### 1. Explicit search trigger
- Add `search: number` (default `0`) to the `/days-out` search schema.
- Gold "Search Christmas activities" submit: merge q/location/from/to/radius into existing URL state, set `mode: "find"`, increment `search`, keep everything else, scroll to results.
- "Find this near me" on an Inspire Me idea: same, also carrying the idea's keywords/types and incrementing `search`.
- Live query becomes `enabled: mode === "find" && search > 0` with key `["experience-search", search, q, location, from, to, radius, keywords, types]`, so an identical repeat search still refetches.

### 2. Surface provider status instead of hiding failure
- `searchAllSources` returns `providerStatus: { id, name, status: "success" | "failed", count }[]` alongside the existing `sources`; failures are logged server-side only, never sent to the browser.
- `searchExperiences` passes it through on `ExperienceSearchResult`.
- `SourcesSearched` keeps listing successful providers; when a provider failed it adds the quiet line: "Live web search is temporarily unavailable. Showing results from our other sources."
- The "We haven't found matching live listings" message only shows when every enabled provider actually succeeded.

### 3. Don't cache broken searches
- In `search.functions.ts`, only write to the 10-minute cache when no enabled provider failed. Failed runs are returned but not stored, so a retry after the Google issue is resolved gets fresh results.

### 4. Searching feedback
- Button immediately shows "Searching Christmas activities…" with spinner on tap.
- Results area immediately shows "Searching Christmas magic near you…", or "Searching A Complete Christmas and the live web…" when the live-web provider is enabled.

### 5. Verification
Real browser test at 360px and 390px with q=`Santa`, location=`RH1 3HA`, 01/11/2026 → 24/12/2026, 25 miles: one tap enters the searching state, a fresh server request runs, the viewport moves to the status area, the URL carries `search=1`, pressing Search again fires `search=2` with a genuinely new request. Because of the 429 above, the expected honest outcome today is the "live web search temporarily unavailable" line rather than Google results.

## Out of scope
No redesign, no new route, no second search system, no new provider, no Inspire Me / planner / event-model changes.
