# Adab / Inspo

A calm, Islamic-corrective guide to online behaviour — plus a small set of tools
that make the point:

| Surface | Route | What it is |
| --- | --- | --- |
| Landing page | `/` | The essay (the gaze, the comment, the adab we owe one another) |
| Reflections | `/blog`, `/blog/:blogId` | Community-written posts with a moderation queue |
| Write a reflection | `/blog/new` | Submissions land as `pending` until a moderator approves them |
| Inspo board | `/dashboard` | An infinite Konva canvas: upload images, write text, undo, AI-generate |
| Moderator console | `/admin` | Server-verified approve/reject queue |

Stack: **TanStack Start** (SSR + server functions) · **React 19** ·
**Supabase** (Postgres, Auth, Storage, Edge Functions) · **shadcn/ui** +
**Tailwind v4** · **Konva/react-konva** · **Cloudflare Workers** (via
`@cloudflare/vite-plugin` + Nitro).

---

## Quick start

```bash
npm install
cp .env.example .env   # then fill in your Supabase project values
npm run dev            # http://localhost:8080
```

The Supabase values come from your project's API settings (or `supabase status`
for a local stack). See [.env.example](./.env.example) for every variable.

### Database

Migrations live in [`supabase/migrations/`](./supabase/migrations) and apply in
filename order:

| File | Purpose |
| --- | --- |
| `20260905_create_blogs_table.sql` | `blogs` table |
| `20260906_add_blog_status.sql` | moderation `status` column |
| `20260907_create_boards.sql` | `boards`, `board_items`, private `board-images` storage bucket, owner-only RLS |
| `20260908_harden_policies.sql` | `CHECK` constraints, tags backfill + `NOT NULL`, `updated_at` trigger, indexes, tightened `blogs` RLS, `increment_blog_likes` clamp (`-1..1`) |

`supabase/seed.sql` (wired up in `supabase/config.toml` under `[db] seed_sql`)
seeds the four starter reflections on `supabase db reset`.

```bash
supabase db reset                              # local: migrate + seed
supabase functions deploy generate-image       # edge function for AI images
supabase secrets set LOVABLE_API_KEY=...       # env for the edge function
```

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port **8080** |
| `npm run build` / `npm run build:dev` | Production / development build |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | `tsc --noEmit` (covers `src`, `e2e`, config files) |
| `npm run lint` / `npm run lint:fix` | ESLint over the whole repo |
| `npm run check` | typecheck + lint in one shot |
| `npm test` | Playwright e2e suite |

---

## Environment variables

Everything is documented inline in [`.env.example`](./.env.example).

**Client-safe** (inlined into the browser bundle — never a secret):

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

**Server-only** (read through `process.env` in server functions/middleware):

- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — bypasses RLS; used *only* by
  `src/integrations/supabase/client.server.ts` and the `generate-image`
  edge function.
- `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET` — moderator sign-in.
- `LOVABLE_CRON_SECRET` (`_PREVIOUS` for rotation) and `LOVABLE_API_KEY`
  for edge functions, set with `supabase secrets set` rather than `.env`.

> `.env` is gitignored. Only `.env.example` (with placeholders) is committed.

---

## How it's put together

**Routing** — file-based, under `src/routes/`. `_authenticated.tsx` wraps the
private area and bounces signed-out visitors to `/login?redirect=...`.

**Server-only code** — there is no `.server.ts` Vite plugin, so privileged
modules are imported lazily *inside* a handler:

```ts
const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
```

Never hoist that import to module scope.

**Moderation** — every privileged step happens on the server
(`src/services/admin.functions.ts`):

1. the password is compared against `process.env.ADMIN_PASSWORD`
   (never a `VITE_` var — those are bundled into the client),
2. success returns an HMAC-SHA256 signed, 8-hour expiring token stored in
   `localStorage` (`src/lib/admin-session.ts`),
3. reads/writes go through the service-role client, because RLS now only lets
   authors *submit* posts, not approve or edit them.

**Validation** — zod schemas live in `src/lib/validation.ts`; safe post-auth
redirects are constrained by `src/lib/safe-redirect.ts` (same-origin paths only).

**Canvas** — `src/components/canvas/` renders a Konva stage. Shared item types
are in `board-types.ts`; history is a bounded stack in
`src/hooks/use-undo-stack.ts`.

---

## Testing

```bash
npx playwright install chromium   # once
npm test
```

The suite boots its own dev server on port **8099** (`--strictPort`) so it
never attaches to a stray dev server on 8080. Point it at a deployed preview
with `PLAYWRIGHT_BASE_URL=https://... npm test` instead.

---

## CI

[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) runs typecheck, lint
and build on every push/PR, plus the Playwright suite as a separate job.

---

## Deploying

`wrangler.jsonc` + `@cloudflare/vite-plugin` target **Cloudflare Workers**
(`main: "@tanstack/react-start/server-entry"`, `nodejs_compat`). Set the
environment variables above on the Worker, and the `VITE_` ones at build time.

> **Lockfiles:** `package-lock.json` is the source of truth (CI runs `npm ci`).
> `bun.lockb`/`bunfig.toml` are leftovers from an earlier Bun setup and may be
> stale — delete them if you're not using Bun, or regenerate with `bun install`.
