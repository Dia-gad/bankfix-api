# Week 2 Update — BankFix API — Backend Development

**Focus:** Authentication, authorization, relationships, validation, and safe error handling.

## Delivered
- Registration and login with bcrypt password hashing and JWT access tokens.
- Protected maintenance-request endpoints.
- Request ownership checks and administrator access.
- Ownership and reporter details derived from the authenticated account.
- Related work-assignment retrieval endpoint.
- Consistent structured errors and handling for malformed JSON, invalid input, duplicate emails, and missing resources.
- Updated API specification, request examples, issue log, and test evidence.

## Key decisions
- Maintenance routes require a Bearer token.
- New requests are associated with the authenticated user.
- Public registration creates requester accounts; it cannot assign the admin role.
- Administrators can manage all maintenance requests.
- JWT secrets remain in the local .env file and must never be committed.

## Feedback response
No external mentor feedback was available when this update was prepared. The issue log records implementation issues found and addressed. Add actual mentor or peer feedback when received.

## Verification status
Local manual checks passed for authentication, ownership, administrator access, related assignments, validation, and error handling. See `docs/week-2-test-results.md` and `docs/week-2-test-checklist.md`.

Automated integration tests and broader security/performance checks remain planned for Week 3.

## AI and sources used
AI assistance was used to help plan and draft implementation changes, documentation, and test commands. The implementation was run and manually checked locally.
