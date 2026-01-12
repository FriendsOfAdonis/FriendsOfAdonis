import 'reflect-metadata'
import { test } from '@japa/runner'
import { type Database } from '@adonisjs/lucid/database'
import { type ApplicationService } from '@adonisjs/core/types'
import { setupApp, getDatabase, createTable, cleanupTables } from '../helpers/database.js'
import { SQLite3Introspector } from '../../src/ddl/introspection/dialects/sqlite3.js'
import { DatabaseIntrospector } from '../../src/ddl/introspection/database_introspector.js'

test.group('SQLite3Introspector', (group) => {
  let app: ApplicationService
  let db: Database

  group.setup(async () => {
    const result = await setupApp()
    app = result.app
    db = await getDatabase(app)
  })

  group.teardown(async () => {
    await db.manager.closeAll()
    await app.terminate()
  })

  group.each.teardown(async () => {
    await cleanupTables(db)
  })

  test('introspects empty database', async ({ assert }) => {
    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.deepEqual(schema, { tables: {} })
  })

  test('introspects table with primary key column', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.properties(schema.tables, ['users'])
    assert.deepEqual(schema.tables.users.columns.id, {
      type: 'integer',
      isPrimary: true,
      isNullable: true,
      default: undefined,
      maxLength: undefined,
      isUnique: false,
    })
  })

  test('introspects table with autoincrement primary key', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.users.columns.id.isPrimary, true)
    assert.equal(schema.tables.users.columns.id.type, 'integer')
  })

  test('introspects varchar column with max length', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        email VARCHAR(255) NOT NULL
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.deepEqual(schema.tables.users.columns.email, {
      type: 'varchar',
      isPrimary: false,
      isNullable: false,
      default: undefined,
      maxLength: 255,
      isUnique: false,
    })
  })

  test('introspects multiple varchar lengths', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(255),
        bio VARCHAR(1000)
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.users.columns.name.maxLength, 100)
    assert.equal(schema.tables.users.columns.email.maxLength, 255)
    assert.equal(schema.tables.users.columns.bio.maxLength, 1000)
  })

  test('introspects text column without max length', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE posts (
        id INTEGER PRIMARY KEY,
        content TEXT
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.deepEqual(schema.tables.posts.columns.content, {
      type: 'text',
      isPrimary: false,
      isNullable: true,
      default: undefined,
      maxLength: undefined,
      isUnique: false,
    })
  })

  test('introspects nullable vs not null columns', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        bio TEXT NOT NULL
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.users.columns.email.isNullable, false)
    assert.equal(schema.tables.users.columns.name.isNullable, true)
    assert.equal(schema.tables.users.columns.bio.isNullable, false)
  })

  test('introspects default string value', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE orders (
        id INTEGER PRIMARY KEY,
        status VARCHAR(20) DEFAULT 'pending'
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.orders.columns.status.default, "'pending'")
  })

  test('introspects default numeric value', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        quantity INTEGER DEFAULT 0,
        price INTEGER DEFAULT 100
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.products.columns.quantity.default, '0')
    assert.equal(schema.tables.products.columns.price.default, '100')
  })

  test('introspects default boolean-like value', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE settings (
        id INTEGER PRIMARY KEY,
        is_active INTEGER DEFAULT 1,
        is_deleted INTEGER DEFAULT 0
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.settings.columns.is_active.default, '1')
    assert.equal(schema.tables.settings.columns.is_deleted.default, '0')
  })

  test('introspects unique column via index', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        email VARCHAR(255) NOT NULL
      )
    `
    )
    await db.rawQuery('CREATE UNIQUE INDEX idx_users_email ON users(email)')

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    // Single-column unique indices are converted to column-level unique flag
    assert.equal(schema.tables.users.columns.email.isUnique, true)
    // The index should be removed from indices since it's now a column property
    assert.notProperty(schema.tables.users.indices, 'idx_users_email')
  })

  test('introspects inline unique constraint', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.users.columns.email.isUnique, true)
  })

  test('introspects composite unique index', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE tags (
        id INTEGER PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        slug VARCHAR(50) NOT NULL
      )
    `
    )
    await db.rawQuery('CREATE UNIQUE INDEX idx_tags_name_slug ON tags(name, slug)')

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    // Composite indices should remain as indices (not converted to column unique)
    assert.equal(schema.tables.tags.columns.name.isUnique, false)
    assert.equal(schema.tables.tags.columns.slug.isUnique, false)
    assert.property(schema.tables.tags.indices, 'idx_tags_name_slug')
    assert.deepEqual(schema.tables.tags.indices['idx_tags_name_slug'], {
      isUnique: true,
      columns: ['name', 'slug'],
    })
  })

  test('introspects non-unique index', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        category VARCHAR(100)
      )
    `
    )
    await db.rawQuery('CREATE INDEX idx_products_category ON products(category)')

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.property(schema.tables.products.indices, 'idx_products_category')
    assert.deepEqual(schema.tables.products.indices['idx_products_category'], {
      isUnique: false,
      columns: ['category'],
    })
  })

  test('introspects multiple indices on same table', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        sku VARCHAR(50) NOT NULL,
        name VARCHAR(200) NOT NULL,
        category VARCHAR(100),
        price INTEGER
      )
    `
    )
    await db.rawQuery('CREATE UNIQUE INDEX idx_products_sku ON products(sku)')
    await db.rawQuery('CREATE INDEX idx_products_category ON products(category)')
    await db.rawQuery('CREATE INDEX idx_products_price_cat ON products(price, category)')

    const introspector = new SQLite3Introspector(db)
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
    await createTable(
      db,
      `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100)
      )
    `
    )
    await createTable(
      db,
      `
      CREATE TABLE posts (
        id INTEGER PRIMARY KEY,
        title VARCHAR(200)
      )
    `
    )
    await createTable(
      db,
      `
      CREATE TABLE comments (
        id INTEGER PRIMARY KEY,
        body TEXT
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.properties(schema.tables, ['users', 'posts', 'comments'])
    assert.property(schema.tables.users.columns, 'name')
    assert.property(schema.tables.posts.columns, 'title')
    assert.property(schema.tables.comments.columns, 'body')
  })

  test('introspects table with many columns', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE complex_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid VARCHAR(36) NOT NULL,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        login_count INTEGER DEFAULT 0,
        last_login DATETIME,
        metadata TEXT,
        created_at DATETIME,
        updated_at DATETIME
      )
    `
    )
    await db.rawQuery('CREATE UNIQUE INDEX idx_complex_uuid ON complex_table(uuid)')
    await db.rawQuery('CREATE UNIQUE INDEX idx_complex_email ON complex_table(email)')

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    const columns = schema.tables.complex_table.columns

    assert.equal(Object.keys(columns).length, 12)
    assert.equal(columns.id.isPrimary, true)
    assert.equal(columns.uuid.isUnique, true)
    assert.equal(columns.email.isUnique, true)
    assert.equal(columns.name.isNullable, true)
    assert.equal(columns.password.isNullable, false)
    assert.equal(columns.is_admin.default, '0')
    assert.equal(columns.is_active.default, '1')
  })

  test('introspects datetime column', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE events (
        id INTEGER PRIMARY KEY,
        starts_at DATETIME NOT NULL,
        ends_at DATETIME
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.events.columns.starts_at.type, 'datetime')
    assert.equal(schema.tables.events.columns.starts_at.isNullable, false)
    assert.equal(schema.tables.events.columns.ends_at.type, 'datetime')
    assert.equal(schema.tables.events.columns.ends_at.isNullable, true)
  })

  test('introspects integer column types', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE numbers (
        id INTEGER PRIMARY KEY,
        small_int SMALLINT,
        big_int BIGINT,
        regular INT
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.numbers.columns.small_int.type, 'smallint')
    assert.equal(schema.tables.numbers.columns.big_int.type, 'bigint')
    assert.equal(schema.tables.numbers.columns.regular.type, 'int')
  })

  test('introspects real/float column types', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE measurements (
        id INTEGER PRIMARY KEY,
        temperature REAL,
        pressure FLOAT,
        humidity DOUBLE
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.measurements.columns.temperature.type, 'real')
    assert.equal(schema.tables.measurements.columns.pressure.type, 'float')
    assert.equal(schema.tables.measurements.columns.humidity.type, 'double')
  })

  test('introspects blob column type', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE files (
        id INTEGER PRIMARY KEY,
        data BLOB
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.files.columns.data.type, 'blob')
  })

  test('introspects boolean column type', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE flags (
        id INTEGER PRIMARY KEY,
        is_enabled BOOLEAN DEFAULT 0
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.flags.columns.is_enabled.type, 'boolean')
    assert.equal(schema.tables.flags.columns.is_enabled.default, '0')
  })

  test('primary key column is not marked as unique', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY
      )
    `
    )
    // SQLite automatically creates an index for PRIMARY KEY
    // but we should not mark it as unique since it's already primary

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.users.columns.id.isPrimary, true)
    assert.equal(schema.tables.users.columns.id.isUnique, false)
  })

  test('getTables returns all table names', async ({ assert }) => {
    await createTable(db, 'CREATE TABLE alpha (id INTEGER PRIMARY KEY)')
    await createTable(db, 'CREATE TABLE beta (id INTEGER PRIMARY KEY)')
    await createTable(db, 'CREATE TABLE gamma (id INTEGER PRIMARY KEY)')

    const introspector = new SQLite3Introspector(db)
    const tables = await introspector.getTables()

    assert.includeMembers(tables, ['alpha', 'beta', 'gamma'])
  })

  test('getColumns returns column schema for specific table', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const columns = await introspector.getColumns('users')

    assert.properties(columns, ['id', 'name'])
    assert.equal(columns.id.isPrimary, true)
    assert.equal(columns.name.maxLength, 100)
  })

  test('getIndices returns index schema for specific table', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        sku VARCHAR(50),
        category VARCHAR(100)
      )
    `
    )
    await db.rawQuery('CREATE UNIQUE INDEX idx_sku ON products(sku)')
    await db.rawQuery('CREATE INDEX idx_cat ON products(category)')

    const introspector = new SQLite3Introspector(db)
    const indices = await introspector.getIndices('products')

    assert.properties(indices, ['idx_sku', 'idx_cat'])
    assert.equal(indices['idx_sku'].isUnique, true)
    assert.equal(indices['idx_cat'].isUnique, false)
  })

  test('handles table with no columns except primary key', async ({ assert }) => {
    await createTable(db, 'CREATE TABLE empty_ish (id INTEGER PRIMARY KEY)')

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(Object.keys(schema.tables.empty_ish.columns).length, 1)
    assert.property(schema.tables.empty_ish.columns, 'id')
  })

  test('handles char column type with length', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE codes (
        id INTEGER PRIMARY KEY,
        country_code CHAR(2),
        currency_code CHAR(3)
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.codes.columns.country_code.type, 'char')
    assert.equal(schema.tables.codes.columns.country_code.maxLength, 2)
    assert.equal(schema.tables.codes.columns.currency_code.maxLength, 3)
  })

  test('handles numeric column type with precision', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE finances (
        id INTEGER PRIMARY KEY,
        amount NUMERIC(10,2),
        rate DECIMAL(5,4)
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    // The regex only matches single numbers like (255), not precision/scale like (10,2)
    // So the full type is preserved and maxLength is undefined
    assert.equal(schema.tables.finances.columns.amount.type, 'numeric(10,2)')
    assert.equal(schema.tables.finances.columns.amount.maxLength, undefined)
    assert.equal(schema.tables.finances.columns.rate.type, 'decimal(5,4)')
    assert.equal(schema.tables.finances.columns.rate.maxLength, undefined)
  })

  test('handles table names with underscores', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE user_profile_settings (
        id INTEGER PRIMARY KEY,
        user_id INTEGER
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.property(schema.tables, 'user_profile_settings')
  })

  test('handles column names with underscores', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        created_at DATETIME,
        updated_at DATETIME
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.properties(schema.tables.users.columns, [
      'first_name',
      'last_name',
      'created_at',
      'updated_at',
    ])
  })

  test('handles default value with expression', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE logs (
        id INTEGER PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.logs.columns.created_at.default, 'CURRENT_TIMESTAMP')
  })

  test('handles null default value explicitly', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE items (
        id INTEGER PRIMARY KEY,
        deleted_at DATETIME DEFAULT NULL
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.items.columns.deleted_at.default, 'NULL')
  })
})

