import { type ApplicationService } from '@adonisjs/core/types'
import { type Database } from '@adonisjs/lucid/database'
import { type QueryClientContract, type ConnectionConfig } from '@adonisjs/lucid/types/database'
import { test } from '@japa/runner'
import { setupDatabase } from '../helpers.ts'
import { type Constructor } from '@adonisjs/core/types/common'
import { type BaseDatabaseIntrospector } from '../../src/ddl/introspection/dialects/base.ts'
import { type Group } from '@japa/runner/core'

function emptyDatabase(introspector: BaseDatabaseIntrospector) {
  test('introspect empty database', async ({ assert }) => {
    const schema = await introspector.introspect()
    assert.deepEqual(schema, { tables: {} })
  })
}

function primaryKey(client: QueryClientContract, introspector: BaseDatabaseIntrospector) {
  test('introspects table with primary key column', async ({ assert }) => {
    await client.schema.createTable('users', (table) => {
      table.integer('id').primary()
    })

    const schema = await introspector.introspect()

    assert.properties(schema.tables, ['users'])
    assert.equal(schema.tables.users.columns.id.type, 'integer')
    assert.equal(schema.tables.users.columns.id.isPrimary, true)
    assert.equal(schema.tables.users.columns.id.default, undefined)
    assert.equal(schema.tables.users.columns.id.maxLength, undefined)
    assert.equal(schema.tables.users.columns.id.isUnique, false)
    // Note: isNullable varies by dialect - PostgreSQL PKs are NOT NULL, SQLite allows nullable PKs
  })
}

export const databaseTests = {
  emptyDatabase,
  primaryKey,
}

