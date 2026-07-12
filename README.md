# ECOTUN

An installable PWA directory of eco-conscious businesses in Tunisia. Visitors can browse, search, and filter listings by category and governorate; submit new businesses through a moderated form; and install the app to their home screen for offline access. A single admin reviews every submission before it goes live, preventing greenwashing.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (base-ui) |
| Database ORM | Prisma 7 + PostgreSQL |
| Auth | Auth.js v5 (single-admin, credential provider) |
| PWA | Serwist (service worker + offline shell) |
| Deploy | Vercel |

## Local setup

**Prerequisites:** Node.js 20+, a PostgreSQL database (local or Neon/Supabase/etc).

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and fill in the values:

   ```bash
   cp .env.example .env
   ```

   Required variables:

   ```env
   # Postgres connection strings (pooled + direct)
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/ecotun?sslmode=require"
   DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/ecotun?sslmode=require"

   # Auth.js secret
   AUTH_SECRET=""

   # Single admin account
   ADMIN_EMAIL="admin@ecotun.tn"
   ADMIN_PASSWORD_HASH=""
   ```

3. **Generate `AUTH_SECRET`**

   ```bash
   npx auth secret
   ```

   Or with OpenSSL:

   ```bash
   node -e "const c=require('crypto');console.log(c.randomBytes(32).toString('base64url'))"
   ```

   Paste the output into `AUTH_SECRET` in `.env`.

4. **Set the admin credentials**

   Set `ADMIN_EMAIL` to the admin's email address, then generate a bcrypt hash of the password:

   ```bash
   npx tsx scripts/hash-password.ts your-strong-password
   ```

   Paste the hash output into `ADMIN_PASSWORD_HASH` in `.env`.

   > **Development defaults** — the seed script sets up `admin@ecotun.tn` / `ecotun-dev-admin`.
   > You must replace these with a strong password before deploying to production (regenerate the hash).

5. **Run migrations and seed**

   ```bash
   npx prisma migrate deploy   # apply all migrations
   npm run db:seed             # seed initial data (dev admin + sample businesses)
   ```

   For local development you can also use `npm run db:migrate` which runs `prisma migrate dev` (creates new migrations if you change the schema).

6. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev --turbopack` | Start development server with Turbopack |
| `build` | `next build --webpack` | Production build (webpack, required for Serwist) |
| `start` | `next start` | Serve the production build |
| `test` | `vitest run` | Run all tests once |
| `db:migrate` | `prisma migrate dev` | Create and apply a new migration |
| `db:deploy` | `prisma migrate deploy` | Apply pending migrations (production/CI) |
| `db:seed` | `tsx prisma/seed.ts` | Seed the database |
| `db:studio` | `prisma studio` | Open Prisma Studio GUI |

## Admin panel

The moderation queue lives at `/admin` (protected; redirects to `/admin/login` if unauthenticated).

**Development credentials** (set by `db:seed`):

- Email: `admin@ecotun.tn`
- Password: `ecotun-dev-admin`

**Before deploying to production**, generate a new hash and update `ADMIN_PASSWORD_HASH`:

```bash
npx tsx scripts/hash-password.ts your-production-password
```

## PWA notes

- **Icons**: `public/icons/` contains placeholder PNG icons. Replace them with real branded assets (192×192 and 512×512). You can regenerate the placeholders with:

  ```bash
  node scripts/gen-icons.mjs
  ```

- **Build flag**: `npm run build` uses `--webpack` because Serwist's `InjectManifest` plugin is incompatible with Turbopack. The dev server (`npm run dev`) uses Turbopack for speed; only the production build uses webpack.

## Deploy on Vercel

1. Connect the repository in the Vercel dashboard.

2. Set all required environment variables in **Settings → Environment Variables**:

   | Variable | Notes |
   |---|---|
   | `DATABASE_URL` | Pooled connection (e.g., Neon pooler URL) |
   | `DIRECT_URL` | Direct (non-pooled) connection — required by Prisma migrations |
   | `AUTH_SECRET` | Generate with `npx auth secret` |
   | `ADMIN_EMAIL` | Admin login email |
   | `ADMIN_PASSWORD_HASH` | bcrypt hash from `npx tsx scripts/hash-password.ts` |

3. **Run migrations on deploy.** Add `prisma migrate deploy` to your deploy command, or use a Vercel build hook. The `postinstall` script should run `prisma generate` automatically.

4. **Build command**: `npm run build` (uses `--webpack`; already set in `package.json`).

## Project structure

```
src/
  app/           # Next.js App Router pages and layouts
  components/    # Shared UI components
  server/        # Data access layer + server actions
  lib/           # Shared utilities and constants (eco labels, etc.)
prisma/          # Prisma schema, migrations, and seed
docs/            # Design system and planning documents
scripts/         # CLI helpers (hash-password, gen-icons)
```

- **Design system**: [`docs/design-system.md`](docs/design-system.md)
- **Spec & plan**: [`docs/superpowers/specs/`](docs/superpowers/specs/) and [`docs/superpowers/plans/`](docs/superpowers/plans/)
