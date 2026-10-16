# Manual Smoke Test Plan

Run the API locally and use `requests/bankfix.http`, Postman, or curl.

1. `GET /health` → 200.
2. `GET /api/maintenance-requests` → 200.
3. `GET /api/maintenance-requests/1` → 200 after seeding.
4. `GET /api/maintenance-requests/999999` → 404 if that ID does not exist.
5. Create a request with valid fictional fields → 201.
6. Create with a title of `"x"` → 400.
7. Create with `facility_id: 999999` → 400.
8. Update an existing request status → 200.
9. Update a missing ID → 404.
10. Delete a disposable test request → 200.
11. Check logs and ensure no secrets or real data are printed.

Do not mark these checks as passed until you run them in your environment.
