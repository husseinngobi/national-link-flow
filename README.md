# NGDXH

National Government Data Exchange Hub for Uganda.

NGDXH is a working showcase prototype for secure government interoperability. It demonstrates how a citizen, company, or officer can move through public and internal flows while ministry data remains role-scoped, auditable, and exchange-based rather than copied into one central monolith.

## What This Repository Contains

- `client/` - the public and internal web app built with React, TanStack Router, Vite, and Tailwind CSS.
- `server/` - the demo backend with SQLite and Postgres execution paths.
- `docs/` - showcase, architecture, and deployment notes for reviewers.

## Showcase Highlights

- Public citizen and service portal.
- Internal officer flows with role-based access control.
- NIRA-style biometric verification.
- Audit logging and simulated SSO.
- Ministry interoperability views for verification, simulation, and oversight.

## Public vs Internal

- Public-facing entry points are intentionally limited to the citizen, company, and service guidance flows.
- Internal operational pages are reserved for officer sign-in and role-scoped dashboards.
- The repository is structured so a reviewer can understand the separation at a glance.

## Repository Guide

- [Showcase overview](docs/showcase-overview.md)
- [System architecture](docs/system-architecture.md)
- [Deployment guide](docs/deployment.md)
- [Repository map](docs/repository-map.md)
- [Application-ready summary](docs/application-ready-summary.md)

## Local Development

Frontend:

```powershell
npm run dev:client
```

Backend:

```powershell
npm run dev:server
```

Build the client:

```powershell
npm run build:client
```

## Recommended Deployment Split

For this prototype, the best production-style deployment is:

- Frontend on Vercel.
- Backend on Render.
- Postgres for the backend data store.

That split fits the repo well because the frontend is a static/edge-friendly React app while the backend has server-side state, audit logging, and a clear database dependency.

## Deployment Notes

- Use Postgres for the hosted backend. SQLite is fine for local demo mode, but it is not the right choice for persistent hosted deployment.
- Set the frontend API base URL to the Render backend.
- Keep sensitive environment variables out of GitHub.
- If you want a single-provider alternative, Cloudflare Pages + Workers is also a strong match for this codebase, but Vercel + Render is a good and practical split.

## Before Sharing the Repo

- Run `npm run build:client`.
- Run `npm run lint` in `client/`.
- Confirm `client/.env` and `server/.env` are not committed.
- Confirm generated output such as `dist/` stays ignored.

## Status

This is a showcase prototype, not a live production government integration.
