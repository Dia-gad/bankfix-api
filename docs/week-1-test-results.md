# BankFix API — Week 1 Test Results

## Test environment
- API: Node.js and Express
- Database: PostgreSQL
- Testing tool: Postman
- Data: Fictional maintenance records
- Base URL: http://localhost:3000

## Results

| Test | Expected result | Observed result |
|---|---|---|
| Health check | 200 OK | Successful |
| List maintenance requests | 200 OK | Successful |
| Create a valid request | 201 Created | Request created |
| Retrieve an existing request | 200 OK | Passed |
| Update an existing request | 200 OK | Passed |
| Delete the disposable test request | 200 OK | Passed |
| Retrieve the deleted request | 404 Not Found | Passed |
| Create request with a one-character title | 400 Bad Request | Validation error returned |
| Create request with a nonexistent facility | 400 Bad Request | Relationship error returned |
| Update a nonexistent request | 404 Not Found | Resource-not-found error returned |

## Notes
- A disposable test request was used for the delete test.
- Original demo records were not intentionally deleted.
- The API was tested locally using fictional data.
- Authentication and authorization remain planned for Week 2.
