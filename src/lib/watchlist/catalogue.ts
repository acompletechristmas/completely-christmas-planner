/**
 * Human-curated Christmas viewing catalogue — reference content only.
 *
 * ONE MASTER TITLE = ONE RECORD. A title never appears twice; crossovers are
 * extra keys inside `strength`.
 *
 * Nothing here is stored per user. "Add to my watchlist" creates an ordinary
 * row in the `watchlist_items` table from these fields.
 *
 * No AI, no external API, no copyrighted summaries or artwork: every blurb is
 * a short original line written for A Complete Christmas.
 *
 * PILOT SET: this file currently holds the small human-approved pilot list used
 * to prove the architecture. The wider catalogue is curated separately.
 */

import type {
  AgeBand,
  ChristmasRelevance,
  ContextKey,
  MoodKey,
  Strength,
  UkCertificate,
} from "./vocabulary";

export type ContentType = "film" | "tv_special" | "episode" | "series" | "other";

export type { AgeBand, ChristmasRelevance, ContextKey, Strength };

export interface CatalogueTitle {
  /** Stable, never reused. Also the `suggestion_key` on saved rows. */
  key: string;
  title: string;
  year?: number;
  type: ContentType;
  /** One short, original sentence describing what makes it Christmassy. */
  blurb: string;
  minutes?: number;

  /**
   * Official UK certificate (BBFC classification). Display metadata only —
   * never used by the internal suitability/recommendation engine. Populated
   * only from verified UK classification data; currently unset on all titles.
   */
  ukCertificate?: UkCertificate;

  /** Film artwork URL. Unset until poster artwork is added; cards show a placeholder meanwhile. */
  posterUrl?: string;

  /** How fundamentally the title relates to Christmas. */
  christmas: ChristmasRelevance;

  /**
   * INTERNAL A Complete Christmas viewing guidance only — never shown as an
   * official age rating and never implying any certification body.
   */
  suitability: AgeBand;

  /** The whole of human curation. Absent key = not recommended for that context. */
  strength: Partial<Record<ContextKey, Strength>>;

  /** Occasions this suits (shared timing vocabulary). */
  timings?: string[];

  /** Optional human "why" line, overriding the generated one. */
  note?: string;
}

/** Back-compat alias for existing importers. */
export type WatchlistIdea = CatalogueTitle;

