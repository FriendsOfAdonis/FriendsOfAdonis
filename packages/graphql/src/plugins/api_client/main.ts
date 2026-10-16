import { ApiClient, type ApiRequest } from '@japa/api-client'
import type { PluginFn } from '@japa/runner/types'
import type { ApplicationService } from '@adonisjs/core/types'
import { RuntimeException } from '@adonisjs/core/exceptions'
import {
  createOperation,
  ensureUploadsMethod,
  extendApiRequest,
  prepareRequest,
} from './request.js'
import { extendApiResponse } from './response.js'
import type {
  GraphQLApiClientOptions,
  GraphQLDocument,
  GraphQLHttpMethod,
  GraphQLQueryOptions,
} from './types.js'
import type { GraphQLDriverContract, GraphQlService } from '../../types.js'

export type * from './types.js'

/**
 * Endpoint used to construct requests before the real endpoint is
 * resolved. The API client fixes the URL at construction time while
 * the route is only known once the application is ready, so the URL
 * is replaced right before sending.
 */
const PLACEHOLDER_ENDPOINT = '/graphql'

/**
 * Resolves the path of the GraphQL endpoint from the route
 * named `graphql`.
 */
async function resolveEndpoint(app: ApplicationService): Promise<string> {
  const router = await app.container.make('router')

  try {
    return router.makeUrl('graphql')
  } catch {
    throw new RuntimeException(
      'Cannot find the "graphql" route. Register it with "graphql.registerRoute(router)" or configure the "path" option of the graphqlApiClient plugin'
    )
  }
}

/**
 * Checks whether the driver is the Apollo driver. The driver module
 * is imported lazily because it depends on the optional
 * `@apollo/server` package.
 */
async function isApolloDriver(driver: GraphQLDriverContract): Promise<boolean> {
  try {
    const { ApolloDriver } = await import('../../drivers/apollo_driver.js')
    return driver instanceof ApolloDriver
  } catch {
    return false
  }
}

/**
 * Hooks the GraphQL server with the Japa API client plugin.
 * Adds `client.query` and `client.mutate` along with GraphQL
 * assertions on the response.
 *
 * @param app - AdonisJS application service
 * @param options - Plugin options
 *
 * @example
 * // tests/bootstrap.ts
 * import { graphqlApiClient } from '@foadonis/graphql/plugins/api_client'
 *
 * export const plugins = [assert(), apiClient(), graphqlApiClient(app)]
 *
 * // In a test
 * test('lists posts', async ({ client }) => {
 *   const response = await client.query(`query { posts { id title } }`)
 *   response.assertNoErrors()
 *   response.assertData({ posts: [{ id: '1', title: 'Hello' }] })
 * })
 */
export function graphqlApiClient(
  app: ApplicationService,
  options: GraphQLApiClientOptions = {}
): PluginFn {
  return function ({ config }) {
    /**
     * Servers started by the plugin, so they are stopped once and
     * servers started by the provider are left untouched.
     */
    const started = new Set<GraphQlService>()

    /**
     * Pending starts, so concurrent first requests share one start.
     */
    const starting = new WeakMap<GraphQlService, Promise<void>>()

    /**
     * Stops a server when the plugin started it.
     */
    async function stopServer(graphql: GraphQlService) {
      if (!started.delete(graphql)) return
      await graphql.stop()
    }

    /**
     * The provider only starts the server in the "web" environment,
     * so the plugin starts it on the first GraphQL request.
     */
    async function ensureServerStarted() {
      const graphql = await app.container.make('graphql')
      if (graphql.driver.isReady) return graphql

      let pending = starting.get(graphql)
      if (!pending) {
        pending = graphql.start().then(() => {
          started.add(graphql)
          app.terminating(() => stopServer(graphql))
        })
        starting.set(graphql, pending)
      }

      await pending
      return graphql
    }

    /**
     * Fails early when uploading files over GET or to a driver
     * that cannot parse multipart requests.
     */
    async function ensureUploadsSupported(request: ApiRequest, driver: GraphQLDriverContract) {
      const operation = request.graphqlOperation!
      if (operation.uploads.size === 0) return

      ensureUploadsMethod(operation)

      if (await isApolloDriver(driver)) {
        throw new RuntimeException(
          'File uploads are not supported by the Apollo driver. Use the Yoga driver to test file uploads'
        )
      }
    }

    /**
     * The endpoint is only known once the application has
     * registered its routes, so it is applied right before sending.
     */
    async function applyEndpoint(request: ApiRequest) {
      const path = options.path ?? (await resolveEndpoint(app))
      const baseUrl = request.config.baseUrl
      const isUrl = path.startsWith('http://') || path.startsWith('https://')

      request.request.url = baseUrl && !isUrl ? `${baseUrl}/${path.replace(/^\//, '')}` : path
    }

    /**
     * Creates a request carrying a GraphQL operation.
     */
    function createRequest(
      client: ApiClient,
      document: GraphQLDocument,
      variables: unknown,
      method: GraphQLHttpMethod
    ) {
      const request = client.request(PLACEHOLDER_ENDPOINT, method)
      request.graphqlOperation = createOperation(
        document,
        variables as Record<string, unknown> | undefined,
        method
      )
      return request
    }

    ApiClient.macro('query', function (this: ApiClient, document: GraphQLDocument, ...args: any[]) {
      const [variables, queryOptions] = args as [unknown?, GraphQLQueryOptions?]
      return createRequest(this, document, variables, queryOptions?.method ?? 'POST')
    })

    ApiClient.macro(
      'mutate',
      function (this: ApiClient, document: GraphQLDocument, variables?: unknown) {
        return createRequest(this, document, variables, 'POST')
      }
    )

    ApiClient.setup(async (request) => {
      if (!request.graphqlOperation) return

      const graphql = await ensureServerStarted()
      await ensureUploadsSupported(request, graphql.driver)
      await applyEndpoint(request)
      await prepareRequest(request)
    })

    extendApiRequest()
    extendApiResponse()

    config.teardown.push(async () => {
      if (app.isTerminated) return
      await stopServer(await app.container.make('graphql'))
    })
  }
}
