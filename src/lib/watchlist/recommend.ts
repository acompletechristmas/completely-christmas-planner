/**
 * Deterministic recommendation engine for My Christmas Watchlist.
 *
 * No external APIs, no AI, no randomness. The same household + preferences
 * always return the same recommendations.
 */

import { AGE_ORDER, isSuitableForAge, MOODS, typeLabel } from "./constants";
import { WATCHLIST_IDEAS, type Audience, type Mood, type WatchlistIdea } from "./catalogue";
import type { Database } from "@/integrations/supabase/types";

type PersonRow = Database["public"]["Tables"]["people"]["Row"];
type SettingsRow = Database["public"]["Tables"]["planner_settings"]["Row"];

export interface HouseholdContext {
  settings?: SettingsRow | null;
  people?: PersonRow[] | null;
}

export interface WatchlistRefinements {
  /** If the user chose specific audiences, use those. Otherwise infer from household. */
  audiences?: Audience[];
  /** Selected mood filters. */
  moods?: Mood[];
  /** Preferred timing, if any. */
  timing?: string;
  /** If true, exclude items whose recommendation key is already saved. */
  excludeSavedKeys?: string[];
  /** If true, boost the "surprise" mood at the end. */
  surprise?: boolean;
}

export interface RecommendationResult {
  heading: string;
  subheading: string;
  items: WatchlistIdea[];
  explanation: string;
  totalAvailable: number;
  filter: {
    ageBand: string;
    audiences: Audience[];
  };
}

const AUDIENCE_PRIORITY: Audience[] = [
  "alone",
  "adults_no_children",
  "couple",
  "young_adults",
  "teenagers",
  "older_children",
  "young_children",
  "mixed_ages",
  "extended",
];

const MOOD_WEIGHTS: Record<Mood, number> = {
  classic: 1,
  funny: 1,
  romantic: 1,
  cosy: 1,
  magical: 1,
  nostalgic: 1,
  family: 1.2,
  newer: 1,
  easy: 1,
  tearjerker: 1,
  musical: 1,
  animated: 1,
  adventure: 1,
  feel_good: 1.1,
  surprise: 1,
};

/** Convert a person age_range string into a maximum age band. */
function ageRangeToMaxBand(ageRange?: string | null): string {
  if (!ageRange) return "adult";
  const ar = ageRange.toLowerCase();
  if (ar.includes("0-4") || ar.includes("toddler") || ar.includes("baby")) return "all";
  if (ar.includes("5-9") || ar.includes("child")) return "5+";
  if (ar.includes("10-12") || ar.includes("pre-teen")) return "8+";
  if (ar.includes("13-17") || ar.includes("teen")) return "12+";
  return "adult";
}

/** The most restrictive age band the selected audience(s) can safely watch. */
function audienceToMaxAgeBand(audience: Audience): string {
  switch (audience) {
    case "young_children":
      return "all";
    case "older_children":
      return "8+";
    case "teenagers":
      return "12+";
    case "young_adults":
    case "adults_no_children":
    case "couple":
    case "alone":
      return "adult";
    case "mixed_ages":
    case "extended":
      // These groups may include children, so we must default to the safest
      // unless they are paired with a specific age. The recommendation function
      // combines this with the household's youngest member.
      return "all";
    default:
      return "all";
  }
}

/** Derive the youngest age band present in the household. */
function householdMaxAgeBand(context: HouseholdContext): string {
  const { settings, people } = context;
  const fromPeople = (people ?? []).map((p) => ageRangeToMaxBand(p.age_range));
  const bands: string[] = [...fromPeople];

  // If there are children in the planner settings, assume a young child.
  const numChildren = settings?.num_children ?? 0;
  if (numChildren > 0) bands.push("all");

  // A couple with no children and no people data is treated as adult.
  if (bands.length === 0) {
    const householdTypes = settings?.household_types ?? [];
    if (householdTypes.includes("alone") || householdTypes.includes("couple")) {
      return "adult";
    }
    return "all"; // Default to family-safe when uncertain.
  }

  return bands.reduce((youngest, band) => {
    return AGE_ORDER[band] < AGE_ORDER[youngest] ? band : youngest;
  }, "adult");
}

/** Infer intended audiences from household composition if the user didn't specify. */
function inferAudiences(context: HouseholdContext): Audience[] {
  const { settings, people } = context;
  const types = settings?.household_types ?? [];
  const numChildren = settings?.num_children ?? 0;
  const peopleAges = (people ?? []).map((p) => ageRangeToMaxBand(p.age_range));
  const hasYoungChild =
    peopleAges.includes("all") || peopleAges.includes("5+") || numChildren > 0;
  const hasOlderChild = peopleAges.includes("8+");
  const hasTeen = peopleAges.includes("12+");
  const hasAdult = peopleAges.length === 0 || peopleAges.includes("adult");

  const audiences: Audience[] = [];

  if (types.includes("alone")) audiences.push("alone");
  if (types.includes("couple")) audiences.push("couple");
  if (types.includes("family_with_young_children") || hasYoungChild) {
    audiences.push("young_children", "mixed_ages", "extended");
  }
  if (types.includes("family_with_older_children") || hasOlderChild) {
    audiences.push("older_children", "mixed_ages", "extended");
  }
  if (types.includes("family_with_teenagers") || hasTeen) {
    audiences.push("teenagers", "mixed_ages", "extended");
  }
  if (types.includes("family_with_adult_children") || hasAdult) {
    audiences.push("young_adults", "adults_no_children");
  }

  // Deduplicate and default to family-mixed if nothing found.
  const unique = Array.from(new Set(audiences));
  if (unique.length === 0) return ["mixed_ages"];
  return unique;
}

