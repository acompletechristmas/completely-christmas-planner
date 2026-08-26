/**
 * Deterministic recommendation engine for My Christmas Watchlist.
 *
 * Pipeline: suitability gate -> curated human strength -> Christmas relevance
 * -> household & occasion fit -> gentle diversification.
 *
 * Human curation dominates: one `essential` context beats any amount of
 * generic metadata matching. No AI, no network, no randomness — the same input
 * always returns the same output.
 */

import { typeLabel } from "./constants";
import { WATCHLIST_IDEAS, type CatalogueTitle, type WatchlistIdea } from "./catalogue";
import { COLLECTIONS, isCollectionKey } from "./collections";
import {
  AGE_BAND_ORDER,
  audienceCeiling,
  audienceLabel as vocabAudienceLabel,
  isSuitableFor,
  moodKeyLabel,
  MOOD_KEYS,
  RELEVANCE_MULTIPLIER,
  SECRET_RELEVANCE_MULTIPLIER,
  strengthValue,
  type AgeBand,
  type AudienceKey,
  type CollectionKey,
  type ContextKey,
  type MoodKey,
} from "./vocabulary";
import type { WatchlistContentType } from "@/hooks/use-watchlist";

export type Audience = AudienceKey;
export type Mood = MoodKey;

export interface PersonShape {
  age_range?: string | null;
}

export interface PlannerSettingsShape {
  num_children?: number;
  household_types?: string[];
  celebration_style?: string[];
}

export interface HouseholdContext {
  settings?: PlannerSettingsShape | null;
  people?: PersonShape[] | null;
}

export interface WatchlistRefinements {
  /** The people actually watching. If omitted, inferred from the household. */
  audiences?: AudienceKey[];
  /** Selected mood/genre keys. */
  moods?: MoodKey[];
  /** A curated collection, e.g. secret_christmas. */
  collection?: CollectionKey;
  /** Preferred timing, if any. */
  timing?: string;
  /** Recommendation keys already saved — never suggested again. */
  excludeSavedKeys?: string[];
  /** Deterministic alternative pick. */
  surprise?: boolean;
}

export interface ScoredTitle {
  item: CatalogueTitle;
  score: number;
  /** Strongest curated context matched, used for the badge line. */
  topContext?: ContextKey;
}

export interface RecommendationResult {
  heading: string;
  subheading: string;
  items: CatalogueTitle[];
  scored: ScoredTitle[];
  explanation: string;
  totalAvailable: number;
  filter: {
    ageBand: AgeBand;
    audiences: AudienceKey[];
  };
}

/* ------------------------------------------------------------- household */

/** Convert a person age_range string into the age band they can safely watch. */
function ageRangeToBand(ageRange?: string | null): AgeBand {
  if (!ageRange) return "adult";
  const ar = ageRange.toLowerCase();
  if (ar.includes("0-4") || ar.includes("toddler") || ar.includes("baby")) return "all";
  if (ar.includes("5-9") || ar.includes("child")) return "5+";
  if (ar.includes("10-12") || ar.includes("pre-teen")) return "8+";
  if (ar.includes("13-17") || ar.includes("teen")) return "12+";
  return "adult";
}

/** The youngest viewer present in the household. */
function householdCeiling(context: HouseholdContext): AgeBand {
  const bands: AgeBand[] = (context.people ?? []).map((p) => ageRangeToBand(p.age_range));
  if ((context.settings?.num_children ?? 0) > 0) bands.push("all");

  if (bands.length === 0) {
    const types = context.settings?.household_types ?? [];
    if (types.includes("alone") || types.includes("couple")) return "adult";
    return "all";
  }

  return bands.reduce<AgeBand>(
    (youngest, band) => (AGE_BAND_ORDER[band] < AGE_BAND_ORDER[youngest] ? band : youngest),
    "adult",
  );
}

/** Infer likely viewers from the household when the user has not chosen. */
function inferAudiences(context: HouseholdContext): AudienceKey[] {
  const types = context.settings?.household_types ?? [];
  const ages = (context.people ?? []).map((p) => ageRangeToBand(p.age_range));
  const numChildren = context.settings?.num_children ?? 0;

  const hasYoung = numChildren > 0 || ages.includes("all") || ages.includes("5+");
  const hasOlderChild = ages.includes("8+");
  const hasTeen = ages.includes("12+");

  const audiences: AudienceKey[] = [];
  if (types.includes("alone")) audiences.push("alone");
  if (types.includes("couple")) audiences.push("couple", "adults");
  if (types.includes("family_with_young_children") || hasYoung) {
    audiences.push("young_children", "mixed_ages", "multigenerational");
  }
  if (types.includes("family_with_older_children") || hasOlderChild) {
    audiences.push("older_children", "mixed_ages");
  }
  if (types.includes("family_with_teenagers") || hasTeen) {
    audiences.push("teenagers", "mixed_ages");
  }
  if (types.includes("family_with_adult_children")) {
    audiences.push("adult_children", "adults");
  }

  const unique = Array.from(new Set(audiences));
  return unique.length > 0 ? unique : ["mixed_ages"];
}

/* ------------------------------------------------------------------ gate */

