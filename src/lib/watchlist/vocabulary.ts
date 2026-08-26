/**
 * Controlled vocabularies for My Christmas Watchlist.
 *
 * One flat "context key" namespace covers audiences, moods/genres and curated
 * collections so a human curator can write `strength: { romance: "essential" }`
 * without worrying about which bucket a key belongs to.
 *
 * Nothing here is stored per user — this is reference vocabulary only.
 */

/* ---------------------------------------------------------------- audience */

export type AudienceKey =
  | "young_children"
  | "older_children"
  | "teenagers"
  | "young_adults"
  | "adult_children"
  | "adults"
  | "couple"
  | "adults_no_children"
  | "mixed_ages"
  | "multigenerational"
  | "alone";

export const AUDIENCES: { key: AudienceKey; label: string }[] = [
  { key: "young_children", label: "Young children" },
  { key: "older_children", label: "Older children" },
  { key: "teenagers", label: "Teenagers" },
  { key: "young_adults", label: "Young adults" },
  { key: "adult_children", label: "Grown-up children" },
  { key: "adults", label: "Adults" },
  { key: "couple", label: "A couple" },
  { key: "adults_no_children", label: "Adults, no children" },
  { key: "mixed_ages", label: "Mixed ages" },
  { key: "multigenerational", label: "The whole family" },
  { key: "alone", label: "Just me" },
];

export const AUDIENCE_KEYS: AudienceKey[] = AUDIENCES.map((a) => a.key);

export function audienceLabel(key: AudienceKey | string): string {
  return AUDIENCES.find((a) => a.key === key)?.label ?? key;
}

/* ------------------------------------------------------------ mood / genre */

export type MoodKey =
  | "romance"
  | "comedy"
  | "cosy"
  | "magical"
  | "nostalgic"
  | "emotional"
  | "feel_good"
  | "action"
  | "dark_comedy"
  | "musical"
  | "animation"
  | "classic"
  | "modern"
  | "british"
  | "alternative"
  | "family"
  | "adult_christmas";

export const MOOD_VOCABULARY: { key: MoodKey; label: string }[] = [
  { key: "romance", label: "Romance" },
  { key: "comedy", label: "Comedy" },
  { key: "cosy", label: "Cosy" },
  { key: "magical", label: "Magical" },
  { key: "nostalgic", label: "Nostalgic" },
  { key: "emotional", label: "Emotional" },
  { key: "feel_good", label: "Feel-good" },
  { key: "action", label: "Action" },
  { key: "dark_comedy", label: "Dark comedy" },
  { key: "musical", label: "Musical" },
  { key: "animation", label: "Animation" },
  { key: "classic", label: "Classic" },
  { key: "modern", label: "Modern" },
  { key: "british", label: "British" },
  { key: "alternative", label: "Alternative Christmas" },
  { key: "family", label: "Family" },
  { key: "adult_christmas", label: "Grown-up Christmas" },
];

export const MOOD_KEYS: MoodKey[] = MOOD_VOCABULARY.map((m) => m.key);

export function moodKeyLabel(key: MoodKey | string): string {
  return MOOD_VOCABULARY.find((m) => m.key === key)?.label ?? key;
}

/* ------------------------------------------------------------- collections */

export type CollectionKey =
  | "secret_christmas"
  | "christmas_eve_favourites"
  | "christmas_day_afternoon"
  | "kids_in_bed"
  | "with_teenagers"
  | "with_grown_up_children"
  | "everyone_agrees"
  | "cosy_night"
  | "christmas_romance"
  | "christmas_classics"
  | "modern_classic";

/* ---------------------------------------------------------- context + rank */

/** Any key a curator may give a strength to. */
export type ContextKey = AudienceKey | MoodKey | CollectionKey;

/**
 * Human-curated recommendation strength for one context.
 * `unsuitable` is an explicit hard block for a clearly incompatible audience.
 */
export type Strength = "essential" | "strong" | "extra" | "unsuitable";

export const STRENGTH_SCORE: Record<Exclude<Strength, "unsuitable">, number> = {
  essential: 100,
  strong: 60,
  extra: 25,
};

export function strengthValue(strength: Strength | undefined): number {
  if (!strength || strength === "unsuitable") return 0;
  return STRENGTH_SCORE[strength];
}

/* ----------------------------------------------------- Christmas relevance */

/**
 * How fundamentally Christmas relates to a title. Separate from quality and
 * separate from recommendation strength.
 */
export type ChristmasRelevance = "core" | "strong_setting" | "christmas_adjacent";

export const RELEVANCE_MULTIPLIER: Record<ChristmasRelevance, number> = {
  core: 1,
  strong_setting: 0.85,
  christmas_adjacent: 0.55,
};

/** When someone deliberately asks for Secret Christmas Films, invert the bias. */
export const SECRET_RELEVANCE_MULTIPLIER: Record<ChristmasRelevance, number> = {
  core: 0.6,
  strong_setting: 0.95,
  christmas_adjacent: 1.15,
};

export function relevanceLabel(relevance: ChristmasRelevance): string {
  switch (relevance) {
    case "core":
      return "A proper Christmas film";
    case "strong_setting":
      return "Set at Christmas";
    case "christmas_adjacent":
      return "Christmas-adjacent";
  }
}

/* -------------------------------------------------------------- suitability */

/**
 * INTERNAL A Complete Christmas viewing guidance only.
 * This is NOT an official BBFC classification and must never be presented as one.
 */
export type AgeBand = "all" | "5+" | "8+" | "12+" | "adult";

export const AGE_BAND_ORDER: Record<AgeBand, number> = {
  all: 0,
  "5+": 1,
  "8+": 2,
  "12+": 3,
  adult: 4,
};

export function isSuitableFor(titleBand: AgeBand, viewerBand: AgeBand): boolean {
  return AGE_BAND_ORDER[titleBand] <= AGE_BAND_ORDER[viewerBand];
}

/** The highest content band a given viewing audience can safely be shown. */
export function audienceCeiling(audience: AudienceKey): AgeBand {
  switch (audience) {
    case "young_children":
      return "all";
    case "older_children":
      return "8+";
    case "teenagers":
      return "12+";
    case "mixed_ages":
    case "multigenerational":
      return "8+";
    default:
      return "adult";
  }
}
