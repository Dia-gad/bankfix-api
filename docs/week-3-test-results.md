# BankFix API — Week 3 Testing and Security Results

## Summary

Week 3 adds automated testing with Jest and Supertest and reviews
authentication, input validation, authorization, and dependencies.

## Automated test results

Command: `npm test`

Result: 17 tests passed across 4 test suites.

### Application behaviour — 3 tests
- Health endpoint returns the expected response.
- X-Powered-By header is not exposed.
- Unknown routes return 404.

### Authentication — 3 tests
- Requests without a token are rejected.
- Invalid Bearer tokens are rejected.
- Incorrect authorization schemes are rejected.

### Request validation — 5 tests
- Short titles are rejected.
- Invalid priorities are rejected.
- Client-supplied reporter information is rejected.
- Malformed request IDs are rejected.
- Empty updates are rejected.

### Authorization — 6 tests
- Requesters cannot view another user's request.
- Requesters cannot update another user's request.
- Requesters cannot delete another user's request.
- Requesters cannot view another user's assignments.
- Requesters can update their own request.
- Administrators can view another user's request.

The authorization tests mock the maintenance service. They verify
controller behaviour but do not replace integration tests against
a dedicated test database.

## Database ownership review

The maintenance-request repository filters requester list queries
using `created_by_user_id`. Administrators can list all requests.

The controller checks record ownership before allowing access to
individual requests, updates, deletions, and assignments.

## Dependency security review

- Compatible dependency updates were applied using `npm audit fix`.
- Zod was upgraded to version 4.6.7.
- All 17 automated tests passed after the Zod upgrade.
- The latest audit reported 5 low-severity findings associated with
  the Jest/deepmerge dependency tree.
- The suggested forced fix was not applied because npm proposed
  downgrading Jest to version 25.1.0.
- No high- or moderate-severity findings remained in the latest
  reported audit.

## Commands used

- `npm test`
- `npm audit`
- `npm ls zod --depth=0`

## Conclusion

The current automated test suite passes. Authentication, input
validation, controller authorization, and repository ownership
filtering have been reviewed. Database integration tests remain a
future improvement. The remaining low-severity dependency findings
should be tracked rather than resolved through a breaking downgrade.
