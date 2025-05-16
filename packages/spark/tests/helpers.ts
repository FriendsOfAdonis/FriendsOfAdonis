import { IgnitorFactory } from '@adonisjs/core/factories'
import Stream from 'node:stream'

export const BASE_URL = new URL('./tmp/', import.meta.url)

export async function setupApp() {
  const ignitor = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .create(BASE_URL, {
      importer: (filePath) => {
        if (filePath.startsWith('./') || filePath.startsWith('../')) {
          return import(new URL(filePath, BASE_URL).href)
        }

        return import(filePath)
      },
    })

  const app = ignitor.createApp('web')
  await app.init().then(() => app.boot())

  const ace = await app.container.make('ace')
  ace.ui.switchMode('raw')

  return { ace, app }
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
