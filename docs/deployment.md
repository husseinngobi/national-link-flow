# Deployment Guide

## Recommended Hosting Split

For this NGDXH prototype, the cleanest deployment split is:

- Frontend on Vercel.
- Backend on Render.
- Postgres for hosted persistence.

That split is appropriate because the frontend is a Vite/TanStack React app, while the backend has stateful verification, audit logging, and database-backed demo flows.

## Frontend On Vercel

Use the `client/` folder as the project root.

Suggested settings:

- Build command: `npm run build`
- Output: Vite default build output
- Install command: `npm install`

Required environment variables:

- `VITE_API_BASE_URL` - the public URL of the Render backend

## Backend On Render

Use the `server/` folder as the service root.

Suggested settings:

- Start command: `npm start`
- Install command: `npm install`

Required environment variables:

- `DATABASE_URL` - Postgres connection string
- `PORT` - optional, if your Render service expects a fixed port

## Database Choice

Use Postgres in hosted deployment.

SQLite is fine for local showcase use, but it is not ideal for a shared hosted environment because it is file-based and not designed for multi-instance production hosting.

## Security Notes

- Keep secrets out of the repository.
- Restrict CORS to the deployed frontend origin before any public release.
- Use a proper identity provider for any live officer access.
- Treat the current demo credentials as showcase-only.

## Good Alternatives

If you later want a single-vendor edge deployment, Cloudflare Pages + Workers is a strong fit for this stack.

For now, Vercel + Render is a practical and professional match for the repo as it stands.
