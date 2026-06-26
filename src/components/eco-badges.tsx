import { CheckIcon, FileCheckIcon, InfoIcon, ExternalLinkIcon } from "lucide-react";
import {
  PRACTICE_LABELS,
  CERTIFICATION_LABELS,
  VERIFICATION_LABELS,
} from "@/lib/eco";

// ---------------------------------------------------------------------------
// PracticeBadges
// ---------------------------------------------------------------------------
export function PracticeBadges({ practices }: { practices: string[] }) {
  const visible = practices.slice(0, 4);
  const overflow = practices.length - visible.length;

  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Eco practices">
      {visible.map((p) => (
        <span
          key={p}
          className="inline-flex items-center rounded-full border border-primary/40 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary"
        >
          {PRACTICE_LABELS[p] ?? p}
        </span>
      ))}
      {overflow > 0 && (
        <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          +{overflow}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CertificationBadges
// ---------------------------------------------------------------------------
interface Certification {
  type: string;
  evidenceUrl?: string | null;
}

export function CertificationBadges({
  certifications,
}: {
  certifications: Certification[];
}) {
  if (certifications.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Certifications">
      {certifications.map((cert, i) => {
        const label = CERTIFICATION_LABELS[cert.type] ?? cert.type;
        return (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full border border-accent/50 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
          >
            {label}
            {cert.evidenceUrl && (
              <a
                href={cert.evidenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View evidence for ${label} (opens in new tab)`}
                className="ml-0.5 inline-flex items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
              >
                <ExternalLinkIcon className="size-3" aria-hidden="true" />
              </a>
            )}
          </span>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// VerificationBadge
// ---------------------------------------------------------------------------
export function VerificationBadge({ level }: { level: string }) {
  const label = VERIFICATION_LABELS[level] ?? level;

  if (level === "ADMIN_VERIFIED") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground"
        aria-label={`Verification: ${label}`}
      >
        <CheckIcon className="size-3 shrink-0" aria-hidden="true" />
        {label}
      </span>
    );
  }

  if (level === "EVIDENCE_PROVIDED") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full border border-accent/50 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
        aria-label={`Verification: ${label}`}
      >
        <FileCheckIcon className="size-3 shrink-0" aria-hidden="true" />
        {label}
      </span>
    );
  }

  // SELF_DECLARED or unknown
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
      aria-label={`Verification: ${label}`}
    >
      <InfoIcon className="size-3 shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}
