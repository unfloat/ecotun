import { describe, it, expect } from "vitest";
import { buildBusinessWhere } from "./filters";

describe("buildBusinessWhere", () => {
  it("always restricts to APPROVED for public", () => {
    const w = buildBusinessWhere({});
    expect(w.status).toBe("APPROVED");
  });
  it("adds category and governorate when present", () => {
    const w = buildBusinessWhere({ category: "CAFE", governorate: "TUNIS" });
    expect(w.category).toBe("CAFE");
    expect(w.governorate).toBe("TUNIS");
  });
  it("requires all selected practices (hasEvery)", () => {
    const w = buildBusinessWhere({ practices: ["LOCALLY_SOURCED", "RENEWABLE_ENERGY"] });
    expect(w.practices).toEqual({ hasEvery: ["LOCALLY_SOURCED", "RENEWABLE_ENERGY"] });
  });
  it("text search matches name or description, case-insensitive", () => {
    const w = buildBusinessWhere({ q: "vegan" });
    expect(w.OR).toEqual([
      { name: { contains: "vegan", mode: "insensitive" } },
      { shortDescription: { contains: "vegan", mode: "insensitive" } },
      { description: { contains: "vegan", mode: "insensitive" } },
    ]);
  });
});
