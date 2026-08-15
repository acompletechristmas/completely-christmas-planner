import type { ExperienceType } from "@/lib/days-out/experience-data";

/** Who the day out is for. Kept separate from the Experience `Audience` model. */
export type IdeaGroup =
  | "couple"
  | "babies"
  | "young_children"
  | "older_children"
  | "teenagers"
  | "young_adults"
  | "adult_children"
  | "multi_gen"
  | "adults_friends"
  | "alone";

export type IdeaMood =
  | "magical"
  | "romantic"
  | "traditional"
  | "fun"
  | "cosy"
  | "relaxing"
  | "different"
  | "food"
  | "outdoors"
  | "indoors"
  | "active"
  | "luxury"
  | "budget"
  | "free"
  | "surprise";

export const GROUP_LABELS: Record<IdeaGroup, string> = {
  couple: "A couple",
  babies: "Family with babies or toddlers",
  young_children: "Family with young children",
  older_children: "Family with older children",
  teenagers: "Family with teenagers",
  young_adults: "Family with young adults",
  adult_children: "Family with adult children",
  multi_gen: "Multi-generational family",
  adults_friends: "Adults or friends",
  alone: "Going alone",
};

export const MOOD_LABELS: Record<IdeaMood, string> = {
  magical: "Magical",
  romantic: "Romantic",
  traditional: "Traditional",
  fun: "Fun",
  cosy: "Cosy",
  relaxing: "Relaxing",
  different: "Something different",
  food: "Food & drink",
  outdoors: "Outdoors",
  indoors: "Indoors",
  active: "Active",
  luxury: "Luxury",
  budget: "Budget friendly",
  free: "Free",
  surprise: "Surprise me",
};

export const GROUP_VALUES = Object.keys(GROUP_LABELS) as IdeaGroup[];
export const MOOD_VALUES = Object.keys(MOOD_LABELS) as IdeaMood[];

export function isGroup(value: string): value is IdeaGroup {
  return (GROUP_VALUES as string[]).includes(value);
}

export function isMood(value: string): value is IdeaMood {
  return (MOOD_VALUES as string[]).includes(value);
}

/**
 * A Christmas IDEA. Deliberately NOT an Experience: no venue, no date,
 * no price, no booking link. An idea is never presented as a real listing —
 * it is only ever a starting point for a genuine search.
 */
export interface ExperienceIdea {
  id: string;
  title: string;
  /** Why this might suit the people going. */
  why: string;
  /** Short human tags shown on the card. */
  tags: string[];
  /** Existing filter types this idea maps onto, when it maps at all. */
  types: ExperienceType[];
  /** Search words that keep the specific intent alive, e.g. "candlelit concert". */
  keywords: string[];
  groups: IdeaGroup[];
  moods: IdeaMood[];
}

export interface RecommendationRequest {
  group?: IdeaGroup;
  /** Optional free text, e.g. "4 and 7". */
  ages?: string;
  moods: IdeaMood[];
  /** Existing Days Out search context — reused, never duplicated. */
  location?: string;
  from?: string;
  to?: string;
  radiusMiles?: number;
  /** Rotates the selection for "Show me more ideas" / "Surprise me". */
  seed?: number;
  limit?: number;
}

const GROUP_PHRASE: Record<IdeaGroup, string> = {
  couple: "for two",
  babies: "for little ones",
  young_children: "for the children",
  older_children: "for the family",
  teenagers: "for teenagers",
  young_adults: "for young adults",
  adult_children: "for the grown-up family",
  multi_gen: "for the whole family",
  adults_friends: "for grown-ups",
  alone: "just for you",
};

const MOOD_PHRASE: Partial<Record<IdeaMood, string>> = {
  magical: "magical",
  romantic: "romantic",
  traditional: "traditional",
  cosy: "cosy",
  relaxing: "relaxed",
  luxury: "luxurious",
  fun: "fun-filled",
  free: "free",
  budget: "budget-friendly",
  outdoors: "outdoor",
  active: "active",
  different: "different",
  food: "delicious",
};

/** Friendly, personal heading — never "Recommended events". */
export function buildIdeasHeading(group?: IdeaGroup, moods: IdeaMood[] = []): string {
  const mood = moods.map((m) => MOOD_PHRASE[m]).find(Boolean);
  const who = group ? GROUP_PHRASE[group] : "for you";
  if (mood && group === "couple") return `Romantic Christmas ideas for two`;
  if (mood) return `${capitalise(mood)} Christmas ideas ${who}`;
  return `Christmas ideas ${who}`;
}

function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