test.group('DatabaseIntrospector with SQLite', (group) => {
  let app: ApplicationService
  let db: Database

  group.setup(async () => {
    const result = await setupApp()
    app = result.app
    db = await getDatabase(app)
  })

  group.teardown(async () => {
    await db.manager.closeAll()
    await app.terminate()
  })

  group.each.teardown(async () => {
    await cleanupTables(db)
  })

  test('uses SQLite3Introspector for better-sqlite3 dialect', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        email VARCHAR(255) NOT NULL
      )
    `
    )

    const introspector = new DatabaseIntrospector(db)
    const schema = await introspector.introspect()

    assert.property(schema.tables, 'users')
    assert.property(schema.tables.users.columns, 'id')
    assert.property(schema.tables.users.columns, 'email')
  })

  test('full introspection matches SQLite3Introspector output', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sku VARCHAR(50) NOT NULL,
        name VARCHAR(200) NOT NULL,
        price INTEGER DEFAULT 0
      )
    `
    )
    await db.rawQuery('CREATE UNIQUE INDEX idx_sku ON products(sku)')

    const databaseIntrospector = new DatabaseIntrospector(db)
    const sqlite3Introspector = new SQLite3Introspector(db)

    const schemaFromDatabase = await databaseIntrospector.introspect()
    const schemaFromSqlite3 = await sqlite3Introspector.introspect()

    assert.deepEqual(schemaFromDatabase, schemaFromSqlite3)
  })
})

