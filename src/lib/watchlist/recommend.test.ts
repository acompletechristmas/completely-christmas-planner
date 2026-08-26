import { describe, expect, it } from "vitest";
import { recommendWatchlistItems, surpriseWatchlistItem } from "./recommend";
import { WATCHLIST_IDEAS } from "./catalogue";
import { COLLECTIONS } from "./collections";
import type { Database } from "@/integrations/supabase/types";

function makeSettings(
  overrides?: Partial<Database["public"]["Tables"]["planner_settings"]["Row"]>,
): Database["public"]["Tables"]["planner_settings"]["Row"] {
  return {
    user_id: "00000000-0000-0000-0000-000000000001",
    budget_total: null,
    is_hosting: false,
    num_adults: 2,
    num_children: 0,
    is_travelling: false,
    sends_cards: false,
    decorates_indoor: false,
    decorates_outdoor: false,
    dietary_notes: null,
    planning_style: "balanced",
    stress_free: false,
    setup_completed: false,
    notes: null,
    household_types: [] as string[],
    celebration_style: [] as string[],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  } as Database["public"]["Tables"]["planner_settings"]["Row"];
}

function makePerson(
  ageRange: string,
): Database["public"]["Tables"]["people"]["Row"] {
  return {
    id: "00000000-0000-0000-0000-000000000002",
    user_id: "00000000-0000-0000-0000-000000000001",
    name: "Test",
    age_range: ageRange,
    relationship: null,
    date_of_birth: null,
    clothing_size: null,
    shoe_size: null,
    favourite_colours: null,
    favourite_shops: null,
    hobbies: null,
    favourite_films: null,
    favourite_books: null,
    favourite_games: null,
    favourite_characters: null,
    wishlist: null,
    notes: null,
    gift_budget: null,
    avatar_url: null,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    dislikes: null,
    initial_ideas: null,
    needs_stocking: false,
    needs_card: false,
  } as Database["public"]["Tables"]["people"]["Row"];
}

const keysOf = (items: { key: string }[]) => items.map((i) => i.key);

describe("suitability gate", () => {
  it("never suggests adult-band titles to young children", () => {
    const result = recommendWatchlistItems(
      {
        settings: makeSettings({ num_children: 2, household_types: ["family_with_young_children"] }),
        people: [makePerson("0-4")],
      },
      { audiences: ["young_children"] },
    );
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((i) => i.suitability === "all")).toBe(true);
    expect(keysOf(result.items)).not.toContain("bad_santa");
    expect(keysOf(result.items)).not.toContain("violent_night");
  });

  it("respects explicit unsuitable markers for the selected audience", () => {
    const result = recommendWatchlistItems(
      { settings: makeSettings({ household_types: ["family_with_teenagers"] }) },
      { audiences: ["teenagers"], moods: ["comedy"] },
    );
    expect(keysOf(result.items)).not.toContain("bad_santa");
  });

  it("lets selected adult viewers override a young child in the household", () => {
    const result = recommendWatchlistItems(
      {
        settings: makeSettings({ num_children: 2, household_types: ["family_with_young_children"] }),
        people: [makePerson("0-4")],
      },
      { audiences: ["adults"], moods: ["dark_comedy"] },
    );
    expect(keysOf(result.items)).toContain("bad_santa");
  });
});

describe("curated strength dominates", () => {
  it("leads a romance request with the essential romances", () => {
    const result = recommendWatchlistItems(
      { settings: makeSettings({ household_types: ["couple"] }) },
      { audiences: ["couple"], moods: ["romance"] },
    );
    const top = keysOf(result.items.slice(0, 4));
    expect(top).toEqual(
      expect.arrayContaining(["the_holiday", "love_actually", "last_christmas", "love_hard"]),
    );
  });

  it("puts curated comedy above generic matches for teenagers", () => {
    const result = recommendWatchlistItems(
      { settings: makeSettings({ household_types: ["family_with_teenagers"] }) },
      { audiences: ["teenagers"], moods: ["comedy"] },
    );
    const top = keysOf(result.items.slice(0, 3));
    expect(top).toEqual(expect.arrayContaining(["elf", "home_alone", "daddys_home_2"]));
  });

  it("leads grown-up children comedy with the adult-facing picks", () => {
    const result = recommendWatchlistItems(
      { settings: makeSettings({ household_types: ["family_with_adult_children"] }) },
      { audiences: ["adult_children"], moods: ["comedy"] },
    );
    const top = keysOf(result.items.slice(0, 3));
    expect(top).toEqual(expect.arrayContaining(["daddys_home_2", "love_actually", "spirited"]));
  });

  it("leads a magical family request with the magical essentials", () => {
    const result = recommendWatchlistItems(
      { settings: makeSettings({ num_children: 2 }), people: [makePerson("5-9")] },
      { audiences: ["young_children"], moods: ["magical"] },
    );
    const top = keysOf(result.items.slice(0, 2));
    expect(top).toEqual(expect.arrayContaining(["polar_express", "arthur_christmas"]));
  });

  it("returns action and dark comedy for adults", () => {
    const action = recommendWatchlistItems({}, { audiences: ["adults"], moods: ["action"] });
    expect(keysOf(action.items)[0]).toBe("violent_night");

    const dark = recommendWatchlistItems({}, { audiences: ["adults"], moods: ["dark_comedy"] });
    expect(keysOf(dark.items).slice(0, 2)).toEqual(
      expect.arrayContaining(["bad_santa", "violent_night"]),
    );
  });

  it("suits a mixed-age family with titles everyone can watch", () => {
    const result = recommendWatchlistItems({}, { audiences: ["mixed_ages"] });
    const top = keysOf(result.items.slice(0, 3));
    expect(top).toEqual(expect.arrayContaining(["elf", "home_alone", "arthur_christmas"]));
  });
});

