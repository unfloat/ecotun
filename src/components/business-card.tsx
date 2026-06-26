import Link from "next/link";
import {
  UtensilsIcon,
  CoffeeIcon,
  ShoppingBasketIcon,
  ShoppingBagIcon,
  BriefcaseIcon,
  BuildingIcon,
  BedDoubleIcon,
  LeafIcon,
} from "lucide-react";
import { CATEGORY_LABELS, govLabel } from "@/lib/eco";
import { PracticeBadges, VerificationBadge } from "./eco-badges";

// Map category to a lucide icon
function CategoryIcon({ category }: { category: string }) {
  const cls = "size-10 text-primary/60";
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

interface Business {
  id: string;
  slug: string;
  name: string;
  category: string;
  governorate: string;
  shortDescription: string;
  practices: string[];
  verification: string;
  certifications: Array<{
    type: string;
    evidenceUrl?: string | null;
  }>;
}

export function BusinessCard({ business }: { business: Business }) {
  return (
    <article
      className="group/card flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Visual band — gradient with category icon (no images in seed) */}
      <div
        className="flex h-24 items-center justify-center bg-gradient-to-br from-primary/10 to-muted"
        aria-hidden="true"
      >
        <CategoryIcon category={business.category} />
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title — primary link */}
        <h3 className="font-heading text-base font-semibold leading-snug">
          <Link
            href={`/business/${business.slug}`}
            className="text-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            {business.name}
          </Link>
        </h3>

        {/* Meta row */}
        <p className="text-xs text-muted-foreground">
          {CATEGORY_LABELS[business.category] ?? business.category}
          {" · "}
          {govLabel(business.governorate)}
        </p>

        {/* Short description — clamped to 2 lines */}
        <p className="line-clamp-2 text-sm text-foreground/80 leading-relaxed">
          {business.shortDescription}
        </p>

        {/* Practice badges */}
        {business.practices.length > 0 && (
          <PracticeBadges practices={business.practices} />
        )}

        {/* Spacer + verification badge pinned to bottom */}
        <div className="mt-auto pt-1">
          <VerificationBadge level={business.verification} />
        </div>
      </div>
    </article>
  );
}
