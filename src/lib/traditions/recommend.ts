/**
 * Deterministic traditions recommendation. No AI, no network — the curated
 * catalogue is scored against what the planner already knows about the
 * household, then diversified so the list doesn't repeat itself.
 */

import { TRADITION_IDEAS, type Audience, type Cost, type Mood, type TraditionIdea } from "./catalogue";
import type { PlannerSettings } from "@/hooks/use-planner-settings";
import { calcAge, type Person } from "@/hooks/use-people";

export interface HouseholdProfile {
  audiences: Audience[];
  moods: Mood[];
  /** Preferred cost level, if we can infer one. */
  budget: Cost | null;
  hasChildren: boolean;
  adults: number;
  children: number;
}

export interface Refinements {
  audiences?: Audience[];
  moods?: Mood[];
  budget?: Cost | null;
}

/** Map the planner's household_types values onto catalogue audiences. */
const HOUSEHOLD_AUDIENCE: Record<string, Audience[]> = {
  young_children: ["young_children", "mixed_ages"],
  teenagers: ["teenagers", "mixed_ages"],
  mixed_ages: ["mixed_ages", "extended", "young_children", "teenagers"],
  couple: ["couple"],
  adults_no_children: ["adults_no_children"],
  young_adults: ["young_adults", "mixed_ages"],
  alone: ["alone"],
  extended: ["extended", "mixed_ages"],
};

/** celebration_style values that hint at a mood. */
const STYLE_MOOD: Record<string, Mood[]> = {
  hosting: ["traditional", "fun"],
  visiting: ["active", "traditional"],
  quiet_home: ["cosy", "relaxing"],
  multiple: ["fun", "active"],
};

function pushUnique<T>(list: T[], values: T[]) {
  for (const v of values) if (!list.includes(v)) list.push(v);
}

export function deriveProfile(
  settings: PlannerSettings | null,
  people: Person[],
  refinements: Refinements = {},
): HouseholdProfile {
  const audiences: Audience[] = [];
  const moods: Mood[] = [];

  for (const t of settings?.household_types ?? []) {
    pushUnique(audiences, HOUSEHOLD_AUDIENCE[t] ?? []);
  }
  for (const s of settings?.celebration_style ?? []) {
    pushUnique(moods, STYLE_MOOD[s] ?? []);
  }

  // People we already know about sharpen the picture.
  let youngest: number | null = null;
  let oldest: number | null = null;
  for (const p of people) {
    const age = calcAge(p.date_of_birth);
    if (age !== null) {
      youngest = youngest === null ? age : Math.min(youngest, age);
      oldest = oldest === null ? age : Math.max(oldest, age);
    }
    switch (p.age_range) {
      case "baby":
      case "toddler":
      case "child":
        pushUnique(audiences, ["young_children"]);
        break;
      case "teen":
        pushUnique(audiences, ["teenagers"]);
        break;
      case "young_adult":
        pushUnique(audiences, ["young_adults"]);
        break;
      default:
        break;
    }
  }
  if (youngest !== null && youngest <= 10) pushUnique(audiences, ["young_children"]);
  if (youngest !== null && youngest > 10 && youngest <= 17) pushUnique(audiences, ["teenagers"]);
  if (oldest !== null && youngest !== null && oldest - youngest >= 25) pushUnique(audiences, ["mixed_ages"]);

  const adults = settings?.num_adults ?? 0;
  const children = settings?.num_children ?? 0;
  if (children > 0) pushUnique(audiences, ["young_children"]);
  if (adults === 2 && children === 0 && audiences.length === 0) pushUnique(audiences, ["couple"]);
  if (adults === 1 && children === 0 && audiences.length === 0) pushUnique(audiences, ["alone"]);
  if (adults + children >= 6) pushUnique(audiences, ["extended", "mixed_ages"]);

  if (settings?.stress_free) pushUnique(moods, ["relaxing", "cosy"]);

  pushUnique(audiences, refinements.audiences ?? []);
  pushUnique(moods, refinements.moods ?? []);

  const budget = refinements.budget ?? null;

  return {
    audiences,
    moods,
    budget,
    hasChildren: audiences.includes("young_children") || children > 0,
    adults,
    children,
  };
}

const COST_RANK: Record<Cost, number> = { free: 0, low: 1, treat: 2 };

