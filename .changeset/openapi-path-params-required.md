---
"@foadonis/openapi": patch
---

Mark auto-discovered path parameters as `required` in the generated OpenAPI document. Path parameters are always required per the OpenAPI Specification, and omitting the flag produced a technically-invalid document that strict generators such as `openapi-python-client` reject — silently skipping every operation that has a path parameter.
