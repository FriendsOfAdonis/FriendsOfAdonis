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

/**
 * Converts AdonisJS route patterns to OpenAPI path format
 * Transforms :param to {param}
 *
 * @param routePattern - The AdonisJS route pattern (e.g., '/users/:id')
 * @returns The OpenAPI path format (e.g., '/users/{id}')
 */
export function convertRoutePatternToOpenApiPath(routePattern: string): string {
  return routePattern.replaceAll(/:([^/]+)/g, '{$1}')
}
