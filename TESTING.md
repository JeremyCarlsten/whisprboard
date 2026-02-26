# Whisprboard Testing Guide

This repo uses **Vitest** for unit/integration tests and **Testing Library** for React components.

## Prerequisites

- Node.js 20+
- pnpm installed globally (`npm i -g pnpm`)
- Local dependencies installed:

```bash
pnpm install
```

## Running the test suite

Run all tests once (CI-style):

```bash
pnpm test
```

Run tests in watch mode during development (recommended):

```bash
pnpm vitest -- --watch
```

> Note: `pnpm test` is configured in `package.json` as `vitest run` for fast CI runs. Use the explicit `vitest -- --watch` command locally when iterating.

## Adding new tests

- Place React component tests under `tests/` and use `@testing-library/react` + `@testing-library/jest-dom`.
- Prefer testing user-visible behavior (text, roles, labels) instead of implementation details.
- Keep tests co-located with features when it makes the most sense for maintenance.

## Next steps (future improvement)

- Add a GitHub Actions workflow that runs `pnpm install`, `pnpm lint`, and `pnpm test` on every PR.
- Add example component tests in `tests/` as templates for new contributors.
