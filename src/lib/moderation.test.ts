import { describe, it, expect } from "vitest";
import { canTransition, type Status } from "./moderation";

describe("canTransition", () => {
  it("allows PENDING -> APPROVED/REJECTED", () => {
    expect(canTransition("PENDING", "APPROVED")).toBe(true);
    expect(canTransition("PENDING", "REJECTED")).toBe(true);
  });
  it("allows APPROVED -> ARCHIVED", () => {
    expect(canTransition("APPROVED", "ARCHIVED")).toBe(true);
  });
  it("forbids REJECTED -> APPROVED", () => {
    expect(canTransition("REJECTED" as Status, "APPROVED")).toBe(false);
  });
  it("allows ARCHIVED -> APPROVED (re-publish) but nothing else", () => {
    expect(canTransition("ARCHIVED", "APPROVED")).toBe(true);
    expect(canTransition("ARCHIVED", "REJECTED")).toBe(false);
    expect(canTransition("ARCHIVED", "PENDING")).toBe(false);
  });
});
