import { ApiResponse } from '@japa/api-client'
import type { GraphQLFormattedError } from 'graphql'
import type { GraphQLResponseBody } from './types.js'

/**
 * Formats the errors of a response into a readable list
 * used in assertion messages and dumps.
 */
export function formatErrors(errors: GraphQLFormattedError[]): string {
  if (errors.length === 0) return 'No errors'

  return errors
    .map((error) => {
      const code = error.extensions?.code
      const path = error.path?.join('.')
      const details = [code ? `code: ${code}` : null, path ? `path: ${path}` : null]
        .filter(Boolean)
        .join(', ')

      return details ? `- ${error.message} (${details})` : `- ${error.message}`
    })
    .join('\n')
}

/**
 * Returns the parsed body of the response when it is an object,
 * `undefined` otherwise.
 */
function parsedBody(response: ApiResponse): GraphQLResponseBody | undefined {
  const body = response.body()
  if (body && typeof body === 'object' && !Buffer.isBuffer(body)) {
    return body as GraphQLResponseBody
  }
}

/**
 * Retrieves the assert instance of a response, failing with an
 * actionable message when the assert plugin is missing.
 */
function assertOrFail(response: ApiResponse) {
  if (!response.assert) {
    throw new Error(
      'GraphQL assertions are not available. Make sure to install the @japa/assert plugin'
    )
  }

  return response.assert
}

/**
 * Registers the GraphQL getters and assertions on the `ApiResponse` class.
 */
export function extendApiResponse() {
  ApiResponse.getter('data', function (this: ApiResponse) {
    return parsedBody(this)?.data
  })

  ApiResponse.getter('errors', function (this: ApiResponse) {
    return parsedBody(this)?.errors ?? []
  })

  ApiResponse.getter('extensions', function (this: ApiResponse) {
    return parsedBody(this)?.extensions ?? {}
  })

  ApiResponse.macro('assertNoErrors', function (this: ApiResponse) {
    const assert = assertOrFail(this)
    const body = parsedBody(this)

    assert.isTrue(
      body !== undefined && ('data' in body || 'errors' in body),
      `Expected a GraphQL response, received status ${this.status()} with body: ${this.text() || '<empty>'}`
    )
    assert.isEmpty(
      this.errors,
      `Expected no GraphQL errors, received:\n${formatErrors(this.errors)}`
    )
  })

  ApiResponse.macro('assertData', function (this: ApiResponse, expected: any) {
    assertOrFail(this).deepEqual(this.data, expected)
  })

  ApiResponse.macro('assertDataContains', function (this: ApiResponse, expected: any) {
    assertOrFail(this).containsSubset(this.data, expected)
  })

  ApiResponse.macro('assertErrors', function (this: ApiResponse, count?: number) {
    const assert = assertOrFail(this)

    if (count === undefined) {
      assert.isNotEmpty(this.errors, 'Expected GraphQL errors, received none')
      return
    }

    assert.lengthOf(
      this.errors,
      count,
      `Expected ${count} GraphQL error(s), received ${this.errors.length}:\n${formatErrors(this.errors)}`
    )
  })

  ApiResponse.macro('assertErrorCode', function (this: ApiResponse, code: string) {
    const codes = this.errors.map((error) => error.extensions?.code)
    assertOrFail(this).include(
      codes,
      code,
      `Expected a GraphQL error with code "${code}", received:\n${formatErrors(this.errors)}`
    )
  })

  ApiResponse.macro('assertErrorMessage', function (this: ApiResponse, message: string | RegExp) {
    const matches = this.errors.some((error) =>
      typeof message === 'string' ? error.message === message : message.test(error.message)
    )

    assertOrFail(this).isTrue(
      matches,
      `Expected a GraphQL error matching ${String(message)}, received:\n${formatErrors(this.errors)}`
    )
  })

  ApiResponse.macro('dumpErrors', function (this: ApiResponse) {
    console.log(`GraphQL errors:\n${formatErrors(this.errors)}`)
    return this
  })
}
