"use client";

import { useRef, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_LABELS, PRACTICE_LABELS, GOVERNORATES, govLabel } from "@/lib/eco";

interface FilterBarProps {
  /** Current values from server (parsed from URL) */
  defaultQ: string;
  defaultCategory: string;
  defaultGovernorate: string;
  defaultPractices: string[];
}

export function FilterBar({
  defaultQ,
  defaultCategory,
  defaultGovernorate,
  defaultPractices,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local controlled state so UI is responsive during debounce
  const [q, setQ] = useState(defaultQ);
  const [showFilters, setShowFilters] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Build updated URL params from current state + overrides */
  function buildParams(overrides: {
    q?: string;
    category?: string;
    governorate?: string;
    practices?: string[];
  }) {
    const current = new URLSearchParams(searchParams.toString());

    const next: Record<string, string | string[] | undefined> = {
      q: "q" in overrides ? overrides.q : (current.get("q") ?? ""),
      category:
        "category" in overrides
          ? overrides.category
          : (current.get("category") ?? ""),
      governorate:
        "governorate" in overrides
          ? overrides.governorate
          : (current.get("governorate") ?? ""),
      practices:
        "practices" in overrides
          ? overrides.practices
          : current.getAll("practices"),
    };

    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q as string);
    if (next.category) params.set("category", next.category as string);
    if (next.governorate) params.set("governorate", next.governorate as string);
    const practices = next.practices as string[];
    for (const p of practices ?? []) {
      params.append("practices", p);
    }
    return params.toString();
  }

  function navigate(qs: string) {
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
  }

  /** Debounced search input handler */
  const handleSearch = useCallback(
    (value: string) => {
      setQ(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        navigate(buildParams({ q: value }));
      }, 250);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  );

  function handleCategory(value: string | null) {
    navigate(buildParams({ category: value ?? "" }));
  }

  function handleGovernorate(value: string | null) {
    navigate(buildParams({ governorate: value ?? "" }));
  }

  function togglePractice(practice: string) {
    const current = new URLSearchParams(searchParams.toString()).getAll(
      "practices"
    );
    const next = current.includes(practice)
      ? current.filter((p) => p !== practice)
      : [...current, practice];
    navigate(buildParams({ practices: next }));
  }

  function clearAll() {
    setQ("");
    navigate("");
  }

  const hasFilters =
    defaultQ ||
    defaultCategory ||
    defaultGovernorate ||
    defaultPractices.length > 0;

  const activePractices = new URLSearchParams(searchParams.toString()).getAll(
    "practices"
  );
  const activeCategory = new URLSearchParams(searchParams.toString()).get("category") ?? "";
  const activeGovernorate = new URLSearchParams(searchParams.toString()).get("governorate") ?? "";

  return (
    <div className="sticky top-14 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        {/* Primary row: search + category + governorate + toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <label htmlFor="filter-search" className="sr-only">
              Search businesses
            </label>
            <SearchIcon
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="filter-search"
              type="search"
              value={q}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search businesses…"
              className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 transition-colors"
              autoComplete="off"
            />
          </div>

          {/* Category select */}
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-category" className="sr-only">
              Category
            </label>
            <Select
              value={activeCategory || null}
              onValueChange={(v) => handleCategory(v)}
              id="filter-category"
            >
              <SelectTrigger
                className="h-10 min-w-36"
                aria-label="Filter by category"
              >
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Governorate select */}
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-governorate" className="sr-only">
              Governorate
            </label>
            <Select
              value={activeGovernorate || null}
              onValueChange={(v) => handleGovernorate(v)}
              id="filter-governorate"
            >
              <SelectTrigger
                className="h-10 min-w-36"
                aria-label="Filter by governorate"
              >
                <SelectValue placeholder="All governorates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All governorates</SelectItem>
                {GOVERNORATES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {govLabel(g)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Toggle practices panel on mobile */}
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            aria-controls="practice-filters"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-lg border border-input px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:hidden"
          >
            <SlidersHorizontalIcon className="size-4" aria-hidden="true" />
            <span>Filters</span>
            {activePractices.length > 0 && (
              <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {activePractices.length}
              </span>
            )}
          </button>

          {/* Clear filters */}
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-transparent px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <XIcon className="size-4" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>

        {/* Practice chips — always visible on sm+, collapsible on mobile */}
        <div
          id="practice-filters"
          className={[
            "flex flex-wrap gap-2 mt-3",
            showFilters ? "block" : "hidden sm:flex",
          ].join(" ")}
          role="group"
          aria-label="Filter by eco practices"
        >
          {Object.entries(PRACTICE_LABELS).map(([key, label]) => {
            const active = activePractices.includes(key);
            return (
              <button
                key={key}
                type="button"
                role="checkbox"
                aria-checked={active}
                onClick={() => togglePractice(key)}
                className={[
                  "inline-flex min-h-[36px] items-center rounded-full border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
