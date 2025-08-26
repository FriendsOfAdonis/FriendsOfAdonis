import { test } from '@japa/runner'
import { toOpenAPIPath } from '../src/utils.js'

test.group('Utils - toOpenAPIPath', () => {
  test('should convert simple path parameter', ({ assert }) => {
    assert.equal(toOpenAPIPath('/users/:id'), '/users/{id}')
  })

  test('should convert multiple path parameters', ({ assert }) => {
    assert.equal(
      toOpenAPIPath('/posts/:postId/comments/:commentId'),
      '/posts/{postId}/comments/{commentId}'
    )
  })

  test('should convert path parameters with underscores', ({ assert }) => {
    assert.equal(toOpenAPIPath('/api/users/:user_id'), '/api/users/{user_id}')
  })

  test('should convert path parameters with numbers', ({ assert }) => {
    assert.equal(toOpenAPIPath('/api/v1/users/:user123'), '/api/v1/users/{user123}')
  })

  test('should handle paths with no parameters', ({ assert }) => {
    assert.equal(toOpenAPIPath('/users'), '/users')
    assert.equal(toOpenAPIPath('/api/health'), '/api/health')
    assert.equal(toOpenAPIPath('/'), '/')
  })

  test('should handle paths with mixed content', ({ assert }) => {
    assert.equal(
      toOpenAPIPath('/api/v1/users/:userId/posts/:postId/comments'),
      '/api/v1/users/{userId}/posts/{postId}/comments'
    )
  })

  test('should handle complex nested paths with multiple parameters', ({ assert }) => {
    assert.equal(
      toOpenAPIPath('/api/v1/organizations/:orgId/projects/:projectId/tasks/:taskId'),
      '/api/v1/organizations/{orgId}/projects/{projectId}/tasks/{taskId}'
    )
  })

  test('should handle paths with multiple consecutive parameters', ({ assert }) => {
    assert.equal(toOpenAPIPath('/:type/:id/:action'), '/{type}/{id}/{action}')
  })

  test('should handle paths with parameters at the beginning', ({ assert }) => {
    assert.equal(toOpenAPIPath('/:locale/users'), '/{locale}/users')
  })

  test('should handle paths with parameters at the end', ({ assert }) => {
    assert.equal(toOpenAPIPath('/users/:id'), '/users/{id}')
  })

  test('should handle edge cases with special characters', ({ assert }) => {
    // Should only match valid parameter names (alphanumeric + underscore)
    assert.equal(toOpenAPIPath('/users/:id-123'), '/users/{id}-123')
    assert.equal(toOpenAPIPath('/users/:id.123'), '/users/{id}.123')
    assert.equal(toOpenAPIPath('/users/:id/123'), '/users/{id}/123')
  })

  test('should handle empty string', ({ assert }) => {
    assert.equal(toOpenAPIPath(''), '')
  })

  test('should handle paths with only parameters', ({ assert }) => {
    assert.equal(toOpenAPIPath('/:id'), '/{id}')
    assert.equal(toOpenAPIPath('/:id/:name'), '/{id}/{name}')
  })

  test('should handle paths with multiple slashes', ({ assert }) => {
    assert.equal(toOpenAPIPath('/api//v1//users/:id'), '/api//v1//users/{id}')
  })

  test('should handle paths with mixed case parameters', ({ assert }) => {
    assert.equal(toOpenAPIPath('/users/:userId/posts/:PostId'), '/users/{userId}/posts/{PostId}')
  })

  // Tests for optional parameters
  test('should handle optional parameters', ({ assert }) => {
    assert.equal(toOpenAPIPath('/users/:id?'), '/users/{id}')
    assert.equal(toOpenAPIPath('/posts/:postId?/comments'), '/posts/{postId}/comments')
    assert.equal(toOpenAPIPath('/api/:version?/users/:id'), '/api/{version}/users/{id}')
  })

  test('should handle multiple optional parameters', ({ assert }) => {
    assert.equal(toOpenAPIPath('/users/:id?/posts/:postId?'), '/users/{id}/posts/{postId}')
    assert.equal(toOpenAPIPath('/:locale?/users/:id?/posts'), '/{locale}/users/{id}/posts')
  })

  test('should handle optional parameters in complex paths', ({ assert }) => {
    assert.equal(
      toOpenAPIPath('/api/:version?/organizations/:orgId?/projects/:projectId'),
      '/api/{version}/organizations/{orgId}/projects/{projectId}'
    )
  })

  // Tests for wildcard parameters (only at end)
  test('should handle wildcard parameters at end', ({ assert }) => {
    assert.equal(toOpenAPIPath('/files/*'), '/files/{wildcard}')
    assert.equal(toOpenAPIPath('/static/*'), '/static/{wildcard}')
    assert.equal(toOpenAPIPath('/*'), '/{wildcard}')
  })

  test('should handle wildcard parameters with other parameters', ({ assert }) => {
    assert.equal(toOpenAPIPath('/users/:id/*'), '/users/{id}/{wildcard}')
    assert.equal(toOpenAPIPath('/api/:version/*'), '/api/{version}/{wildcard}')
    assert.equal(toOpenAPIPath('/:locale/*'), '/{locale}/{wildcard}')
  })

  // Tests for mixed parameter types
  test('should handle mixed parameter types', ({ assert }) => {
    assert.equal(
      toOpenAPIPath('/api/:version?/users/:id/*'),
      '/api/{version}/users/{id}/{wildcard}'
    )
    assert.equal(toOpenAPIPath('/:locale?/posts/:postId?/*'), '/{locale}/posts/{postId}/{wildcard}')
  })

  test('should handle complex mixed patterns', ({ assert }) => {
    assert.equal(
      toOpenAPIPath('/api/:version?/organizations/:orgId?/projects/:projectId/*'),
      '/api/{version}/organizations/{orgId}/projects/{projectId}/{wildcard}'
    )
  })

  // Edge cases for new parameter types
  test('should handle edge cases for optional parameters', ({ assert }) => {
    // Optional parameter at end of path
    assert.equal(toOpenAPIPath('/users/:id?'), '/users/{id}')

    // Optional parameter before another segment
    assert.equal(toOpenAPIPath('/users/:id?/posts'), '/users/{id}/posts')
  })

  test('should handle edge cases for wildcard parameters', ({ assert }) => {
    // Wildcard at end of path
    assert.equal(toOpenAPIPath('/files/*'), '/files/{wildcard}')
  })

  test('should handle empty segments with new parameter types', ({ assert }) => {
    assert.equal(toOpenAPIPath('/:id?/:name?'), '/{id}/{name}')
    assert.equal(toOpenAPIPath('/:id/*'), '/{id}/{wildcard}')
  })
})
