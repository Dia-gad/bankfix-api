# BankFix API

A secure, auditable maintenance-request API for fictional multi-branch facilities. This is a BuildLab Stage 1, Week 1 starter project.

## Scope
Week 1 delivers maintenance-request CRUD with validation, PostgreSQL persistence, fictional seed data, and documented HTTP examples. Authentication and authorization are deliberately deferred to Week 2.

## Requirements
- Node.js 20+
- PostgreSQL 15+
- Git

## Setup (Git Bash on Windows)

1. Copy `.env.example` to `.env` and update the local database values.
2. Create a PostgreSQL database, for example `bankfix_dev`.
3. Install packages:
   ```bash
   npm install
   ```
4. Run the schema migration:
   ```bash
   npm run db:migrate
   ```
5. Seed fictional demo data:
   ```bash
   npm run db:seed
   ```
6. Start the API:
   ```bash
   npm run dev
   ```
7. Test health:
   ```bash
   curl http://localhost:3000/health
   ```

## Environment
Never commit `.env`, passwords, tokens, real bank/customer data, or sensitive infrastructure details. `.env.example` contains placeholders only.

## Week 1 endpoints
- `GET /health`
- `GET /api/maintenance-requests`
- `GET /api/maintenance-requests/:id`
- `POST /api/maintenance-requests`
- `PATCH /api/maintenance-requests/:id`
- `DELETE /api/maintenance-requests/:id`

All data must be fictional. Authentication is not implemented in Week 1.

## Repository and milestone
Create a public GitHub repository after reviewing that no secrets are present. Tag the verified Week 1 milestone `week-1` only after smoke tests pass.

## Known limitation
This package is generated starter code and has not been run against your local PostgreSQL installation yet. Follow the steps in `docs/smoke-test.md` and fix any environment-specific issues before claiming the API is tested.
