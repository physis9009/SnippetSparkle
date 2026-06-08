# Snippet Sparkle ✨

A secure personal snippet-sharing web app — save, search, star, and share code snippets.

---

## Overview

Snippet Sparkle is a lightweight Next.js application for collecting and sharing code snippets. It provides account-based access, searchable snippet collections, tagging and favorites (starred snippets). The project is built with modern React and Next.js patterns, TypeScript, Tailwind CSS, and integrates NextAuth for credential-based authentication.

## Key Features

- Account-based authentication (credentials) via NextAuth
- Create, view, and search code snippets by language and tags
- Star / favorite snippets and paginated browsing

## Tech Stack

- Framework: Next.js 16 (app router)
- Language: TypeScript + React 19
- Auth: NextAuth (credentials provider)
- Database: PostgreSQL (accessed with the `postgres` package)
- Styling: Tailwind CSS (shadcn components, base-ui theme)
- Utilities: `zod`, `bcrypt`, `highlight.js`

## Project Structure (high level)

- [app/](app/): Next.js application routes and UI (app router)
	- [app/layout.tsx](app/layout.tsx#L1-L120) — global layout and metadata
	- [app/lib/definitions.ts](app/lib/definitions.ts#L1-L80) — core TypeScript types (`Snippet`, `Tag`, `User`)
	- [app/ui/](app/ui/) — reusable UI components (search, pagination, star button, forms)
- `auth.ts` — NextAuth setup and credential provider logic ([auth.ts](auth.ts#L1-L200))
- `auth.config.ts` — auth configuration and protected-route behavior
- `package.json` — scripts and dependency manifest ([package.json](package.json#L1-L80))
- `LICENSE` — project license (Creative Commons BY-NC-SA 4.0)

## Getting Started

Prerequisites:

- Node.js (recommended LTS)
- PostgreSQL instance and a `POSTGRES_URL` connection string

Quick start (using your package manager; repository includes `pnpm-lock.yaml`):

```bash
# install
pnpm install

# run dev server
pnpm dev
```

Environment variables to set (examples):

- `POSTGRES_URL` — full PostgreSQL connection string (required)
- `NEXTAUTH_URL` — canonical site URL (for auth callbacks)
- `NEXTAUTH_SECRET` — secret for NextAuth (production)

## Contributing

Thanks for considering contributing! A suggested workflow:

1. Fork the repository and create a feature branch.
2. Open a clear, focused pull request describing the change.
3. Keep changes small and test locally.

Coding guidelines:

- Follow the existing TypeScript and React style in `app/` and `components/`.
- Add or update `app/lib/definitions.ts` types when changing core data shapes.
- Run linters and keep commits atomic.

If you discover security-related issues (e.g., secrets accidentally committed), please contact the maintainer directly rather than opening a public issue.

## License

This repository is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. See [LICENSE](LICENSE#L1-L6) for details.

## Contact / Acknowledgments

Maintainer: Wynn Wang

Thanks to the open-source libraries used in this project (Next.js, NextAuth, Tailwind, shadcn, and many others listed in [package.json](package.json#L1-L80)).

---