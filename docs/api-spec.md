# BankFix API Specification — Week 1

Base URL: `http://localhost:3000`

## Health
`GET /health`
- Purpose: process health check.
- Success: `200 { "status": "ok", "service": "bankfix-api" }`

## List requests
`GET /api/maintenance-requests?limit=20&offset=0`
- Purpose: list requests with simple pagination.
- Success: `200 { "data": [], "pagination": { "limit": 20, "offset": 0, "count": 0 } }`
- `limit` is clamped to 1–100; `offset` is non-negative.

## Read one request
`GET /api/maintenance-requests/:id`
- `200` with `{ "data": request }`
- `400` for invalid ID
- `404` when the request does not exist

## Create
`POST /api/maintenance-requests`
- Required JSON fields: `facility_id` (positive integer), `title` (3–160 chars), `reported_by` (2–120 chars)
- Optional: `asset_id` (positive integer or null), `description` (max 2000 chars), `priority` (`low`, `medium`, `high`, `urgent`), `status` (`open`, `in_progress`, `resolved`, `cancelled`)
- Success: `201 { "data": request }`
- Invalid body: `400`
- Missing facility/invalid asset relationship: `400`

Example:
```json
{
  "facility_id": 1,
  "asset_id": 1,
  "title": "Demo air conditioner inspection",
  "description": "Fictional data for local testing.",
  "priority": "medium",
  "reported_by": "Demo Operations User"
}
```

## Update
`PATCH /api/maintenance-requests/:id`
- Purpose: update one or more allowed fields.
- Success: `200 { "data": request }`
- Empty/invalid body: `400`
- Missing request: `404`

## Delete
`DELETE /api/maintenance-requests/:id`
- Success: `200 { "data": deletedRequest, "message": "Maintenance request deleted" }`
- Missing request: `404`

## Common response conventions
- `201`: resource created
- `200`: successful read/update/delete
- `400`: invalid request or invalid referenced relationship
- `404`: resource/route not found
- `500`: unexpected server error

## Week 1 security boundary
No authentication or authorization is implemented yet. Run locally with fictional data only. Add authentication and access control in Week 2 before considering broader exposure.
