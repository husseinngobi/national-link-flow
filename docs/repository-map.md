# Repository Map

## Top Level

- `client/` - React frontend and UI shell.
- `server/` - backend services and demo data handling.
- `docs/` - showcase, architecture, and deployment documentation.

## Client

- `client/src/routes/` - route-level pages for the public and internal experiences.
- `client/src/components/` - shared shells, theme controls, and UI building blocks.
- `client/src/hooks/` - client-side hooks.
- `client/src/lib/` - app helpers and static domain data.
- `client/src/styles.css` - global design tokens, theme variables, and utility classes.

## Server

- `server/index.js` - SQLite-backed demo server.
- `server/index-postgres.js` - Postgres-backed server path.
- `server/boot.js` - environment switch that selects SQLite or Postgres mode.
- `server/scripts/` - maintenance and migration helpers.

## Review Focus

This repository is organized to make the public and internal surfaces easy to review:

- public pages for citizens and general service guidance
- internal officer pages for controlled access workflows
- server-side audit and verification behavior
- deployment notes for hosted review and handoff
