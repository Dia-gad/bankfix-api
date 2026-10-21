# BankFix Week 2 Manual Test Checklist

Run these checks after `npm install`, updating `.env`, and `npm run db:migrate`. Use fictional data only. Do not publish tokens or passwords.

| Check | Request / action | Expected result |
|---|---|---|
| Health | `GET /health` | `200` and `{ "status": "ok" }` |
| Register | `POST /api/auth/register` with a new email and password of at least 8 characters | `201`; response contains `data.user` and `data.token`, but no `password_hash` |
| Duplicate account | Register the same email again | `409 EMAIL_ALREADY_REGISTERED` |
| Login | `POST /api/auth/login` with correct credentials | `200` and a token |
| Bad login | Login with an incorrect password | `401 INVALID_CREDENTIALS` |
| Current user | `GET /api/auth/me` with `Authorization: Bearer <token>` | `200` with public profile only |
| Missing token | Call `GET /api/maintenance-requests` or POST without Authorization | `401 UNAUTHORIZED` |
| Create | Create with token and valid fictional `facility_id`, `title`, etc. | `201`; `created_by_user_id` and `reported_by` match the authenticated user |
| Spoof reporter | Include `reported_by` in the create body | `400 VALIDATION_ERROR` (strict schema rejects unknown field) |
| Owner scope | Log in as requester B and list requests created by requester A | A's records are not listed to B |
| Forbidden update | As requester B, PATCH request A created | `403 FORBIDDEN` |
| Forbidden delete | As requester B, DELETE request A created | `403 FORBIDDEN`; record remains |
| Owner update/delete | As requester A, PATCH and then DELETE A's disposable test request | `200` for each operation |
| Related data | GET `/api/maintenance-requests/:ownId/assignments` | `200` with `data` array (possibly empty) |
| Invalid input | Create a request with a one-character title | `400 VALIDATION_ERROR` |
| Invalid reference | Create with a nonexistent facility or invalid asset/facility pair | `400 INVALID_REFERENCE` |
| Missing resource | GET/PATCH a nonexistent request ID with a valid token | `404 MAINTENANCE_REQUEST_NOT_FOUND` |
| Invalid token | Use a tampered or expired token | `401 INVALID_TOKEN` |
| Invalid JSON | Send a malformed JSON body | `400 INVALID_JSON` |
| Error format | Inspect all error responses | Every error has `error.code` and `error.message`; no stack trace |

## Admin check

Create two demo requesters first. Promote one trusted demo user directly in the local database, then log in again to obtain a token carrying the admin role:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin-demo@example.test';
```

Using the freshly issued admin token, verify that the admin can see all maintenance requests and can update a request created by the other requester. Do not promote a public user in a deployed environment without a controlled administrative process.