describe("Christmas relevance", () => {
  it("keeps adjacent titles behind core titles normally", () => {
    const result = recommendWatchlistItems({}, { audiences: ["adults"], moods: ["romance"] });
    const keys = keysOf(result.items);
    expect(keys.indexOf("the_holiday")).toBeLessThan(keys.indexOf("bridget_jones_diary"));
  });

  it("inverts the bias for the Secret Christmas Films collection", () => {
    const result = recommendWatchlistItems(
      {},
      { audiences: ["adults"], collection: "secret_christmas" },
    );
    const keys = keysOf(result.items);
    expect(keys).toEqual(
      expect.arrayContaining([
        "bridget_jones_diary",
        "while_you_were_sleeping",
        "when_harry_met_sally",
      ]),
    );
    expect(keys).not.toContain("the_holiday");
  });
});

describe("collections", () => {
  it("only returns titles that opted into the collection", () => {
    for (const c of COLLECTIONS) {
      const result = recommendWatchlistItems({}, { collection: c.key, audiences: ["adults"] });
      expect(result.items.every((i) => Boolean(i.strength[c.key]))).toBe(true);
    }
  });
});

describe("engine behaviour", () => {
  it("excludes already-saved recommendation keys", () => {
    const first = recommendWatchlistItems({}, { audiences: ["couple"], moods: ["romance"] });
    const savedKey = first.items[0].key;
    const result = recommendWatchlistItems(
      {},
      { audiences: ["couple"], moods: ["romance"], excludeSavedKeys: [savedKey] },
    );
    expect(keysOf(result.items)).not.toContain(savedKey);
  });

  it("is deterministic", () => {
    const a = recommendWatchlistItems({}, { audiences: ["adults"], moods: ["comedy"] });
    const b = recommendWatchlistItems({}, { audiences: ["adults"], moods: ["comedy"] });
    expect(keysOf(a.items)).toEqual(keysOf(b.items));
  });

  it("returns a surprise item that is not the top pick", () => {
    const refinements = { audiences: ["adults"] } as const;
    const result = recommendWatchlistItems({}, { ...refinements });
    const surprise = surpriseWatchlistItem({}, { ...refinements });
    expect(surprise).not.toBeNull();
    if (surprise) expect(surprise.key).not.toBe(result.items[0].key);
  });
});

describe("catalogue integrity", () => {
  it("has no duplicate keys", () => {
    const keys = WATCHLIST_IDEAS.map((i) => i.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("has no duplicate titles", () => {
    const titles = WATCHLIST_IDEAS.map((i) => i.title.toLowerCase());
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("contains the approved pilot set", () => {
    const keys = new Set(WATCHLIST_IDEAS.map((i) => i.key));
    for (const key of [
      "the_holiday",
      "love_actually",
      "last_christmas",
      "love_hard",
      "bridget_jones_diary",
      "while_you_were_sleeping",
      "when_harry_met_sally",
      "elf",
      "home_alone",
      "daddys_home_2",
      "arthur_christmas",
      "polar_express",
      "bad_santa",
      "violent_night",
      "spirited",
    ]) {
      expect(keys.has(key)).toBe(true);
    }
  });

  it("uses only valid content types", () => {
    const valid = new Set(["film", "tv_special", "episode", "series", "other"]);
    expect(WATCHLIST_IDEAS.every((i) => valid.has(i.type))).toBe(true);
  });
});
