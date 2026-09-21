import { ApplicationService } from '@adonisjs/core/types'
import { Database } from '@adonisjs/lucid/database'
import { test } from '@japa/runner'
import { setupDatabase } from '../helpers.ts'
import {
  afterDelete,
  afterSave,
  afterUpdate,
  BaseModel,
  beforeDelete,
  beforeFetch,
  beforeSave,
  beforeUpdate,
  column,
} from '@adonisjs/lucid/orm'
import { errors } from '@adonisjs/lucid'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'
import Factory from '@adonisjs/lucid/factories'
import { compose } from '@adonisjs/core/helpers'
import {
  afterRestore,
  beforeRestore,
  E_MODEL_DELETED,
  E_NOT_SOFT_DELETABLE,
  SoftDeletable,
} from '../../modules/soft_delete/main.ts'

async function cleanSchema(db: Database) {
  const connection = db.connection()

  await connection.schema.dropTableIfExists('users')
}

async function setupSchema(db: Database) {
  const connection = db.connection()

  await connection.schema.createTable('users', (table) => {
    table.increments()
    table.string('first_name').notNullable()
    table.string('last_name').notNullable()
    table.timestamp('deleted_at').nullable()
    table.timestamp('updated_at').notNullable()
    table.timestamp('created_at').notNullable()
  })

  return () => cleanSchema(db)
}

class User extends compose(BaseModel, SoftDeletable) {
  @column()
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}

/**
 * User model whose own `beforeFetch` hook includes the trashed rows.
 */
class ArchivedUser extends compose(BaseModel, SoftDeletable) {
  static table = 'users'

  @column()
  declare id: number

  @beforeFetch()
  static includeTrashed(query: ModelQueryBuilderContract<typeof ArchivedUser>) {
    query.withTrashed()
  }
}

/**
 * User model reading the same table without the `SoftDeletable` mixin.
 */
class PlainUser extends BaseModel {
  static table = 'users'

  @column()
  declare id: number

  @column.dateTime()
  declare deletedAt: DateTime | null
}

const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  }
})
  .state('trashed', (row) => {
    row.deletedAt = DateTime.now()
  })
  .build()

/**
 * Hooks run on `HookedUser`, in order, and the state of the row seen by each
 * delete hook.
 */
const hookCalls: string[] = []
const deleteHookStates: {
  hook: string
  isForceDeleting: boolean
  isDeleted: boolean
  isTrashed: boolean
}[] = []

/**
 * Makes the `beforeDelete` hook of `HookedUser` throw during a force delete.
 */
let failForceDelete = false

function trackDeleteHook(hook: string, user: HookedUser) {
  hookCalls.push(hook)
  deleteHookStates.push({
    hook,
    isForceDeleting: user.$isForceDeleting,
    isDeleted: user.$isDeleted,
    isTrashed: user.isTrashed,
  })
}

class HookedUser extends compose(BaseModel, SoftDeletable) {
  static table = 'users'

  @column()
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @beforeSave()
  static trackBeforeSave() {
    hookCalls.push('before:save')
  }

  @afterSave()
  static trackAfterSave() {
    hookCalls.push('after:save')
  }

  @beforeUpdate()
  static trackBeforeUpdate() {
    hookCalls.push('before:update')
  }

  @afterUpdate()
  static trackAfterUpdate() {
    hookCalls.push('after:update')
  }

  @beforeDelete()
  static trackBeforeDelete(user: HookedUser) {
    trackDeleteHook('before:delete', user)
    if (failForceDelete && user.$isForceDeleting) throw new Error('force delete failed')
  }

  @afterDelete()
  static trackAfterDelete(user: HookedUser) {
    trackDeleteHook('after:delete', user)
  }

  @beforeRestore()
  static trackBeforeRestore() {
    hookCalls.push('before:restore')
  }

  @afterRestore()
  static trackAfterRestore() {
    hookCalls.push('after:restore')
  }
}

