# Contributing

Thanks for your interest in contributing to no cap food rankings!

## How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b my-feature`)
3. Commit your changes
4. Push to your branch (`git push origin my-feature`)
5. Open a Pull Request against `main`

## Development Setup

```bash
git clone https://github.com/<your-username>/no-cap-food-rankings.git
cd no-cap-food-rankings
npm install
```

Create a `.env` file:

```
DATABASE_URL=postgresql://user:password@localhost:5432/no-cap-food-rankings
```

Set up the database and start the dev server:

```bash
npm run db:generate
npm run db:migrate
npm run dev
```

## Code Style

- Single quotes, no semicolons
- Use full word variable names (`request` not `req`)
- Use `camelCase` (no `CONSTANT_CASE`)
- Use whitespace to break up code for readability
- Alphabetical ordering by default
- No `any` — use proper types or `unknown`
- Prefer `??` over `||`

See [CODE_STYLE.md](CODE_STYLE.md) for the full guide.

## Running Checks

Before submitting a PR, make sure everything passes:

```bash
npm run lint
npm run typecheck
npm run test
```

## PR Guidelines

- Keep PRs focused — one feature or fix per PR
- Write a clear description of what changed and why
- Make sure CI passes before requesting review
- Add tests for new functionality
