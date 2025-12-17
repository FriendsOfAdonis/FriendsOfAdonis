import { IgnitorFactory } from '@adonisjs/core/factories'
import { FileSystem } from '@japa/file-system'
import { defineConfig as defineLucidConfig } from '@adonisjs/lucid'
import { copyFile } from 'node:fs/promises'
import path from 'node:path'
import User from './fixtures/user.js'
import { Kernel } from '@adonisjs/core/ace'
import { Assert } from '@japa/assert'
import { GenericContainer } from 'testcontainers'
import { DateTime } from 'luxon'

export const BASE_URL = new URL('./tmp/', import.meta.url)

export const CONTAINERS = {
  meilisearch: new GenericContainer('getmeili/meilisearch:v1.10')
    .withExposedPorts(7700)
    .withHealthCheck({
      test: ['CMD-SHELL', 'curl -f http://localhost:7700/health || exit 1'],
      interval: 1000,
      timeout: 3000,
      retries: 5,
      startPeriod: 1000,
    }),
  typesense: new GenericContainer('typesense/typesense:29.0')
    .withCommand(['--api-key=superrandomkey', '--data-dir=/tmp'])
    .withExposedPorts(8108)
    .withHealthCheck({
      test: ['CMD-SHELL', `curl -f http://localhost:8108/health || exit 1`],
      interval: 1000,
      timeout: 3000,
      retries: 5,
      startPeriod: 1000,
    }),
}

export async function setupApp(
  rcFileContents: Record<string, any> = {},
  config: Record<string, any> = {}
) {
  const ignitor = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .merge({
      rcFileContents,
      config,
    })
    .create(BASE_URL, {
      importer: (filePath) => {
        if (filePath.startsWith('./') || filePath.startsWith('../')) {
          return import(new URL(filePath, BASE_URL).href)
        }

        return import(filePath)
      },
    })

  const app = ignitor.createApp('web')
  await app.init().then(() => app.boot())

  const ace = await app.container.make('ace')
  ace.ui.switchMode('raw')

  return { ace, app }
}

export async function setupFakeAdonisApp(fs: FileSystem, config: Record<string, any>) {
  await setupFakeAdonisProject(fs)
  const { app, ace } = await setupApp(
    {
      commands: [() => import('@adonisjs/lucid/commands')],
      providers: [
        () => import('@adonisjs/lucid/database_provider'),
        () => import('../providers/magnify_provider.js'),
      ],
    },
    {
      database: defineLucidConfig({
        connection: 'sqlite',
        connections: {
          sqlite: {
            client: 'better-sqlite3',
            connection: {
              filename: new URL('./db.sqlite', BASE_URL).pathname,
            },
          },
        },
      }),
      ...config,
    }
  )

  await fs.mkdir('database/migrations')
  await copyFile(
    new URL('./fixtures/migrations/create_users_table.ts', import.meta.url),
    path.join(fs.basePath, 'database/migrations/create_users_table.ts')
  )

  return { app, ace }
}

export async function setupFakeAdonisProject(fs: FileSystem) {
  await Promise.all([
    fs.create('.env', ''),
    fs.createJson('tsconfig.json', {}),
    fs.create('adonisrc.ts', 'export default defineConfig({})'),
    fs.create(
      'start/env.ts',
      `
    import { Env } from '@adonisjs/core/env'

    export default await Env.create(new URL('../', import.meta.url), {})
`
    ),
  ])
}

export async function initializeDatabase(ace: Kernel) {
  User.shouldBeSearchable = false
  await ace.exec('migration:fresh', [])
  await seedDatabase()
  User.shouldBeSearchable = true
}

async function seedDatabase() {
  function* collection() {
    yield { name: 'Adonis Larpor' }

    for (const key of Array(9).keys()) {
      yield { name: `Example ${key + 2}` }
    }

    yield { name: `Larry Casper`, isAdmin: true }
    yield { name: `Reta Larkin` }

    for (const key of Array(7).keys()) {
      yield { name: `Example ${key + 14}` }
    }

    yield { name: 'Prof. Larry Prosacco DVM', isAdmin: true }

    for (const key of Array(18).keys()) {
      yield { name: `Example ${key + 22}` }
    }

    yield { name: 'Linkwood Larkin', isAdmin: true }
    yield { name: 'Otis Larson MD' }
    yield { name: 'Gudrun Larkin' }
    yield { name: 'Dax Larkin' }
    yield { name: 'Dana Larson Sr.' }
    yield { name: 'Amos Larson Sr.' }
  }

  let date = DateTime.now()

  // To ensure proper order we manually set createdAt
  const toCreate = [
    ...Array.from(collection()).map((v) => {
      date = date.minus({ seconds: 1 })
      return {
        ...v,
        createdAt: date,
      }
    }),
  ]

  await User.createMany(toCreate)
}

export function assertSearchResults(assert: Assert, results: any[], expected: [number, string][]) {
  assert.lengthOf(results, expected.length)
  for (const [index, result] of results.entries()) {
    assert.equal(result.id, expected[index][0])
    assert.equal(result.name, expected[index][1])
  }
}

export function sleep(seconds = 1) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, seconds * 1000)
  })
}