test.group('SoftDelete', (group) => {
  let db: Database
  let app: ApplicationService

  group.setup(async () => {
    const result = await setupDatabase({
      client: 'sqlite',
      connection: {
        filename: ':memory:',
      },
    })

    app = result.app
    db = result.db

    return setupSchema(db)
  })

  group.teardown(async () => {
    await app.terminate()
  })

  group.each.setup(() => db.connection().truncateAllTables())

  group.each.setup(() => {
    failForceDelete = false
  })

  /**
   * Creates a `HookedUser`, then clears the hooks tracked during its creation.
   */
  async function createHookedUser(attributes: Partial<{ deletedAt: DateTime }> = {}) {
    const user = await HookedUser.create({ firstName: 'Jane', lastName: 'Doe', ...attributes })
    hookCalls.length = 0
    deleteHookStates.length = 0
    return user
  }

  /**
   * Counts the rows physically present in the table, bypassing the model and
   * therefore the soft-delete scope. Useful to assert whether a row was soft
   * deleted (still present) or force deleted (gone).
   */
  async function countRows() {
    const result = await db.from('users').count('* as total')
    return Number(result[0].total)
  }

  /**
   * Reads a row straight from the database, ignoring the soft-delete scope.
   */
  function rawRow(id: number) {
    return db.from('users').where('id', id).first()
  }

  /**
   * ---------------------------------------------------------------------------
   * Reading: the default scope hides trashed rows
   * ---------------------------------------------------------------------------
   */

  test('should return all users when none are trashed', async ({ expect }) => {
    await UserFactory.createMany(10)
    const users = await User.query()
    expect(users).toHaveLength(10)
  })

  test('should return only non trashed users when using query', async ({ expect }) => {
    await UserFactory.createMany(5)
    await UserFactory.apply('trashed').createMany(15)

    const users = await User.query()
    expect(users).toHaveLength(5)
  })

  test('should return only non trashed users when using all', async ({ expect }) => {
    await UserFactory.createMany(5)
    await UserFactory.apply('trashed').createMany(15)

    const users = await User.all()
    expect(users).toHaveLength(5)
  })

  test('should return only non trashed users when using find', async ({ expect }) => {
    const existing = await UserFactory.create()
    const trashed = await UserFactory.apply('trashed').create()

    expect(await User.find(existing.id)).toBeDefined()
    expect(await User.find(trashed.id)).toBeNull()
  })

  test('should ignore trashed users when using first', async ({ expect }) => {
    const existing = await UserFactory.create()
    await UserFactory.apply('trashed').createMany(3)

    const first = await User.first()
    expect(first).not.toBeNull()
    expect(first!.id).toBe(existing.id)
  })

  test('should ignore trashed users when using findBy', async ({ expect }) => {
    const existing = await UserFactory.merge({ firstName: 'Jane' }).create()
    const trashed = await UserFactory.apply('trashed').merge({ firstName: 'John' }).create()

    expect(await User.findBy('firstName', 'Jane')).not.toBeNull()
    expect(await User.findBy('firstName', 'John')).toBeNull()
    expect(existing.id).not.toBe(trashed.id)
  })

  test('should throw when findOrFail targets a trashed user', async ({ expect }) => {
    const trashed = await UserFactory.apply('trashed').create()

    await expect(User.findOrFail(trashed.id)).rejects.toThrow()
  })

  test('should exclude trashed users from aggregates', async ({ expect }) => {
    await UserFactory.createMany(3)
    await UserFactory.apply('trashed').createMany(7)

    const result = await User.query().count('* as total')
    expect(Number(result[0].$extras.total)).toBe(3)
  })

  test('should exclude trashed users from pojo queries', async ({ expect }) => {
    await UserFactory.createMany(3)
    await UserFactory.apply('trashed').createMany(7)

    const users = await User.query().pojo()
    expect(users).toHaveLength(3)
  })

  test('should not leak trashed users through an orWhere clause', async ({ expect }) => {
    await UserFactory.apply('trashed').merge({ firstName: 'Jane' }).create()
    const john = await UserFactory.merge({ firstName: 'John' }).create()

    const users = await User.query().where('firstName', 'Jane').orWhere('firstName', 'John')
    expect(users.map((user) => user.id)).toEqual([john.id])
  })

  test('should include trashed users when a beforeFetch hook uses withTrashed', async ({
    expect,
  }) => {
    await UserFactory.createMany(3)
    await UserFactory.apply('trashed').createMany(7)

    const users = await ArchivedUser.query()
    expect(users).toHaveLength(10)
  })

  test('should not leak trashed users through an orWhere clause in a later group', async ({
    expect,
  }) => {
    await UserFactory.apply('trashed').merge({ firstName: 'Jane' }).create()
    const john = await UserFactory.merge({ firstName: 'John' }).create()

    const users = await User.query()
      .where('firstName', 'Jane')
      .wrapExisting()
      .orWhere('firstName', 'John')
    expect(users.map((user) => user.id)).toEqual([john.id])
  })

  test('should hide trashed users when the table is aliased', async ({ expect }) => {
    await UserFactory.createMany(3)
    await UserFactory.apply('trashed').createMany(7)

    expect(await User.query().from('users as u')).toHaveLength(3)
    expect(await User.query().from({ u: 'users' })).toHaveLength(3)
  })

  test('should keep the where clauses of a query compiled twice', async ({ expect }) => {
    await UserFactory.merge({ firstName: 'Jane' }).create()
    await UserFactory.apply('trashed').merge({ firstName: 'Jane' }).create()
    await UserFactory.merge({ firstName: 'John' }).create()

    const query = User.query().withTrashed().where('firstName', 'Jane').wrapExisting()
    query.toSQL()
    expect(await query).toHaveLength(2)
  })

  test('should keep withTrashed on a cloned query', async ({ expect }) => {
    await UserFactory.createMany(3)
    await UserFactory.apply('trashed').createMany(7)

    const users = await User.query().withTrashed().clone()
    expect(users).toHaveLength(10)
  })

  test('pagination total should include trashed rows when using withTrashed', async ({
    expect,
  }) => {
    await UserFactory.createMany(3)
    await UserFactory.apply('trashed').createMany(7)

    const page = await User.query().withTrashed().paginate(1, 5)
    expect(page.total).toBe(10)
  })

  /**
   * ---------------------------------------------------------------------------
   * Deleting: instance delete is soft, forceDelete is permanent
   * ---------------------------------------------------------------------------
   */

  test('should soft delete a row instead of removing it', async ({ expect }) => {
    const user = await UserFactory.create()

    await user.delete()

    expect(user.isTrashed).toBe(true)
    expect(DateTime.isDateTime(user.deletedAt)).toBe(true)
    expect(user.deletedAt!.isValid).toBe(true)

    // The row must still physically exist after a soft delete.
    expect(await countRows()).toBe(1)

    const row = await rawRow(user.id)

    expect(DateTime.fromSQL(row.deleted_at).isValid).toBe(true)
  })

  test('should not flag the instance as deleted after a soft delete', async ({ expect }) => {
    const user = await UserFactory.create()

    await user.delete()

    expect(user.$isDeleted).toBe(false)
  })

  test('should hide a soft deleted row from subsequent queries', async ({ expect }) => {
    const user = await UserFactory.create()

    await user.delete()

    expect(await User.find(user.id)).toBeNull()
    expect(await User.query()).toHaveLength(0)
  })

  test('should permanently remove a row when using forceDelete', async ({ expect }) => {
    const user = await UserFactory.create()

    await user.forceDelete()

    expect(user.$isDeleted).toBe(true)
    expect(await countRows()).toBe(0)
    expect(await rawRow(user.id)).toBeNull()
  })

  /**
   * ---------------------------------------------------------------------------
   * Restoring
   * ---------------------------------------------------------------------------
   */

  test('should be a no-op when restoring a row that is not trashed', async ({ expect }) => {
    const created = await UserFactory.create()
    // Re-fetch so `deletedAt` is hydrated as `null` (a freshly built instance
    // leaves it `undefined`).
    const user = await User.findOrFail(created.id)

    const result = await user.restore()

    expect(result).toBe(user)
    expect(user.isTrashed).toBe(false)
  })

  test('should throw when restoring a force deleted row', async ({ expect }) => {
    const user = await UserFactory.create()
    await user.forceDelete()

    await expect(user.restore()).rejects.toThrow(E_MODEL_DELETED)
  })

  test('should restore a soft deleted row', async ({ expect }) => {
    const user = await UserFactory.apply('trashed').create()

    await user.restore()

    expect(user.isTrashed).toBe(false)
    expect(user.deletedAt).toBeNull()
    expect(await User.find(user.id)).not.toBeNull()
    // The column must be cleared to a real NULL in the database.
    const row = await rawRow(user.id)
    expect(row.deleted_at).toBeNull()
  })

  test('should make a restored row visible again', async ({ expect }) => {
    const user = await UserFactory.create()
    await user.delete()
    expect(await User.find(user.id)).toBeNull()

    await user.restore()

    expect(await User.find(user.id)).not.toBeNull()
  })

  /**
   * ---------------------------------------------------------------------------
   * isTrashed lifecycle
   * ---------------------------------------------------------------------------
   */

  test('should mark the instance as trashed after a soft delete', async ({ expect }) => {
    const user = await UserFactory.create()

    await user.delete()

    expect(user.isTrashed).toBe(true)
  })

  test('isTrashed should be false for a freshly created model', async ({ expect }) => {
    const user = await UserFactory.create()

    expect(user.isTrashed).toBe(false)
  })

  /**
   * ---------------------------------------------------------------------------
   * Query scopes: withTrashed / onlyTrashed
   * ---------------------------------------------------------------------------
   */

  test('withTrashed should include trashed rows', async ({ expect }) => {
    await UserFactory.createMany(3)
    await UserFactory.apply('trashed').createMany(7)

    const users = await User.query().withTrashed()
    expect(users).toHaveLength(10)
  })

  test('onlyTrashed should return only trashed rows', async ({ expect }) => {
    await UserFactory.createMany(3)
    await UserFactory.apply('trashed').createMany(7)

    const users = await User.query().onlyTrashed()
    expect(users).toHaveLength(7)
    // The stored value must round-trip back into a valid DateTime instance.
    for (const u of users) {
      expect(DateTime.isDateTime(u.deletedAt)).toBe(true)
      expect(u.deletedAt!.isValid).toBe(true)
    }
  })

  /**
   * ---------------------------------------------------------------------------
   * Bulk operations on the query builder
   * ---------------------------------------------------------------------------
   */

  test('bulk query delete should soft delete the matched rows', async ({ expect }) => {
    await UserFactory.createMany(5)

    await User.query().delete()

    const rows = await db.from('users')
    expect(rows).toHaveLength(5)
    for (const row of rows) {
      expect(DateTime.fromSQL(row.deleted_at).isValid).toBe(true)
    }
  })

  test('bulk query delete should not stamp trashed rows again', async ({ expect }) => {
    const deletedAt = DateTime.fromISO('2020-01-01T00:00:00')
    const user = await UserFactory.merge({ deletedAt }).create()

    await User.query().delete()

    const row = await rawRow(user.id)
    expect(DateTime.fromSQL(row.deleted_at).toISO()).toBe(deletedAt.toISO())
  })

  test('bulk query update should skip trashed rows', async ({ expect }) => {
    const jane = await UserFactory.merge({ lastName: 'Doe' }).create()
    const john = await UserFactory.apply('trashed').merge({ lastName: 'Doe' }).create()

    await User.query().update({ lastName: 'Smith' })

    expect((await rawRow(jane.id)).last_name).toBe('Smith')
    expect((await rawRow(john.id)).last_name).toBe('Doe')
  })

  test('bulk query delete should only soft delete the rows matched by the where clause', async ({
    expect,
  }) => {
    const kept = await UserFactory.merge({ lastName: 'Keeper' }).createMany(2)
    await UserFactory.merge({ lastName: 'Doomed' }).createMany(3)

    await User.query().where('lastName', 'Doomed').delete()

    // Unmatched rows stay active and visible through the default scope.
    const active = await User.all()
    expect(active.map((u) => u.id).sort()).toEqual(kept.map((u) => u.id).sort())

    // Matched rows are soft deleted: still present, hidden, and trashed.
    expect(await countRows()).toBe(5)
    const trashed = await User.query().onlyTrashed()
    expect(trashed).toHaveLength(3)
    expect(trashed.every((u) => u.lastName === 'Doomed')).toBe(true)
  })

  test('bulk query forceDelete should permanently remove the matched rows', async ({ expect }) => {
    await UserFactory.createMany(5)

    await User.query().forceDelete()

    expect(await countRows()).toBe(0)
  })

  test('bulk query forceDelete should honour an existing where clause', async ({ expect }) => {
    const kept = await UserFactory.merge({ lastName: 'Keeper' }).createMany(2)
    await UserFactory.merge({ lastName: 'Doomed' }).createMany(3)

    await User.query().where('lastName', 'Doomed').forceDelete()

    expect(await countRows()).toBe(2)
    const remaining = await User.all()
    expect(remaining.map((u) => u.id).sort()).toEqual(kept.map((u) => u.id).sort())
  })

  test('bulk query forceDelete should permanently remove trashed rows', async ({ expect }) => {
    await UserFactory.createMany(2)
    await UserFactory.apply('trashed').createMany(3)

    await User.query().onlyTrashed().forceDelete()

    // Only the trashed rows are gone, the active ones remain.
    expect(await countRows()).toBe(2)
    expect(await User.query()).toHaveLength(2)
  })

  test('bulk query restore should restore every trashed row', async ({ expect }) => {
    await UserFactory.apply('trashed').createMany(5)

    await User.query().withTrashed().restore()

    expect(await User.query()).toHaveLength(5)
    // Every `deleted_at` must be cleared to a real NULL.
    const rows = await db.from('users')
    expect(rows.map((row) => row.deleted_at)).toEqual(Array.from({ length: 5 }).fill(null))
  })

  test('bulk query restore is not filtered by the soft-delete scope', async ({ expect }) => {
    await UserFactory.apply('trashed').createMany(4)

    // A bulk restore lifts the scope itself: it reaches the trashed rows even
    // without an explicit `withTrashed()`.
    await User.query().restore()

    expect(await User.query()).toHaveLength(4)
  })

  /**
   * ---------------------------------------------------------------------------
   * Pagination and grouping
   * ---------------------------------------------------------------------------
   */

  test('pagination total should exclude trashed rows', async ({ expect }) => {
    await UserFactory.createMany(3)
    await UserFactory.apply('trashed').createMany(7)

    const page = await User.query().paginate(1, 10)
    expect(page.total).toBe(3)
  })

  test('pagination rows should exclude trashed users', async ({ expect }) => {
    await UserFactory.createMany(3)
    await UserFactory.apply('trashed').createMany(7)

    const page = await User.query().paginate(1, 10)
    expect(page.all()).toHaveLength(3)
  })

  test('group by aggregate should exclude trashed rows', async ({ expect }) => {
    await UserFactory.merge({ lastName: 'Smith' }).createMany(3)
    await UserFactory.apply('trashed').merge({ lastName: 'Smith' }).createMany(4)

    const rows = await User.query()
      .where('lastName', 'Smith')
      .count('* as total')
      .groupBy('lastName')

    expect(Number(rows[0].$extras.total)).toBe(3)
  })

  /**
   * ---------------------------------------------------------------------------
   * Hooks
   * ---------------------------------------------------------------------------
   */

  test('soft delete should only run the delete hooks', async ({ expect }) => {
    const user = await createHookedUser()

    await user.delete()

    expect(hookCalls).toEqual(['before:delete', 'after:delete'])
  })

  test('delete hooks should see a soft delete as not force deleting', async ({ expect }) => {
    const user = await createHookedUser()

    await user.delete()

    expect(deleteHookStates).toEqual([
      { hook: 'before:delete', isForceDeleting: false, isDeleted: false, isTrashed: false },
      { hook: 'after:delete', isForceDeleting: false, isDeleted: false, isTrashed: true },
    ])
  })

  test('force delete should run the delete hooks while force deleting', async ({ expect }) => {
    const user = await createHookedUser()

    await user.forceDelete()

    expect(deleteHookStates).toEqual([
      { hook: 'before:delete', isForceDeleting: true, isDeleted: false, isTrashed: false },
      { hook: 'after:delete', isForceDeleting: true, isDeleted: true, isTrashed: false },
    ])
    expect(user.$isForceDeleting).toBe(false)
  })

  test('force delete should run the delete hooks on a trashed row', async ({ expect }) => {
    const user = await createHookedUser({ deletedAt: DateTime.now() })

    await user.forceDelete()

    expect(hookCalls).toEqual(['before:delete', 'after:delete'])
    expect(await countRows()).toBe(0)
  })

  test('deleteQuietly should soft delete without running hooks', async ({ expect }) => {
    const user = await createHookedUser()

    await user.deleteQuietly()

    expect(hookCalls).toEqual([])
    expect(user.isTrashed).toBe(true)
    expect(user.$isDeleted).toBe(false)
    expect(await countRows()).toBe(1)

    // The instance must stay usable after a quiet soft delete.
    await user.restore()
    expect(await HookedUser.find(user.id)).not.toBeNull()
  })

  test('forceDeleteQuietly should remove the row without running hooks', async ({ expect }) => {
    const user = await createHookedUser()

    await user.forceDeleteQuietly()

    expect(hookCalls).toEqual([])
    expect(user.$isDeleted).toBe(true)
    expect(user.$isForceDeleting).toBe(false)
    expect(await countRows()).toBe(0)
  })

  test('restore should only run the restore hooks', async ({ expect }) => {
    const user = await createHookedUser({ deletedAt: DateTime.now() })

    await user.restore()

    expect(hookCalls).toEqual(['before:restore', 'after:restore'])
    expect(user.isTrashed).toBe(false)
  })

  test('restoreQuietly should restore without running hooks', async ({ expect }) => {
    const user = await createHookedUser({ deletedAt: DateTime.now() })

    const result = await user.restoreQuietly()

    expect(result).toBe(user)
    expect(hookCalls).toEqual([])
    expect(user.isTrashed).toBe(false)
    expect((await rawRow(user.id)).deleted_at).toBeNull()
  })

  test('deleting a trashed row should be a no-op', async ({ expect }) => {
    const user = await createHookedUser({ deletedAt: DateTime.now().minus({ days: 1 }) })
    const deletedAt = user.deletedAt
    const before = await rawRow(user.id)

    await user.delete()
    await user.deleteQuietly()

    expect(hookCalls).toEqual([])
    expect(user.deletedAt).toBe(deletedAt)
    expect(await rawRow(user.id)).toEqual(before)
  })

  test('restoring a row that is not trashed should be a no-op', async ({ expect }) => {
    const user = await createHookedUser()

    await user.restore()
    await user.restoreQuietly()

    expect(hookCalls).toEqual([])
  })

  test('should throw when deleting a force deleted row', async ({ expect }) => {
    const user = await createHookedUser()
    await user.forceDelete()

    await expect(user.delete()).rejects.toThrow(errors.E_MODEL_DELETED)
    await expect(user.deleteQuietly()).rejects.toThrow(errors.E_MODEL_DELETED)
  })

  test('should throw when quietly restoring a force deleted row', async ({ expect }) => {
    const user = await createHookedUser()
    await user.forceDelete()

    await expect(user.restoreQuietly()).rejects.toThrow(E_MODEL_DELETED)
  })

  test('a failed force delete should not turn the next delete into a force delete', async ({
    expect,
  }) => {
    const user = await createHookedUser()

    failForceDelete = true
    await expect(user.forceDelete()).rejects.toThrow('force delete failed')
    expect(user.$isForceDeleting).toBe(false)

    failForceDelete = false
    await user.delete()

    // The row must have been soft deleted, not removed.
    expect(user.isTrashed).toBe(true)
    expect(await countRows()).toBe(1)
  })

  /**
   * ---------------------------------------------------------------------------
   * Columns written by a soft delete and a restore
   * ---------------------------------------------------------------------------
   */

  test('soft delete should bump updatedAt', async ({ expect }) => {
    const created = await UserFactory.create()
    await db.from('users').where('id', created.id).update({ updated_at: '2020-01-01 00:00:00' })
    const user = await User.findOrFail(created.id)

    await user.delete()

    expect(user.updatedAt.year).not.toBe(2020)
    expect(DateTime.fromSQL((await rawRow(user.id)).updated_at).year).not.toBe(2020)
  })

  test('restore should bump updatedAt', async ({ expect }) => {
    const created = await UserFactory.apply('trashed').create()
    await db.from('users').where('id', created.id).update({ updated_at: '2020-01-01 00:00:00' })
    const user = await User.query().withTrashed().where('id', created.id).firstOrFail()

    await user.restore()

    expect(user.updatedAt.year).not.toBe(2020)
    expect(DateTime.fromSQL((await rawRow(user.id)).updated_at).year).not.toBe(2020)
  })

  test('soft delete should leave other pending changes unsaved', async ({ expect }) => {
    const user = await UserFactory.merge({ firstName: 'Jane' }).create()
    user.firstName = 'John'

    await user.delete()

    const row = await rawRow(user.id)
    expect(row.first_name).toBe('Jane')
    expect(row.deleted_at).not.toBeNull()
    expect(user.$dirty).toEqual({ firstName: 'John' })
  })

  test('restore should leave other pending changes unsaved', async ({ expect }) => {
    const user = await UserFactory.apply('trashed').merge({ firstName: 'Jane' }).create()
    user.firstName = 'John'

    await user.restore()

    const row = await rawRow(user.id)
    expect(row.first_name).toBe('Jane')
    expect(row.deleted_at).toBeNull()
    expect(user.$dirty).toEqual({ firstName: 'John' })
  })

  test('soft delete should run inside the model transaction', async ({ expect }) => {
    const user = await UserFactory.create()
    const trx = await db.transaction()
    user.useTransaction(trx)

    await user.delete()
    await trx.rollback()

    expect((await rawRow(user.id)).deleted_at).toBeNull()
  })

  /**
   * ---------------------------------------------------------------------------
   * Models without the mixin are left untouched
   * ---------------------------------------------------------------------------
   */

  test('should not hide trashed rows of a model without the mixin', async ({ expect }) => {
    await UserFactory.createMany(3)
    await UserFactory.apply('trashed').createMany(7)

    expect(await PlainUser.query()).toHaveLength(10)
    expect(await PlainUser.query().withTrashed()).toHaveLength(10)
  })

  test('onlyTrashed should throw on a model without the mixin', async ({ expect }) => {
    expect(() => PlainUser.query().onlyTrashed()).toThrow(E_NOT_SOFT_DELETABLE)
  })

  test('should permanently delete rows of a model without the mixin', async ({ expect }) => {
    const users = await UserFactory.createMany(2)

    await PlainUser.query().where('id', users[0].id).delete()
    const plainUser = await PlainUser.findOrFail(users[1].id)
    await plainUser.delete()

    expect(await countRows()).toBe(0)
  })

  /**
   * ---------------------------------------------------------------------------
   * Row queries: a model instance always reaches its own row
   * ---------------------------------------------------------------------------
   */

  test('should save changes made to a trashed row', async ({ expect }) => {
    const user = await UserFactory.apply('trashed').merge({ firstName: 'Jane' }).create()

    user.firstName = 'John'
    await user.save()

    expect((await rawRow(user.id)).first_name).toBe('John')
  })

  test('should refresh a trashed row', async ({ expect }) => {
    const user = await UserFactory.apply('trashed').merge({ firstName: 'Jane' }).create()
    await db.from('users').where('id', user.id).update({ first_name: 'John' })

    await user.refresh()

    expect(user.firstName).toBe('John')
  })
})
