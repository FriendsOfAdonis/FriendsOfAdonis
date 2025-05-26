import { test } from '@japa/runner'
import { convertRoutePatternToOpenApiPath } from '../src/utils.js'

test.group('Utils - convertRoutePatternToOpenApiPath', () => {
  test('should convert single parameter', ({ assert }) => {
    const result = convertRoutePatternToOpenApiPath('/users/:id')
    assert.equal(result, '/users/{id}')
  })

  test('should convert multiple parameters', ({ assert }) => {
    const result = convertRoutePatternToOpenApiPath('/users/:userId/subscriptions/:subscriptionId')
    assert.equal(result, '/users/{userId}/subscriptions/{subscriptionId}')
  })

  test('should convert parameter with underscores', ({ assert }) => {
    const result = convertRoutePatternToOpenApiPath('/api/:user_id/posts/:post_id')
    assert.equal(result, '/api/{user_id}/posts/{post_id}')
  })

  test('should convert parameter with numbers', ({ assert }) => {
    const result = convertRoutePatternToOpenApiPath('/api/v1/:id1/items/:id2')
    assert.equal(result, '/api/v1/{id1}/items/{id2}')
  })

  test('should handle paths without parameters', ({ assert }) => {
    const result = convertRoutePatternToOpenApiPath('/api/users')
    assert.equal(result, '/api/users')
  })

  test('should handle paths with wildcard parameters unchanged', ({ assert }) => {
    const result = convertRoutePatternToOpenApiPath('/api/users/*')
    assert.equal(result, '/api/users/*')
  })

  test('should handle complex paths with mixed parameters', ({ assert }) => {
    const result = convertRoutePatternToOpenApiPath(
      '/api/v2/:orgId/projects/:projectId/files/:fileId'
    )
    assert.equal(result, '/api/v2/{orgId}/projects/{projectId}/files/{fileId}')
  })

  test('should handle root parameter', ({ assert }) => {
    const result = convertRoutePatternToOpenApiPath('/:id')
    assert.equal(result, '/{id}')
  })

  test('should handle parameters at the end', ({ assert }) => {
    const result = convertRoutePatternToOpenApiPath('/users/:id')
    assert.equal(result, '/users/{id}')
  })

  test('should handle parameters in the middle', ({ assert }) => {
    const result = convertRoutePatternToOpenApiPath('/users/:id/profile')
    assert.equal(result, '/users/{id}/profile')
  })
})
