import { type HttpRequest, type HttpResponse } from '@adonisjs/core/http'
import { HeaderMap, type HTTPGraphQLRequest, type HTTPGraphQLResponse } from '@apollo/server'

export function adonisToGraphqlRequest(request: HttpRequest): HTTPGraphQLRequest {
  const body = request.body()
  const headers = new HeaderMap()

  for (const [key, value] of Object.entries(request.headers())) {
    if (value !== undefined) {
      headers.set(key, Array.isArray(value) ? value.join(', ') : value)
    }
  }

  return {
    method: request.method().toUpperCase(),
    headers,
    search: request.parsedUrl.query,
    body,
  }
}

export function graphqlToAdonisResponse(
  response: HttpResponse,
  httpGraphqlResponse: HTTPGraphQLResponse
): void {
  for (const [key, value] of httpGraphqlResponse.headers) {
    response.header(key, value)
  }

  response.status(httpGraphqlResponse.status || 200)

  if (httpGraphqlResponse.body.kind === 'complete') {
    return response.send(httpGraphqlResponse.body.string)
  }

  throw new Error('Buffering not yet supported')
}
