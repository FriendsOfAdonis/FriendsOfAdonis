import { ApplicationService } from '@adonisjs/core/types'
import { Database } from '@adonisjs/lucid/database'
import { test } from '@japa/runner'
import { setupDatabase } from './helpers.ts'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Factory from '@adonisjs/lucid/factories'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletable } from '../src/mixins/soft_delete.ts'
import { E_MODEL_DELETED } from '../src/exceptions.ts'

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

    // The scope is a read-time hook (beforeFetch/beforeFind), so it does not
    // apply to a bulk update: restore reaches the trashed rows even without
    // an explicit `withTrashed()`.
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
})
