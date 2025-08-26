---
'@foadonis/openapi': minor
---

Remove content negotiation in favor of file extensions for documentation format.

When registering OpenAPI routes you will now have 3 registered routes:

- /api - returns the OpenAPI documentation UI
- /api.json - returns the OpenAPI documentation in JSON format
- /api.yaml - returns the OpenAPI documentation in YAML format

The routes are named `openapi.html`, `openapi.json` and `openapi.yaml`.
