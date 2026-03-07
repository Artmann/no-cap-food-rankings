# Chow Where

A food ranking game where users vote on which country's food they prefer.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Prettier for formatting

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `public/` - Static assets
- `@/*` - Path alias for project root

## Commands

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier

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

## Git

- Don't include Claude as the author in commit messages.
