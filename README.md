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

Create a `.env` file:

```
DATABASE_URL="file:./dev.db"
```

For production (Vercel), you'll want to switch to a hosted database (e.g., Turso, PlanetScale, Neon) and update the adapter accordingly.

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS 4**
- **Prisma 7** with SQLite (via `@prisma/adapter-better-sqlite3`)
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

## Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Set `DATABASE_URL` env var (or switch to a hosted DB adapter)
4. Deploy

## License

MIT
