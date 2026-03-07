# no cap food rankings

A food ranking game where users vote on which country's food they prefer.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Drizzle ORM + PostgreSQL
- shadcn/ui (Radix)
- Prettier for formatting

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `app/vote/` - Voting feature (server page, client vote-screen, server actions)
- `data/` - Static JSON data (countries list)
- `db/` - Drizzle ORM schema and client singleton
- `drizzle/` - Generated migration files
- `lib/` - Shared utilities (countries, visitor ID)
- `components/ui/` - shadcn/ui components
- `public/` - Static assets (including og.png)
- `@/*` - Path alias for project root

## Commands

- `npm run dev` - Start dev server
- `npm run build` - Production build (note: known Turbopack prerender bug, not
  our code)
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier
- `npm run db:generate` - Generate Drizzle migration files
- `npm run db:migrate` - Run pending migrations
- `npm run db:studio` - Open Drizzle Studio

## Code Style

See `CODE_STYLE.md` for full details. Key rules:

- No CONSTANT_CASE. Use camelCase.
- Use full word variable names (e.g., `request` not `req`).
- Use whitespace to break up code. Blank line after const groups, control flows,
  and before returns.
- Alphabetical ordering by default. Accessibility level first if applicable.
- No `any` - use proper types or `unknown`.
- No non-null assertions (`!` operator).
- Prefer `??` over `||`.
- Always await or handle promises.
- Single quotes, no semicolons.

## Testing

- Test files live next to the implementation.
- Prefer `toEqual` over `toBe`.
- Compare entire objects instead of single properties.

## Database

- PostgreSQL connection configured via `DATABASE_URL` in `.env`
- Drizzle config at `drizzle.config.ts`, schema at `db/schema.ts`
- DB client uses globalThis singleton to survive Next.js dev hot reload

## React 19 Lint Gotchas

- `react-hooks/set-state-in-effect`: Cannot call setState directly inside
  useEffect. Use `useSyncExternalStore` for client-only mounting instead.
- `react-hooks/refs`: Cannot access ref.current during render. Don't use refs
  for lazy client-side init — use a mounted gate component pattern instead
  (parent checks mounted, child uses `useState` with lazy initializer).

## Design

- Fonts: Outfit (sans), Merriweather (serif), JetBrains Mono (mono) via
  shadcn/ui theme from tweakcn
- Vote screen: mobile-first vertical split, horizontal on `md:` breakpoint
- Pastel color palette (amber/orange warm side, cyan/blue cool side)
- Tone: zoomer/gen-alpha friendly descriptions

## GitHub

- Repo: https://github.com/Artmann/chow-where

## Git

- Don't include Claude as the author in commit messages.
