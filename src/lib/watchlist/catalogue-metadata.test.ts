import { describe, expect, it } from "vitest";
import { WATCHLIST_IDEAS, type CatalogueTitle } from "./catalogue";

/**
 * Job 2/3 architecture checks:
 * - pilot titles carry no UK certificate until values come from verified
 *   UK classification data during human curation;
 * - pilot titles carry no poster artwork yet (cards use placeholders);
 * - the optional fields accept valid values when populated (mock only).
 */
describe("watchlist catalogue metadata", () => {
  it("leaves ukCertificate undefined on every pilot title", () => {
    expect(WATCHLIST_IDEAS.every((t) => t.ukCertificate === undefined)).toBe(true);
  });

  it("leaves posterUrl undefined on every pilot title", () => {
    expect(WATCHLIST_IDEAS.every((t) => t.posterUrl === undefined)).toBe(true);
  });

  it("accepts a verified certificate and poster on a mock title", () => {
    const mock: CatalogueTitle = {
      key: "mock_verified",
      title: "Mock Verified Title",
      year: 2000,
      type: "film",
      blurb: "A mock title used only to prove the metadata shape.",
      christmas: "core",
      suitability: "all",
      strength: {},
      ukCertificate: "12A",
      posterUrl: "https://example.com/poster.webp",
    };
    expect(mock.ukCertificate).toBe("12A");
    expect(mock.posterUrl).toContain("https://");
  });
});
