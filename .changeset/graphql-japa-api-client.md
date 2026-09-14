---
"@foadonis/graphql": minor
---

Test your GraphQL API with the new Japa plugin exported from `@foadonis/graphql/plugins/api_client`. It adds `client.query` and `client.mutate` to the API client, along with GraphQL assertions on the response.

```ts
test('lists posts', async ({ client }) => {
  const response = await client.query(`query { posts { id title } }`).loginAs(user)

  response.assertNoErrors()
  response.assertData({ posts: [{ id: '1', title: 'Hello' }] })
})
```
