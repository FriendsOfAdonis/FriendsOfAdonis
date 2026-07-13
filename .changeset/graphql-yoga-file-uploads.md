---
"@foadonis/graphql": patch
---

The Yoga driver now streams multipart requests to GraphQL Yoga, enabling file uploads through the GraphQL multipart request specification. Previously `request.raw()` returned `null` for multipart bodies (which the bodyparser never buffers), so uploads always failed. Add your GraphQL endpoint to the bodyparser `processManually` list to use file uploads.
