---
"@foadonis/openapi": patch
---

Deduplicate auto-discovered path parameters so they no longer accumulate across `buildDocument()` calls. A path parameter already registered — by a previous router scan or a user-provided `@ApiParam` — is now skipped instead of being appended again.
