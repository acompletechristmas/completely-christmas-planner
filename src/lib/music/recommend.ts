/**
 * Deterministic soundtrack builder for My Christmas Music.
 *
 * No external APIs, no AI, no randomness. The same household + refinements
 * always produce the same suggested soundtrack.
 */

import { MUSIC_IDEAS, type Audience, type Energy, type MusicIdea, type MusicMood } from "./catalogue";
import { momentLabel, musicMoodLabel } from "./constants";
import type { NewMusicItem } from "@/hooks/use-music";

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

export interface MusicRefinements {
  /** The moment being planned for — the strongest signal. */
  moment?: string;
  /** Optional mood chips. */
  moods?: MusicMood[];
  /** Suggestion keys already saved, excluded from the results. */
  excludeSavedKeys?: string[];
  /** How many items to return (defaults to 12). */
  limit?: number;
}

export interface MusicRecommendationResult {
  heading: string;
  subheading: string;
  explanation: string;
  items: MusicIdea[];
  totalAvailable: number;
  audiences: Audience[];
}

const AUDIENCE_LABELS: Record<Audience, string> = {
  young_children: "young children",
  older_children: "older children",
  teenagers: "teenagers",
  young_adults: "young adults",
  couple: "a couple",
  adults_no_children: "adults",
  mixed_ages: "mixed ages",
  extended: "extended family",
  alone: "listening on your own",
};

export function audienceLabel(a: Audience): string {
  return AUDIENCE_LABELS[a] ?? a;
}

/** Energy shape per moment — how many low / mid / high slots to aim for. */
const ENERGY_CURVES: Record<string, Energy[]> = {
  decorating: ["mid", "high", "high", "mid", "high", "mid", "high", "mid", "high", "mid", "high", "mid"],
  wrapping: ["low", "low", "mid", "low", "mid", "low", "mid", "low", "mid", "low", "mid", "low"],
  cooking: ["mid", "high", "mid", "high", "high", "mid", "high", "mid", "high", "mid", "high", "mid"],
  christmas_eve: ["low", "low", "mid", "low", "mid", "low", "low", "mid", "low", "mid", "low", "low"],
  christmas_morning: ["mid", "high", "mid", "high", "mid", "mid", "high", "mid", "high", "mid", "mid", "high"],
  christmas_dinner: ["low", "mid", "low", "low", "mid", "low", "mid", "low", "low", "mid", "low", "mid"],
  party: ["high", "high", "mid", "high", "high", "high", "mid", "high", "high", "mid", "high", "high"],
  singalong: ["mid", "high", "mid", "mid", "high", "mid", "high", "mid", "mid", "high", "mid", "high"],
  cosy_evening: ["low", "low", "mid", "low", "low", "mid", "low", "mid", "low", "low", "mid", "low"],
  travelling: ["mid", "high", "mid", "mid", "high", "mid", "high", "mid", "mid", "high", "mid", "mid"],
  background: ["low", "low", "low", "mid", "low", "low", "mid", "low", "low", "mid", "low", "low"],
  any_time: ["mid", "low", "high", "mid", "low", "mid", "high", "low", "mid", "high", "low", "mid"],
};

function curveFor(moment: string | undefined): Energy[] {
  return ENERGY_CURVES[moment ?? "any_time"] ?? ENERGY_CURVES.any_time;
}

function ageRangeToAudience(ageRange?: string | null): Audience | null {
  if (!ageRange) return null;
  const ar = ageRange.toLowerCase();
  if (ar.includes("0-4") || ar.includes("5-9") || ar.includes("baby") || ar.includes("toddler"))
    return "young_children";
  if (ar.includes("10-12") || ar.includes("child") || ar.includes("pre-teen")) return "older_children";
  if (ar.includes("13") || ar.includes("teen")) return "teenagers";
  if (ar.includes("18") || ar.includes("young adult")) return "young_adults";
  return null;
}

