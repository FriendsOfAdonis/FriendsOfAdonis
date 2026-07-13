---
"@foadonis/graphql": minor
---

`@Authorized` now accepts Bouncer policies (`@Authorized(RecipePolicy, 'edit')`) and passes the parent object to abilities and policy methods when protecting fields. Authorization is fully delegated to Bouncer, so `allowGuest` abilities and policy methods are now evaluated for unauthenticated users.