function scoreIdea(idea: TraditionIdea, profile: HouseholdProfile): number {
  let score = 0;

  const audienceHits = idea.audiences.filter((a) => profile.audiences.includes(a)).length;
  if (profile.audiences.length) {
    if (audienceHits === 0) score -= 6;
    else score += 5 + audienceHits;
  }

  // Ideas that suit almost everybody are useful but shouldn't beat a
  // genuinely targeted match.
  if (idea.audiences.length >= 7) score += 1;

  const moodHits = idea.moods.filter((m) => profile.moods.includes(m)).length;
  score += moodHits * 2;

  if (profile.budget) {
    const diff = Math.abs(COST_RANK[idea.cost] - COST_RANK[profile.budget]);
    score += diff === 0 ? 2 : diff === 1 ? 0 : -2;
  } else if (idea.cost === "free") {
    score += 0.5;
  }

  // A household with no children shouldn't be shown Santa footprints.
  if (!profile.hasChildren && idea.audiences.length === 1 && idea.audiences[0] === "young_children") {
    score -= 8;
  }

  return score;
}

export interface RecommendInput {
  settings: PlannerSettings | null;
  people: Person[];
  /** Catalogue keys the user has already added, so they don't reappear. */
  alreadySavedKeys?: string[];
  refinements?: Refinements;
  limit?: number;
}

export interface Recommendation {
  heading: string;
  because: string;
  profile: HouseholdProfile;
  ideas: TraditionIdea[];
}

function headingFor(profile: HouseholdProfile): string {
  const a = profile.audiences;
  if (a.includes("young_children")) return "Ideas for a magical Christmas with young children";
  if (a.includes("extended")) return "Traditions the whole family can enjoy";
  if (a.includes("teenagers")) return "Christmas traditions for your family";
  if (a.includes("couple")) return "Christmas traditions for two";
  if (a.includes("alone")) return "Christmas traditions just for you";
  if (a.includes("young_adults")) return "Grown-up Christmas traditions";
  if (a.includes("adults_no_children")) return "Christmas traditions for a grown-up Christmas";
  return "Christmas traditions to make your own";
}

function becauseFor(profile: HouseholdProfile): string {
  if (!profile.audiences.length) {
    return "A broad mix to start with — tell us a little more and we'll tailor these.";
  }
  const bits: string[] = [];
  if (profile.children > 0) bits.push(`${profile.children} ${profile.children === 1 ? "child" : "children"}`);
  if (profile.adults > 0) bits.push(`${profile.adults} ${profile.adults === 1 ? "adult" : "adults"}`);
  const who = bits.length ? bits.join(" and ") : "your household";
  return `Chosen from what you've already told us about ${who}.`;
}

/**
 * Rank the catalogue for this household, then spread the results across
 * categories and moods so the list feels varied rather than repetitive.
 */
export function recommendTraditions({
  settings,
  people,
  alreadySavedKeys = [],
  refinements = {},
  limit = 12,
}: RecommendInput): Recommendation {
  const profile = deriveProfile(settings, people, refinements);
  const saved = new Set(alreadySavedKeys);

  const ranked = TRADITION_IDEAS.filter((i) => !saved.has(i.key))
    .map((idea, index) => ({ idea, score: scoreIdea(idea, profile), index }))
    .sort((a, b) => (b.score === a.score ? a.index - b.index : b.score - a.score));

  const perCategory = new Map<string, number>();
  const perMood = new Map<Mood, number>();
  const picked: TraditionIdea[] = [];
  const held: TraditionIdea[] = [];

  for (const { idea } of ranked) {
    if (picked.length >= limit) break;
    const catCount = perCategory.get(idea.category) ?? 0;
    const leadMood = idea.moods[0];
    const moodCount = leadMood ? (perMood.get(leadMood) ?? 0) : 0;
    if (catCount >= 2 || moodCount >= 3) {
      held.push(idea);
      continue;
    }
    perCategory.set(idea.category, catCount + 1);
    if (leadMood) perMood.set(leadMood, moodCount + 1);
    picked.push(idea);
  }

  // Top up from the held-back list if diversification left us short.
  for (const idea of held) {
    if (picked.length >= limit) break;
    picked.push(idea);
  }

  return { heading: headingFor(profile), because: becauseFor(profile), profile, ideas: picked };
}
