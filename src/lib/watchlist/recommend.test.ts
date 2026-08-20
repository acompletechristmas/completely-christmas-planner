import { describe, expect, it } from "vitest";
import { recommendWatchlistItems, surpriseWatchlistItem } from "./recommend";
import { WATCHLIST_IDEAS } from "./catalogue";
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

describe("recommendWatchlistItems", () => {
  it("returns family-safe suggestions when a young child is in the household", () => {
    const result = recommendWatchlistItems({
      settings: makeSettings({ num_children: 2, household_types: ["family_with_young_children"] }),
      people: [makePerson("0-4")],
    });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((i) => i.ageBand === "all" || i.ageBand === "5+" || i.ageBand === "8+")).toBe(true);
    expect(result.heading).toContain("little ones");
  });

  it("allows adult-only suggestions when the user explicitly selects adults", () => {
    const result = recommendWatchlistItems(
      {
        settings: makeSettings({ num_children: 2, household_types: ["family_with_young_children"] }),
        people: [makePerson("0-4")],
      },
      { audiences: ["adults_no_children"] },
    );
    expect(result.items.length).toBeGreaterThan(0);
    const adultItems = result.items.filter((i) => i.ageBand === "adult");
    expect(adultItems.length).toBeGreaterThan(0);
  });

  it("excludes already-saved recommendation keys", () => {
    const first = recommendWatchlistItems(
      { settings: makeSettings({ household_types: ["couple"] }) },
      { audiences: ["couple"] },
    );
    const savedKey = first.items[0].key;
    const result = recommendWatchlistItems(
      { settings: makeSettings({ household_types: ["couple"] }) },
      { audiences: ["couple"], excludeSavedKeys: [savedKey] },
    );
    expect(result.items.some((i) => i.key === savedKey)).toBe(false);
  });

  it("diversifies results by mood and type", () => {
    const result = recommendWatchlistItems(
      { settings: makeSettings({ household_types: ["mixed_ages"] }) },
      { audiences: ["mixed_ages"] },
    );
    const primaryMoods = result.items.map((i) => i.moods[0]);
    const uniqueMoods = new Set(primaryMoods);
    expect(uniqueMoods.size).toBeGreaterThanOrEqual(2);
  });

  it("filters unsuitable items by age band", () => {
    const result = recommendWatchlistItems(
      { settings: makeSettings({ household_types: ["alone"] }) },
      { audiences: ["alone"] },
    );
    expect(result.items.some((i) => i.ageBand === "adult")).toBe(true);
  });

  it("respects mood filters", () => {
    const result = recommendWatchlistItems(
      { settings: makeSettings({ household_types: ["couple"] }) },
      { audiences: ["couple"], moods: ["romantic"] },
    );
    const top = result.items.slice(0, 6);
    expect(top.filter((i) => i.moods.includes("romantic")).length).toBeGreaterThanOrEqual(3);
  });

  it("returns a surprise item that is not the top pick", () => {
    const context = { settings: makeSettings({ household_types: ["couple"] }) };
    const result = recommendWatchlistItems(context, { audiences: ["couple"] });
    const surprise = surpriseWatchlistItem(context, { audiences: ["couple"] });
    expect(surprise).not.toBeNull();
    if (surprise) {
      expect(result.items[0].key).not.toBe(surprise.key);
    }
  });
});

describe("catalogue integrity", () => {
  it("has no duplicate keys", () => {
    const keys = WATCHLIST_IDEAS.map((i) => i.key);
    const unique = new Set(keys);
    expect(unique.size).toBe(keys.length);
  });

  it("has at least 80 curated entries", () => {
    expect(WATCHLIST_IDEAS.length).toBeGreaterThanOrEqual(80);
  });

  it("uses only valid content types", () => {
    const valid = new Set(["film", "tv_special", "episode", "series", "other"]);
    expect(WATCHLIST_IDEAS.every((i) => valid.has(i.type))).toBe(true);
  });
});
