# ECOTUN Design System

Source of truth for all UI work. Mobile-first, accessible (WCAG AA), Tailwind v4 + shadcn (base-ui). Derived via the ui-ux-pro-max ruleset (accessibility + touch + typography/color + forms + navigation priorities).

## Brand & mood
Eco-conscious directory for Tunisia. Natural, trustworthy, warm — not corporate-sterile, not "greenwashed neon." Evokes olive groves, earth/clay, sunlight on limestone.

## Color tokens (map into `src/app/globals.css` shadcn CSS variables; keep oklch format the file already uses)
Light:
- `--background`: warm off-white `#FBFAF6`
- `--foreground`: deep green-charcoal `#1B2A22`
- `--primary`: leaf/olive green `#1A7F4B` · `--primary-foreground`: `#FFFFFF`
- `--accent` (sparingly, warm earth/clay): `#C2703D` · `--accent-foreground`: `#FFFFFF`
- `--muted`: warm beige `#F1EEE6` · `--muted-foreground`: `#5A6B60`
- `--card`: `#FFFFFF` · `--card-foreground`: `#1B2A22`
- `--border`: `#E4E0D6` · `--ring`: primary green
Dark:
- `--background`: `#11140F` · `--foreground`: `#E9ECE4`
- `--primary`: desaturated/lighter green `#4FB97D` · `--primary-foreground`: `#0C1009`
- `--accent`: `#D08A5C` · `--card`: `#1A1E16` · `--muted`: `#222720` · `--border`: `#2C322A`

Verification semantics (NEVER color-only — always pair with label/icon):
- `ADMIN_VERIFIED` → solid green badge + check icon
- `EVIDENCE_PROVIDED` → amber/accent outline badge + document icon
- `SELF_DECLARED` → neutral/muted badge + info icon

All foreground/background pairs must meet ≥4.5:1 (verify primary-green text only on light, use white text on green fills).

## Typography (next/font, font-display swap)
- Headings: **Fraunces** (variable; organic, warm serif) — weights 500–700, slight optical size for large display.
- Body / UI: **Inter** (variable) — base 16px, line-height 1.5–1.6.
- Scale: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36. Weight: headings 600–700, body 400, labels/badges 500.
- Line length 60–75ch on desktop; comfortable measure on mobile.

## Spacing, radius, elevation
- 4/8px spacing rhythm. Section vertical rhythm 16/24/32/48.
- Radius: cards/inputs `rounded-xl` (~0.75rem); badges `rounded-full`.
- Shadows: subtle only (`shadow-sm` resting, `shadow-md` on hover for cards). One consistent elevation scale.

## Components
- **BusinessCard** (`<article>`): leading visual band (if no image, a soft green→beige gradient with category icon), `<h3>` name as the only link (covers card via stretched-link pattern but keep nested interactive elements accessible), meta row (category · governorate with `govLabel`), 1-line shortDescription (clamp), then a wrap of practice chips (max ~4 + "+N"), and a verification badge. Hover: subtle lift (transform/shadow only, no layout shift). Min tap target 44px.
- **FilterBar**: full-width search input (type="search", visible `<label>`, debounced ~250ms), Category + Governorate selects, Practices as toggle chips (checkbox semantics) inside a collapsible "Filters" on mobile. "Clear filters" action. Updates URL searchParams (shareable, server-rendered). Sticky under header on scroll.
- **EcoBadges**: practices = soft green outline chips; certifications = accent/amber chip with small Lucide icon + (evidence link → external icon); verification badge per semantics above.
- **Header/nav**: ECOTUN wordmark (Fraunces) + links Home / Submit. Mobile ≤5 items, current route highlighted. Skip-to-content link. `<main>` landmark.
- **Forms** (submit): visible labels (not placeholder-only), required asterisks, helper text below complex inputs, semantic input types (email/tel/url), errors below each field with `role="alert"`/aria-live, focus first invalid field on submit error, loading state on submit button, success confirmation.
- **Empty states**: friendly message + action (e.g. no results → "No eco-businesses match — clear filters or submit one").

## Accessibility (non-negotiable)
- Visible `focus-visible` rings (2px, ring color = primary). Never remove focus outlines.
- Icons from **Lucide** only (already installed); no emoji as icons. Icon-only buttons need `aria-label`.
- Sequential headings (one h1 per page). Color never the sole signal.
- `prefers-reduced-motion`: reduce/disable transitions. Animations 150–300ms, transform/opacity only.
- Touch targets ≥44px, ≥8px apart. Respect `min-h-dvh` over 100vh.
- Form labels tied with `htmlFor`; `aria-live` for async feedback; toasts (sonner) don't steal focus.

## Next.js 16 notes (see [[vercel-react-best-practices]] / repo AGENTS.md)
- `params` and `searchParams` are async — `await` them in Server Components.
- Public pages are Server Components reading the DB directly; mark only interactive bits (`FilterBar`, form, moderation actions) as `"use client"`.
- Reserve image/space to avoid CLS; lazy-load below-fold.
