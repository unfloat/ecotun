import { describe, it, expect } from "vitest";
import { submissionSchema } from "./validation";

const valid = {
  name: "Green Bites",
  category: "RESTAURANT",
  shortDescription: "Plant-forward bistro",
  description: "A plant-forward bistro sourcing locally in Tunis.",
  governorate: "TUNIS",
  city: "Tunis",
  practices: ["LOCALLY_SOURCED"],
  website: "https://greenbites.tn",
};

describe("submissionSchema", () => {
  it("accepts a valid submission", () => {
    expect(submissionSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects empty name", () => {
    expect(submissionSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });
  it("rejects a bad website url", () => {
    expect(submissionSchema.safeParse({ ...valid, website: "not-a-url" }).success).toBe(false);
  });
  it("rejects an unknown category", () => {
    expect(submissionSchema.safeParse({ ...valid, category: "NOPE" }).success).toBe(false);
  });
});
