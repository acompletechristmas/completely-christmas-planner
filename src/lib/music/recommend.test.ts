import { describe, expect, it } from "vitest";
import { recommendMusic, surpriseMusicItem, musicIdeaToSavedFields } from "./recommend";
import { MUSIC_IDEAS } from "./catalogue";

const family = {
  settings: { household_types: ["young_children"], num_children: 2, celebration_style: ["hosting"] },
  people: [{ age_range: "0-4" }, { age_range: "5-9" }, { age_range: "adult" }],
};

const couple = {
  settings: { household_types: ["couple"], num_children: 0, celebration_style: ["quiet_home"] },
  people: [{ age_range: "adult" }, { age_range: "adult" }],
};

describe("recommendMusic", () => {
  it("is deterministic", () => {
    const a = recommendMusic(family, { moment: "decorating" });
    const b = recommendMusic(family, { moment: "decorating" });
    expect(a.items.map((i) => i.key)).toEqual(b.items.map((i) => i.key));
  });

  it("changes the soundtrack when the moment changes", () => {
    const party = recommendMusic(couple, { moment: "party" }).items.map((i) => i.key);
    const dinner = recommendMusic(couple, { moment: "christmas_dinner" }).items.map((i) => i.key);
    expect(party).not.toEqual(dinner);
  });

  it("matches the moment for most picks", () => {
    const { items } = recommendMusic(couple, { moment: "christmas_dinner" });
    const onMoment = items.filter((i) => i.moments.includes("christmas_dinner")).length;
    expect(onMoment).toBeGreaterThanOrEqual(Math.ceil(items.length * 0.8));
  });

  it("paces a dinner soundtrack lower than a party soundtrack", () => {
    const score = (energy: string) => (energy === "low" ? 0 : energy === "mid" ? 1 : 2);
    const avg = (keys: { energy: string }[]) =>
      keys.reduce((sum, i) => sum + score(i.energy), 0) / keys.length;
    expect(avg(recommendMusic(couple, { moment: "christmas_dinner" }).items)).toBeLessThan(
      avg(recommendMusic(couple, { moment: "party" }).items),
    );
  });

  it("does not turn a household with children into an all-children soundtrack", () => {
    const { items } = recommendMusic(family, { moment: "decorating" });
    const childrenOnly = items.filter((i) => i.moods.includes("children")).length;
    expect(childrenOnly).toBeLessThan(items.length / 2);
  });

  it("keeps non-family-safe tracks away from young children", () => {
    const { items } = recommendMusic(family, { moment: "party" });
    expect(items.every((i) => i.familySafe)).toBe(true);
  });

  it("favours crooners or jazz for a romantic couple", () => {
    const { items } = recommendMusic(couple, { moment: "cosy_evening", moods: ["romantic"] });
    const smooth = items.filter(
      (i) => i.moods.includes("crooner") || i.moods.includes("jazzy") || i.moods.includes("romantic"),
    ).length;
    expect(smooth).toBeGreaterThan(items.length / 2);
  });

  it("never repeats an artist", () => {
    const { items } = recommendMusic(couple, { moment: "party" });
    const artists = items.map((i) => (i.artist ?? i.title).toLowerCase());
    expect(new Set(artists).size).toBe(artists.length);
  });

  it("excludes already-saved suggestions", () => {
    const first = recommendMusic(couple, { moment: "party" }).items[0];
    const { items } = recommendMusic(couple, { moment: "party", excludeSavedKeys: [first.key] });
    expect(items.some((i) => i.key === first.key)).toBe(false);
  });

  it("returns a surprise pick that respects the filters", () => {
    const pick = surpriseMusicItem(family, { moment: "singalong" });
    expect(pick).not.toBeNull();
    expect(pick!.familySafe).toBe(true);
  });
});

describe("musicIdeaToSavedFields", () => {
  it("carries the suggestion key and chosen moment", () => {
    const idea = MUSIC_IDEAS[0];
    const row = musicIdeaToSavedFields(idea, "party");
    expect(row.suggestion_key).toBe(idea.key);
    expect(row.source).toBe("suggestion");
    expect(row.moment).toBe("party");
    expect(row.title).toBe(idea.title);
  });
});
