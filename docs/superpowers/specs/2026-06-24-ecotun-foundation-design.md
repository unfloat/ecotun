# ECOTUN — Foundation Design (v1)

**Date:** 2026-06-24
**Status:** Approved scope, pending spec review

## 1. Product summary

ECOTUN is an installable Progressive Web App to **discover and submit eco-conscious
restaurants, businesses, and companies** in **Tunisia**. Users browse/search/filter a
directory; anyone can submit a business; submissions enter a **lightweight admin
moderation** step before going live (anti-spam, anti-greenwashing). The app is
offline-capable, responsive, mobile-first, and accessible.

## 2. v1 scope decisions

| Decision | Choice |
|---|---|
| Geography / language | Tunisia, **English-first** (i18n / Arabic-RTL deferred) |
| Moderation | **Single admin** (the owner) reviews a pending queue |
| Architecture | **Full-stack from day one** (real DB via Prisma) |
| Public accounts | **None in v1** — anonymous browse + submit |
| Admin auth | **Real** server-side auth (single admin) |

## 3. Tech stack

- **Framework:** Next.js (App Router) + TypeScript. Server Components read the DB for
  public pages; **Server Actions** handle the submit form and moderation actions.
- **ORM / DB:** Prisma → **Vercel Postgres** (Neon-backed). Same Postgres for local and
  prod to avoid dialect drift. Migrations + seed script.
- **UI:** Tailwind CSS + **shadcn/ui** (Button, Card, Input, Select, Checkbox, Dialog,
  Form, Badge, etc.). Mobile-first, accessible (semantic HTML, labels, focus states,
  color contrast).
- **PWA:** Serwist (`@serwist/next`) — service worker (offline shell + runtime caching),
  `manifest.webmanifest`, placeholder icons.
- **Auth:** Auth.js / NextAuth v5, **Credentials** provider, single admin (hashed
  password in env). Protects `/admin` and moderation server actions.
- **Deploy:** Vercel.

## 4. Data model (Prisma)

### Business
| Field | Type | Notes |
|---|---|---|
| id | string (cuid) | PK |
| slug | string (unique) | from name |
| name | string | |
| category | enum `Category` | see below |
| shortDescription | string | ~140 chars, for cards |
| description | string (text) | full |
| governorate | enum `Governorate` | Tunisia's governorates |
| city | string | |
| address | string? | |
| lat / lng | float? | optional, enables map later |
| phone / email / website | string? | contact |
| instagram / facebook | string? | socials |
| priceRange | int? (1–4) | mainly restaurants/cafes |
| images | string[] | URLs; placeholder in v1 |
| tags | string[] | free-form eco tags |
| submitterName / submitterEmail | string? | optional, anonymous-friendly |
| status | enum `ModerationStatus` | PENDING default |
| verification | enum `Verification` | self_declared default |
| reviewNote | string? | reject/archive reason |
| reviewedAt | datetime? | |
| createdAt / updatedAt | datetime | |
| practices | `Practice[]` | **Postgres enum array** directly on Business (no metadata needed; fast to filter) |
| certifications | relation → `BusinessCertification[]` | **Separate table** — each row carries `type: Certification`, `issuer?`, `year?`, `evidenceUrl?` |

### Enums

**Category:** `RESTAURANT, CAFE, GROCERY_MARKET, RETAIL_SHOP, SERVICES, COMPANY_B2B,
ACCOMMODATION, OTHER`

**Governorate:** Tunisia's 24 governorates (Tunis, Ariana, Ben Arous, Manouba, Nabeul,
Zaghouan, Bizerte, Béja, Jendouba, Kef, Siliana, Sousse, Monastir, Mahdia, Sfax,
Kairouan, Kasserine, Sidi Bouzid, Gabès, Medenine, Tataouine, Gafsa, Tozeur, Kebili)

**Certification (type):** `ORGANIC_BIO_TUNISIE, EU_ORGANIC, USDA_ORGANIC, FAIR_TRADE,
ISO_14001, B_CORP, EU_ECOLABEL, GREEN_KEY, LEED, MSC` — each instance may carry an
`issuer?`, `year?`, and `evidenceUrl?`.

**Practice:** `PLANT_BASED_OPTIONS, LOCALLY_SOURCED, ZERO_WASTE_COMPOSTING,
NO_SINGLE_USE_PLASTIC, REUSABLE_PACKAGING, BULK_PACKAGE_FREE, RENEWABLE_ENERGY,
WATER_CONSERVATION, RECYCLING_PROGRAM, ANTI_FOOD_WASTE, FAIR_ETHICAL_LABOR,
BIKE_EV_FRIENDLY`

**ModerationStatus:** `PENDING → APPROVED | REJECTED`; `APPROVED → ARCHIVED`
(admin unpublish). Public site shows **APPROVED only**.

**Verification (anti-greenwashing):** `SELF_DECLARED → EVIDENCE_PROVIDED → ADMIN_VERIFIED`.
Certifications can attach an `evidenceUrl`; admin escalates verification during review.

## 5. Routes & flows

- `/` — homepage: list APPROVED businesses (cards) + search box + filters
  (category, governorate, practices). Server-rendered query.
- `/business/[slug]` — detail page (eco attributes, certifications + evidence, contact,
  verification badge).
- `/submit` — public submit form (Server Action → create row `PENDING`,
  `verification = SELF_DECLARED`). Honeypot field for basic spam resistance.
- `/admin` — auth-protected. Pending queue with **Approve / Reject (+reason) / Archive**;
  can set verification level. Server actions enforce auth.
- API/PWA: `manifest.webmanifest`, service worker via Serwist.

## 6. Accessibility & mobile-first

- Semantic landmarks, labelled form controls, visible focus, adequate contrast,
  keyboard-operable filters/dialogs (shadcn/Radix primitives help here).
- Layout designed mobile-first; responsive grid for cards.

## 7. Offline behaviour (PWA)

- App shell + static assets precached. Browse pages use a network-first/stale-while-
  revalidate runtime cache so previously viewed listings work offline.
- Submit form requires network in v1 (clear offline messaging; background-sync deferred).

## 8. Seed data

- Prisma seed script inserts ~8–12 realistic Tunisian eco-businesses across categories
  and governorates (mix of certifications/practices, varied verification levels), all
  `APPROVED`, plus 1–2 `PENDING` to exercise the admin queue.

## 9. First working slice (build target this session)

1. Scaffold Next.js + TS + Tailwind + shadcn + Prisma + Serwist; running dev server.
2. Prisma schema + migration + seed.
3. Homepage: list seed businesses + search/filter bar.
4. Business detail page.
5. Submit form (Server Action → PENDING).
6. PWA essentials (manifest, service worker, placeholder icons) — installable.
7. Admin auth + minimal pending queue (approve/reject).
8. Git: logical commits throughout (no Claude co-author trailer).

## 10. Deferred (explicitly out of v1)

Public user accounts; image upload/storage (placeholder URLs for now); maps;
i18n/Arabic-RTL; background-sync offline submit; multi-moderator roles; ratings/reviews.

## 11. Decisions left for later (flagged)

- Image hosting (Vercel Blob / Cloudinary) when real uploads are added.
- Full-text/search service if the directory grows large (client/Prisma filtering is fine
  for v1 scale).
- Multi-user/role expansion of Auth.js if submitter accounts are introduced.
