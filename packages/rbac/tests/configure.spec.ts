import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import Configure from '@adonisjs/core/commands/configure'
import { test } from '@japa/runner'
import { createApplication } from './helpers.ts'

test.group('Configure', () => {
  test('publishes the definition, middleware and users migration', async ({ fs, assert }) => {
    await fs.create('.env', '')
    await fs.createJson('tsconfig.json', {})
    await fs.createJson('package.json', {})
    await fs.create('start/env.ts', `export default Env.create(new URL('./'), {})`)
    await fs.create('adonisrc.ts', `export default defineConfig({})`)
    await fs.create(
      'start/kernel.ts',
      [
        `import router from '@adonisjs/core/services/router'`,
        `import server from '@adonisjs/core/services/server'`,
        ``,
        `server.use([])`,
        `router.use([])`,
        `export const middleware = router.named({})`,
      ].join('\n')
    )

    const { ace } = await createApplication()

    const command = await ace.create(Configure, ['../../index.js'])
    await command.exec()
    command.assertSucceeded()

    await assert.fileContains('start/rbac.ts', [
      `import { definePermissions, defineRoles } from '@foadonis/rbac'`,
      'export const permissions = definePermissions({',
      'export const roles = defineRoles(permissions, {',
    ])

    await assert.fileContains('app/middleware/authorize_middleware.ts', [
      `import type { ActivePermission } from '@foadonis/rbac/types'`,
      `import type { permissions } from '#start/rbac'`,
      'export default class AuthorizeMiddleware {',
      'required: ActivePermission<typeof permissions> | ActivePermission<typeof permissions>[]',
      'await ctx.bouncer.authorize(key)',
    ])

    await assert.fileContains('start/kernel.ts', [
      'export const middleware = router.named({',
      `authorize: () => import('#middleware/authorize_middleware')`,
    ])

    const migrations = await readdir(join(fs.basePath, 'database/migrations'))
    assert.lengthOf(migrations, 1)
    assert.match(migrations[0], /^\d+_add_rbac_columns_to_users_table\.ts$/)

    await assert.fileContains(`database/migrations/${migrations[0]}`, [
      `protected tableName = 'users'`,
      'this.schema.alterTable(this.tableName, (table) => {',
      `table.json('roles').nullable()`,
      `table.json('permissions').nullable()`,
      `table.dropColumns('roles', 'permissions')`,
    ])
  }).timeout(30000)
})
