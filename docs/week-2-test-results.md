# BankFix API — Week 2 Test Results

## Environment
- Node.js, Express, and PostgreSQL
- Local API tested with curl
- Fictional test accounts and maintenance requests only
- JWT values and passwords are intentionally excluded from this report

## Results

| Test | Expected | Result |
|---|---|---|
| Health endpoint | 200 | PASS |
| Maintenance list without token | 401 | PASS |
| Register requester | 201 | PASS |
| Authenticated maintenance list | 200 | PASS |
| Create owned maintenance request | 201 | PASS |
| Update own maintenance request | 200 | PASS |
| Second requester login | Successful | PASS |
| Other requester updates another user's request | 403 | PASS |
| Other requester deletes another user's request | 403 | PASS |
| Related assignments endpoint | 200 | PASS |
| Admin login and access | Successful | PASS |
| Admin views another user's request | Allowed | PASS |
| Admin updates another user's request | 200 | PASS |
| Authenticated profile endpoint | 200 | PASS |
| Duplicate registration | 409 | PASS |
| Incorrect password | 401 | PASS |
| Public attempt to assign admin role | 400 | PASS |
| Client-supplied reporter rejected | 400 | PASS |
| One-character title rejected | 400 | PASS |
| Update nonexistent request | 404 | PASS |
| Malformed JSON | 400 | PASS |

## Notes
- The database migrations completed successfully.
- Ownership checks were verified with two fictional requester accounts.
- The admin test account was promoted locally through PostgreSQL for testing.
- These are manual test results; automated integration tests are planned for Week 3.
- Use fictional data only. Never commit .env, passwords, or JWT tokens.
