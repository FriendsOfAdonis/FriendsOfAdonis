import { FileSystem } from '@japa/file-system'
import { test } from '@japa/runner'
import { setupApp } from './helpers.js'
import Configure from '@adonisjs/core/commands/configure'

async function setupFakeAdonisProject(fs: FileSystem) {
  await Promise.all([
    fs.create('.env', ''),
    fs.createJson('tsconfig.json', {}),
    fs.create('adonisrc.ts', `export default defineConfig({})`),
    fs.create('vite.config.ts', `export default { plugins: [] }`),
    fs.create(
      'start/kernel.ts',
      `
      import router from '@adonisjs/core/services/router'
      import server from '@adonisjs/core/services/server'

      router.use([
        () => import('@adonisjs/core/bodyparser_middleware'),
      ])

      server.use([])
    `
    ),
  ])
}

test.group('configure', (group) => {
  group.tap((t) => t.timeout(20_000))
  group.each.setup(async ({ context }) => setupFakeAdonisProject(context.fs))

  test('should properly configure powercord', async ({ assert }) => {
    const { ace } = await setupApp()

    const command = await ace.create(Configure, ['../../index.js'])
    await command.exec()

    command.assertSucceeded()

    await assert.fileContains('config/powercord.ts', '@foadonis/powercord')

    await assert.fileContains('adonisrc.ts', '@foadonis/powercord/powercord_provider')
  })
})
