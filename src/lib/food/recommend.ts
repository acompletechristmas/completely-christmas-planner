import { MENU_STYLES, COURSE_ORDER, SUGGESTIONS, type MenuStyleKey, type Suggestion } from "./curated-menus";
import { type FoodOccasion, type FoodGuest } from "./types";
import type { Person } from "@/hooks/use-people";
import type { PlannerSettings } from "@/hooks/use-planner-settings";

export type GroupType =
  | "solo"
  | "couple"
  | "adults"
  | "family_young"
  | "family_teens"
  | "family_adult_children"
  | "multigenerational"
  | "large_group";

export interface RecommendationContext {
  adults: number;
  children: number;
  totalGuests: number;
  groupType: GroupType;
  /** Dietary requirement keys gathered from the occasion's guests and planner settings. */
  dietaryTags: string[];
  styleKey: MenuStyleKey;
  occasionKey: string | null;
  occasionName: string;
  /** Derived flags used by the scoring function. */
  stressFree: boolean;
  luxury: boolean;
  budget: boolean;
  buffet: boolean;
  familyFriendly: boolean;
}

export interface PersonalisedMenu {
  intro: string;
  /** Suggested number of servings to record on accepted dishes. */
  servings: number;
  /** Suggestions grouped by course, in presentation order. */
  groups: [string, Suggestion[]][];
  /** Caveats and the dietary disclaimer. */
  warnings: string[];
}

export interface CustomItem {
  id: string;
  name: string;
  meal: string;
  course: string;
}

const GROUP_LABELS: Record<GroupType, string> = {
  solo: "just you",
  couple: "a couple",
  adults: "adults",
  family_young: "a family with young children",
  family_teens: "a family with teenagers",
  family_adult_children: "a family with adult children",
  multigenerational: "a multigenerational group",
  large_group: "a large group",
};

const HOUSEHOLD_TO_GROUP: Partial<Record<string, GroupType>> = {
  alone: "solo",
  couple: "couple",
  adults_no_children: "adults",
  young_children: "family_young",
  teenagers: "family_teens",
  mixed_ages: "family_young",
  young_adults: "adults",
  extended: "multigenerational",
};

const ALLERGY_DISCLAIMER =
  "Remember to check ingredients, labels and preparation methods for individual dietary needs and allergies — these suggestions are a starting point, not a guarantee.";

function deriveGroupType(adults: number, children: number, householdTypes: string[]): GroupType {
  if (householdTypes.length > 0) {
    for (const h of householdTypes) {
      const mapped = HOUSEHOLD_TO_GROUP[h];
      if (mapped) return mapped;
    }
  }
  const total = adults + children;
  if (total === 1) return "solo";
  if (children === 0 && adults === 2) return "couple";
  if (children === 0) return "adults";
  if (total > 10) return "large_group";
  if (children > 0 && adults <= 2) return "family_young";
  return "multigenerational";
}

export function buildRecommendationContext(
  occasion: FoodOccasion,
  guests: FoodGuest[],
  people: Person[],
  settings: PlannerSettings | null,
  styleKey: MenuStyleKey,
): RecommendationContext {
  const adults = Math.max(0, occasion.num_adults);
  const children = Math.max(0, occasion.num_children);
  const totalGuests = adults + children;
  const groupType = deriveGroupType(adults, children, settings?.household_types ?? []);

  const fromGuests = guests.flatMap((g) => g.dietary_tags);
  const fromSettings = settings?.dietary_notes ? ["other"] : [];
  const dietaryTags = Array.from(new Set([...fromGuests, ...fromSettings]));

  return {
    adults,
    children,
    totalGuests,
    groupType,
    dietaryTags,
    styleKey,
    occasionKey: occasion.default_key,
    occasionName: occasion.name,
    stressFree: styleKey === "easy" || settings?.stress_free === true,
    luxury: styleKey === "luxury",
    budget: styleKey === "budget",
    buffet: styleKey === "buffet",
    familyFriendly: styleKey === "family" || children > 0,
  };
}

function isCompatible(suggestion: Suggestion, ctx: RecommendationContext): boolean {
  if (ctx.familyFriendly && suggestion.adultOnly) return false;
  if (ctx.styleKey === "vegetarian" && suggestion.contains?.includes("meat")) return false;
  if (ctx.styleKey === "vegetarian" && suggestion.contains?.includes("fish")) return false;
  if (suggestion.occasions && ctx.occasionKey && !suggestion.occasions.includes(ctx.occasionKey)) return false;
  return true;
}

