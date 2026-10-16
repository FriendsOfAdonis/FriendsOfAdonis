import { ApiRequest } from '@japa/api-client'
import { print, type DocumentNode } from 'graphql'
import { RuntimeException } from '@adonisjs/core/exceptions'
import type {
  GraphQLDocument,
  GraphQLHttpMethod,
  GraphQLOperation,
  GraphQLUpload,
  GraphQLUploadOptions,
} from './types.js'

/**
 * Converts a document to its string form.
 */
export function printDocument(document: GraphQLDocument): string {
  return typeof document === 'string' ? document : print(document as DocumentNode)
}

/**
 * Creates the operation state attached to a request.
 */
export function createOperation(
  document: GraphQLDocument,
  variables: Record<string, unknown> | undefined,
  method: GraphQLHttpMethod
): GraphQLOperation {
  return {
    query: printDocument(document),
    variables,
    method,
    uploads: new Map(),
  }
}

/**
 * Sets a value at a dotted path inside the variables object, creating
 * intermediate objects as needed. A numeric segment creates a list,
 * so `files.0` produces `{ files: [value] }`.
 */
function setVariable(variables: Record<string, any>, path: string, value: unknown) {
  const segments = path.split('.')
  let target = variables

  segments.slice(0, -1).forEach((segment, index) => {
    target[segment] ??= /^\d+$/.test(segments[index + 1]) ? [] : {}
    target = target[segment]
  })

  target[segments.at(-1)!] = value
}

/**
 * Converts an upload to a value accepted by superagent along with its
 * filename and content type. A filename is always provided, otherwise
 * the server parses the part as a plain field instead of a file.
 */
async function toMultipartValue(variable: string, upload: GraphQLUpload) {
  const { file, options } = upload
  const fallbackName = variable.split('.').at(-1)!

  if (file instanceof Blob) {
    const name = file instanceof File ? file.name : fallbackName

    return {
      value: Buffer.from(await file.arrayBuffer()),
      options: {
        filename: options?.filename ?? name,
        contentType: options?.contentType ?? (file.type || undefined),
      },
    }
  }

  return {
    value: file,
    options: { ...options, filename: options?.filename ?? fallbackName },
  }
}

/**
 * Fails when the operation combines uploads with the GET method,
 * as multipart bodies can only be sent with POST.
 */
export function ensureUploadsMethod(operation: GraphQLOperation) {
  if (operation.uploads.size > 0 && operation.method === 'GET') {
    throw new RuntimeException('File uploads cannot be sent over GET. Use the POST method instead')
  }
}

/**
 * Assembles the HTTP payload of a request from its GraphQL
 * operation. Called right before the request is sent so that
 * chained calls can still mutate the operation.
 */
export async function prepareRequest(request: ApiRequest) {
  const operation = request.graphqlOperation
  if (!operation) return

  const payload = {
    query: operation.query,
    variables: operation.variables,
    operationName: operation.operationName,
  }

  if (operation.uploads.size > 0) {
    const variables = structuredClone(operation.variables ?? {})
    const map: Record<string, string[]> = {}
    const files: { value: any; options: GraphQLUploadOptions }[] = []

    for (const [variable, upload] of operation.uploads) {
      setVariable(variables, variable, null)
      map[String(files.length)] = [`variables.${variable}`]
      files.push(await toMultipartValue(variable, upload))
    }

    request.field('operations', JSON.stringify({ ...payload, variables }))
    request.field('map', JSON.stringify(map))
    files.forEach(({ value, options }, index) => request.file(String(index), value, options))

    return
  }

  if (operation.method === 'GET') {
    request.header('apollo-require-preflight', 'true')
    request.qs({
      query: payload.query,
      ...(payload.variables ? { variables: JSON.stringify(payload.variables) } : {}),
      ...(payload.operationName ? { operationName: payload.operationName } : {}),
    })
    return
  }

  request.json(payload)
}

/**
 * Retrieves the operation of a request, failing when the request
 * was not created through `client.query` or `client.mutate`.
 */
function operationOrFail(request: ApiRequest): GraphQLOperation {
  if (!request.graphqlOperation) {
    throw new RuntimeException(
      'GraphQL request helpers are only available on requests created with "client.query" or "client.mutate"'
    )
  }

  return request.graphqlOperation
}

/**
 * Registers the GraphQL macros on the `ApiRequest` class.
 */
export function extendApiRequest() {
  ApiRequest.macro('operationName', function (this: ApiRequest, name: string) {
    operationOrFail(this).operationName = name
    return this
  })

  ApiRequest.macro(
    'upload',
    function (this: ApiRequest, variable: string, file, options?: GraphQLUploadOptions) {
      operationOrFail(this).uploads.set(variable, { file, options })
      return this
    }
  )
}
