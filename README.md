# BankFix API

A backend API for recording, assigning, and tracking maintenance requests across fictional multi-branch facilities. Built for the BuildLab Backend Development track using Node.js, Express, PostgreSQL, and Zod.

## Week 2 capabilities

- Account registration and login (`POST /api/auth/register`, `POST /api/auth/login`) using bcrypt password hashing and JWT access tokens.
- Protected maintenance-request endpoints using `Authorization: Bearer <token>`.
- Requester ownership isolation for list/read/update/delete; `admin` users can manage all requests.
- The reporter and owner of each new request come from the authenticated account, not user-supplied fields.
- Related work-assignment retrieval at `GET /api/maintenance-requests/:id/assignments`.
- Consistent structured errors, input validation, safer handling of database constraint errors, malformed JSON, and oversized bodies.

## Requirements

- Node.js 20+
- PostgreSQL 15+
- Git

## Setup (Git Bash on Windows)

1. Copy `.env.example` to `.env` and fill in your local PostgreSQL values.
2. Set `JWT_SECRET` in `.env` to a unique random value of at least 32 characters. In Git Bash you can generate one with `openssl rand -hex 32`. Never use the example placeholder for a deployed service.
3. Create a PostgreSQL database, for example `bankfix_dev`.
4. Install packages: `npm install`
5. Run migrations: `npm run db:migrate`
6. Seed fictional demo data: `npm run db:seed`
7. Start the API: `npm run dev`
8. Test health: `curl http://localhost:3000/health`

The migration script runs numbered `.sql` files under `db/migrations` in order. Migrations are designed to be safe to rerun for this project.

## Authentication flow

1. Register through `POST /api/auth/register` with `name`, `email`, and `password` (at least 8 characters).
2. Copy the returned JWT into the `Authorization: Bearer <token>` header.
3. Use it for `/api/auth/me` and all `/api/maintenance-requests` routes.
4. Login through `POST /api/auth/login` when the token expires. The default expiry is one hour.

Public self-registration always creates a `requester`. To test the admin role locally, promote a trusted fictional test account using SQL, then log in again to obtain a fresh token:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin-demo@example.test';
```

## API references

- `docs/api-spec.md` — endpoints, status codes, authentication, and examples.
- `requests/bankfix.http` — REST Client examples.
- `docs/issue-log.md` — Week 2 issue log.
- `docs/week-2-test-checklist.md` — manual verification matrix.
- `docs/week-2-update.md` — weekly update note.
- `docs/erd.md` — data model.

## Main routes

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | Health check |
| POST | `/api/auth/register` | Public | Register requester |
| POST | `/api/auth/login` | Public | Login and issue JWT |
| GET | `/api/auth/me` | Bearer token | View current account |
| GET | `/api/maintenance-requests` | Bearer token | List own requests; admins see all |
| POST | `/api/maintenance-requests` | Bearer token | Create request |
| GET | `/api/maintenance-requests/:id` | Owner/admin token | Read request |
| PATCH | `/api/maintenance-requests/:id` | Owner/admin token | Update request |
| DELETE | `/api/maintenance-requests/:id` | Owner/admin token | Delete request |
| GET | `/api/maintenance-requests/:id/assignments` | Owner/admin token | Fetch related assignments |

## Data and security boundaries

- Use fictional data only. Do not use real bank names, branch information, employees, customers, passwords, or internal infrastructure details.
- `.env` is local and must not be committed. Only `.env.example` belongs in Git.
- Password hashes are never returned to clients. JWT secrets must not be logged or committed.
- Errors use `{ "error": { "code": "...", "message": "..." } }`; server stack traces are not sent to clients.
- Authentication and authorization provide a learning-project baseline, not a claim of production security readiness. Email verification, password reset, refresh-token rotation, audit logs, and deployment security review remain future work.

## Milestones

- Week 1: data model, PostgreSQL schema/seed, main maintenance-request CRUD, and manual CRUD verification.
- Week 2: authentication/authorization, ownership, related data, consistent error handling, and manual verification.
- Week 3: automated test suite, further security/performance hardening, and deployment or clean setup documentation.