/**
 * The safety ceiling comes from the ACTUAL intended viewers: the selected
 * audiences when the user has chosen, otherwise the youngest person in the
 * household. A younger household member outside the selected viewing group
 * never suppresses valid teen or adult recommendations.
 */
function effectiveCeiling(
  context: HouseholdContext,
  selected: AudienceKey[] | undefined,
): AgeBand {
  if (selected && selected.length > 0) {
    return selected.reduce<AgeBand>(
      (youngest, a) => {
        const band = audienceCeiling(a);
        return AGE_BAND_ORDER[band] < AGE_BAND_ORDER[youngest] ? band : youngest;
      },
      "adult",
    );
  }
  return householdCeiling(context);
}

/* ---------------------------------------------------------------- copy */

function contextPhrase(key: ContextKey): string {
  if (isCollectionKey(key)) return COLLECTIONS.find((c) => c.key === key)!.title.toLowerCase();
  if ((MOOD_KEYS as string[]).includes(key)) return moodKeyLabel(key as MoodKey).toLowerCase();
  return vocabAudienceLabel(key as AudienceKey).toLowerCase();
}

function buildCopy(
  audiences: AudienceKey[],
  moods: MoodKey[],
  collection: CollectionKey | undefined,
  timing: string | undefined,
  total: number,
) {
  const collectionDef = collection ? COLLECTIONS.find((c) => c.key === collection) : undefined;

  let heading: string;
  if (collectionDef) {
    heading = collectionDef.title;
  } else if (moods.length > 0) {
    heading = `${moodKeyLabel(moods[0])} Christmas viewing`;
  } else {
    const a = audiences[0] ?? "mixed_ages";
    heading =
      a === "young_children"
        ? "Gentle Christmas viewing for little ones"
        : a === "couple"
          ? "Cosy Christmas viewing for two"
          : a === "alone"
            ? "Christmas comfort viewing"
            : a === "teenagers"
              ? "Christmas picks for teenagers"
              : a === "adults" || a === "adults_no_children"
                ? "Grown-up Christmas viewing"
                : "Christmas viewing for the whole family";
  }

  if (timing && timing !== "any_time") {
    const map: Record<string, string> = {
      christmas_eve: "Christmas Eve",
      christmas_morning: "Christmas morning",
      christmas_day: "Christmas Day",
      boxing_day: "Boxing Day",
      december: "December",
      weekend: "A December weekend",
    };
    if (map[timing]) heading = `${heading} — ${map[timing]}`;
  }

  const subheading =
    collectionDef?.subtitle ??
    (total > 0
      ? `${total} hand-picked suggestion${total === 1 ? "" : "s"} for who's actually watching.`
      : "A few Christmas viewing ideas chosen for your household.");

  const parts = [
    audiences.length > 0 ? audiences.map(contextPhrase).join(", ") : "your household",
    moods.length > 0 ? `a ${moods.map((m) => moodKeyLabel(m).toLowerCase()).join(" / ")} mood` : "",
  ].filter(Boolean);

  return {
    heading,
    subheading,
    explanation: `Chosen for ${parts.join(" and ")}.`,
  };
}

/* --------------------------------------------------------------- engine */

