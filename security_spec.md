# Security Test Specification

## Clinical Reports sub-collection
Path: `/users/{uid}/clinicalReports/{reportId}`

### Expected Access Control
- Read: Allowed only if authenticated user is the owner of the document (`uid === auth.uid`).
- Write/Update: Allowed only if authenticated user is the owner of the document (`uid === auth.uid`), and fields match:
  - `reportName` is string of max length 200.
  - `hospitalName` is string of max length 200.
  - `reportDate` is string.
  - `reportType` is string.
- Delete: Allowed only if authenticated user is the owner of the document (`uid === auth.uid`).

### Tests
1. Unauthenticated users cannot read or write to `/users/{any_uid}/clinicalReports/{any_id}`.
2. User `A` can read/write to `/users/A/clinicalReports/{any_id}`.
3. User `A` cannot read/write to `/users/B/clinicalReports/{any_id}`.
