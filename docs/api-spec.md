# BankFix API Specification — Week 2

Base URL: `http://localhost:3000`

## Authentication

### Register
`POST /api/auth/register`
- Body: `{ "name": "Demo Requester", "email": "requester@example.test", "password": "LocalDemoPassword123!" }`
- Success: `201` with a public user object and JWT access token.
- Invalid body: `400 VALIDATION_ERROR`.
- Duplicate email: `409 EMAIL_ALREADY_REGISTERED`.
- Passwords are hashed with bcrypt before storage. Public responses never include password hashes.
- Self-registration creates `requester` users only. Promote a trusted local demo account to `admin` with a direct database update; never accept a role from the public request body.

### Login
`POST /api/auth/login`
- Body: `{ "email": "requester@example.test", "password": "LocalDemoPassword123!" }`
- Success: `200` with user and JWT.
- Invalid credentials: `401 INVALID_CREDENTIALS` (generic message, without disclosing which field failed).

### Current user
`GET /api/auth/me`
- Requires `Authorization: Bearer <token>`.
- Success: `200` with the authenticated user's public profile.

## Maintenance requests (all routes require a valid Bearer token)

- `GET /api/maintenance-requests?limit=20&offset=0` — list the user's own requests; admin users see all requests. `200`.
- `GET /api/maintenance-requests/:id` — retrieve one request owned by the user or any request for an admin. `200`, `400 INVALID_ID`, `403 FORBIDDEN`, or `404 MAINTENANCE_REQUEST_NOT_FOUND`.
- `POST /api/maintenance-requests` — create a request. Body fields: `facility_id` (positive integer), optional `asset_id` (positive integer or null), `title` (3–160 chars), optional `description` (max 2,000 chars), optional `priority` (`low`, `medium`, `high`, `urgent`), and optional `status` (`open`, `in_progress`, `resolved`, `cancelled`). `reported_by` and owner ID are set from the authenticated user, not accepted from the client. Success: `201`; invalid body/reference: `400`.
- `PATCH /api/maintenance-requests/:id` — update allowed request fields only if the user owns the request or is an admin. `200`, `400`, `403`, or `404`.
- `DELETE /api/maintenance-requests/:id` — delete only if the user owns the request or is an admin. `200`, `403`, or `404`.
- `GET /api/maintenance-requests/:id/assignments` — retrieve work assignments related to an accessible maintenance request. `200` with an empty list when no assignments are recorded; `403` or `404` when inaccessible or missing.

## Consistent errors

All errors use `{ "error": { "code": "...", "message": "..." } }`; validation errors may also include `details`. Status conventions include `400` bad input, `401` missing/invalid authentication, `403` authenticated but not permitted, `404` missing resource/route, `409` duplicate/conflict, `413` oversized body, and `500` unexpected server failure. Stack traces are never returned to clients.

## Database relationships and legacy demo rows

`users` has many `maintenance_requests` through nullable `created_by_user_id`; `maintenance_requests` has many `work_assignments`. Existing seeded Week 1 requests have no owner and are visible/manageable only to an admin. New records receive the authenticated creator's ID. The asset-to-facility composite foreign key remains enforced.

## Security notes

- Set a unique `JWT_SECRET` of at least 32 characters in `.env`; never commit `.env`.
- Access tokens expire according to `JWT_EXPIRES_IN` (default `1h`).
- Passwords are hashed with bcrypt (12 rounds).
- No real bank, employee, customer, or branch data should be used.
