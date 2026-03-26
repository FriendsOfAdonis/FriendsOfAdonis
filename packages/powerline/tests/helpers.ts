import { IgnitorFactory } from '@adonisjs/core/factories'
import { type ApplicationService } from '@adonisjs/core/types'
import { type PowerlineMessages, type MessageEvent } from '../src/types.ts'

export const BASE_URL = new URL('./tmp/', import.meta.url)

export async function setupApp(
  ignitorFn?: (factory: IgnitorFactory) => IgnitorFactory,
  appFn?: (app: ApplicationService) => void
) {
  const factory = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .merge({
      rcFileContents: {
        providers: [() => import('../providers/powerline_provider.ts')],
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

export async function connectSocket(url = 'ws://localhost:3338') {
  const socket = new WebSocket(url)

  await new Promise<void>((res, rej) => {
    socket.addEventListener('open', () => res())
    socket.addEventListener('error', () => rej())
  })

  return socket
}

export function nextSocketMessage<Message extends MessageEvent<PowerlineMessages>>(
  socket: WebSocket
): Promise<Message> {
  return new Promise((res) => {
    socket.addEventListener(
      'message',
      (event) => {
        res(JSON.parse(event.data))
      },
      { once: true }
    )
  })
}
