---
"@foadonis/graphql": patch
---

The Yoga driver now serves the `path` configured in `config/graphql.ts`. Previously, any path not ending with `/graphql` answered a 404 unless `graphqlEndpoint` was also passed to the driver.
