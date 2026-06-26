import { describe, it, expect } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Green Bites Café")).toBe("green-bites-cafe");
  });
  it("strips punctuation and collapses spaces", () => {
    expect(slugify("  Eco--Shop!!  Tunis ")).toBe("eco-shop-tunis");
  });
});
