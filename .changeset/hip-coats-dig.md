---
'@foadonis/actions': minor
---

Add `skipSegments` option to `indexActions` to control which path segments are excluded when generating action identifiers.

The default value is now `['actions']`, meaning `app/identity/actions/login.ts` resolves to `Identity.Login` instead of `Identity.Actions.Login`.