export function configureDatabaseTests(
  group: Group,
  connectionOrFactory: () => ConnectionConfig,
  introspectorClass: Constructor<BaseDatabaseIntrospector>
) {
  let db: Database
  let app: ApplicationService
  let client: QueryClientContract

  group.setup(async () => {
    const connection =
      typeof connectionOrFactory === 'function' ? connectionOrFactory() : connectionOrFactory
    const result = await setupDatabase(connection)

    app = result.app
    db = result.db
    client = result.db.connection()
  })

  group.teardown(async () => {
    await app.terminate()
  })

  group.each.setup(async () => {
    await client.dropAllTables()
  })

  test('introspects table with autoincrement primary key', async ({ assert }) => {
    await client.schema.createTable('users', (table) => {
      table.increments('id').primary()
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.users.columns.id.isPrimary, true)
    assert.equal(schema.tables.users.columns.id.type, 'integer')
  })

  test('introspects varchar column with max length', async ({ assert }) => {
    await client.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('email', 200).notNullable()
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.users.columns.email.type, 'varchar')
    assert.equal(schema.tables.users.columns.email.maxLength, 200)
  })

  test('introspects multiple varchar lengths', async ({ assert }) => {
    await client.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('name', 100)
      table.string('email', 255)
      table.string('bio', 1000)
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.users.columns.name.maxLength, 100)
    assert.equal(schema.tables.users.columns.email.maxLength, undefined)
    assert.equal(schema.tables.users.columns.bio.maxLength, 1000)
  })

  test('introspects text column without max length', async ({ assert }) => {
    await client.schema.createTable('posts', (table) => {
      table.increments('id').primary()
      table.text('content')
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.posts.columns.content.type, 'text')
    assert.equal(schema.tables.posts.columns.content.maxLength, undefined)
  })

  test('introspects nullable vs not null columns', async ({ assert }) => {
    await client.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable()
      table.string('name', 100).nullable()
      table.text('bio').notNullable()
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.users.columns.email.isNullable, false)
    assert.equal(schema.tables.users.columns.name.isNullable, true)
    assert.equal(schema.tables.users.columns.bio.isNullable, false)
  })

  test('introspects default string value', async ({ assert }) => {
    await client.schema.createTable('orders', (table) => {
      table.increments('id').primary()
      table.string('status', 20).defaultTo('pending')
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.orders.columns.status.default, 'pending')
  })

  test('introspects default numeric value', async ({ assert }) => {
    await client.schema.createTable('products', (table) => {
      table.increments('id').primary()
      table.integer('quantity').defaultTo(0)
      table.integer('price').defaultTo(100)
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.products.columns.quantity.default, 0)
    assert.equal(schema.tables.products.columns.price.default, 100)
  })

  test('introspects unique column via index', async ({ assert }) => {
    await client.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable()
    })
    await client.schema.alterTable('users', (table) => {
      table.unique(['email'], { indexName: 'idx_users_email' })
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    // Single-column unique indices are converted to column-level unique flag
    assert.equal(schema.tables.users.columns.email.isUnique, true)
    // The index should be removed from indices since it's now a column property
    assert.notProperty(schema.tables.users.indices, 'idx_users_email')
  })

  test('introspects inline unique constraint', async ({ assert }) => {
    await client.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable().unique()
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.users.columns.email.isUnique, true)
  })

  test('introspects composite unique index', async ({ assert }) => {
    await client.schema.createTable('tags', (table) => {
      table.increments('id').primary()
      table.string('name', 50).notNullable()
      table.string('slug', 50).notNullable()
      table.unique(['name', 'slug'])
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    // Composite indices should remain as indices (not converted to column unique)
    assert.equal(schema.tables.tags.columns.name.isUnique, false)
    assert.equal(schema.tables.tags.columns.slug.isUnique, false)
    assert.property(schema.tables.tags.indices, 'tags_name_slug_unique')
    assert.deepEqual(schema.tables.tags.indices['tags_name_slug_unique'], {
      isUnique: true,
      columns: ['name', 'slug'],
    })
  })

  test('introspects non-unique index', async ({ assert }) => {
    await client.schema.createTable('products', (table) => {
      table.increments('id').primary()
      table.string('category', 100)
      table.index(['category'])
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.property(schema.tables.products.indices, 'products_category_index')
    assert.deepEqual(schema.tables.products.indices['products_category_index'], {
      isUnique: false,
      columns: ['category'],
    })
  })

  test('introspects multiple indices on same table', async ({ assert }) => {
    await client.schema.createTable('products', (table) => {
      table.increments('id').primary()
      table.string('sku', 50).notNullable()
      table.string('name', 200).notNullable()
      table.string('category', 100)
      table.integer('price')
    })
    await client.schema.alterTable('products', (table) => {
      table.unique(['sku'], { indexName: 'idx_products_sku' })
      table.index(['category'], 'idx_products_category')
      table.index(['price', 'category'], 'idx_products_price_cat')
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    // Single-column unique index converted to column property
    assert.equal(schema.tables.products.columns.sku.isUnique, true)
    assert.notProperty(schema.tables.products.indices, 'idx_products_sku')

    // Non-unique indices remain
    assert.property(schema.tables.products.indices, 'idx_products_category')
    assert.property(schema.tables.products.indices, 'idx_products_price_cat')
    assert.deepEqual(schema.tables.products.indices['idx_products_price_cat'], {
      isUnique: false,
      columns: ['price', 'category'],
    })
  })

  test('introspects multiple tables', async ({ assert }) => {
    await client.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('name', 100)
    })
    await client.schema.createTable('posts', (table) => {
      table.increments('id').primary()
      table.string('title', 200)
    })
    await client.schema.createTable('comments', (table) => {
      table.increments('id').primary()
      table.text('body')
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.properties(schema.tables, ['users', 'posts', 'comments'])
    assert.property(schema.tables.users.columns, 'name')
    assert.property(schema.tables.posts.columns, 'title')
    assert.property(schema.tables.comments.columns, 'body')
  })

  test('introspects table with many columns', async ({ assert }) => {
    await client.schema.createTable('complex_table', (table) => {
      table.increments('id').primary()
      table.string('uuid', 36).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('name', 100).nullable()
      table.text('password').notNullable()
      table.boolean('is_admin').defaultTo(false)
      table.boolean('is_active').defaultTo(true)
      table.integer('login_count').defaultTo(0)
      table.timestamp('last_login').nullable()
      table.text('metadata').nullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    const columns = schema.tables.complex_table.columns

    assert.equal(Object.keys(columns).length, 12)
    assert.equal(columns.id.isPrimary, true)
    assert.equal(columns.uuid.isUnique, true)
    assert.equal(columns.email.isUnique, true)
    assert.equal(columns.name.isNullable, true)
    assert.equal(columns.password.isNullable, false)
  })

  test('introspects timestamp column', async ({ assert }) => {
    await client.schema.createTable('events', (table) => {
      table.increments('id').primary()
      table.timestamp('starts_at').notNullable()
      table.timestamp('ends_at').nullable()
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.events.columns.starts_at.type, 'datetime')
    assert.equal(schema.tables.events.columns.starts_at.isNullable, false)
    assert.equal(schema.tables.events.columns.ends_at.type, 'datetime')
    assert.equal(schema.tables.events.columns.ends_at.isNullable, true)
  })

  test('introspects integer column types', async ({ assert }) => {
    await client.schema.createTable('numbers', (table) => {
      table.increments('id').primary()
      table.specificType('small_int', 'smallint')
      table.bigInteger('big_int')
      table.integer('regular')
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.numbers.columns.small_int.type, 'smallint')
    assert.equal(schema.tables.numbers.columns.big_int.type, 'bigint')
    assert.equal(schema.tables.numbers.columns.regular.type, 'integer')
  })

  test('introspects float/double column types', async ({ assert }) => {
    await client.schema.createTable('measurements', (table) => {
      table.increments('id').primary()
      table.float('temperature')
      table.double('pressure')
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(
      schema.tables.measurements.columns.temperature.type,
      introspector.toSQLType('float')
    )
    assert.equal(schema.tables.measurements.columns.pressure.type, introspector.toSQLType('double'))
  })

  test('introspects binary column type', async ({ assert }) => {
    await client.schema.createTable('files', (table) => {
      table.increments('id').primary()
      table.binary('data')
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.files.columns.data.type, 'binary')
  })

  test('introspects boolean column type', async ({ assert }) => {
    await client.schema.createTable('flags', (table) => {
      table.increments('id').primary()
      table.boolean('is_enabled').defaultTo(false)
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    // SQLite stores booleans as integers, PostgreSQL as boolean
    assert.oneOf(schema.tables.flags.columns.is_enabled.type, ['boolean', 'tinyint'])
  })

  test('primary key column is not marked as unique', async ({ assert }) => {
    await client.schema.createTable('users', (table) => {
      table.increments('id').primary()
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.users.columns.id.isPrimary, true)
    assert.equal(schema.tables.users.columns.id.isUnique, false)
  })

  test('getTables returns all table names', async ({ assert }) => {
    await client.schema.createTable('alpha', (table) => {
      table.increments('id').primary()
    })
    await client.schema.createTable('beta', (table) => {
      table.increments('id').primary()
    })
    await client.schema.createTable('gamma', (table) => {
      table.increments('id').primary()
    })

    const introspector = new introspectorClass(db)
    const tables = await introspector.getTables()

    assert.includeMembers(tables, ['alpha', 'beta', 'gamma'])
  })

  test('getColumns returns column schema for specific table', async ({ assert }) => {
    await client.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('name', 100).notNullable()
    })

    const introspector = new introspectorClass(db)
    const columns = await introspector.getColumns('users')

    assert.properties(columns, ['id', 'name'])
    assert.equal(columns.id.isPrimary, true)
    assert.equal(columns.name.maxLength, 100)
  })

  test('getIndices returns index schema for specific table', async ({ assert }) => {
    await client.schema.createTable('products', (table) => {
      table.increments('id').primary()
      table.string('sku', 50)
      table.string('category', 100)
    })
    await client.schema.alterTable('products', (table) => {
      table.unique(['sku'], { indexName: 'idx_sku' })
      table.index(['category'], 'idx_cat')
    })

    const introspector = new introspectorClass(db)
    const indices = await introspector.getIndices('products')

    assert.properties(indices, ['idx_sku', 'idx_cat'])
    assert.equal(indices['idx_sku'].isUnique, true)
    assert.equal(indices['idx_cat'].isUnique, false)
  })

  test('handles table with no columns except primary key', async ({ assert }) => {
    await client.schema.createTable('empty_ish', (table) => {
      table.increments('id').primary()
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(Object.keys(schema.tables.empty_ish.columns).length, 1)
    assert.property(schema.tables.empty_ish.columns, 'id')
  })

  test('handles table names with underscores', async ({ assert }) => {
    await client.schema.createTable('user_profile_settings', (table) => {
      table.increments('id').primary()
      table.integer('user_id')
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.property(schema.tables, 'user_profile_settings')
  })

  test('handles column names with underscores', async ({ assert }) => {
    await client.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('first_name', 50)
      table.string('last_name', 50)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.properties(schema.tables.users.columns, [
      'first_name',
      'last_name',
      'created_at',
      'updated_at',
    ])
  })

  test('handles very long varchar length', async ({ assert }) => {
    await client.schema.createTable('long_text', (table) => {
      table.increments('id').primary()
      table.string('content', 65535)
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.long_text.columns.content.maxLength, 65535)
  })

  test('handles composite primary key', async ({ assert }) => {
    await client.schema.createTable('pivot', (table) => {
      table.integer('user_id').notNullable()
      table.integer('role_id').notNullable()
      table.primary(['user_id', 'role_id'])
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.pivot.columns.user_id.isPrimary, true)
    assert.equal(schema.tables.pivot.columns.role_id.isPrimary, true)
  })

  test('handles foreign key constraint', async ({ assert }) => {
    await client.schema.createTable('users', (table) => {
      table.increments('id').primary()
    })
    await client.schema.createTable('posts', (table) => {
      table.increments('id').primary()
      table.integer('user_id').notNullable().references('id').inTable('users')
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.property(schema.tables, 'users')
    assert.property(schema.tables, 'posts')
    assert.property(schema.tables.posts.columns, 'user_id')
    assert.equal(schema.tables.posts.columns.user_id.isNullable, false)
  })

  test('handles check constraint', async ({ assert }) => {
    await client.schema.createTable('products', (table) => {
      table.increments('id').primary()
      table.integer('price').checkPositive()
    })

    const introspector = new introspectorClass(db)
    const schema = await introspector.introspect()

    assert.property(schema.tables.products.columns, 'price')
    assert.equal(schema.tables.products.columns.price.type, 'integer')
  })

  test('introspects native types properly - {$self}')
    .with([
      'integer',
      'tinyint',
      'smallint',
      'mediumint',
      'bigint',
      'text',
      'string',
      'float',
      'double',
      'decimal',
      'boolean',
      'date',
      'datetime',
      'time',
      'timestamp',
      'point',
      'binary',
      'json',
      'jsonb',
      'uuid',
    ] as const)
    .run(async ({ assert }, value) => {
      await client.schema.createTable('tags', (table) => {
        table[value]('test_column')
      })

      const introspector = new introspectorClass(db)
      const schema = await introspector.introspect()

      assert.property(schema.tables.tags.columns, 'test_column')
      assert.equal(schema.tables.tags.columns.test_column.type, introspector.toSQLType(value))
    })
}