function buildHeading(
  audiences: Audience[],
  moods: Mood[],
  timing?: string,
  totalItems?: number,
): { heading: string; subheading: string; explanation: string } {
  const audience = audiences[0] ?? "mixed_ages";
  const moodLabel = moods[0] ? MOODS.find((m) => m.key === moods[0])?.label : undefined;

  const headings: Record<Audience, string[]> = {
    young_children: [
      "Gentle Christmas viewing for little ones",
      "Magical Christmas stories for children",
    ],
    older_children: [
      "Family Christmas adventures",
      "Christmas films the children will love",
    ],
    teenagers: [
      "Christmas picks for teenagers",
      "Festive viewing they'll actually watch",
    ],
    young_adults: [
      "Christmas viewing for grown-up children",
      "Festive picks for young adults",
    ],
    couple: [
      "Cosy Christmas viewing for two",
      "Christmas films for a quiet night in",
    ],
    adults_no_children: [
      "Christmas viewing for adults",
      "Grown-up festive films and specials",
    ],
    mixed_ages: [
      "Christmas viewing for the whole family",
      "Festive favourites for every generation",
    ],
    extended: [
      "Christmas viewing for a full house",
      "Festive picks that suit everyone together",
    ],
    alone: [
      "Christmas comfort viewing",
      "A little festive time just for you",
    ],
  };

  const baseHeadings = headings[audience] ?? headings.mixed_ages;
  let heading = baseHeadings[0];
  if (moodLabel) {
    heading = `${moodLabel} for your Christmas watchlist`;
  }
  if (timing && timing !== "any_time") {
    const timingMap: Record<string, string> = {
      christmas_eve: "Christmas Eve",
      christmas_morning: "Christmas morning",
      christmas_day: "Christmas Day",
      boxing_day: "Boxing Day",
      december: "December",
      weekend: "A December weekend",
      any_time: "Any time",
    };
    heading = `${heading} — ${timingMap[timing] ?? ""}`;
  }

  const subheading =
    totalItems && totalItems > 0
      ? `We found ${totalItems} suggestion${totalItems === 1 ? "" : "s"} that fit your household.`
      : "A few Christmas viewing ideas chosen for your household.";

  const explanation = `Suggestions matched to ${audiences
    .map((a) => {
      const map: Record<string, string> = {
        young_children: "young children",
        older_children: "older children",
        teenagers: "teenagers",
        young_adults: "young adults",
        couple: "a couple",
        adults_no_children: "adults",
        mixed_ages: "mixed ages",
        extended: "extended family",
        alone: "watching alone",
      };
      return map[a] ?? a;
    })
    .join(", ")}${moodLabel ? ` and a ${moodLabel.toLowerCase()} mood` : ""}.`;

  return { heading, subheading, explanation };
}

