import type { Metadata } from "next";
import { SubmitForm } from "@/components/submit-form";

export const metadata: Metadata = {
  title: "Submit a business — ECOTUN",
  description:
    "Know an eco-conscious restaurant, shop, or service in Tunisia? Submit it to the ECOTUN directory. All submissions are moderated before going live.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Page heading */}
      <h1 className="font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
        Submit a business
      </h1>

      {/* Intro copy */}
      <div className="mt-4 space-y-3 text-base text-muted-foreground">
        <p>
          <strong className="text-foreground">ECOTUN</strong> is a curated directory of
          eco-conscious businesses across Tunisia — restaurants, cafés, grocery
          markets, retail shops, services, and more that are committed to
          sustainable, local, and ethical practices.
        </p>
        <p>
          Know a business that belongs here? Fill in the form below. Our team
          reviews every submission before it goes live to ensure the directory
          stays trustworthy and free of greenwashing.
        </p>

        {/* Moderation + anti-greenwashing notice */}
        <div className="rounded-xl border border-border bg-muted/40 px-5 py-4 text-sm">
          <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
            <li>
              <strong className="text-foreground">Moderated before publishing</strong> — submissions
              are reviewed and may be rejected if claims cannot be verified.
            </li>
            <li>
              <strong className="text-foreground">Provide evidence for eco claims</strong> — mention
              certifications, sourcing policies, waste or energy reports, or
              third-party audits in your description. Vague or unsubstantiated
              claims will be flagged.
            </li>
            <li>
              <strong className="text-foreground">No paid placements</strong> — listing is free and
              merit-based.
            </li>
          </ul>
        </div>
      </div>

      {/* Form */}
      <div className="mt-10">
        <SubmitForm />
      </div>
    </div>
  );
}