function score(suggestion: Suggestion, ctx: RecommendationContext): number {
  let score = 10;

  // Style match
  if (suggestion.styles.includes(ctx.styleKey)) score += 5;

  // Occasion fit
  if (suggestion.occasions && ctx.occasionKey) {
    if (suggestion.occasions.includes(ctx.occasionKey)) score += 5;
    else score -= 10;
  }

  // Group size
  if (ctx.groupType === "couple" && suggestion.scales === false) score -= 5;
  if (ctx.groupType === "large_group" && suggestion.scales) score += 5;
  if (ctx.totalGuests >= 8 && suggestion.scales) score += 3;

  // Children / family
  if (ctx.children > 0) {
    if (suggestion.childFriendly) score += 3;
    if (suggestion.adultOnly) score -= 20;
  }
  if (ctx.familyFriendly && suggestion.childFriendly) score += 4;
  if (ctx.familyFriendly && suggestion.adultOnly) score -= 20;

  // Dietary tags
  for (const tag of ctx.dietaryTags) {
    if (suggestion.dietary_tags?.includes(tag)) score += 2;
    if (tag === "nut_allergy" && suggestion.contains?.includes("nuts")) score -= 10;
  }

  // Effort / stress
  if (ctx.stressFree) {
    if (suggestion.makeAhead === "make_ahead") score += 4;
    if (suggestion.makeAhead === "day_before") score += 2;
    if (suggestion.effort === 1) score += 4;
    if (suggestion.effort === 3) score -= 3;
  }

  // Budget / luxury
  if (ctx.budget) {
    if (suggestion.budget === 1) score += 4;
    if (suggestion.budget === 3) score -= 3;
  }
  if (ctx.luxury) {
    if (suggestion.budget === 3) score += 4;
    if (suggestion.budget === 1) score -= 3;
  }

  // Buffet prefers buffet dishes and de-prioritises traditional dinner mains
  if (ctx.buffet) {
    if (suggestion.meal === "buffet") score += 5;
    if (suggestion.meal === "dinner" && (suggestion.course === "Main" || suggestion.course === "Sides")) score -= 2;
  }

  // Couple + luxury gets a small premium bump
  if (ctx.groupType === "couple" && ctx.luxury && suggestion.budget === 3) score += 2;

  return score;
}

function getCourseCaps(ctx: RecommendationContext): Record<string, number> {
  const t = ctx.totalGuests;
  const base = {
    Breakfast: 0,
    Starters: 0,
    Main: 0,
    Cold: 0,
    Hot: 0,
    Sides: 0,
    Cheese: 0,
    Desserts: 0,
    Drinks: 0,
  };

  if (ctx.buffet) {
    return {
      ...base,
      Cold: t <= 4 ? 2 : t <= 8 ? 3 : 4,
      Hot: t <= 4 ? 2 : t <= 8 ? 3 : 4,
      Cheese: 1,
      Desserts: 1,
      Drinks: 1,
    };
  }

  if (ctx.groupType === "solo" || ctx.groupType === "couple") {
    return {
      ...base,
      Breakfast: 1,
      Starters: 1,
      Main: 1,
      Sides: 2,
      Desserts: 1,
      Drinks: 1,
    };
  }

  if (t <= 4) {
    return {
      ...base,
      Breakfast: 1,
      Starters: 1,
      Main: 1,
      Sides: 3,
      Desserts: 1,
      Drinks: 1,
    };
  }

  if (t <= 8) {
    return {
      ...base,
      Breakfast: 1,
      Starters: 2,
      Main: 1,
      Sides: 4,
      Desserts: 2,
      Drinks: 1,
    };
  }

  return {
    ...base,
    Breakfast: 1,
    Starters: 2,
    Main: 1,
    Sides: 5,
    Desserts: 2,
    Drinks: 2,
  };
}

