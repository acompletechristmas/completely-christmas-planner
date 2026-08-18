import { describe, expect, it } from "vitest";
import { buildMenu, buildRecommendationContext, alternativesFor } from "./recommend";
import type { FoodOccasion, FoodGuest } from "./types";
import type { Person } from "@/hooks/use-people";
import type { PlannerSettings } from "@/hooks/use-planner-settings";

function makeOccasion(overrides: Partial<FoodOccasion> = {}): FoodOccasion {
  return {
    id: "occ-1",
    user_id: "u-1",
    name: "Christmas Day",
    occasion_date: "2026-12-25",
    num_adults: 4,
    num_children: 2,
    notes: null,
    is_default: true,
    default_key: "christmas_day",
    sort_order: 0,
    created_at: "",
    updated_at: "",
    ...overrides,
  };
}

function makeGuest(overrides: Partial<FoodGuest> = {}): FoodGuest {
  return {
    id: "g-1",
    user_id: "u-1",
    occasion_id: "occ-1",
    person_id: null,
    guest_name: "Alex",
    dietary_tags: [],
    dietary_notes: null,
    sort_order: 0,
    created_at: "",
    updated_at: "",
    ...overrides,
  };
}

const people: Person[] = [];
const settings: PlannerSettings | null = null;

describe("buildRecommendationContext", () => {
  it("derives a couple from two adults", () => {
    const ctx = buildRecommendationContext(
      makeOccasion({ num_adults: 2, num_children: 0 }),
      [],
      people,
      settings,
      "traditional",
    );
    expect(ctx.groupType).toBe("couple");
    expect(ctx.totalGuests).toBe(2);
  });

  it("derives a family with young children", () => {
    const ctx = buildRecommendationContext(
      makeOccasion({ num_adults: 2, num_children: 3 }),
      [],
      people,
      settings,
      "traditional",
    );
    expect(ctx.groupType).toBe("family_young");
  });

  it("collects dietary tags from guests", () => {
    const guest = makeGuest({ dietary_tags: ["vegetarian", "gluten_free"] });
    const ctx = buildRecommendationContext(makeOccasion(), [guest], people, settings, "traditional");
    expect(ctx.dietaryTags).toContain("vegetarian");
    expect(ctx.dietaryTags).toContain("gluten_free");
  });
});

describe("buildMenu", () => {
  it("produces a balanced traditional menu", () => {
    const ctx = buildRecommendationContext(
      makeOccasion({ num_adults: 6, num_children: 2 }),
      [],
      people,
      settings,
      "traditional",
    );
    const menu = buildMenu(ctx);
    const courses = menu.groups.map(([c]) => c);
    expect(courses).toContain("Starters");
    expect(courses).toContain("Main");
    expect(courses).toContain("Sides");
    expect(courses).toContain("Desserts");
    expect(menu.servings).toBeGreaterThanOrEqual(8);
    expect(menu.warnings[0]).toContain("allergies");
  });

  it("suggests a smaller menu for a couple", () => {
    const ctx = buildRecommendationContext(
      makeOccasion({ num_adults: 2, num_children: 0 }),
      [],
      people,
      settings,
      "traditional",
    );
    const menu = buildMenu(ctx);
    const sides = menu.groups.find(([c]) => c === "Sides")?.[1]?.length ?? 0;
    expect(sides).toBeLessThanOrEqual(2);
    expect(menu.servings).toBe(2);
  });

  it("includes a vegetarian option when a guest is vegetarian", () => {
    const guest = makeGuest({ dietary_tags: ["vegetarian"] });
    const ctx = buildRecommendationContext(makeOccasion(), [guest], people, settings, "traditional");
    const menu = buildMenu(ctx);
    const all = menu.groups.flatMap(([, list]) => list);
    expect(all.some((s) => s.dietary_tags?.includes("vegetarian"))).toBe(true);
  });

  it("avoids adult-only dishes for family-friendly styles", () => {
    const ctx = buildRecommendationContext(makeOccasion({ num_children: 3 }), [], people, settings, "family");
    const menu = buildMenu(ctx);
    const all = menu.groups.flatMap(([, list]) => list);
    expect(all.some((s) => s.adultOnly)).toBe(false);
  });

  it("low-stress easy menu prefers make-ahead dishes", () => {
    const ctx = buildRecommendationContext(makeOccasion(), [], people, settings, "easy");
    const menu = buildMenu(ctx);
    const all = menu.groups.flatMap(([, list]) => list);
    const makeAhead = all.filter((s) => s.makeAhead && s.makeAhead !== "on_the_day").length;
    expect(makeAhead / all.length).toBeGreaterThan(0.3);
  });

  it("warns when a dietary requirement cannot be met", () => {
    const guest = makeGuest({ dietary_tags: ["dairy_free"] });
    const ctx = buildRecommendationContext(makeOccasion(), [guest], people, settings, "luxury");
    const menu = buildMenu(ctx);
    expect(menu.warnings.some((w) => w.toLowerCase().includes("dairy-free"))).toBe(true);
  });
});

describe("alternativesFor", () => {
  it("returns alternatives for a suggestion", () => {
    const ctx = buildRecommendationContext(makeOccasion(), [], people, settings, "traditional");
    const menu = buildMenu(ctx);
    const suggestion = menu.groups.flatMap(([, list]) => list)[0];
    expect(suggestion).toBeDefined();
    const alts = alternativesFor(suggestion!, ctx);
    expect(alts.length).toBeGreaterThan(0);
    expect(alts[0]!.key).not.toBe(suggestion!.key);
  });
});
