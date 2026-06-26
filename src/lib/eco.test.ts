import { describe, it, expect } from "vitest";
import { CATEGORY_LABELS, PRACTICE_LABELS, GOVERNORATES } from "./eco";

describe("eco labels", () => {
  it("has a human label for every category", () => {
    expect(CATEGORY_LABELS.RESTAURANT).toBe("Restaurant");
    expect(CATEGORY_LABELS.GROCERY_MARKET).toBe("Grocery & Market");
  });
  it("labels practices readably", () => {
    expect(PRACTICE_LABELS.NO_SINGLE_USE_PLASTIC).toBe("No single-use plastic");
  });
  it("lists 24 governorates", () => {
    expect(GOVERNORATES).toHaveLength(24);
  });
});
