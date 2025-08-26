/**
 * Converts Adonis-style path to OpenAPI-compliant format
 *
 * @param path - Adonis-style path (eg. /users/:id)
 *
 * @returns OpenAPI-compliant path (eg. /users/{id})
 */
export function toOpenAPIPath(path: string): string {
  return (
    path
      // Handle optional parameters (remove ? after parameter)
      .replace(/:([a-zA-Z0-9_]+)\?/g, '{$1}')
      // Handle wildcard parameters (only at end of path)
      .replace(/\*$/, '{wildcard}')
      // Handle regular parameters
      .replace(/:([a-zA-Z0-9_]+)/g, '{$1}')
  )
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
