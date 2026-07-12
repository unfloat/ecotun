import type { Metadata } from "next";
import { CheckCircleIcon } from "lucide-react";
import { listPending } from "@/server/businesses";
import { CATEGORY_LABELS, VERIFICATION_LABELS, govLabel } from "@/lib/eco";
import { PracticeBadges, CertificationBadges, VerificationBadge } from "@/components/eco-badges";
import { ModerationActions } from "@/components/moderation-actions";

export const metadata: Metadata = {
  title: "Moderation queue — ECOTUN Admin",
};

export default async function AdminPage() {
  const pending = await listPending();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Moderation queue
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {pending.length === 0
            ? "No pending submissions"
            : pending.length === 1
            ? "1 pending submission"
            : `${pending.length} pending submissions`}
        </p>
      </div>

      {pending.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/40 px-6 py-16 text-center">
          <CheckCircleIcon
            className="size-12 text-primary/60"
            aria-hidden="true"
          />
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Queue is clear
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            All submissions have been reviewed. Check back later for new ones.
          </p>
        </div>
      ) : (
        <ul className="space-y-6" role="list">
          {pending.map((b) => (
            <li key={b.id}>
              <article className="rounded-xl border border-border bg-card shadow-sm">
                {/* Card header */}
                <div className="border-b border-border px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-heading text-lg font-semibold text-foreground">
                        {b.name}
                      </h2>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {CATEGORY_LABELS[b.category] ?? b.category}
                        {" · "}
                        {govLabel(b.governorate)}
                        {b.city ? `, ${b.city}` : ""}
                      </p>
                    </div>
                    <VerificationBadge level={b.verification} />
                  </div>
                </div>

                {/* Card body */}
                <div className="px-5 py-4 space-y-4">
                  {/* Short description */}
                  <p className="text-sm font-medium text-foreground">
                    {b.shortDescription}
                  </p>

                  {/* Full description */}
                  {b.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {b.description}
                    </p>
                  )}

                  {/* Practices */}
                  {b.practices.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Eco practices
                      </p>
                      <PracticeBadges practices={b.practices} />
                    </div>
                  )}

                  {/* Certifications */}
                  {b.certifications.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Certifications
                      </p>
                      <CertificationBadges certifications={b.certifications} />
                    </div>
                  )}

                  {/* Contact info */}
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {b.email && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Email:</span>{" "}
                        {b.email}
                      </p>
                    )}
                    {b.phone && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Phone:</span>{" "}
                        {b.phone}
                      </p>
                    )}
                    {b.website && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Website:</span>{" "}
                        <a
                          href={b.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
                        >
                          {b.website}
                        </a>
                      </p>
                    )}
                    {b.address && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Address:</span>{" "}
                        {b.address}
                      </p>
                    )}
                  </div>

                  {/* Submitter info */}
                  {(b.submitterName || b.submitterEmail) && (
                    <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                        Submitted by
                      </p>
                      {b.submitterName && (
                        <p className="text-xs text-foreground">{b.submitterName}</p>
                      )}
                      {b.submitterEmail && (
                        <p className="text-xs text-muted-foreground">
                          {b.submitterEmail}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Submission date */}
                  <p className="text-xs text-muted-foreground">
                    Submitted{" "}
                    <time dateTime={b.createdAt.toISOString()}>
                      {b.createdAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  </p>
                </div>

                {/* Moderation actions */}
                <div className="border-t border-border bg-muted/30 px-5 py-4 rounded-b-xl">
                  <ModerationActions businessId={b.id} />
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
