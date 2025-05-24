import { IgnitorFactory } from '@adonisjs/core/factories'

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
