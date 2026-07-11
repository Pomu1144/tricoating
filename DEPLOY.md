# Deploying Triangle Coatings

This site is a **server-rendered app** (TanStack Start) that runs on
**Cloudflare Workers**, with a **D1 database** for sign-in and accounts. It is
**not** a static site, so it cannot be hosted on GitHub Pages (Pages only serves
static files, which is why an empty Pages site returns a 404).

All commands below run from the `app/` directory.

```bash
cd app
bun install
```

## One-time setup

### 1. Create a Cloudflare account and log in

Sign up at <https://dash.cloudflare.com/sign-up> (the Workers free tier is enough
to start), then authenticate wrangler:

```bash
bunx wrangler login
```

### 2. Create the D1 database

```bash
bunx wrangler d1 create tricoating-db
```

This prints a block like:

```
[[d1_databases]]
binding = "DB"
database_name = "tricoating-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copy the `database_id` and paste it into **`app/wrangler.jsonc`**, replacing
`REPLACE_WITH_DATABASE_ID_FROM_WRANGLER_D1_CREATE`. Commit that change.

### 3. Apply the database schema

```bash
bun run db:migrate
```

(This runs `wrangler d1 migrations apply tricoating-db --remote` against the
files in `app/migrations/`.)

## Deploy

```bash
bun run deploy
```

That builds the app and runs `wrangler deploy`. When it finishes, wrangler prints
the live URL — `https://tricoating.<your-subdomain>.workers.dev`.

To attach a custom domain, add a route/custom domain to the Worker in the
Cloudflare dashboard (Workers & Pages → your Worker → Settings → Domains &
Routes).

## Automatic deploys from GitHub (optional)

`.github/workflows/deploy.yml` builds, migrates, and deploys on every push to
`main`. To enable it, add two repository secrets under
**Settings → Secrets and variables → Actions**:

| Secret | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | A Cloudflare API token with **Edit Cloudflare Workers** and **D1 edit** permissions. Create one at <https://dash.cloudflare.com/profile/api-tokens>. |
| `CLOUDFLARE_ACCOUNT_ID` | Your account id, shown on the right side of the Cloudflare dashboard Workers page (or `bunx wrangler whoami`). |

The database still has to be created once (steps 1–3 above) and its
`database_id` committed to `wrangler.jsonc` before the workflow can deploy.

## Local development

```bash
cd app
bun run dev              # Node dev server at http://localhost:5173
```

`bun run dev` serves the marketing/catalog pages. The sign-in / account routes
call D1, which only exists on Cloudflare — to exercise those locally, run the
Worker runtime instead:

```bash
bun run build
bunx wrangler dev                       # workerd runtime
bun run db:migrate:local                # seed the local D1 once
```
