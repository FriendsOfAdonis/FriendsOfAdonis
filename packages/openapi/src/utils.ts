/**
 * Converts Adonis-style path parameters to OpenAPI-compliant format
 * 
 * Handles:
 * - Regular parameters: /users/:id → /users/{id}
 * - Optional parameters: /users/:id? → /users{id}
 * - Wildcard parameters: /users/* → /users/{wildcard} (only at end)
 * - Mixed patterns: /users/:id/posts/:postId? → /users/{id}/posts/{postId}
 * 
 * Based on AdonisJS routing documentation:
 * - Route patterns don't contain search params
 * - Wildcard parameters (*) can only appear at the end of the path
 * - Optional parameters use ? suffix
 * - Trailing slashes are not part of route patterns
 * 
 * Examples:
 * - /users/:id → /users/{id}
 * - /posts/:postId/comments/:commentId → /posts/{postId}/comments/{commentId}
 * - /api/v1/users/:userId? → /api/v1/users/{userId}
 * - /files/* → /files/{wildcard}
 * - /users/:id/posts/:postId? → /users/{id}/posts/{postId}
 */
export function toOpenAPIPath(path: string): string {
  return path
    // Handle optional parameters (remove ? after parameter)
    .replace(/:([a-zA-Z0-9_]+)\?/g, '{$1}')
    // Handle wildcard parameters (only at end of path)
    .replace(/\*$/, '{wildcard}')
    // Handle regular parameters
    .replace(/:([a-zA-Z0-9_]+)/g, '{$1}')
}

export function isConstructor(fn: Function) {
  try {
    Reflect.construct(String, [], fn)
  } catch (e) {
    return false
  }
  return true
}

const THUNK_EXTRACT_RE = /.+=>(.+)/
export function extractNameFromThunk(thunk: Function): string | undefined {
  const res = THUNK_EXTRACT_RE.exec(thunk.toString())
  if (!res || res.length < 2) return
  return res[1]
}
