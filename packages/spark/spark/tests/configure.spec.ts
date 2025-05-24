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

  test('should properly configure spark', async ({ assert }) => {
    const { ace } = await setupApp()

    const command = await ace.create(Configure, ['../../index.js'])
    await command.exec()

    command.assertSucceeded()

    await assert.fileContains('config/spark.ts', '@foadonis/spark')

    await assert.fileContains('app/controllers/welcome_controller.tsx', 'index')

    await assert.fileContains('app/spark/layouts/root_layout.tsx', '{children}')

    await assert.fileContains('adonisrc.ts', '@foadonis/spark/provider')
    await assert.fileContains('adonisrc.ts', '@foadonis/spark/commands')

    await assert.fileContains('package.json', '#spark/*')

    await assert.fileContains('tsconfig.json', 'react-jsx')
    await assert.fileContains('tsconfig.json', '@foadonis/spark')
  })
})
