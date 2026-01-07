import { IgnitorFactory } from '@adonisjs/core/factories'
import { type ApplicationService } from '@adonisjs/core/types'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

export const BASE_URL = new URL('./tmp/', import.meta.url)

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

export async function setupApp(
  ignitorFn?: (factory: IgnitorFactory) => IgnitorFactory,
  appFn?: (app: ApplicationService) => void
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

  await ignitor
    .tap((app) => {
      appFn?.(app)

      app.booted(async () => {
        const router = await app.container.make('router')
        router.use([() => import('@adonisjs/core/bodyparser_middleware')])
      })
    })
    .httpServer()
    .start()

  const app = ignitor.getApp()!

  return { app, ignitor }
}
