import { test } from '@japa/runner'
import { type StartedTestContainer } from 'testcontainers'
import { SQLite3Introspector } from '../../src/ddl/introspection/dialects/sqlite3.ts'
import { PostgresIntrospector } from '../../src/ddl/introspection/dialects/postgres.ts'
import { configureDatabaseTests } from './helpers.ts'
import { POSTGRES_CONTAINER } from '../helpers/postgres.ts'

test.group('DatabaseIntrospector / sqlite3', (group) => {
  configureDatabaseTests(
    group,
    () => ({
      client: 'better-sqlite3',
      connection: {
        filename: ':memory:',
      },
      useNullAsDefault: true,
    }),
    SQLite3Introspector
  )
})

test.group('DatabaseIntrospector / postgres', (group) => {
  let container: StartedTestContainer

  group.tap((t) => t.timeout(60_000))

  group.setup(async () => {
    container = await POSTGRES_CONTAINER.start()
  })

  group.teardown(async () => {
    await container.stop()
  })

  configureDatabaseTests(
    group,
    () => ({
      client: 'pg',
      connection: {
        host: container.getHost(),
        port: container.getFirstMappedPort(),
        user: 'test',
        password: 'test',
        database: 'test_db',
      },
      searchPath: ['public'],
    }),
    PostgresIntrospector
  )
})