/** Derive who the music is for from existing planner settings and People. */
export function inferAudiences(context: HouseholdContext): Audience[] {
  const found = new Set<Audience>();
  const types = context.settings?.household_types ?? [];

  for (const t of types) {
    if (t === "young_children") found.add("young_children");
    if (t === "teenagers") found.add("teenagers");
    if (t === "young_adults") found.add("young_adults");
    if (t === "couple") found.add("couple");
    if (t === "adults_no_children") found.add("adults_no_children");
    if (t === "mixed_ages") found.add("mixed_ages");
    if (t === "extended") found.add("extended");
    if (t === "alone") found.add("alone");
  }

  for (const p of context.people ?? []) {
    const a = ageRangeToAudience(p.age_range);
    if (a) found.add(a);
  }

  if ((context.settings?.num_children ?? 0) > 0) found.add("young_children");

  if (found.size === 0) return ["mixed_ages"];
  if (found.size > 1) found.add("mixed_ages");
  return Array.from(found);
}

function hasYoungChildren(audiences: Audience[]): boolean {
  return audiences.includes("young_children");
}

interface Scored {
  item: MusicIdea;
  score: number;
}

function scoreItem(
  item: MusicIdea,
  audiences: Audience[],
  moment: string | undefined,
  moods: Set<MusicMood>,
  context: HouseholdContext,
): number {
  let score = 0;

  // Moment fit is the strongest signal.
  if (moment && moment !== "any_time") {
    if (item.moments.includes(moment)) score += 6;
    else score -= 4;
  }

  // Audience fit.
  let audienceHits = 0;
  for (const a of audiences) {
    if (item.audiences.includes(a)) audienceHits++;
  }
  score += audienceHits * 1.5;
  if (audienceHits === 0) score -= 2;

  // Mood fit.
  for (const m of item.moods) {
    if (moods.has(m)) score += 2;
  }

  // Broad appeal helps a mixed or multi-generational room.
  const mixed = audiences.includes("mixed_ages") || audiences.includes("extended");
  if (mixed && item.audiences.length >= 7) score += 1.5;

  // A couple or adults-only room leans crooner / jazz / romantic.
  if (
    (audiences.includes("couple") || audiences.includes("adults_no_children")) &&
    !audiences.includes("young_children")
  ) {
    if (item.moods.includes("crooner") || item.moods.includes("jazzy")) score += 1.5;
    if (moods.has("romantic") && item.moods.includes("romantic")) score += 2;
    if (item.moods.includes("children")) score -= 3;
  }

  // Children in the room get some music of their own, but never all of it.
  if (hasYoungChildren(audiences) && item.moods.includes("children")) score += 1;

  // Celebration-style hints from existing planner settings.
  const styles = context.settings?.celebration_style ?? [];
  if (styles.includes("quiet_home") && item.energy === "low") score += 0.75;
  if (styles.includes("hosting") && item.moods.includes("party")) score += 0.5;
  if (styles.includes("visiting") && item.moments.includes("travelling")) score += 0.5;

  return score;
}

/**
 * Build a soundtrack rather than a ranked list: fill an energy curve for the
 * moment while keeping artists, eras and styles varied.
 */
