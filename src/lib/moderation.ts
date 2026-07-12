export type Status = "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";

const ALLOWED: Record<Status, Status[]> = {
  PENDING: ["APPROVED", "REJECTED"],
  APPROVED: ["ARCHIVED"],
  REJECTED: [],
  ARCHIVED: ["APPROVED"],
};

export function canTransition(from: Status, to: Status): boolean {
  return ALLOWED[from]?.includes(to) ?? false;
}