export function recommendWatchlistItems(
  context: HouseholdContext,
  refinements: WatchlistRefinements = {},
): RecommendationResult {
  const selectedAudiences =
    refinements.audiences && refinements.audiences.length > 0
      ? refinements.audiences
      : inferAudiences(context);

  // The user-chosen audience sets the intended viewing context. If they did not
  // choose one, fall back to the youngest person in the household so children are
  // protected by default.
  const audienceMaxAgeBand = selectedAudiences.reduce((youngest, a) => {
    const band = audienceToMaxAgeBand(a);
    return AGE_ORDER[band] < AGE_ORDER[youngest] ? band : youngest;
  }, "adult" as string);

  const householdMaxAge = householdMaxAgeBand(context);
  const effectiveAgeBand =
    refinements.audiences && refinements.audiences.length > 0
      ? audienceMaxAgeBand
      : householdMaxAge;

  const savedKeys = new Set(refinements.excludeSavedKeys ?? []);
  const selectedMoods = new Set(refinements.moods ?? []);

  let candidates = WATCHLIST_IDEAS.filter((item) => {
    // Safety filter: the item must be suitable for the effective age band.
    if (!isSuitableForAge(item.ageBand, effectiveAgeBand)) return false;

    // If the user explicitly selected audiences, keep only items that are
    // intended for at least one of those audiences. This lets adults find
    // date-night picks even if children exist in the household.
    if (refinements.audiences && refinements.audiences.length > 0) {
      return item.audiences.some((a) => selectedAudiences.includes(a));
    }

    return true;
  });

  // Exclude already-saved items unless this is a "Show me more" request.
  if (savedKeys.size > 0) {
    candidates = candidates.filter((item) => !savedKeys.has(item.key));
  }

  // Score and diversify.
  const scored = candidates.map((item) => {
    let score = 0;
    let audienceMatches = 0;
    let moodMatches = 0;

    for (const a of selectedAudiences) {
      if (item.audiences.includes(a)) {
        audienceMatches++;
        score += AUDIENCE_PRIORITY.indexOf(a) >= 0 ? 2 : 1;
      }
    }

    for (const m of item.moods) {
      if (selectedMoods.has(m)) {
        moodMatches++;
        score += MOOD_WEIGHTS[m] ?? 1;
      }
    }

    // Timing match.
    if (refinements.timing && item.timings.includes(refinements.timing)) {
      score += 1.5;
    }

    // Family-wide bonus when the group is mixed or extended.
    if (
      selectedAudiences.includes("mixed_ages") ||
      selectedAudiences.includes("extended") ||
      selectedAudiences.includes("young_children")
    ) {
      if (item.audiences.includes("young_children")) score += 1.5;
    }

    // Celebration-style hints from planner settings.
    const celebrationStyles = context.settings?.celebration_style ?? [];
    if (celebrationStyles.includes("traditional") && item.moods.includes("classic")) {
      score += 1;
    }
    if (celebrationStyles.includes("relaxed") && item.moods.includes("easy")) {
      score += 0.5;
    }
    if (
      (celebrationStyles.includes("big_gathering") ||
        celebrationStyles.includes("extended_family")) &&
      item.audiences.includes("extended")
    ) {
      score += 1;
    }

    // Surprise boost: if nothing is selected, add a small surprise-friendly lift.
    if (refinements.surprise && item.moods.includes("surprise")) {
      score += 0.5;
    }

    // Slight tie-breakers.
    if (item.audiences.includes("alone") && selectedAudiences.includes("alone")) score += 0.5;
    if (item.year && item.year >= 2015) score += 0.2; // newer gets a tiny bump

    return { item, score, audienceMatches, moodMatches };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.audienceMatches !== a.audienceMatches) return b.audienceMatches - a.audienceMatches;
    if (b.moodMatches !== a.moodMatches) return b.moodMatches - a.moodMatches;
    return a.item.title.localeCompare(b.item.title);
  });

  // Diversify by picking at most 3 from the same mood, then the same type.
  const picked: WatchlistIdea[] = [];
  const moodCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  const maxPerMood = 3;
  const maxPerType = 5;

  for (const { item } of scored) {
    const primaryMood = item.moods[0] ?? "classic";
    if ((moodCounts[primaryMood] ?? 0) >= maxPerMood) continue;
    if ((typeCounts[item.type] ?? 0) >= maxPerType) continue;
    picked.push(item);
    moodCounts[primaryMood] = (moodCounts[primaryMood] ?? 0) + 1;
    typeCounts[item.type] = (typeCounts[item.type] ?? 0) + 1;
    if (picked.length >= 24) break; // First manageable set.
  }

  const { heading, subheading, explanation } = buildHeading(
    selectedAudiences,
    refinements.moods ?? [],
    refinements.timing,
    scored.length,
  );

  return {
    heading,
    subheading,
    items: picked,
    explanation,
    totalAvailable: scored.length,
    filter: {
      ageBand: effectiveAgeBand,
      audiences: selectedAudiences,
    },
  };
}

export function surpriseWatchlistItem(
  context: HouseholdContext,
  refinements: WatchlistRefinements = {},
): WatchlistIdea | null {
  const result = recommendWatchlistItems(context, {
    ...refinements,
    surprise: true,
  });
  if (result.items.length === 0) return null;
  // Return a mid-ranked item so it is not the same top pick every time.
  const idx = Math.min(4, result.items.length - 1);
  return result.items[idx] ?? null;
}

export function watchlistItemToSavedFields(
  item: WatchlistIdea,
  context: HouseholdContext,
): {
  title: string;
  content_type?: string;
  year?: number;
  recommendation_key?: string;
  source: string;
  mood_tags: string[];
  timing?: string;
} {
  return {
    title: item.title,
    content_type: item.type,
    year: item.year,
    recommendation_key: item.key,
    source: "recommendation",
    mood_tags: item.moods,
    timing: item.timings[0] ?? "any_time",
  };
}

export function audienceLabel(audience: Audience): string {
  const map: Record<Audience, string> = {
    young_children: "Young children",
    older_children: "Older children",
    teenagers: "Teenagers",
    young_adults: "Young adults",
    couple: "A couple",
    adults_no_children: "Adults",
    mixed_ages: "Mixed ages",
    extended: "Extended family",
    alone: "Just me",
  };
  return map[audience];
}

export function describeWhy(item: WatchlistIdea, audiences: Audience[]): string {
  const audience = audiences.find((a) => item.audiences.includes(a)) ?? item.audiences[0];
  const type = typeLabel(item.type);
  const reasons: string[] = [];

  if (audience) reasons.push(`A good fit for ${audienceLabel(audience).toLowerCase()}`);
  if (item.minutes) reasons.push(`${item.minutes} minutes`);
  if (item.year) reasons.push(`${item.year}`);
  reasons.push(type);

  return reasons.join(" · ");
}
