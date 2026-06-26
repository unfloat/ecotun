import Link from "next/link";
import { FilterBar } from "@/components/filter-bar";
import { BusinessCard } from "@/components/business-card";
import { listBusinesses } from "@/server/businesses";
import type { BusinessFilters } from "@/lib/filters";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  // Parse filters from URL
  // Practices can arrive as repeated ?practices=A&practices=B
  // (FilterBar appends them that way via URLSearchParams.append)
  const rawPractices = sp["practices"];
  const practices: string[] = Array.isArray(rawPractices)
    ? rawPractices
    : rawPractices
    ? [rawPractices]
    : [];

  const filters: BusinessFilters = {
    q: typeof sp["q"] === "string" ? sp["q"] : undefined,
    category: typeof sp["category"] === "string" ? sp["category"] : undefined,
    governorate:
      typeof sp["governorate"] === "string" ? sp["governorate"] : undefined,
    practices: practices.length > 0 ? practices : undefined,
  };

  const businesses = await listBusinesses(filters);

  const hasFilters = !!(
    filters.q ||
    filters.category ||
    filters.governorate ||
    (filters.practices && filters.practices.length > 0)
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Eco-conscious businesses
            <br className="hidden sm:block" />
            <span className="text-primary"> in Tunisia</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Discover restaurants, cafés, shops, and services committed to
            sustainable, local, and ethical practices.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <FilterBar
        defaultQ={filters.q ?? ""}
        defaultCategory={filters.category ?? ""}
        defaultGovernorate={filters.governorate ?? ""}
        defaultPractices={filters.practices ?? []}
      />

      {/* Results */}
      <section
        className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6"
        aria-label="Business listings"
      >
        {/* Result count */}
        <p className="mb-6 text-sm text-muted-foreground" aria-live="polite" aria-atomic="true">
          {businesses.length === 0
            ? "No businesses found"
            : businesses.length === 1
            ? "1 business found"
            : `${businesses.length} businesses found`}
        </p>

        {businesses.length > 0 ? (
          <ul
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {businesses.map((business) => (
              <li key={business.id}>
                <BusinessCard business={business} />
              </li>
            ))}
          </ul>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/40 px-6 py-16 text-center">
            <span className="text-4xl" aria-hidden="true">🌿</span>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              No eco-businesses match your filters
            </h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Try adjusting your search or filters, or be the first to add one
              in this area.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {hasFilters && (
                <Link
                  href="/"
                  className="inline-flex min-h-[44px] items-center rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Clear filters
                </Link>
              )}
              <Link
                href="/submit"
                className="inline-flex min-h-[44px] items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Submit a business
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
