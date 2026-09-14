---
'@foadonis/graphql': patch
---

The Redis PubSub clients are now closed when the application terminates in every environment, not only the web server. An ace command, a seeder or a queue worker that published an event no longer keeps the process alive, and shutdown waits for the publishes still in flight to reach Redis instead of dropping them.