function makeIntro(ctx: RecommendationContext): string {
  const style = MENU_STYLES.find((s) => s.key === ctx.styleKey);
  const styleName = style?.label.toLowerCase() ?? "Christmas";
  const groupName = GROUP_LABELS[ctx.groupType];
  let intro = `A ${styleName} menu for ${ctx.occasionName} — ${ctx.totalGuests} ${ctx.totalGuests === 1 ? "guest" : "guests"} (${ctx.adults} adults, ${ctx.children} children), ${groupName}.`;

  if (ctx.stressFree) intro += " With plenty you can prepare ahead so the day stays relaxed.";
  if (ctx.luxury) intro += " A little more indulgent, for a special occasion.";
  if (ctx.budget) intro += " Generous without the big spend.";
  if (ctx.buffet) intro += " Designed for grazing and sharing.";
  if (ctx.dietaryTags.length > 0) intro += " Includes options to consider for the dietary needs you've recorded.";

  return intro;
}

function computeServings(ctx: RecommendationContext): number {
  // Round total to a sensible number, with a minimum that feels generous for a couple.
  if (ctx.totalGuests <= 2) return 2;
  if (ctx.totalGuests <= 4) return 4;
  if (ctx.totalGuests <= 6) return 6;
  if (ctx.totalGuests <= 8) return 8;
  return Math.ceil(ctx.totalGuests / 2) * 2;
}

function hasDietaryOption(tag: string, suggestion: Suggestion): boolean {
  if (suggestion.dietary_tags?.includes(tag)) return true;
  if (tag === "nut_allergy" && !suggestion.contains?.includes("nuts")) return true;
  return false;
}

function tagLabel(tag: string): string {
  switch (tag) {
    case "vegetarian":
      return "vegetarian";
    case "vegan":
      return "vegan";
    case "gluten_free":
      return "gluten-free";
    case "dairy_free":
      return "dairy-free";
    case "nut_allergy":
      return "nut-free";
    default:
      return tag;
  }
}

export function buildMenu(ctx: RecommendationContext): PersonalisedMenu {
  const pool = SUGGESTIONS.filter((s) => s.styles.includes(ctx.styleKey)).filter((s) => isCompatible(s, ctx));
  const scored = pool.map((s) => ({ s, score: score(s, ctx) })).sort((a, b) => b.score - a.score);

  const caps = getCourseCaps(ctx);
  const selected: Suggestion[] = [];
  const usedKeys = new Set<string>();

  for (const course of COURSE_ORDER) {
    const cap = caps[course] ?? 0;
    if (cap === 0) continue;
    const forCourse = scored.filter((x) => x.s.course === course && !usedKeys.has(x.s.key));
    const count = Math.min(cap, forCourse.length);
    for (let i = 0; i < count; i++) {
      selected.push(forCourse[i]!.s);
      usedKeys.add(forCourse[i]!.s.key);
    }
  }

  // Ensure at least one option for each recorded dietary requirement where the pool has one.
  const warnings: string[] = [];
  const actionableTags = ctx.dietaryTags.filter((t) =>
    ["vegetarian", "vegan", "gluten_free", "dairy_free", "nut_allergy"].includes(t),
  );

  for (const tag of actionableTags) {
    const alreadySelected = selected.some((s) => hasDietaryOption(tag, s));
    if (!alreadySelected) {
      const alternative = scored.find((x) => !usedKeys.has(x.s.key) && hasDietaryOption(tag, x.s));
      if (alternative) {
        selected.push(alternative.s);
        usedKeys.add(alternative.s.key);
      } else {
        warnings.push(`We couldn't find a curated ${tagLabel(tag)} option in this style — you may want to add your own.`);
      }
    }
  }

  const groups = COURSE_ORDER.map((course) => [course, selected.filter((s) => s.course === course)] as [string, Suggestion[]]).filter(([, list]) => list.length > 0);

  return {
    intro: makeIntro(ctx),
    servings: computeServings(ctx),
    groups,
    warnings: warnings.length > 0 ? [...warnings, ALLERGY_DISCLAIMER] : [ALLERGY_DISCLAIMER],
  };
}

export function alternativesFor(suggestion: Suggestion, ctx: RecommendationContext): Suggestion[] {
  return SUGGESTIONS.filter(
    (s) => s.styles.includes(ctx.styleKey) && s.course === suggestion.course && s.key !== suggestion.key && isCompatible(s, ctx),
  )
    .map((s) => ({ s, score: score(s, ctx) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.s);
}

export function courseDefaultMeal(course: string): string {
  switch (course) {
    case "Breakfast":
      return "breakfast";
    case "Cold":
    case "Hot":
    case "Cheese":
      return "buffet";
    case "Desserts":
      return "desserts";
    case "Drinks":
      return "drinks";
    case "Starters":
    case "Main":
    case "Sides":
    default:
      return "dinner";
  }
}
