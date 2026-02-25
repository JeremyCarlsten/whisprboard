# Whisprboard

A lightweight, reusable feedback board for your apps. Users can suggest features, upvote ideas, and help shape your roadmap.

## Quick Start

```bash
pnpm install
npx prisma migrate dev
pnpm seed
pnpm dev
```

Then visit `http://localhost:3000/squadroll` to see the SquadRoll feedback board.

## Environment Variables

### Local development

Create a `.env` file:

```
DATABASE_URL="file:./dev.db"
```

### Production (Turso / libSQL)

Set these environment variables in Vercel (or your host):

```bash
TURSO_DATABASE_URL="libsql://your-db-name-your-org.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"
```

When both are present, Whisprboard automatically uses the Turso/libSQL adapter. Otherwise it falls back to local SQLite via `better-sqlite3`.

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS 4**
- **Prisma 7** with SQLite (local) / Turso libSQL (production)
- **TypeScript**

## Data Model

- **Product** — each app gets a product entry (e.g., `squadroll`)
- **Feedback** — user suggestions with title, description, score
- **Vote** — one vote per browser fingerprint per feedback item

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/feedback` | Create a new suggestion |
| `POST` | `/api/feedback/[id]/vote` | Upvote a suggestion |
| `GET`  | `/api/health` | Health check + DB status |

### Create feedback

```json
POST /api/feedback
{
  "productSlug": "squadroll",
  "title": "Filter games by genre",
  "body": "Optional longer description"
}
```

### Upvote

```json
POST /api/feedback/:id/vote
{}
```

## Adding a new product

Add a row to the `Product` table with a unique `slug`. Then visit `/:slug` to see its board.

## Integrating with other apps

Link from your app to `https://whisprboard.com/<your-slug>` (or wherever you deploy this).

## Deployment (Vercel + Turso)

1. **Create a Turso database:**
   ```bash
   turso db create whisprboard
   turso db tokens create whisprboard
   ```
2. **Push schema to Turso:**
   ```bash
   TURSO_DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." npx prisma migrate deploy
   ```
3. **Import in Vercel** — connect the GitHub repo
4. **Set env vars** in Vercel project settings:
   - `TURSO_DATABASE_URL` — your Turso database URL
   - `TURSO_AUTH_TOKEN` — your Turso auth token
5. **Deploy** — Vercel will auto-build on push
6. **Seed** (optional): Run seed against Turso or add products via the admin API

### Health check

`GET /api/health` — returns DB connection status and product count.

## License

MIT
