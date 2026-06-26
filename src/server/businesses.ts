import { db } from "@/lib/db";
import { buildBusinessWhere, type BusinessFilters } from "@/lib/filters";

/** Public directory query — only APPROVED rows, verified businesses surfaced first. */
export async function listBusinesses(filters: BusinessFilters) {
  return db.business.findMany({
    where: buildBusinessWhere(filters) as never,
    orderBy: [{ verification: "desc" }, { createdAt: "desc" }],
    include: { certifications: true },
  });
}

/** Single listing by slug (caller decides whether to expose non-APPROVED). */
export async function getBusinessBySlug(slug: string) {
  return db.business.findUnique({
    where: { slug },
    include: { certifications: true },
  });
}

/** Admin moderation queue — oldest pending first. */
export async function listPending() {
  return db.business.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: { certifications: true },
  });
}