export const WATCHLIST_IDEAS: CatalogueTitle[] = [
  /* ------------------------------------------------------------- romance */
  {
    key: "the_holiday",
    title: "The Holiday",
    year: 2006,
    type: "film",
    minutes: 136,
    blurb: "Two women swap homes for Christmas and quietly rebuild their lives.",
    christmas: "core",
    suitability: "12+",
    timings: ["december", "christmas_eve", "weekend"],
    note: "The definitive Christmas romance — cottage, snow, and a very good cry.",
    strength: {
      romance: "essential",
      christmas_romance: "essential",
      cosy: "essential",
      couple: "essential",
      cosy_night: "essential",
      adults: "strong",
      adult_children: "strong",
      alone: "strong",
      modern_classic: "strong",
      kids_in_bed: "strong",
      feel_good: "strong",
      comedy: "extra",
      young_children: "unsuitable",
    },
  },
  {
    key: "love_actually",
    title: "Love Actually",
    year: 2003,
    type: "film",
    minutes: 135,
    blurb: "Nine London love stories collide in the weeks before Christmas.",
    christmas: "core",
    suitability: "adult",
    timings: ["december", "christmas_eve"],
    strength: {
      romance: "essential",
      christmas_romance: "essential",
      british: "essential",
      comedy: "strong",
      couple: "essential",
      adults: "strong",
      adult_children: "strong",
      adults_no_children: "strong",
      emotional: "strong",
      modern_classic: "strong",
      kids_in_bed: "strong",
      cosy_night: "strong",
      young_children: "unsuitable",
      older_children: "unsuitable",
    },
  },
  {
    key: "last_christmas",
    title: "Last Christmas",
    year: 2019,
    type: "film",
    minutes: 103,
    blurb: "A London shop elf stumbles her way towards a better year.",
    christmas: "core",
    suitability: "12+",
    timings: ["december", "weekend"],
    strength: {
      romance: "essential",
      christmas_romance: "essential",
      british: "strong",
      couple: "essential",
      cosy: "strong",
      modern: "strong",
      adults: "strong",
      emotional: "strong",
      cosy_night: "strong",
      young_children: "unsuitable",
    },
  },
  {
    key: "love_hard",
    title: "Love Hard",
    year: 2021,
    type: "film",
    minutes: 104,
    blurb: "A catfished dating-app romance turns into a full Christmas fortnight.",
    christmas: "core",
    suitability: "12+",
    timings: ["december", "weekend"],
    strength: {
      romance: "essential",
      christmas_romance: "essential",
      comedy: "strong",
      modern: "strong",
      couple: "essential",
      adults: "strong",
      young_adults: "strong",
      cosy_night: "strong",
      young_children: "unsuitable",
    },
  },

  /* ---------------------------------------------- secret Christmas films */
  {
    key: "bridget_jones_diary",
    title: "Bridget Jones's Diary",
    year: 2001,
    type: "film",
    minutes: 97,
    blurb: "Opens and closes at Christmas, reindeer jumper and all.",
    christmas: "christmas_adjacent",
    suitability: "adult",
    timings: ["december", "any_time"],
    note: "A secret Christmas film — it starts and ends with a Christmas party.",
    strength: {
      secret_christmas: "essential",
      romance: "strong",
      comedy: "strong",
      british: "strong",
      adults: "strong",
      adults_no_children: "strong",
      kids_in_bed: "strong",
      nostalgic: "extra",
      young_children: "unsuitable",
      older_children: "unsuitable",
      teenagers: "unsuitable",
    },
  },
  {
    key: "while_you_were_sleeping",
    title: "While You Were Sleeping",
    year: 1995,
    type: "film",
    minutes: 103,
    blurb: "A lonely token collector is mistaken for a fiancée over the holidays.",
    christmas: "strong_setting",
    suitability: "8+",
    timings: ["december", "boxing_day"],
    strength: {
      secret_christmas: "essential",
      romance: "strong",
      cosy: "strong",
      nostalgic: "strong",
      feel_good: "strong",
      adults: "strong",
      couple: "strong",
      alone: "strong",
      cosy_night: "strong",
    },
  },
  {
    key: "when_harry_met_sally",
    title: "When Harry Met Sally…",
    year: 1989,
    type: "film",
    minutes: 96,
    blurb: "Years of New Year's Eves and Christmas tree runs across New York.",
    christmas: "christmas_adjacent",
    suitability: "adult",
    timings: ["december", "any_time"],
    strength: {
      secret_christmas: "essential",
      romance: "strong",
      comedy: "strong",
      classic: "strong",
      nostalgic: "strong",
      adults: "strong",
      adults_no_children: "strong",
      couple: "strong",
      kids_in_bed: "strong",
      young_children: "unsuitable",
      older_children: "unsuitable",
    },
  },

  /* -------------------------------------------------------- family comedy */
  {
    key: "elf",
    title: "Elf",
    year: 2003,
    type: "film",
    minutes: 97,
    blurb: "A human raised at the North Pole arrives in New York at full volume.",
    christmas: "core",
    suitability: "all",
    timings: ["december", "christmas_eve", "weekend"],
    note: "The safest bet in the house — genuinely funny for every age.",
    strength: {
      comedy: "essential",
      family: "essential",
      everyone_agrees: "essential",
      mixed_ages: "essential",
      multigenerational: "essential",
      feel_good: "essential",
      magical: "strong",
      young_children: "strong",
      older_children: "strong",
      teenagers: "strong",
      modern_classic: "strong",
      christmas_day_afternoon: "strong",
    },
  },
  {
    key: "home_alone",
    title: "Home Alone",
    year: 1990,
    type: "film",
    minutes: 103,
    blurb: "A boy left behind defends the house with paint tins and ingenuity.",
    christmas: "core",
    suitability: "8+",
    timings: ["december", "christmas_eve", "christmas_day"],
    strength: {
      comedy: "essential",
      family: "essential",
      everyone_agrees: "essential",
      mixed_ages: "essential",
      multigenerational: "strong",
      christmas_classics: "essential",
      nostalgic: "strong",
      older_children: "strong",
      teenagers: "strong",
      christmas_day_afternoon: "strong",
    },
  },
  {
    key: "daddys_home_2",
    title: "Daddy's Home 2",
    year: 2017,
    type: "film",
    minutes: 100,
    blurb: "Two dads and two grandads share one very crowded Christmas.",
    christmas: "core",
    suitability: "12+",
    timings: ["december", "boxing_day"],
    strength: {
      comedy: "essential",
      family: "strong",
      teenagers: "strong",
      adult_children: "strong",
      multigenerational: "strong",
      with_teenagers: "strong",
      with_grown_up_children: "strong",
      modern: "strong",
      young_children: "unsuitable",
    },
  },
  {
    key: "spirited",
    title: "Spirited",
    year: 2022,
    type: "film",
    minutes: 127,
    blurb: "A big musical retelling of A Christmas Carol from the ghosts' side.",
    christmas: "core",
    suitability: "12+",
    timings: ["december", "weekend"],
    strength: {
      musical: "essential",
      comedy: "strong",
      modern: "strong",
      adult_children: "strong",
      teenagers: "strong",
      with_grown_up_children: "strong",
      feel_good: "strong",
      family: "extra",
    },
  },

  /* ---------------------------------------------------- magical / children */
  {
    key: "arthur_christmas",
    title: "Arthur Christmas",
    year: 2011,
    type: "film",
    minutes: 97,
    blurb: "The Santa family runs a high-tech operation — and one child is missed.",
    christmas: "core",
    suitability: "all",
    timings: ["december", "christmas_eve"],
    strength: {
      magical: "essential",
      animation: "essential",
      family: "essential",
      young_children: "essential",
      british: "strong",
      older_children: "strong",
      mixed_ages: "strong",
      everyone_agrees: "strong",
      feel_good: "strong",
      christmas_eve_favourites: "strong",
    },
  },
  {
    key: "polar_express",
    title: "The Polar Express",
    year: 2004,
    type: "film",
    minutes: 100,
    blurb: "A midnight train carries doubting children to the North Pole.",
    christmas: "core",
    suitability: "all",
    timings: ["christmas_eve", "december"],
    strength: {
      magical: "essential",
      young_children: "essential",
      christmas_eve_favourites: "essential",
      animation: "strong",
      family: "strong",
      cosy: "strong",
      older_children: "strong",
      mixed_ages: "extra",
    },
  },

  /* ------------------------------------------------------ grown-up / dark */
  {
    key: "bad_santa",
    title: "Bad Santa",
    year: 2003,
    type: "film",
    minutes: 91,
    blurb: "A hopeless mall Santa runs a Christmas Eve heist he barely survives.",
    christmas: "core",
    suitability: "adult",
    timings: ["december"],
    strength: {
      dark_comedy: "essential",
      adult_christmas: "essential",
      alternative: "strong",
      adults: "strong",
      adults_no_children: "strong",
      kids_in_bed: "strong",
      comedy: "strong",
      young_children: "unsuitable",
      older_children: "unsuitable",
      teenagers: "unsuitable",
      family: "unsuitable",
    },
  },
  {
    key: "violent_night",
    title: "Violent Night",
    year: 2022,
    type: "film",
    minutes: 112,
    blurb: "Father Christmas takes on a siege at a very wealthy family's house.",
    christmas: "core",
    suitability: "adult",
    timings: ["december"],
    strength: {
      action: "essential",
      adult_christmas: "essential",
      dark_comedy: "strong",
      alternative: "strong",
      adults: "strong",
      adults_no_children: "strong",
      kids_in_bed: "strong",
      modern: "strong",
      young_children: "unsuitable",
      older_children: "unsuitable",
      teenagers: "unsuitable",
      family: "unsuitable",
    },
  },
];

/** Every mood-namespace key a title is curated for, strongest first. */
export function titleMoodKeys(item: CatalogueTitle, moodKeys: readonly MoodKey[]): MoodKey[] {
  const order: Record<string, number> = { essential: 0, strong: 1, extra: 2 };
  return moodKeys
    .filter((m) => {
      const s = item.strength[m];
      return s !== undefined && s !== "unsuitable";
    })
    .sort((a, b) => order[item.strength[a] as string] - order[item.strength[b] as string]);
}
