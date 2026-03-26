import { IgnitorFactory } from '@adonisjs/core/factories'
import { test } from '@japa/runner'
import { BASE_URL } from './helpers.js'

test.group('Configuration', () => {
  test('should configure powerline', async () => {
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

    const app = ignitor.createApp('console')
    await app.init()
    await app.boot()
  }).timeout(30000)
})
