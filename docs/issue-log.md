# BankFix Week 2 Issue Log

No external mentor feedback has been recorded in the repository yet. The following are implementation issues identified during the Week 2 hardening work; update this log with any actual mentor or peer feedback received.

| # | Issue identified | Risk / impact | Resolution in Week 2 | Status |
|---|---|---|---|---|
| 1 | Maintenance write endpoints were unauthenticated | Any caller could create, modify, or delete a request | Added JWT Bearer authentication to maintenance-request routes | Implemented; verified locally |
| 2 | A client could supply `reported_by` | A caller could impersonate another reporter | Reporter and owner fields now come from the verified token; client fields are rejected by strict validation | Implemented; verified locally |
| 3 | No record ownership was stored | The API could not reliably determine who created a request | Added `users` table and nullable `created_by_user_id` relationship with an index | Implemented; migration applied and verified locally |
| 4 | Users were not separated by ownership | One requester could potentially edit/delete another request | Requesters are scoped to their own requests; admins can manage all requests; unauthorized writes return 403 | Implemented; verified locally |
| 5 | Error payloads used inconsistent shapes | Clients could not reliably interpret errors | Standardized errors to `error.code` and `error.message`, with optional validation details | Implemented; verified locally |
| 6 | Migration script only ran one hard-coded SQL file | Future schema additions were easy to miss | Migration runner now executes numbered SQL files in order | Implemented; verified locally |
| 7 | Related work-assignment data had no retrieval endpoint | API users could not inspect a request's related assignments | Added `GET /api/maintenance-requests/:id/assignments` with parent ownership checks | Implemented; verified locally |
| 8 | Malformed JSON and oversized bodies lacked clear API errors | Invalid payloads could return unclear errors | Added structured `400 INVALID_JSON` and `413 BODY_TOO_LARGE` responses | Implemented; verified locally |
