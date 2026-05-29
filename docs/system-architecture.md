# NGDXH System Architecture

## Architecture Summary

NGDXH is built as a modular web application with a frontend, a simulated backend, and data sources that model government interoperability.

## Main Components

### Frontend

- React application built with TanStack Start / TanStack Router
- Public portal pages for citizens and companies
- Internal officer dashboards for ministries and auditors
- Dedicated demo flows for SSO, simulation, verification, and biometrics

### Backend

- Node.js service that issues and validates demo SSO tokens
- Simulated ministry adapter responses
- Audit logging for verification and access events
- SQLite-backed demo data store with a Postgres migration path

### Data Layer

- SQLite for local prototype execution
- Optional Postgres migration support for local or hosted deployment
- Demo citizen, request, and session records

## Data Flow

1. A citizen, company, or officer starts from the appropriate public or internal page.
2. The frontend requests data or a simulated token from the backend.
3. The backend validates the request and returns a scoped response.
4. Ministry dashboards present only the authorized scope for that role.
5. Audit records are kept for traceability and review.

## Interoperability Model

NGDXH is designed as a broker of controlled exchange.

It is not intended to replace ministry systems. It normalizes access, policy, identity, and audit behavior so existing systems can interoperate through a common hub.

## Security Model

- Role-based access control
- Separate public and internal surfaces
- Simulated SSO token validation
- Audit trail for sensitive operations
- NIRA-owned biometric workflow
- Company portal limited to restricted verification outputs

## Current Deployment Model

The prototype runs locally for showcase purposes and can be built successfully from source.

Production deployment would require real identity, real integrations, and formal hosting/security controls beyond the demo implementation.
