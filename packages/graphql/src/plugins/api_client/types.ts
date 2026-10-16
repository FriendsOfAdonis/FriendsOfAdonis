import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { DocumentNode, GraphQLFormattedError } from 'graphql'
import type { MultipartValue } from '@japa/api-client/types'

/**
 * HTTP methods accepted for sending a GraphQL operation.
 */
export type GraphQLHttpMethod = 'GET' | 'POST'

/**
 * A GraphQL document accepted by the client. Typed documents carry the
 * result and variables types, plain strings and `DocumentNode`s do not.
 */
export type GraphQLDocument<TData = any, TVariables = Record<string, unknown>> =
  | string
  | DocumentNode
  | TypedDocumentNode<TData, TVariables>

/**
 * Shape of a GraphQL over HTTP response body.
 */
export interface GraphQLResponseBody<TData = any> {
  /**
   * Result of the operation. Absent when the request failed
   * before execution, for example on a validation error.
   */
  data?: TData | null

  /**
   * Errors raised while validating or executing the operation.
   */
  errors?: GraphQLFormattedError[]

  /**
   * Additional information added by the server.
   */
  extensions?: Record<string, unknown>
}

/**
 * Extracts the `data` type from a response body type, falling back
 * to `any` for untyped responses.
 */
export type GraphQLData<TResponse> =
  TResponse extends GraphQLResponseBody<infer TData> ? TData : any

/**
 * Options accepted by the `graphqlApiClient` plugin.
 */
export interface GraphQLApiClientOptions {
  /**
   * Path of the GraphQL endpoint. Defaults to the pattern
   * of the route named `graphql`.
   */
  path?: string
}

/**
 * Per-operation options accepted by `client.query`.
 */
export interface GraphQLQueryOptions {
  /**
   * HTTP method used to send the query. Defaults to `POST`.
   */
  method?: GraphQLHttpMethod
}

/**
 * State attached to an `ApiRequest` created by `client.query`
 * or `client.mutate`. The HTTP body is assembled from it right
 * before the request is sent.
 */
export interface GraphQLOperation {
  /**
   * Printed GraphQL document.
   */
  query: string

  /**
   * Variables of the operation.
   */
  variables?: Record<string, unknown>

  /**
   * Operation to execute when the document defines several.
   */
  operationName?: string

  /**
   * HTTP method used to send the operation.
   */
  method: GraphQLHttpMethod

  /**
   * Files attached to variables, keyed by the variable path.
   */
  uploads: Map<string, GraphQLUpload>
}

/**
 * Options describing an uploaded file.
 */
export interface GraphQLUploadOptions {
  /**
   * Filename sent to the server. Defaults to the name of a `File`
   * or to the last segment of the variable path.
   */
  filename?: string

  /**
   * Content type sent to the server. Defaults to the type of a
   * `Blob` when set.
   */
  contentType?: string
}

/**
 * A file attached to a variable. `Blob` and `File` values are
 * converted to buffers right before the request is sent.
 */
export interface GraphQLUpload {
  /**
   * The file content or its location.
   */
  file: MultipartValue | Blob

  /**
   * Filename and content type overrides.
   */
  options?: GraphQLUploadOptions
}

/**
 * Variables argument of `client.query` and `client.mutate`, required
 * as soon as the document declares a required variable.
 */
export type GraphQLVariablesArgs<TVariables> =
  Record<string, never> extends TVariables ? [variables?: TVariables] : [variables: TVariables]

declare module '@japa/api-client' {
  interface ApiClient {
    /**
     * Sends a GraphQL query to the application.
     *
     * @example
     * const response = await client.query(`query { posts { id } }`)
     * response.assertNoErrors()
     */
    query<TData = any, TVariables = Record<string, unknown>>(
      document: GraphQLDocument<TData, TVariables>,
      ...args: [...GraphQLVariablesArgs<TVariables>, options?: GraphQLQueryOptions]
    ): ApiRequest<any, GraphQLResponseBody<TData>>

    /**
     * Sends a GraphQL mutation to the application.
     *
     * @example
     * const response = await client.mutate(
     *   `mutation ($title: String!) { createPost(title: $title) { id } }`,
     *   { title: 'Hello' }
     * )
     */
    mutate<TData = any, TVariables = Record<string, unknown>>(
      document: GraphQLDocument<TData, TVariables>,
      ...args: GraphQLVariablesArgs<TVariables>
    ): ApiRequest<any, GraphQLResponseBody<TData>>
  }

  interface ApiRequest<TBody = any, TResponse = any, TQuery = any> {
    /**
     * GraphQL operation carried by the request, when created
     * through `client.query` or `client.mutate`. Used internally
     * to assemble the HTTP payload right before sending.
     */
    graphqlOperation?: GraphQLOperation

    /**
     * Selects the operation to execute in a document
     * defining several operations.
     */
    operationName(name: string): this

    /**
     * Attaches a file to a variable following the GraphQL
     * multipart request specification. Nested variables use
     * a dotted path, for example `input.avatar`.
     *
     * Accepts a file path, a `Buffer`, a `ReadStream`, a `Blob`
     * or a `File`. The filename and content type of a `File`
     * are forwarded unless overridden by the options.
     *
     * Only the Yoga driver supports file uploads.
     */
    upload(variable: string, file: MultipartValue | Blob, options?: GraphQLUploadOptions): this
  }

  interface ApiResponse<TResponse = any> {
    /**
     * The `data` member of the GraphQL response body.
     */
    data: GraphQLData<TResponse>

    /**
     * The `errors` member of the GraphQL response body.
     * Empty when the operation succeeded.
     */
    errors: GraphQLFormattedError[]

    /**
     * The `extensions` member of the GraphQL response body.
     */
    extensions: Record<string, unknown>

    /**
     * Asserts the response is a well-formed GraphQL response,
     * meaning a JSON body with a `data` or `errors` member,
     * and that it carries no errors.
     */
    assertNoErrors(): void

    /**
     * Asserts the `data` member deeply equals the expected value.
     */
    assertData(expected: any): void

    /**
     * Asserts the `data` member contains the expected subset.
     */
    assertDataContains(expected: any): void

    /**
     * Asserts the response has errors. When a count is given,
     * asserts the exact number of errors.
     */
    assertErrors(count?: number): void

    /**
     * Asserts at least one error carries the given `extensions.code`.
     */
    assertErrorCode(code: string): void

    /**
     * Asserts at least one error message equals the given string
     * or matches the given regular expression.
     */
    assertErrorMessage(message: string | RegExp): void

    /**
     * Prints the formatted list of errors.
     */
    dumpErrors(): this
  }
}
