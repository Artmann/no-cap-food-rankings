# no cap food rankings

[![CI](https://github.com/Artmann/no-cap-food-rankings/actions/workflows/ci.yml/badge.svg)](https://github.com/Artmann/no-cap-food-rankings/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Website](https://img.shields.io/badge/website-live-brightgreen)](https://no-cap-food-rankings.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)

A food ranking game where users vote on which country's food they prefer.
Two countries go head-to-head and you pick the winner. Results feed into a
live leaderboard.

**[Play now](https://no-cap-food-rankings.vercel.app)**

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- [shadcn/ui](https://ui.shadcn.com/) (Radix)
- [Motion](https://motion.dev/) for animations

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Install

```bash
git clone https://github.com/Artmann/no-cap-food-rankings.git
cd no-cap-food-rankings
npm install
```

### Environment

Create a `.env` file in the project root:

```
DATABASE_URL=postgresql://user:password@localhost:5432/no-cap-food-rankings
```

### Database

```bash
npm run db:generate
npm run db:migrate
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run tests |
| `npm run format` | Format code with Prettier |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:studio` | Open Drizzle Studio |

## Deployment

The app is deployed on [Vercel](https://vercel.com). Push to `main` to trigger
a production deployment.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE) - Christoffer Artmann
