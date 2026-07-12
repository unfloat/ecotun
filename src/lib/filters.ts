export interface BusinessFilters {
  q?: string;
  category?: string;
  governorate?: string;
  practices?: string[];
}

export function buildBusinessWhere(f: BusinessFilters): Record<string, unknown> {
  const where: Record<string, unknown> = { status: "APPROVED" };
  if (f.category) where.category = f.category;
  if (f.governorate) where.governorate = f.governorate;
  if (f.practices && f.practices.length > 0) where.practices = { hasEvery: f.practices };
  if (f.q && f.q.trim()) {
    const q = f.q.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  return where;
}
