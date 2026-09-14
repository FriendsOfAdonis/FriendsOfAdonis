import { IgnitorFactory } from '@adonisjs/core/factories'
import { type ApplicationService } from '@adonisjs/core/types'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import type { GraphQLApiClientOptions } from '../src/plugins/api_client/types.js'

export const BASE_URL = new URL('./tmp/', import.meta.url)

/**
 * Holds the application booted by the currently running test so that
 * plugins registered once in `bin/test.ts` can reach it lazily.
 */
export const appRef: { current?: ApplicationService } = {}

/**
 * Options of the `graphqlApiClient` plugin registered in `bin/test.ts`.
 * Tests mutate this object to exercise the plugin options and must
 * restore it afterwards.
 */
export const pluginOptions: GraphQLApiClientOptions = {}

/**
 * Proxy forwarding every property access to the application booted
 * by the current test. Japa plugins receive the application at
 * registration time, long before any test boots one.
 */
export const lazyApp = new Proxy({} as ApplicationService, {
  get(_, key) {
    if (!appRef.current) {
      throw new Error('No application has been booted by the current test')
    }

    const value = Reflect.get(appRef.current, key)
    return typeof value === 'function' ? value.bind(appRef.current) : value
  },
})

export function setupApolloClient() {
  const apollo = new ApolloClient({
    link: new HttpLink({
      uri: 'http://localhost:3333/graphql',
      headers: {
        Accept: 'text/event-stream',
      },
    }),
    cache: new InMemoryCache(),
  })

  return { apollo }
}

/**
 * Options of the application booted by `setupApp`.
 */
export interface SetupAppOptions {
  /**
   * Environment of the application. In "web" the ignitor boots the
   * HTTP server process and the provider starts the GraphQL server.
   * In "test" the application boots like an AdonisJS test runner and
   * the HTTP server is started through the test utils.
   */
  environment?: 'web' | 'test'
}

export async function setupApp(
  ignitorFn?: (factory: IgnitorFactory) => IgnitorFactory,
  appFn?: (app: ApplicationService) => void,
  options: SetupAppOptions = {}
) {
  const factory = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .merge({
      rcFileContents: {
        providers: [
          {
            file: () => import('../providers/graphql_provider.js'),
            environment: ['web', 'test'],
          },
        ],
      },
    })

  ignitorFn?.(factory)

  const ignitor = factory.create(BASE_URL, {
    importer: (filePath) => {
      if (filePath.startsWith('./') || filePath.startsWith('../')) {
        return import(new URL(filePath, BASE_URL).href)
      }

      return import(filePath)
    },
  })

  ignitor.tap((app) => {
    appFn?.(app)

    app.booted(async () => {
      const router = await app.container.make('router')
      router.use([() => import('@adonisjs/core/bodyparser_middleware')])
    })
  })

  if (options.environment === 'test') {
    await ignitor.testRunner().run(async (app) => {
      const testUtils = await app.container.make('testUtils')
      const closeServer = await testUtils.httpServer().start()
      app.terminating(closeServer)
    })
  } else {
    await ignitor.httpServer().start()
  }

  const app = ignitor.getApp()!
  appRef.current = app

  return { app, ignitor }
}
