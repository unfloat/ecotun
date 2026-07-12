# ECOTUN Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a running, installable ECOTUN PWA — a Tunisia-focused directory of eco-conscious businesses with browse/search/filter, public submission, and single-admin moderation — on a full-stack Next.js + Prisma + Postgres foundation deployed to Vercel.

**Architecture:** Next.js App Router with Server Components reading Postgres via Prisma for public pages, and Server Actions for the submit form and moderation. Pure domain logic (slugify, filter→where mapping, submission validation, moderation transitions) is isolated into small, unit-tested modules so the DB-touching code stays thin. Admin area is protected by Auth.js (NextAuth v5) Credentials with a single admin. PWA via Serwist.

**Tech Stack:** Next.js (App Router, TypeScript), Tailwind CSS, shadcn/ui, Prisma, Vercel Postgres (Neon), Auth.js v5, Zod, Serwist, Vitest.

**Applies these skills during execution:**
- `ui-ux-pro-max` — before building each UI surface (homepage, card, detail, submit, admin).
- `vercel-react-best-practices` — for App Router structure, Server Components/Actions, caching.
- `web-design-guidelines` — accessibility/UX audit pass near the end.
- `deploy-to-vercel` — final deploy task.

**Conventions:** Commit after every task. Commit messages are plain — **no Claude co-author trailer**. Work directly on `main`.

---

## File structure (created/modified across the plan)

```
ecotun/
  prisma/
    schema.prisma              # models, enums
    seed.ts                    # seed Tunisian businesses
  src/
    lib/
      db.ts                    # Prisma client singleton
      slug.ts                  # slugify (pure, tested)
      filters.ts               # search/filter params -> Prisma where (pure, tested)
      moderation.ts            # status transition rules (pure, tested)
      validation.ts            # Zod schema for submissions (tested)
      eco.ts                   # label maps + enum lists for UI
    server/
      businesses.ts            # data access (listBusinesses, getBusinessBySlug)
      actions.ts               # server actions: submitBusiness, moderate
      auth.ts                  # Auth.js config (single admin Credentials)
    app/
      layout.tsx               # root layout, header/nav, metadata, manifest link
      page.tsx                 # homepage: list + filter bar
      business/[slug]/page.tsx # detail page
      submit/page.tsx          # submit form
      admin/
        layout.tsx             # auth guard
        page.tsx               # pending queue
        login/page.tsx         # admin sign-in
      api/auth/[...nextauth]/route.ts
      ~offline/page.tsx        # offline fallback (Serwist)
      sw.ts                    # Serwist service worker source
    components/
      ui/                      # shadcn primitives
      business-card.tsx
      filter-bar.tsx
      eco-badges.tsx
      submit-form.tsx
      moderation-actions.tsx
      install-prompt.tsx
    middleware.ts              # protect /admin
  public/
    icons/                     # PWA placeholder icons (192,512, maskable)
    manifest.webmanifest
  vitest.config.ts
  .env.example
```

---

## Task 0: Scaffold Next.js into the existing repo

**Files:** creates the Next.js app skeleton in `ecotun/`.

- [ ] **Step 1: Scaffold (into a temp dir, then move — repo already has README/.git)**

The repo already contains `.git` + `README.md`, so scaffold into a temp folder and copy in.

Run (from `E:\ECOTUN`):
```bash
npx create-next-app@latest ecotun-tmp --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack --use-npm
```
Answer any prompt with defaults. Expected: a Next.js project in `ecotun-tmp/`.

- [ ] **Step 2: Move generated files into the repo (preserve existing .git/README)**

Run:
```bash
cp -r ecotun-tmp/. ecotun/    # copies package.json, src/, etc.
rm -rf ecotun-tmp
```
Keep the repo's existing `README.md` (do not overwrite if prompted; the generated one can replace it later in the README task).

- [ ] **Step 3: Install and run dev server**

Run (from `ecotun/`):
```bash
npm install
npm run dev
```
Expected: dev server on `http://localhost:3000`, default Next.js page renders.

- [ ] **Step 4: Add `.gitattributes` for line endings (Windows)**

Create `ecotun/.gitattributes`:
```
* text=auto eol=lf
```

- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "chore: scaffold Next.js app (TS, Tailwind, App Router)"
```

---

## Task 1: Initialize shadcn/ui + base components

**Files:** `components.json`, `src/components/ui/*`, `src/lib/utils.ts`.

- [ ] **Step 1: Init shadcn**
```bash
npx shadcn@latest init
```
Choose defaults (Default style, neutral base color, CSS variables yes).

- [ ] **Step 2: Add the components used by the app**
```bash
npx shadcn@latest add button card input textarea select checkbox label badge dialog form sonner skeleton
```
Expected: components appear under `src/components/ui/`.

- [ ] **Step 3: Verify build**
```bash
npm run build
```
Expected: successful build.

- [ ] **Step 4: Commit**
```bash
git add -A
git commit -m "chore: add shadcn/ui and base components"
```

---

## Task 2: Prisma + Postgres schema

**Files:** Create `prisma/schema.prisma`, `src/lib/db.ts`, `.env.example`. Modify `package.json` (scripts).

> **USER SETUP CHECKPOINT (interactive, cannot be automated):** A Postgres connection is required. For local dev either (a) run `docker run --name ecotun-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ecotun -p 5432:5432 -d postgres:16`, or (b) create a Vercel Postgres DB in the Vercel dashboard and run `vercel link` then `vercel env pull .env.local`. Set `DATABASE_URL` (and `DIRECT_URL`) in `.env` before running migrations. On Vercel, map `DATABASE_URL` to the project's `POSTGRES_PRISMA_URL` and `DIRECT_URL` to `POSTGRES_URL_NON_POOLING`.

- [ ] **Step 1: Install Prisma**
```bash
npm install -D prisma
npm install @prisma/client
npx prisma init
```

- [ ] **Step 2: Write `prisma/schema.prisma`**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum Category {
  RESTAURANT
  CAFE
  GROCERY_MARKET
  RETAIL_SHOP
  SERVICES
  COMPANY_B2B
  ACCOMMODATION
  OTHER
}

enum Governorate {
  TUNIS ARIANA BEN_AROUS MANOUBA NABEUL ZAGHOUAN BIZERTE BEJA JENDOUBA
  KEF SILIANA SOUSSE MONASTIR MAHDIA SFAX KAIROUAN KASSERINE SIDI_BOUZID
  GABES MEDENINE TATAOUINE GAFSA TOZEUR KEBILI
}

enum Practice {
  PLANT_BASED_OPTIONS
  LOCALLY_SOURCED
  ZERO_WASTE_COMPOSTING
  NO_SINGLE_USE_PLASTIC
  REUSABLE_PACKAGING
  BULK_PACKAGE_FREE
  RENEWABLE_ENERGY
  WATER_CONSERVATION
  RECYCLING_PROGRAM
  ANTI_FOOD_WASTE
  FAIR_ETHICAL_LABOR
  BIKE_EV_FRIENDLY
}

enum CertificationType {
  ORGANIC_BIO_TUNISIE
  EU_ORGANIC
  USDA_ORGANIC
  FAIR_TRADE
  ISO_14001
  B_CORP
  EU_ECOLABEL
  GREEN_KEY
  LEED
  MSC
}

enum ModerationStatus {
  PENDING
  APPROVED
  REJECTED
  ARCHIVED
}

enum Verification {
  SELF_DECLARED
  EVIDENCE_PROVIDED
  ADMIN_VERIFIED
}

model Business {
  id               String   @id @default(cuid())
  slug             String   @unique
  name             String
  category         Category
  shortDescription String
  description      String
  governorate      Governorate
  city             String
  address          String?
  lat              Float?
  lng              Float?
  phone            String?
  email            String?
  website          String?
  instagram        String?
  facebook         String?
  priceRange       Int?
  images           String[]
  tags             String[]
  practices        Practice[]
  submitterName    String?
  submitterEmail   String?
  status           ModerationStatus @default(PENDING)
  verification     Verification     @default(SELF_DECLARED)
  reviewNote       String?
  reviewedAt       DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  certifications   BusinessCertification[]

  @@index([status])
  @@index([category])
  @@index([governorate])
}

model BusinessCertification {
  id          String            @id @default(cuid())
  business    Business          @relation(fields: [businessId], references: [id], onDelete: Cascade)
  businessId  String
  type        CertificationType
  issuer      String?
  year        Int?
  evidenceUrl String?

  @@index([businessId])
}
```

- [ ] **Step 3: Write `src/lib/db.ts` (client singleton)**
```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

- [ ] **Step 4: Add scripts to `package.json`**
```json
"scripts": {
  "db:migrate": "prisma migrate dev",
  "db:push": "prisma db push",
  "db:seed": "tsx prisma/seed.ts",
  "db:studio": "prisma studio"
}
```
And add Prisma seed config:
```json
"prisma": { "seed": "tsx prisma/seed.ts" }
```
Install tsx: `npm install -D tsx`.

- [ ] **Step 5: Run first migration**
```bash
npx prisma migrate dev --name init
```
Expected: migration created and applied; client generated.

- [ ] **Step 6: Write `.env.example`**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecotun?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/ecotun?schema=public"
AUTH_SECRET=""
ADMIN_EMAIL="admin@ecotun.tn"
ADMIN_PASSWORD_HASH=""
```

- [ ] **Step 7: Commit**
```bash
git add -A
git commit -m "feat: add Prisma schema, Postgres datasource, and client"
```

---

## Task 3: Eco label maps + enum lists (UI source of truth)

**Files:** Create `src/lib/eco.ts`. **Test:** `src/lib/eco.test.ts`.

- [ ] **Step 1: Write the failing test**
```ts
import { describe, it, expect } from "vitest";
import { CATEGORY_LABELS, PRACTICE_LABELS, GOVERNORATES } from "./eco";

describe("eco labels", () => {
  it("has a human label for every category", () => {
    expect(CATEGORY_LABELS.RESTAURANT).toBe("Restaurant");
    expect(CATEGORY_LABELS.GROCERY_MARKET).toBe("Grocery & Market");
  });
  it("labels practices readably", () => {
    expect(PRACTICE_LABELS.NO_SINGLE_USE_PLASTIC).toBe("No single-use plastic");
  });
  it("lists 24 governorates", () => {
    expect(GOVERNORATES).toHaveLength(24);
  });
});
```

- [ ] **Step 2: Run test, expect FAIL** (Vitest set up in Task 4 — if not yet present, do Task 4 Step 1 first, then return). Run: `npx vitest run src/lib/eco.test.ts` → FAIL (module not found).

- [ ] **Step 3: Implement `src/lib/eco.ts`**
```ts
export const CATEGORY_LABELS: Record<string, string> = {
  RESTAURANT: "Restaurant",
  CAFE: "Café",
  GROCERY_MARKET: "Grocery & Market",
  RETAIL_SHOP: "Retail Shop",
  SERVICES: "Services",
  COMPANY_B2B: "Company (B2B)",
  ACCOMMODATION: "Accommodation",
  OTHER: "Other",
};

export const PRACTICE_LABELS: Record<string, string> = {
  PLANT_BASED_OPTIONS: "Plant-based options",
  LOCALLY_SOURCED: "Locally sourced",
  ZERO_WASTE_COMPOSTING: "Zero-waste / composting",
  NO_SINGLE_USE_PLASTIC: "No single-use plastic",
  REUSABLE_PACKAGING: "Reusable packaging",
  BULK_PACKAGE_FREE: "Bulk / package-free",
  RENEWABLE_ENERGY: "Renewable energy",
  WATER_CONSERVATION: "Water conservation",
  RECYCLING_PROGRAM: "Recycling program",
  ANTI_FOOD_WASTE: "Anti food-waste",
  FAIR_ETHICAL_LABOR: "Fair / ethical labor",
  BIKE_EV_FRIENDLY: "Bike / EV friendly",
};

export const CERTIFICATION_LABELS: Record<string, string> = {
  ORGANIC_BIO_TUNISIE: "Organic — Bio Tunisie",
  EU_ORGANIC: "EU Organic",
  USDA_ORGANIC: "USDA Organic",
  FAIR_TRADE: "Fair Trade",
  ISO_14001: "ISO 14001",
  B_CORP: "B Corp",
  EU_ECOLABEL: "EU Ecolabel",
  GREEN_KEY: "Green Key",
  LEED: "LEED",
  MSC: "MSC (Sustainable Seafood)",
};

export const VERIFICATION_LABELS: Record<string, string> = {
  SELF_DECLARED: "Self-declared",
  EVIDENCE_PROVIDED: "Evidence provided",
  ADMIN_VERIFIED: "Admin verified",
};

export const GOVERNORATES = [
  "TUNIS","ARIANA","BEN_AROUS","MANOUBA","NABEUL","ZAGHOUAN","BIZERTE","BEJA",
  "JENDOUBA","KEF","SILIANA","SOUSSE","MONASTIR","MAHDIA","SFAX","KAIROUAN",
  "KASSERINE","SIDI_BOUZID","GABES","MEDENINE","TATAOUINE","GAFSA","TOZEUR","KEBILI",
] as const;

export const govLabel = (g: string) =>
  g.split("_").map((w) => w[0] + w.slice(1).toLowerCase()).join(" ");
```

- [ ] **Step 4: Run test, expect PASS.** Run: `npx vitest run src/lib/eco.test.ts`.

- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "feat: add eco enum labels and governorate list"
```

---

## Task 4: Test setup + slug + filter + moderation + validation (pure logic, TDD)

**Files:** Create `vitest.config.ts`, `src/lib/slug.ts`, `src/lib/filters.ts`, `src/lib/moderation.ts`, `src/lib/validation.ts`. **Tests:** matching `*.test.ts`.

- [ ] **Step 1: Install + configure Vitest**
```bash
npm install -D vitest
```
Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: { environment: "node", include: ["src/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
```
Add script to `package.json`: `"test": "vitest run"`.

- [ ] **Step 2: slug — failing test** `src/lib/slug.test.ts`
```ts
import { describe, it, expect } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Green Bites Café")).toBe("green-bites-cafe");
  });
  it("strips punctuation and collapses spaces", () => {
    expect(slugify("  Eco--Shop!!  Tunis ")).toBe("eco-shop-tunis");
  });
});
```

- [ ] **Step 3: Run → FAIL.** `npx vitest run src/lib/slug.test.ts`

- [ ] **Step 4: Implement `src/lib/slug.ts`**
```ts
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

- [ ] **Step 5: Run → PASS.**

- [ ] **Step 6: filters — failing test** `src/lib/filters.test.ts`
```ts
import { describe, it, expect } from "vitest";
import { buildBusinessWhere } from "./filters";

describe("buildBusinessWhere", () => {
  it("always restricts to APPROVED for public", () => {
    const w = buildBusinessWhere({});
    expect(w.status).toBe("APPROVED");
  });
  it("adds category and governorate when present", () => {
    const w = buildBusinessWhere({ category: "CAFE", governorate: "TUNIS" });
    expect(w.category).toBe("CAFE");
    expect(w.governorate).toBe("TUNIS");
  });
  it("requires all selected practices (hasEvery)", () => {
    const w = buildBusinessWhere({ practices: ["LOCALLY_SOURCED", "RENEWABLE_ENERGY"] });
    expect(w.practices).toEqual({ hasEvery: ["LOCALLY_SOURCED", "RENEWABLE_ENERGY"] });
  });
  it("text search matches name or description, case-insensitive", () => {
    const w = buildBusinessWhere({ q: "vegan" });
    expect(w.OR).toEqual([
      { name: { contains: "vegan", mode: "insensitive" } },
      { shortDescription: { contains: "vegan", mode: "insensitive" } },
      { description: { contains: "vegan", mode: "insensitive" } },
    ]);
  });
});
```

- [ ] **Step 7: Run → FAIL.**

- [ ] **Step 8: Implement `src/lib/filters.ts`**
```ts
export interface BusinessFilters {
  q?: string;
  category?: string;
  governorate?: string;
  practices?: string[];
}

export function buildBusinessWhere(f: BusinessFilters): Record<string, unknown> {
  const where: Record<string, unknown> = { status: "APPROVED" };
  if (f.category) where.category = f.category;
  if (f.governorate) where.governorate = f.governorate;
  if (f.practices && f.practices.length > 0) where.practices = { hasEvery: f.practices };
  if (f.q && f.q.trim()) {
    const q = f.q.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  return where;
}
```

- [ ] **Step 9: Run → PASS.**

- [ ] **Step 10: moderation — failing test** `src/lib/moderation.test.ts`
```ts
import { describe, it, expect } from "vitest";
import { canTransition, type Status } from "./moderation";

describe("canTransition", () => {
  it("allows PENDING -> APPROVED/REJECTED", () => {
    expect(canTransition("PENDING", "APPROVED")).toBe(true);
    expect(canTransition("PENDING", "REJECTED")).toBe(true);
  });
  it("allows APPROVED -> ARCHIVED", () => {
    expect(canTransition("APPROVED", "ARCHIVED")).toBe(true);
  });
  it("forbids REJECTED -> APPROVED", () => {
    expect(canTransition("REJECTED" as Status, "APPROVED")).toBe(false);
  });
});
```

- [ ] **Step 11: Run → FAIL.**

- [ ] **Step 12: Implement `src/lib/moderation.ts`**
```ts
export type Status = "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";

const ALLOWED: Record<Status, Status[]> = {
  PENDING: ["APPROVED", "REJECTED"],
  APPROVED: ["ARCHIVED"],
  REJECTED: [],
  ARCHIVED: ["APPROVED"],
};

export function canTransition(from: Status, to: Status): boolean {
  return ALLOWED[from]?.includes(to) ?? false;
}
```

- [ ] **Step 13: Run → PASS.**

- [ ] **Step 14: validation — failing test** `src/lib/validation.test.ts`
```ts
import { describe, it, expect } from "vitest";
import { submissionSchema } from "./validation";

const valid = {
  name: "Green Bites",
  category: "RESTAURANT",
  shortDescription: "Plant-forward bistro",
  description: "A plant-forward bistro sourcing locally in Tunis.",
  governorate: "TUNIS",
  city: "Tunis",
  practices: ["LOCALLY_SOURCED"],
  website: "https://greenbites.tn",
};

describe("submissionSchema", () => {
  it("accepts a valid submission", () => {
    expect(submissionSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects empty name", () => {
    expect(submissionSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });
  it("rejects a bad website url", () => {
    expect(submissionSchema.safeParse({ ...valid, website: "not-a-url" }).success).toBe(false);
  });
  it("rejects an unknown category", () => {
    expect(submissionSchema.safeParse({ ...valid, category: "NOPE" }).success).toBe(false);
  });
});
```

- [ ] **Step 15: Run → FAIL.**

- [ ] **Step 16: Implement `src/lib/validation.ts`** (install zod: `npm install zod`)
```ts
import { z } from "zod";

const Category = z.enum([
  "RESTAURANT","CAFE","GROCERY_MARKET","RETAIL_SHOP","SERVICES",
  "COMPANY_B2B","ACCOMMODATION","OTHER",
]);
const Governorate = z.enum([
  "TUNIS","ARIANA","BEN_AROUS","MANOUBA","NABEUL","ZAGHOUAN","BIZERTE","BEJA",
  "JENDOUBA","KEF","SILIANA","SOUSSE","MONASTIR","MAHDIA","SFAX","KAIROUAN",
  "KASSERINE","SIDI_BOUZID","GABES","MEDENINE","TATAOUINE","GAFSA","TOZEUR","KEBILI",
]);
const Practice = z.enum([
  "PLANT_BASED_OPTIONS","LOCALLY_SOURCED","ZERO_WASTE_COMPOSTING","NO_SINGLE_USE_PLASTIC",
  "REUSABLE_PACKAGING","BULK_PACKAGE_FREE","RENEWABLE_ENERGY","WATER_CONSERVATION",
  "RECYCLING_PROGRAM","ANTI_FOOD_WASTE","FAIR_ETHICAL_LABOR","BIKE_EV_FRIENDLY",
]);
const optUrl = z.string().url().optional().or(z.literal("").transform(() => undefined));

export const submissionSchema = z.object({
  name: z.string().min(2).max(120),
  category: Category,
  shortDescription: z.string().min(5).max(160),
  description: z.string().min(20).max(4000),
  governorate: Governorate,
  city: z.string().min(1).max(80),
  address: z.string().max(200).optional(),
  practices: z.array(Practice).default([]),
  website: optUrl,
  email: z.string().email().optional().or(z.literal("").transform(() => undefined)),
  phone: z.string().max(40).optional(),
  instagram: z.string().max(120).optional(),
  facebook: z.string().max(120).optional(),
  submitterName: z.string().max(120).optional(),
  submitterEmail: z.string().email().optional().or(z.literal("").transform(() => undefined)),
  // honeypot — must be empty
  company_website: z.literal("").optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
```

- [ ] **Step 17: Run full suite → PASS.** `npm test`

- [ ] **Step 18: Commit**
```bash
git add -A
git commit -m "feat: add tested domain logic (slug, filters, moderation, validation)"
```

---

## Task 5: Seed data

**Files:** Create `prisma/seed.ts`.

- [ ] **Step 1: Write `prisma/seed.ts`** with ~10 APPROVED + 2 PENDING Tunisian businesses across categories/governorates, varied practices, some with certifications and `ADMIN_VERIFIED`/`EVIDENCE_PROVIDED`.
```ts
import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/slug";
const db = new PrismaClient();

const data = [
  {
    name: "Green Bites Tunis", category: "RESTAURANT", governorate: "TUNIS", city: "Tunis",
    shortDescription: "Plant-forward bistro sourcing from local farms.",
    description: "A plant-forward bistro in central Tunis sourcing seasonal produce from local organic farms, with zero-waste kitchen practices.",
    practices: ["PLANT_BASED_OPTIONS","LOCALLY_SOURCED","ZERO_WASTE_COMPOSTING","NO_SINGLE_USE_PLASTIC"],
    website: "https://greenbites.tn", status: "APPROVED", verification: "ADMIN_VERIFIED",
    certifications: [{ type: "ORGANIC_BIO_TUNISIE", year: 2023 }],
  },
  // ... 9 more APPROVED across CAFE, GROCERY_MARKET, RETAIL_SHOP, SERVICES,
  //     COMPANY_B2B, ACCOMMODATION, OTHER in governorates SOUSSE, SFAX, NABEUL,
  //     BIZERTE, DJERBA(MEDENINE), ARIANA, GABES, MONASTIR, KAIROUAN.
  // ... 2 PENDING (status: "PENDING", verification: "SELF_DECLARED") to exercise admin queue.
];

async function main() {
  for (const b of data) {
    const { certifications = [], ...rest } = b as any;
    await db.business.create({
      data: {
        ...rest,
        slug: slugify(b.name),
        images: [],
        tags: [],
        certifications: { create: certifications },
      },
    });
  }
}
main().then(() => db.$disconnect()).catch(async (e) => { console.error(e); await db.$disconnect(); process.exit(1); });
```
> **Execution note:** Fill in the full 12-entry array with realistic, varied data when implementing this task (the structure above is the exact shape; do not leave the array partial in the real file).

- [ ] **Step 2: Run seed**
```bash
npm run db:seed
```
Expected: rows created. Verify with `npx prisma studio`.

- [ ] **Step 3: Commit**
```bash
git add -A
git commit -m "feat: add Prisma seed with Tunisian eco-businesses"
```

---

## Task 6: Data access layer

**Files:** Create `src/server/businesses.ts`.

- [ ] **Step 1: Implement read functions**
```ts
import { db } from "@/lib/db";
import { buildBusinessWhere, type BusinessFilters } from "@/lib/filters";

export async function listBusinesses(filters: BusinessFilters) {
  return db.business.findMany({
    where: buildBusinessWhere(filters) as never,
    orderBy: [{ verification: "desc" }, { createdAt: "desc" }],
    include: { certifications: true },
  });
}

export async function getBusinessBySlug(slug: string) {
  return db.business.findUnique({
    where: { slug },
    include: { certifications: true },
  });
}

export async function listPending() {
  return db.business.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: { certifications: true },
  });
}
```

- [ ] **Step 2: Typecheck** `npx tsc --noEmit` → no errors.

- [ ] **Step 3: Commit**
```bash
git add -A
git commit -m "feat: add business data access layer"
```

---

## Task 7: Homepage — list + filter bar

> Run `ui-ux-pro-max` and `vercel-react-best-practices` before building this surface.

**Files:** Modify `src/app/page.tsx`, `src/app/layout.tsx`. Create `src/components/business-card.tsx`, `src/components/filter-bar.tsx`, `src/components/eco-badges.tsx`.

- [ ] **Step 1:** Build `eco-badges.tsx` — renders practice/certification/verification badges from `eco.ts` label maps (shadcn `Badge`).
- [ ] **Step 2:** Build `business-card.tsx` — accessible card (semantic `<article>`, heading link to `/business/[slug]`, category + governorate, short description, eco badges).
- [ ] **Step 3:** Build `filter-bar.tsx` — Client Component: search input + category Select + governorate Select + practices checkboxes; updates URL `searchParams` (router.replace) so state is shareable and server-rendered. Includes labelled controls and a "Clear filters" action.
- [ ] **Step 4:** `page.tsx` — Server Component: read `searchParams`, call `listBusinesses`, render `FilterBar` + responsive grid of `BusinessCard`. Empty state when no matches.
- [ ] **Step 5:** `layout.tsx` — header with ECOTUN wordmark + nav (Home, Submit), `metadata`, skip-link, `<main>` landmark.
- [ ] **Step 6:** Verify in browser at `/` — filtering by category/governorate/practice/search updates the list.
- [ ] **Step 7: Commit**
```bash
git add -A
git commit -m "feat: homepage with business list and search/filter bar"
```

---

## Task 8: Business detail page

> Run `ui-ux-pro-max` before building.

**Files:** Create `src/app/business/[slug]/page.tsx`.

- [ ] **Step 1:** Server Component: `getBusinessBySlug`; `notFound()` if missing or not APPROVED. Render name, category, location, description, contact links (website/phone/email/socials), eco-badges, certifications list (with issuer/year and evidence link when present), verification badge. `generateMetadata` for title/description.
- [ ] **Step 2:** Verify a seeded business renders at its `/business/[slug]`.
- [ ] **Step 3: Commit**
```bash
git add -A
git commit -m "feat: business detail page"
```

---

## Task 9: Submit form (Server Action)

> Run `ui-ux-pro-max` before building.

**Files:** Create `src/app/submit/page.tsx`, `src/components/submit-form.tsx`, `src/server/actions.ts`.

- [ ] **Step 1:** `actions.ts` — `submitBusiness(formData)` Server Action: parse with `submissionSchema`; reject if honeypot `company_website` non-empty; on success create `Business` with `status: PENDING`, `verification: SELF_DECLARED`, unique slug (append short suffix on collision); return `{ ok, errors? }`. `revalidatePath("/admin")`.
```ts
"use server";
import { db } from "@/lib/db";
import { submissionSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";

export async function submitBusiness(_prev: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData) as Record<string, unknown>;
  raw.practices = formData.getAll("practices");
  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;
  let slug = slugify(d.name);
  if (await db.business.findUnique({ where: { slug } })) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }
  const { company_website, ...rest } = d;
  await db.business.create({ data: { ...rest, slug, status: "PENDING", verification: "SELF_DECLARED" } });
  revalidatePath("/admin");
  return { ok: true };
}
```
- [ ] **Step 2:** `submit-form.tsx` — Client Component using `useActionState(submitBusiness, ...)`; labelled fields for all schema properties; practices as checkboxes; hidden honeypot `company_website`; field-level error display; success confirmation ("Submitted for review"). Uses shadcn `Form`/`Input`/`Select`/`Textarea`/`Checkbox`/`Button` + `sonner` toast.
- [ ] **Step 3:** `submit/page.tsx` renders the form with intro copy explaining moderation + anti-greenwashing (provide evidence).
- [ ] **Step 4:** Verify: submitting creates a PENDING row (check Prisma Studio / admin queue next task). Honeypot-filled submission is rejected.
- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "feat: public submit form with server action and validation"
```

---

## Task 10: Auth.js single-admin

**Files:** Create `src/server/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/app/admin/login/page.tsx`, `src/middleware.ts`. Modify `.env`.

> **USER SETUP CHECKPOINT:** Generate `AUTH_SECRET` (`npx auth secret`) and an admin password hash. Provide a one-off script to print a bcrypt hash for `ADMIN_PASSWORD_HASH`.

- [ ] **Step 1:** Install: `npm install next-auth@beta bcryptjs && npm install -D @types/bcryptjs`.
- [ ] **Step 2:** `src/server/auth.ts` — NextAuth v5 Credentials provider; authorize compares email to `ADMIN_EMAIL` and `bcrypt.compare(password, ADMIN_PASSWORD_HASH)`; JWT session; export `auth`, `handlers`, `signIn`, `signOut`.
```ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(c) {
        const email = String(c?.email ?? "");
        const password = String(c?.password ?? "");
        const ok =
          email === process.env.ADMIN_EMAIL &&
          (await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH ?? ""));
        return ok ? { id: "admin", email } : null;
      },
    }),
  ],
});
```
- [ ] **Step 3:** `route.ts` → `export const { GET, POST } = handlers;`
- [ ] **Step 4:** `middleware.ts` — protect `/admin` (allow `/admin/login`), redirect unauthenticated to login. Use `auth` wrapper with a matcher `["/admin/:path*"]`.
- [ ] **Step 5:** `admin/login/page.tsx` — sign-in form posting credentials via `signIn("credentials", ...)`.
- [ ] **Step 6:** Add a helper script `scripts/hash-password.ts` (`tsx scripts/hash-password.ts <password>`) printing a bcrypt hash; document in README.
- [ ] **Step 7:** Verify: `/admin` redirects to login when signed out; correct credentials grant access.
- [ ] **Step 8: Commit**
```bash
git add -A
git commit -m "feat: single-admin auth with Auth.js credentials + route protection"
```

---

## Task 11: Admin moderation queue

> Run `ui-ux-pro-max` before building.

**Files:** Create `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`, `src/components/moderation-actions.tsx`. Modify `src/server/actions.ts`.

- [ ] **Step 1:** Add to `actions.ts`: `moderate(id, action, note?)` Server Action — re-check `auth()` (defense in depth); load business; use `canTransition` to validate; set `status`, `reviewNote`, `reviewedAt`; optional `verification` escalation on approve; `revalidatePath("/admin")` + `revalidatePath("/")`. Reject if unauthenticated.
- [ ] **Step 2:** `admin/layout.tsx` — server-side `auth()` guard + admin header with sign-out.
- [ ] **Step 3:** `admin/page.tsx` — `listPending()`; render each with details + `ModerationActions`.
- [ ] **Step 4:** `moderation-actions.tsx` — Approve / Reject (with reason dialog) / set verification; calls `moderate`. Optimistic/toast feedback.
- [ ] **Step 5:** Verify full loop: submit (Task 9) → appears in queue → Approve → shows on homepage; Reject → stays off homepage with reason stored.
- [ ] **Step 6: Commit**
```bash
git add -A
git commit -m "feat: admin moderation queue with approve/reject/verify"
```

---

## Task 12: PWA (Serwist) — manifest, service worker, icons, offline

**Files:** Install Serwist; create `src/app/sw.ts`, `public/manifest.webmanifest`, `public/icons/*`, `src/app/~offline/page.tsx`, `src/components/install-prompt.tsx`. Modify `next.config.ts`, `src/app/layout.tsx`.

- [ ] **Step 1:** Install: `npm install @serwist/next && npm install -D serwist`.
- [ ] **Step 2:** `next.config.ts` — wrap with `withSerwist({ swSrc: "src/app/sw.ts", swDest: "public/sw.js" })`.
- [ ] **Step 3:** `src/app/sw.ts` — `defaultCache` + precache; navigation fallback to `/~offline`.
- [ ] **Step 4:** `public/manifest.webmanifest` — name "ECOTUN", short_name, description, `start_url: "/"`, `display: "standalone"`, theme/background colors (eco green), icons (192, 512, maskable). Link it in `layout.tsx` metadata (`manifest: "/manifest.webmanifest"`, `themeColor`).
- [ ] **Step 5:** Add placeholder icons in `public/icons/` (192×192, 512×512, maskable 512×512) — simple generated PNG/SVG-derived placeholders; note in README to replace with real branding.
- [ ] **Step 6:** `~offline/page.tsx` — friendly offline message.
- [ ] **Step 7:** `install-prompt.tsx` — optional A2HS prompt capturing `beforeinstallprompt`.
- [ ] **Step 8:** Verify (production build, since SW is prod-gated): `npm run build && npm start`; in Chrome DevTools → Application: manifest valid, service worker active, app installable; toggle offline and confirm app shell + `/~offline` work.
- [ ] **Step 9: Commit**
```bash
git add -A
git commit -m "feat: PWA support (manifest, Serwist service worker, offline, icons)"
```

---

## Task 13: Accessibility/UX audit + README + final verification

> Run `web-design-guidelines` for the audit pass.

**Files:** Modify components per audit; rewrite `README.md`.

- [ ] **Step 1:** Run `web-design-guidelines` over the UI; fix flagged issues (labels, focus order, contrast, landmarks, keyboard operability of filters/dialogs).
- [ ] **Step 2:** Rewrite `README.md` — what ECOTUN is, stack, local setup (env vars, DB, migrate, seed, admin password hash), scripts, deploy notes, and where to replace placeholder icons.
- [ ] **Step 3:** Full verification: `npm test` (green), `npm run build` (clean), manual pass of browse → filter → detail → submit → admin approve → appears live.
- [ ] **Step 4: Commit**
```bash
git add -A
git commit -m "docs: README + accessibility polish"
```

---

## Task 14: Deploy to Vercel

> Run `deploy-to-vercel`.

- [ ] **Step 1:** Ensure Vercel Postgres is attached to the project; set `DATABASE_URL`/`DIRECT_URL` (mapped to `POSTGRES_PRISMA_URL`/`POSTGRES_URL_NON_POOLING`), `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` in Vercel env.
- [ ] **Step 2:** Add `postinstall: prisma generate` and ensure `prisma migrate deploy` runs (build step) so prod DB is migrated.
- [ ] **Step 3:** Deploy; run `prisma db seed` against prod once (optional).
- [ ] **Step 4:** Verify the live URL: installable PWA, browse/submit work, `/admin` protected.
- [ ] **Step 5: Commit any deploy config**
```bash
git add -A
git commit -m "chore: Vercel deploy configuration"
```

---

## Self-review notes

- **Spec coverage:** directory browse (T7), search/filter by category+location+attributes (T4 filters, T7), detail (T8), public submit (T9), moderation states + queue (T4 moderation, T10–11), no public accounts / single-admin auth (T10), PWA manifest+SW+icons+offline (T12), Tunisia governorates + eco certs/practices + anti-greenwashing evidence/verification (T2 schema, T3 labels, T8 detail), accessibility/mobile-first (T7/T13), seed data (T5), Vercel deploy (T14). All spec sections map to tasks.
- **Type consistency:** `buildBusinessWhere`/`BusinessFilters` (T4) consumed by `listBusinesses` (T6) and `page.tsx` (T7); `canTransition`/`Status` (T4) used by `moderate` (T11); `submissionSchema`/`SubmissionInput` (T4) used by `submitBusiness` (T9) and `submit-form` (T9); enum string values identical across `schema.prisma` (T2), `eco.ts` (T3), and `validation.ts` (T4).
- **Placeholders:** seed array (T5) is intentionally summarized with an explicit execution note to fill all 12 entries; every code-bearing logic step contains complete code.
