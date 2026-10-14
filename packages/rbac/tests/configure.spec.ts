import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import Configure from '@adonisjs/core/commands/configure'
import { test } from '@japa/runner'
import { createApplication } from './helpers.ts'

test.group('Configure', () => {
  test('publishes the definition, middleware and migrations', async ({ fs, assert }) => {
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

    await assert.fileContains('start/permissions.ts', [
      `import { definePermissions } from '@foadonis/rbac'`,
      'export const permissions = definePermissions({',
      `create: 'Create new products',`,
    ])

    await assert.fileContains('app/middleware/authorize_middleware.ts', [
      `import type { ActivePermission } from '@foadonis/rbac/types'`,
      `import type { permissions } from '#start/permissions'`,
      'export default class AuthorizeMiddleware {',
      'required: ActivePermission<typeof permissions> | ActivePermission<typeof permissions>[]',
      'await ctx.bouncer.authorize(key)',
    ])

    await assert.fileContains('start/kernel.ts', [
      'export const middleware = router.named({',
      `authorize: () => import('#middleware/authorize_middleware')`,
    ])

    const migrations = (await readdir(join(fs.basePath, 'database/migrations'))).sort()
    assert.lengthOf(migrations, 2)
    assert.match(migrations[0], /^\d+_create_roles_table\.ts$/)
    assert.match(migrations[1], /^\d+_create_user_roles_table\.ts$/)

    const [rolesTimestamp] = migrations[0].split('_')
    const [pivotTimestamp] = migrations[1].split('_')
    assert.isBelow(Number(rolesTimestamp), Number(pivotTimestamp))

    await assert.fileContains(`database/migrations/${migrations[0]}`, [
      `protected tableName = 'roles'`,
      `table.string('name').notNullable().unique()`,
      `table.json('permissions').notNullable()`,
    ])

    await assert.fileContains(`database/migrations/${migrations[1]}`, [
      `protected tableName = 'user_roles'`,
      `.inTable('users')`,
      `.inTable('roles')`,
      `.onDelete('CASCADE')`,
      `table.unique(['user_id', 'role_id'])`,
    ])
  }).timeout(30000)
})