export function recommendMusic(
  context: HouseholdContext,
  refinements: MusicRefinements = {},
): MusicRecommendationResult {
  const audiences = inferAudiences(context);
  const moment = refinements.moment;
  const moods = new Set(refinements.moods ?? []);
  const saved = new Set(refinements.excludeSavedKeys ?? []);
  const limit = refinements.limit ?? 12;

  const candidates = MUSIC_IDEAS.filter((item) => {
    if (saved.has(item.key)) return false;
    // Keep the room family-friendly when young children are listening.
    if (!item.familySafe && hasYoungChildren(audiences)) return false;
    return true;
  });

  const scored: Scored[] = candidates
    .map((item) => ({ item, score: scoreItem(item, audiences, moment, moods, context) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => (b.score !== a.score ? b.score - a.score : a.item.title.localeCompare(b.item.title)));

  const curve = curveFor(moment).slice(0, limit);
  const picked: MusicIdea[] = [];
  const used = new Set<string>();
  const artistCount = new Map<string, number>();
  const eraCount = new Map<string, number>();
  const childrenCount = { n: 0 };

  const canTake = (item: MusicIdea): boolean => {
    if (used.has(item.key)) return false;
    const artist = (item.artist ?? item.title).toLowerCase();
    if ((artistCount.get(artist) ?? 0) >= 1) return false;
    if ((eraCount.get(item.era) ?? 0) >= Math.max(3, Math.ceil(limit / 3))) return false;
    // Never let a mixed household turn into an all-children soundtrack.
    if (item.moods.includes("children") && !audiences.includes("young_children")) return false;
    if (item.moods.includes("children") && childrenCount.n >= Math.ceil(limit / 3)) return false;
    return true;
  };

  const take = (item: MusicIdea) => {
    picked.push(item);
    used.add(item.key);
    const artist = (item.artist ?? item.title).toLowerCase();
    artistCount.set(artist, (artistCount.get(artist) ?? 0) + 1);
    eraCount.set(item.era, (eraCount.get(item.era) ?? 0) + 1);
    if (item.moods.includes("children")) childrenCount.n++;
  };

  // Pass one: fill each slot with the best-scoring track of that energy.
  for (const energy of curve) {
    const next = scored.find((s) => s.item.energy === energy && canTake(s.item));
    if (next) take(next.item);
  }

  // Pass two: top up from the best remaining candidates.
  for (const s of scored) {
    if (picked.length >= limit) break;
    if (canTake(s.item)) take(s.item);
  }

  const { heading, subheading, explanation } = buildHeading(audiences, moment, refinements.moods ?? [], scored.length);

  return {
    heading,
    subheading,
    explanation,
    items: picked,
    totalAvailable: scored.length,
    audiences,
  };
}

/** One deterministic pick, rotating through the suggestions by saved count. */
export function surpriseMusicItem(
  context: HouseholdContext,
  refinements: MusicRefinements = {},
): MusicIdea | null {
  const { items } = recommendMusic(context, { ...refinements, limit: 24 });
  if (items.length === 0) return null;
  const index = (refinements.excludeSavedKeys?.length ?? 0) % items.length;
  return items[index];
}

function buildHeading(
  audiences: Audience[],
  moment: string | undefined,
  moods: MusicMood[],
  total: number,
): { heading: string; subheading: string; explanation: string } {
  const primary =
    audiences.find((a) => a === "young_children") ??
    audiences.find((a) => a === "couple" || a === "alone" || a === "adults_no_children") ??
    audiences.find((a) => a === "extended") ??
    "mixed_ages";

  let heading = "Your suggested soundtrack";
  if (moment && moment !== "any_time") {
    heading = `A soundtrack for ${momentLabel(moment).toLowerCase()}`;
  }

  const moodText = moods.map((m) => musicMoodLabel(m).toLowerCase()).join(" and ");
  const subheading = moodText
    ? `Chosen for a ${moodText} feel, and paced for the moment.`
    : "Chosen for your household and paced for the moment.";

  const explanation = `Suggestions matched to ${audienceLabel(primary as Audience)}${
    moment && moment !== "any_time" ? ` and ${momentLabel(moment).toLowerCase()}` : ""
  }${moodText ? `, leaning ${moodText}` : ""}. ${total} ideas fit right now.`;

  return { heading, subheading, explanation };
}

/** Turn a catalogue idea into a saveable row for `music_items`. */
export function musicIdeaToSavedFields(idea: MusicIdea, moment?: string): NewMusicItem {
  return {
    title: idea.title,
    artist: idea.artist ?? null,
    item_type: idea.type,
    moment: moment && moment !== "any_time" ? moment : (idea.moments[0] ?? "any_time"),
    moods: [...idea.moods],
    notes: idea.line,
    source: "suggestion",
    suggestion_key: idea.key,
  };
}
