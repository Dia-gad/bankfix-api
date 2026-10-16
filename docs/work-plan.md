# BankFix Week 1 Work Plan

1. Confirm the target user and the single problem statement.
2. Model facilities, assets, maintenance requests and work assignments.
3. Create PostgreSQL migration and fictional seed data.
4. Implement CRUD for maintenance requests.
5. Add request validation, not-found responses and central error handling.
6. Document routes and sample requests.
7. Run manual smoke tests locally.
8. Review `.gitignore` and ensure no secrets or real data are committed.
9. Commit and tag `week-1` only after the checks pass.
10. Prepare a short mentor walkthrough.

## Acceptance checks
- `GET /health` returns 200.
- List endpoint returns 200 and supports limit/offset.
- Existing ID returns 200; missing ID returns 404.
- Valid create returns 201.
- Invalid request returns 400.
- Valid update returns 200.
- Delete existing row returns 200; missing row returns 404.
- Database constraints reject invalid foreign keys and mismatched asset/facility.
- Only fictional demo records are used.