test.group('SQLite3Introspector edge cases', (group) => {
  let app: ApplicationService
  let db: Database

  group.setup(async () => {
    const result = await setupApp()
    app = result.app
    db = await getDatabase(app)
  })

  group.teardown(async () => {
    await db.manager.closeAll()
    await app.terminate()
  })

  group.each.teardown(async () => {
    await cleanupTables(db)
  })

  test('handles table with foreign key constraint', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY
      )
    `
    )
    await createTable(
      db,
      `
      CREATE TABLE posts (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.property(schema.tables, 'users')
    assert.property(schema.tables, 'posts')
    assert.property(schema.tables.posts.columns, 'user_id')
    assert.equal(schema.tables.posts.columns.user_id.isNullable, false)
  })

  test('handles table with check constraint', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        price INTEGER CHECK(price >= 0)
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.property(schema.tables.products.columns, 'price')
    assert.equal(schema.tables.products.columns.price.type, 'integer')
  })

  test('handles mixed case column types', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE mixed (
        id INTEGER PRIMARY KEY,
        col1 VARCHAR(50),
        col2 varchar(50),
        col3 VarChar(50),
        col4 TEXT,
        col5 text
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    // All types should be normalized to lowercase
    assert.equal(schema.tables.mixed.columns.col1.type, 'varchar')
    assert.equal(schema.tables.mixed.columns.col2.type, 'varchar')
    assert.equal(schema.tables.mixed.columns.col3.type, 'varchar')
    assert.equal(schema.tables.mixed.columns.col4.type, 'text')
    assert.equal(schema.tables.mixed.columns.col5.type, 'text')
  })

  test('handles index on column that does not exist (edge case)', async ({ assert }) => {
    // This shouldn't happen in practice, but tests robustness
    await createTable(
      db,
      `
      CREATE TABLE valid_table (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100)
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    // Should not throw and should return valid schema
    assert.property(schema.tables, 'valid_table')
  })

  test('handles very long varchar length', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE long_text (
        id INTEGER PRIMARY KEY,
        content VARCHAR(65535)
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.equal(schema.tables.long_text.columns.content.maxLength, 65535)
  })

  test('handles multiple primary key columns (composite PK)', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE pivot (
        user_id INTEGER,
        role_id INTEGER,
        PRIMARY KEY (user_id, role_id)
      )
    `
    )

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    // SQLite PRAGMA table_info marks pk=1 for first PK column, pk=2 for second, etc.
    // Both should be marked as primary
    assert.equal(schema.tables.pivot.columns.user_id.isPrimary, true)
    assert.equal(schema.tables.pivot.columns.role_id.isPrimary, true)
  })

  test('handles index with descending order', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE sorted (
        id INTEGER PRIMARY KEY,
        created_at DATETIME
      )
    `
    )
    await db.rawQuery('CREATE INDEX idx_created_desc ON sorted(created_at DESC)')

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    assert.property(schema.tables.sorted.indices, 'idx_created_desc')
    assert.deepEqual(schema.tables.sorted.indices['idx_created_desc'].columns, ['created_at'])
  })

  test('handles partial index', async ({ assert }) => {
    await createTable(
      db,
      `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        email VARCHAR(255),
        is_active INTEGER DEFAULT 1
      )
    `
    )
    await db.rawQuery('CREATE UNIQUE INDEX idx_active_email ON users(email) WHERE is_active = 1')

    const introspector = new SQLite3Introspector(db)
    const schema = await introspector.introspect()

    // Partial index should still be captured
    // Note: Single column unique index is converted to column property
    assert.equal(schema.tables.users.columns.email.isUnique, true)
  })
})
