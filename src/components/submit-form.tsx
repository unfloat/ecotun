"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

import { submitBusiness, type SubmitState } from "@/server/actions";
import { CATEGORY_LABELS, PRACTICE_LABELS, GOVERNORATES, govLabel } from "@/lib/eco";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/form";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-destructive ml-0.5">
      *
    </span>
  );
}

function FieldErrors({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <div role="alert" aria-live="polite" className="mt-1 text-sm text-destructive">
      {errors.map((e, i) => (
        <p key={i}>{e}</p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Submit Form
// ---------------------------------------------------------------------------

const INITIAL_STATE: SubmitState = { ok: false };

export function SubmitForm() {
  const [state, formAction, pending] = useActionState(submitBusiness, INITIAL_STATE);

  // Ref for the success heading (focus on success)
  const successRef = useRef<HTMLHeadingElement>(null);
  // Ref for the error summary heading (focus on first error)
  const errorRef = useRef<HTMLDivElement>(null);
  // Ref for the form (to find the first invalid field)
  const formRef = useRef<HTMLFormElement>(null);

  // Focus management: focus first invalid field or success message
  useEffect(() => {
    if (state.ok && successRef.current) {
      successRef.current.focus();
    } else if (!state.ok && state.errors && errorRef.current) {
      // Try to focus the first field with an error
      const firstErrorField = formRef.current?.querySelector<HTMLElement>(
        "[aria-invalid='true'], .field-has-error input, .field-has-error textarea, .field-has-error select"
      );
      if (firstErrorField) {
        firstErrorField.focus();
      } else {
        errorRef.current.focus();
      }
    }
  }, [state]);

  // Toast on success
  useEffect(() => {
    if (state.ok) {
      toast.success("Submission received!", {
        description: "Your business has been submitted and is pending review.",
      });
    }
  }, [state.ok]);

  // ---------------------------------------------------------------------------
  // Success screen
  // ---------------------------------------------------------------------------
  if (state.ok) {
    return (
      <div
        className="rounded-xl border border-border bg-primary/5 px-8 py-12 text-center"
        role="status"
      >
        <h2
          ref={successRef}
          tabIndex={-1}
          className="font-heading text-2xl font-semibold text-primary outline-none"
        >
          Thank you — submission received!
        </h2>
        <p className="mt-3 text-muted-foreground">
          Your business listing is <strong>pending review</strong> by the ECOTUN
          team. We&apos;ll verify your eco claims before publishing. This typically takes
          1–3 business days.
        </p>
        <Button
          className="mt-6"
          onClick={() => window.location.reload()}
          size="lg"
        >
          Submit another business
        </Button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Form
  // ---------------------------------------------------------------------------
  const e = state.errors ?? {};

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-8">
      {/* Global error summary */}
      {state.message && Object.keys(e).length > 0 && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive outline-none"
        >
          <p className="font-medium">{state.message}</p>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SECTION: Business details                                           */}
      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="section-business">
        <h2
          id="section-business"
          className="mb-4 font-heading text-lg font-semibold text-foreground"
        >
          Business details
        </h2>
        <div className="space-y-5">

          {/* Business name */}
          <div className={e.name ? "field-has-error" : ""}>
            <Label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Business name <RequiredMark />
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="organization"
              required
              aria-required="true"
              aria-invalid={!!e.name}
              aria-describedby={e.name ? "name-error" : undefined}
              className="h-11"
            />
            {e.name && (
              <div id="name-error" role="alert" aria-live="polite" className="mt-1 text-sm text-destructive">
                {e.name.map((msg, i) => <p key={i}>{msg}</p>)}
              </div>
            )}
          </div>

          {/* Category — native <select> for reliable FormData */}
          <div className={e.category ? "field-has-error" : ""}>
            <Label htmlFor="category" className="mb-1.5 block text-sm font-medium">
              Category <RequiredMark />
            </Label>
            <select
              id="category"
              name="category"
              required
              aria-required="true"
              aria-invalid={!!e.category}
              aria-describedby={e.category ? "category-error" : "category-desc"}
              defaultValue=""
              className="h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 aria-invalid:border-destructive"
            >
              <option value="" disabled>
                Select a category…
              </option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <p id="category-desc" className="mt-1 text-xs text-muted-foreground">
              Choose the type that best describes the business.
            </p>
            {e.category && (
              <div id="category-error" role="alert" aria-live="polite" className="mt-1 text-sm text-destructive">
                {e.category.map((msg, i) => <p key={i}>{msg}</p>)}
              </div>
            )}
          </div>

          {/* Short description */}
          <div className={e.shortDescription ? "field-has-error" : ""}>
            <Label htmlFor="shortDescription" className="mb-1.5 block text-sm font-medium">
              Short description <RequiredMark />
            </Label>
            <Input
              id="shortDescription"
              name="shortDescription"
              type="text"
              required
              aria-required="true"
              aria-invalid={!!e.shortDescription}
              aria-describedby={
                e.shortDescription ? "shortDescription-error" : "shortDescription-desc"
              }
              className="h-11"
            />
            <p id="shortDescription-desc" className="mt-1 text-xs text-muted-foreground">
              One sentence (5–160 characters) shown in the directory listing.
            </p>
            {e.shortDescription && (
              <div id="shortDescription-error" role="alert" aria-live="polite" className="mt-1 text-sm text-destructive">
                {e.shortDescription.map((msg, i) => <p key={i}>{msg}</p>)}
              </div>
            )}
          </div>

          {/* Full description */}
          <div className={e.description ? "field-has-error" : ""}>
            <Label htmlFor="description" className="mb-1.5 block text-sm font-medium">
              Full description <RequiredMark />
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              aria-required="true"
              aria-invalid={!!e.description}
              aria-describedby={
                e.description ? "description-error" : "description-desc"
              }
              rows={5}
              className="min-h-[132px]"
            />
            <p id="description-desc" className="mt-1 text-xs text-muted-foreground">
              20–4000 characters. Describe what makes this business eco-conscious.{" "}
              <strong>Include evidence for any eco claims</strong> (certifications,
              sourcing policies, waste reports) to avoid greenwashing flags.
            </p>
            {e.description && (
              <div id="description-error" role="alert" aria-live="polite" className="mt-1 text-sm text-destructive">
                {e.description.map((msg, i) => <p key={i}>{msg}</p>)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION: Location                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="section-location">
        <h2
          id="section-location"
          className="mb-4 font-heading text-lg font-semibold text-foreground"
        >
          Location
        </h2>
        <div className="space-y-5">

          {/* Governorate — native <select> */}
          <div className={e.governorate ? "field-has-error" : ""}>
            <Label htmlFor="governorate" className="mb-1.5 block text-sm font-medium">
              Governorate <RequiredMark />
            </Label>
            <select
              id="governorate"
              name="governorate"
              required
              aria-required="true"
              aria-invalid={!!e.governorate}
              aria-describedby={e.governorate ? "governorate-error" : undefined}
              defaultValue=""
              className="h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 aria-invalid:border-destructive"
            >
              <option value="" disabled>
                Select a governorate…
              </option>
              {GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {govLabel(gov)}
                </option>
              ))}
            </select>
            {e.governorate && (
              <div id="governorate-error" role="alert" aria-live="polite" className="mt-1 text-sm text-destructive">
                {e.governorate.map((msg, i) => <p key={i}>{msg}</p>)}
              </div>
            )}
          </div>

          {/* City */}
          <div className={e.city ? "field-has-error" : ""}>
            <Label htmlFor="city" className="mb-1.5 block text-sm font-medium">
              City / Town <RequiredMark />
            </Label>
            <Input
              id="city"
              name="city"
              type="text"
              required
              aria-required="true"
              aria-invalid={!!e.city}
              aria-describedby={e.city ? "city-error" : undefined}
              className="h-11"
            />
            {e.city && (
              <div id="city-error" role="alert" aria-live="polite" className="mt-1 text-sm text-destructive">
                {e.city.map((msg, i) => <p key={i}>{msg}</p>)}
              </div>
            )}
          </div>

          {/* Address (optional) */}
          <div className={e.address ? "field-has-error" : ""}>
            <Label htmlFor="address" className="mb-1.5 block text-sm font-medium">
              Street address{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="address"
              name="address"
              type="text"
              aria-invalid={!!e.address}
              aria-describedby={e.address ? "address-error" : undefined}
              className="h-11"
            />
            {e.address && (
              <div id="address-error" role="alert" aria-live="polite" className="mt-1 text-sm text-destructive">
                {e.address.map((msg, i) => <p key={i}>{msg}</p>)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION: Eco practices                                              */}
      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="section-practices">
        <h2
          id="section-practices"
          className="mb-1 font-heading text-lg font-semibold text-foreground"
        >
          Eco practices
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Select all that genuinely apply. You will need to provide supporting
          evidence in your description for any claims made here.
        </p>
        <fieldset
          aria-labelledby="section-practices"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <legend className="sr-only">Eco practices</legend>
          {Object.entries(PRACTICE_LABELS).map(([key, label]) => (
            <label
              key={key}
              className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5"
            >
              <input
                type="checkbox"
                name="practices"
                value={key}
                className="size-4 shrink-0 rounded border-input accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {label}
            </label>
          ))}
        </fieldset>
        {e.practices && (
          <div role="alert" aria-live="polite" className="mt-2 text-sm text-destructive">
            {e.practices.map((msg, i) => <p key={i}>{msg}</p>)}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION: Contact & online presence                                 */}
      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="section-contact">
        <h2
          id="section-contact"
          className="mb-4 font-heading text-lg font-semibold text-foreground"
        >
          Contact &amp; online presence{" "}
          <span className="text-sm font-normal text-muted-foreground">(all optional)</span>
        </h2>
        <div className="space-y-5">

          {/* Website */}
          <div className={e.website ? "field-has-error" : ""}>
            <Label htmlFor="website" className="mb-1.5 block text-sm font-medium">
              Website
            </Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://example.com"
              aria-invalid={!!e.website}
              aria-describedby={e.website ? "website-error" : undefined}
              className="h-11"
            />
            {e.website && (
              <div id="website-error" role="alert" aria-live="polite" className="mt-1 text-sm text-destructive">
                {e.website.map((msg, i) => <p key={i}>{msg}</p>)}
              </div>
            )}
          </div>

          {/* Email */}
          <div className={e.email ? "field-has-error" : ""}>
            <Label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Public email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="off"
              spellCheck={false}
              aria-invalid={!!e.email}
              aria-describedby={e.email ? "email-error" : undefined}
              className="h-11"
            />
            {e.email && (
              <div id="email-error" role="alert" aria-live="polite" className="mt-1 text-sm text-destructive">
                {e.email.map((msg, i) => <p key={i}>{msg}</p>)}
              </div>
            )}
          </div>

          {/* Phone */}
          <div className={e.phone ? "field-has-error" : ""}>
            <Label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              aria-invalid={!!e.phone}
              aria-describedby={e.phone ? "phone-error" : undefined}
              className="h-11"
            />
            {e.phone && (
              <div id="phone-error" role="alert" aria-live="polite" className="mt-1 text-sm text-destructive">
                {e.phone.map((msg, i) => <p key={i}>{msg}</p>)}
              </div>
            )}
          </div>

          {/* Instagram */}
          <div className={e.instagram ? "field-has-error" : ""}>
            <Label htmlFor="instagram" className="mb-1.5 block text-sm font-medium">
              Instagram handle
            </Label>
            <Input
              id="instagram"
              name="instagram"
              type="text"
              placeholder="@yourbusiness…"
              aria-invalid={!!e.instagram}
              aria-describedby={e.instagram ? "instagram-error" : undefined}
              className="h-11"
            />
            {e.instagram && (
              <div id="instagram-error" role="alert" aria-live="polite" className="mt-1 text-sm text-destructive">
                {e.instagram.map((msg, i) => <p key={i}>{msg}</p>)}
              </div>
            )}
          </div>

          {/* Facebook */}
          <div className={e.facebook ? "field-has-error" : ""}>
            <Label htmlFor="facebook" className="mb-1.5 block text-sm font-medium">
              Facebook page
            </Label>
            <Input
              id="facebook"
              name="facebook"
              type="text"
              aria-invalid={!!e.facebook}
              aria-describedby={e.facebook ? "facebook-error" : undefined}
              className="h-11"
            />
            {e.facebook && (
              <div id="facebook-error" role="alert" aria-live="polite" className="mt-1 text-sm text-destructive">
                {e.facebook.map((msg, i) => <p key={i}>{msg}</p>)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION: About you (submitter)                                      */}
      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="section-submitter">
        <h2
          id="section-submitter"
          className="mb-4 font-heading text-lg font-semibold text-foreground"
        >
          About you{" "}
          <span className="text-sm font-normal text-muted-foreground">(optional)</span>
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Not shown publicly. Helps us contact you if we have questions during review.
        </p>
        <div className="space-y-5">

          {/* Submitter name */}
          <div className={e.submitterName ? "field-has-error" : ""}>
            <Label htmlFor="submitterName" className="mb-1.5 block text-sm font-medium">
              Your name
            </Label>
            <Input
              id="submitterName"
              name="submitterName"
              type="text"
              autoComplete="name"
              aria-invalid={!!e.submitterName}
              aria-describedby={e.submitterName ? "submitterName-error" : undefined}
              className="h-11"
            />
            {e.submitterName && (
              <div id="submitterName-error" role="alert" aria-live="polite" className="mt-1 text-sm text-destructive">
                {e.submitterName.map((msg, i) => <p key={i}>{msg}</p>)}
              </div>
            )}
          </div>

          {/* Submitter email */}
          <div className={e.submitterEmail ? "field-has-error" : ""}>
            <Label htmlFor="submitterEmail" className="mb-1.5 block text-sm font-medium">
              Your email
            </Label>
            <Input
              id="submitterEmail"
              name="submitterEmail"
              type="email"
              autoComplete="email"
              aria-invalid={!!e.submitterEmail}
              aria-describedby={e.submitterEmail ? "submitterEmail-error" : undefined}
              className="h-11"
            />
            {e.submitterEmail && (
              <div id="submitterEmail-error" role="alert" aria-live="polite" className="mt-1 text-sm text-destructive">
                {e.submitterEmail.map((msg, i) => <p key={i}>{msg}</p>)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Honeypot (bot trap)                                                 */}
      {/* ------------------------------------------------------------------ */}
      {/*
        Visually and semantically hidden: positioned off-screen, aria-hidden,
        tabIndex=-1, autocomplete=off. Bots may fill it; humans never see it.
        If filled, the server action silently discards the submission.
      */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor="company_website">Leave this empty</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Submit button                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          aria-disabled={pending}
          className="min-h-[44px] min-w-[160px]"
        >
          {pending ? (
            <>
              <Loader2Icon className="mr-2 size-4 animate-spin" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            "Submit for review"
          )}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Fields marked with <span aria-hidden="true" className="text-destructive">*</span>{" "}
          <span className="sr-only">asterisk</span> are required.
        </p>
      </div>
    </form>
  );
}
