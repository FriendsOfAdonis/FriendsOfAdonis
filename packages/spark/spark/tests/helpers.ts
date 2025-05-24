import { IgnitorFactory } from '@adonisjs/core/factories'
import { ApplicationService, HttpRouterService } from '@adonisjs/core/types'
import { getActiveTest } from '@japa/runner'
import Stream from 'node:stream'

process.env.NODE_ENV = 'test'

export const BASE_URL = new URL('./tmp/', import.meta.url)

export function setupIgnitor(
  baseUrl: URL = BASE_URL,
  params: Partial<Parameters<IgnitorFactory['merge']>[0]> = {}
) {
  const ignitor = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .merge(params)
    .create(baseUrl, {
      importer: (filePath) => {
        if (filePath.startsWith('./') || filePath.startsWith('../')) {
          return import(new URL(filePath, BASE_URL).href)
        }

        return import(filePath)
      },
    })

  return ignitor
}

export async function setupApp() {
  const ignitor = setupIgnitor()

  const app = ignitor.createApp('web')
  await app.init().then(() => app.boot())

  const ace = await app.container.make('ace')
  ace.ui.switchMode('raw')

  return { ace, app }
}

export async function setupSparkApp() {
  const ignitor = setupIgnitor(new URL(import.meta.url), {
    rcFileContents: {
      providers: [
        () => import('@adonisjs/vite/vite_provider'),
        () => import('@foadonis/spark/provider'),
      ],
    },
    config: {
      spark: {
        layout: () => import('./fixtures/layouts/root_layout.js'),
      },
      vite: {
        assetsUrl: '/assets',
      },
    },
  })

  const app = ignitor.createApp('web')
  await app.init().then(() => app.boot())

  const spark = await app.container.make('spark')

  return { app, spark }
}

export async function setupHttpServer(routerFn: (router: HttpRouterService) => void) {
  const ignitor = setupIgnitor(new URL(import.meta.url), {
    rcFileContents: {
      providers: [
        () => import('@adonisjs/vite/vite_provider'),
        () => import('@foadonis/spark/provider'),
      ],
    },
    config: {
      spark: {
        layout: () => import('./fixtures/layouts/root_layout.js'),
      },
      vite: {
        assetsUrl: '/assets',
      },
    },
  })

  let app: ApplicationService | undefined

  await ignitor
    .tap(async (a) => {
      app = a
      a.listen('SIGTERM', () => a.terminate())

      a.booted(async () => {
        a.config.set('spark', {
          layout: () => import('./fixtures/layouts/root_layout.js'),
        })

        const server = await a.container.make('server')
        server.use([
          () => import('@foadonis/spark/middleware'),
          () => import('@adonisjs/vite/vite_middleware'),
        ])

        const router = await a.container.make('router')

        router.use([() => import('@adonisjs/core/bodyparser_middleware')])

        routerFn(router)
      })
    })
    .httpServer()
    .start()

  getActiveTest()?.cleanup(async () => {
    await app?.terminate()
  })

  if (!app) throw new Error('App not initialized')

  return app as ApplicationService
}

export async function awaitStream(readable: Stream.Readable) {
  return new Promise<string>((res, rej) => {
    let result = ''
    readable.on('data', (chunk: Buffer) => {
      result += chunk.toString('utf8')
    })

    readable.on('end', () => res(result))
    readable.on('error', (err) => rej(err))
  })
}
