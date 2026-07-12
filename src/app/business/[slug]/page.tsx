import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  UtensilsIcon,
  CoffeeIcon,
  ShoppingBasketIcon,
  ShoppingBagIcon,
  BriefcaseIcon,
  BuildingIcon,
  BedDoubleIcon,
  LeafIcon,
  GlobeIcon,
  PhoneIcon,
  MailIcon,
  LinkIcon,
  MapPinIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { getBusinessBySlug } from "@/server/businesses";
import { CATEGORY_LABELS, PRACTICE_LABELS, govLabel } from "@/lib/eco";
import { CertificationBadges, VerificationBadge } from "@/components/eco-badges";

// ---------------------------------------------------------------------------
// Category icon (same as BusinessCard)
// ---------------------------------------------------------------------------
function CategoryIcon({ category }: { category: string }) {
  const cls = "size-12 text-primary/60";
  switch (category) {
    case "RESTAURANT":
      return <UtensilsIcon className={cls} aria-hidden="true" />;
    case "CAFE":
      return <CoffeeIcon className={cls} aria-hidden="true" />;
    case "GROCERY_MARKET":
      return <ShoppingBasketIcon className={cls} aria-hidden="true" />;
    case "RETAIL_SHOP":
      return <ShoppingBagIcon className={cls} aria-hidden="true" />;
    case "SERVICES":
      return <BriefcaseIcon className={cls} aria-hidden="true" />;
    case "COMPANY_B2B":
      return <BuildingIcon className={cls} aria-hidden="true" />;
    case "ACCOMMODATION":
      return <BedDoubleIcon className={cls} aria-hidden="true" />;
    default:
      return <LeafIcon className={cls} aria-hidden="true" />;
  }
}

// ---------------------------------------------------------------------------
// Price range indicator
// ---------------------------------------------------------------------------
function PriceRange({ value }: { value: number }) {
  const symbols = ["€", "€€", "€€€", "€€€€"];
  const labels = ["Budget-friendly", "Moderate", "Upscale", "Premium"];
  const display = symbols[value - 1] ?? "€".repeat(value);
  const label = labels[value - 1] ?? `Price range ${value}`;

  return (
    <span
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
      aria-label={`Price range: ${label}`}
    >
      <span aria-hidden="true" className="font-medium text-foreground">
        {display}
      </span>
      <span className="text-muted-foreground/70">·</span>
      <span>{label}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Full practice badges (no truncation — detail page shows all)
// ---------------------------------------------------------------------------
function AllPracticeBadges({ practices }: { practices: string[] }) {
  if (practices.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2" aria-label="Eco practices">
      {practices.map((p) => (
        <span
          key={p}
          className="inline-flex items-center rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-sm font-medium text-primary"
        >
          {PRACTICE_LABELS[p] ?? p}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// generateMetadata
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business || business.status !== "APPROVED") {
    return {
      title: "Business not found — ECOTUN",
    };
  }

  return {
    title: `${business.name} — ECOTUN`,
    description: business.shortDescription,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business || business.status !== "APPROVED") {
    notFound();
  }

  const categoryLabel = CATEGORY_LABELS[business.category] ?? business.category;
  const locationLabel = `${business.city}, ${govLabel(business.governorate)}`;

  // Determine which contact fields exist
  const hasContact = !!(
    business.website ||
    business.phone ||
    business.email ||
    business.instagram ||
    business.facebook
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeftIcon className="size-4 shrink-0" aria-hidden="true" />
          Back to directory
        </Link>
      </div>

      {/* Header block */}
      <header className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        {/* Visual band — gradient with category icon */}
        <div
          className="flex h-36 items-center justify-center bg-gradient-to-br from-primary/10 to-muted sm:h-44"
          aria-hidden="true"
        >
          <CategoryIcon category={business.category} />
        </div>

        {/* Header content */}
        <div className="bg-card px-6 py-5">
          {/* Business name */}
          <h1 className="font-heading text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
            {business.name}
          </h1>

          {/* Meta row */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="text-sm text-muted-foreground">
              {categoryLabel}
              <span aria-hidden="true"> · </span>
              {locationLabel}
            </p>
            <VerificationBadge level={business.verification} />
          </div>

          {/* Price range */}
          {business.priceRange != null && (
            <div className="mt-3">
              <PriceRange value={business.priceRange} />
            </div>
          )}
        </div>
      </header>

      {/* Description */}
      <section className="mt-8" aria-labelledby="about-heading">
        <h2
          id="about-heading"
          className="font-heading text-lg font-semibold text-foreground"
        >
          About
        </h2>
        <div className="mt-3 max-w-prose space-y-4 text-base leading-relaxed text-foreground/85">
          {business.description.split(/\n+/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* Sustainability section */}
      {(business.practices.length > 0 || business.certifications.length > 0) && (
        <section className="mt-8" aria-labelledby="sustainability-heading">
          <h2
            id="sustainability-heading"
            className="font-heading text-lg font-semibold text-foreground"
          >
            Sustainability
          </h2>

          {business.practices.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Eco Practices
              </h3>
              <AllPracticeBadges practices={business.practices} />
            </div>
          )}

          {business.certifications.length > 0 && (
            <div className="mt-5">
              <h3 className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Certifications
              </h3>
              <CertificationBadges certifications={business.certifications} />
            </div>
          )}
        </section>
      )}

      {/* Contact section */}
      {hasContact && (
        <section className="mt-8" aria-labelledby="contact-heading">
          <h2
            id="contact-heading"
            className="font-heading text-lg font-semibold text-foreground"
          >
            Contact
          </h2>
          <ul className="mt-4 flex flex-col gap-3" role="list">
            {business.website && (
              <li>
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <GlobeIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span>{business.website.replace(/^https?:\/\//, "")}</span>
                  <ExternalLinkIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </li>
            )}

            {business.phone && (
              <li>
                <a
                  href={`tel:${business.phone.replace(/\s+/g, "")}`}
                  className="inline-flex min-h-[44px] items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <PhoneIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span>{business.phone}</span>
                </a>
              </li>
            )}

            {business.email && (
              <li>
                <a
                  href={`mailto:${business.email}`}
                  className="inline-flex min-h-[44px] items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <MailIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span>{business.email}</span>
                </a>
              </li>
            )}

            {business.instagram && (
              <li>
                <a
                  href={
                    business.instagram.startsWith("@")
                      ? `https://instagram.com/${business.instagram.slice(1)}`
                      : `https://instagram.com/${business.instagram}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <LinkIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span>
                    {business.instagram.startsWith("@")
                      ? business.instagram
                      : `@${business.instagram}`}
                  </span>
                  <ExternalLinkIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </li>
            )}

            {business.facebook && (
              <li>
                <a
                  href={`https://facebook.com/${business.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <LinkIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span>{business.facebook}</span>
                  <ExternalLinkIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </li>
            )}
          </ul>
        </section>
      )}

      {/* Location section */}
      {business.lat != null && business.lng != null && (
        <section className="mt-8" aria-labelledby="location-heading">
          <h2
            id="location-heading"
            className="font-heading text-lg font-semibold text-foreground"
          >
            Location
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {business.address && (
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPinIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{business.address}</span>
              </p>
            )}
            <a
              href={`https://www.openstreetmap.org/?mlat=${business.lat}&mlon=${business.lng}&zoom=16`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] w-fit items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <MapPinIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>View on OpenStreetMap</span>
              <ExternalLinkIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
