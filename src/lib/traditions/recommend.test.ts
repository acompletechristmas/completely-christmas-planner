import { describe, expect, it } from "vitest";
import { recommendTraditions } from "./recommend";
import type { PlannerSettings } from "@/hooks/use-planner-settings";
import type { Person } from "@/hooks/use-people";

function settings(patch: Partial<PlannerSettings>): PlannerSettings {
  return {
    user_id: "u1",
    budget_total: null,
    is_hosting: false,
    num_adults: 2,
    num_children: 0,
    is_travelling: false,
    sends_cards: true,
    decorates_indoor: true,
    decorates_outdoor: false,
    dietary_notes: null,
    planning_style: "weekly",
    stress_free: false,
    setup_completed: true,
    notes: null,
    household_types: [],
    celebration_style: [],
    ...patch,
  };
}

const noPeople: Person[] = [];

describe("recommendTraditions", () => {
  it("suits a family with young children", () => {
    const r = recommendTraditions({
      settings: settings({ household_types: ["young_children"], num_children: 2 }),
      people: noPeople,
    });
    expect(r.heading).toMatch(/young children/i);
    const keys = r.ideas.map((i) => i.key);
    expect(keys).toContain("christmas_eve_box");
    expect(r.ideas.length).toBeGreaterThanOrEqual(8);
  });

  it("keeps small-children-only ideas away from a couple", () => {
    const r = recommendTraditions({
      settings: settings({ household_types: ["couple"] }),
      people: noPeople,
    });
    expect(r.heading).toBe("Christmas traditions for two");
    const keys = r.ideas.map((i) => i.key);
    expect(keys).not.toContain("santa_footprints");
    expect(keys).not.toContain("reindeer_food");
  });

  it("offers positive ideas for someone spending Christmas alone", () => {
    const r = recommendTraditions({
      settings: settings({ household_types: ["alone"], num_adults: 1 }),
      people: noPeople,
    });
    expect(r.heading).toMatch(/just for you/i);
    const keys = r.ideas.map((i) => i.key);
    expect(keys.some((k) => ["favourite_breakfast", "my_film", "yearly_reflection", "treat_yourself"].includes(k))).toBe(
      true,
    );
  });

  it("prefers whole-family ideas for extended households", () => {
    const r = recommendTraditions({
      settings: settings({ household_types: ["extended"], num_adults: 8 }),
      people: noPeople,
    });
    expect(r.heading).toMatch(/whole family/i);
    expect(r.ideas.every((i) => i.audiences.includes("extended") || i.audiences.length >= 7)).toBe(true);
  });

  it("never repeats a tradition the user already saved", () => {
    const r = recommendTraditions({
      settings: settings({ household_types: ["young_children"] }),
      people: noPeople,
      alreadySavedKeys: ["christmas_eve_box"],
    });
    expect(r.ideas.map((i) => i.key)).not.toContain("christmas_eve_box");
  });

  it("respects a free-only budget refinement", () => {
    const r = recommendTraditions({
      settings: settings({ household_types: ["mixed_ages"] }),
      people: noPeople,
      refinements: { budget: "free" },
    });
    expect(r.ideas.filter((i) => i.cost === "free").length).toBeGreaterThanOrEqual(6);
  });

  it("keeps the list varied rather than one category over and over", () => {
    const r = recommendTraditions({
      settings: settings({ household_types: ["mixed_ages"] }),
      people: noPeople,
    });
    const counts = new Map<string, number>();
    for (const i of r.ideas) counts.set(i.category, (counts.get(i.category) ?? 0) + 1);
    expect(Math.max(...counts.values())).toBeLessThanOrEqual(3);
  });

  it("falls back to a broad mix when nothing is known", () => {
    const r = recommendTraditions({ settings: null, people: noPeople });
    expect(r.ideas.length).toBe(12);
    expect(r.because).toMatch(/broad mix/i);
  });
});
