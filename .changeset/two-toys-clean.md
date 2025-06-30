---
'@foadonis/shopkeeper': minor
---

Change route registration to be manual

Previously Shopkeeper would attempt to automatically register the webhook route
for Stripe, as part of this, it would also attempt to use the bodyparser
middleware directly. This caused errors in projects which were already using the
bodyparser middleware.

This change requires updating your `start/routes.ts` file to include:

```
import shopkeeper from '@foadonis/shopkeeper/services/shopkeeper'

shopkeeper.registerRoutes()
```

As well as ensuring that you are using the
[`bodyparser`](https://docs.adonisjs.com/guides/basics/body-parser) from
Adonis.js in your application.