export function recommendWatchlistItems(
  context: HouseholdContext,
  refinements: WatchlistRefinements = {},
): RecommendationResult {
  const userChose = Boolean(refinements.audiences && refinements.audiences.length > 0);
  const selectedAudiences = userChose ? refinements.audiences! : inferAudiences(context);
  const ceiling = effectiveCeiling(context, userChose ? refinements.audiences : undefined);

  const selectedMoods = refinements.moods ?? [];
  const collection = refinements.collection;
  const savedKeys = new Set(refinements.excludeSavedKeys ?? []);

  const relevanceMultiplier =
    collection && COLLECTIONS.find((c) => c.key === collection)?.favoursAdjacent
      ? SECRET_RELEVANCE_MULTIPLIER
      : RELEVANCE_MULTIPLIER;

  const selectedContexts: ContextKey[] = [
    ...selectedAudiences,
    ...selectedMoods,
    ...(collection ? [collection] : []),
  ];

  const householdAudiences = inferAudiences(context);

  const scored: ScoredTitle[] = [];

  for (const item of WATCHLIST_IDEAS) {
    if (savedKeys.has(item.key)) continue;

    // 1. Hard suitability gate.
    if (!isSuitableFor(item.suitability, ceiling)) continue;
    if (selectedContexts.some((c) => item.strength[c] === "unsuitable")) continue;
    // A collection filters to titles that opted into it.
    if (collection && !item.strength[collection]) continue;

    // 2. Curated strength — the dominant term.
    let base = 0;
    let topContext: ContextKey | undefined;
    let topValue = 0;
    let matches = 0;
    for (const c of selectedContexts) {
      const value = strengthValue(item.strength[c]);
      if (value > 0) {
        base += value;
        matches++;
        if (value > topValue) {
          topValue = value;
          topContext = c;
        }
      }
    }

    // Nothing curated for what was asked: only keep it as a weak fallback when
    // the user has not specified a mood or collection.
    if (base === 0 && (selectedMoods.length > 0 || collection)) continue;

    // 3. Christmas relevance.
    let score = base * relevanceMultiplier[item.christmas];

    // 4. Household fit (small, additive).
    for (const a of householdAudiences) {
      if (selectedAudiences.includes(a)) continue;
      const value = strengthValue(item.strength[a]);
      if (value >= 100) score += 8;
      else if (value >= 60) score += 5;
      else if (value > 0) score += 2;
    }

    // 5. Occasion fit.
    if (refinements.timing && (item.timings ?? []).includes(refinements.timing)) {
      score += 10;
    }

    // 6. Gentle household style nudges.
    const styles = context.settings?.celebration_style ?? [];
    if (styles.includes("traditional") && item.strength.classic) score += 3;
    if (styles.includes("relaxed") && item.strength.cosy) score += 3;

    scored.push({ item, score: Math.round(score * 100) / 100, topContext });

    void matches;
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aEssential = Object.values(a.item.strength).filter((s) => s === "essential").length;
    const bEssential = Object.values(b.item.strength).filter((s) => s === "essential").length;
    if (bEssential !== aEssential) return bEssential - aEssential;
    if (a.item.christmas !== b.item.christmas) {
      const order = { core: 0, strong_setting: 1, christmas_adjacent: 2 } as const;
      return order[a.item.christmas] - order[b.item.christmas];
    }
    return a.item.title.localeCompare(b.item.title);
  });

  // 7. Softened diversification: an essential match for the requested context is
  // never dropped; only `extra`-strength titles are capped by type.
  const picked: CatalogueTitle[] = [];
  const typeCounts: Record<string, number> = {};
  for (const entry of scored) {
    const isEssential = selectedContexts.some((c) => entry.item.strength[c] === "essential");
    const isExtraOnly =
      !isEssential && selectedContexts.every((c) => entry.item.strength[c] !== "strong");
    if (isExtraOnly && (typeCounts[entry.item.type] ?? 0) >= 8) continue;
    picked.push(entry.item);
    typeCounts[entry.item.type] = (typeCounts[entry.item.type] ?? 0) + 1;
    if (picked.length >= 24) break;
  }

  const { heading, subheading, explanation } = buildCopy(
    selectedAudiences,
    selectedMoods,
    collection,
    refinements.timing,
    scored.length,
  );

  return {
    heading,
    subheading,
    items: picked,
    scored,
    explanation,
    totalAvailable: scored.length,
    filter: { ageBand: ceiling, audiences: selectedAudiences },
  };
}

/** Deterministic alternative pick — never the obvious top result. */
export function surpriseWatchlistItem(
  context: HouseholdContext,
  refinements: WatchlistRefinements = {},
): CatalogueTitle | null {
  const result = recommendWatchlistItems(context, { ...refinements, surprise: true });
  if (result.items.length === 0) return null;
  if (result.items.length === 1) return result.items[0];
  const seed = [
    ...(refinements.audiences ?? []),
    ...(refinements.moods ?? []),
    refinements.collection ?? "",
    refinements.timing ?? "",
  ]
    .join("|")
    .split("")
    .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 9973, 7);
  const idx = 1 + (seed % (result.items.length - 1));
  return result.items[idx] ?? result.items[1];
}

export function watchlistItemToSavedFields(item: CatalogueTitle): {
  title: string;
  content_type?: WatchlistContentType;
  release_year?: number;
  suggestion_key?: string;
  source: string;
  moods: string[];
  timing: string;
} {
  const moods = MOOD_KEYS.filter((m) => {
    const s = item.strength[m];
    return s !== undefined && s !== "unsuitable";
  });
  return {
    title: item.title,
    content_type: item.type as WatchlistContentType,
    release_year: item.year,
    suggestion_key: item.key,
    source: "recommendation",
    moods,
    timing: item.timings?.[0] ?? "any_time",
  };
}

export function audienceLabel(audience: AudienceKey): string {
  return vocabAudienceLabel(audience);
}

/** The short "why this one" line under each suggestion. */
export function describeWhy(
  item: CatalogueTitle,
  audiences: AudienceKey[],
  topContext?: ContextKey,
): string {
  if (item.note) return item.note;

  const reasons: string[] = [];
  const context =
    topContext ?? audiences.find((a) => item.strength[a] && item.strength[a] !== "unsuitable");
  if (context) {
    const strength = item.strength[context];
    const prefix = strength === "essential" ? "Essential for" : "A good fit for";
    reasons.push(`${prefix} ${contextPhrase(context)}`);
  }
  if (item.minutes) reasons.push(`${item.minutes} minutes`);
  if (item.year) reasons.push(`${item.year}`);
  reasons.push(typeLabel(item.type));
  return reasons.join(" · ");
}

/** Badge text driven purely by curation. */
export function curationBadge(item: CatalogueTitle, topContext?: ContextKey): string | null {
  if (item.strength.secret_christmas) return "Secret Christmas film";
  if (topContext && item.strength[topContext] === "essential") {
    const phrase = contextPhrase(topContext);
    return `Essential ${phrase}`;
  }
  return null;
}

export type { WatchlistIdea };
