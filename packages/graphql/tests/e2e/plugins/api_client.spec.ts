import { test } from '@japa/runner'
import { pluginOptions, setupApp, type SetupAppOptions } from '../../helpers.js'
import { defineConfig, drivers } from '../../../src/define_config.js'
import { defineConfig as defineBodyParserConfig } from '@adonisjs/core/bodyparser'
import { TestResolver } from '../../fixtures/test_resolver.js'
import { UploadResolver } from '../../fixtures/upload_resolver.js'
import { parse } from 'graphql'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { ApplicationService } from '@adonisjs/core/types'

/**
 * GraphQL drivers exercised by the plugin tests.
 */
type Driver = 'apollo' | 'yoga'

/**
 * Options of the application booted for a plugin test.
 */
interface PluginAppOptions extends SetupAppOptions {
  /**
   * Path of the GraphQL endpoint. Defaults to `/graphql`.
   */
  path?: string

  /**
   * Registers the GraphQL route. Defaults to `graphql.registerRoute`.
   */
  registerRoute?: (app: ApplicationService) => Promise<void>
}

/**
 * Registers the GraphQL handler under an unnamed route so the
 * plugin cannot resolve it from the `graphql` route name.
 */
async function registerUnnamedRoute(app: ApplicationService) {
  const graphql = await app.container.make('graphql')
  const router = await app.container.make('router')
  router.post('/custom', (ctx) => graphql.handle(ctx))
}

/**
 * Boots an application serving the test resolvers with the given driver.
 */
async function setupPluginApp(driver: Driver, options: PluginAppOptions = {}) {
  const path = options.path ?? '/graphql'
  const graphqlConfig =
    driver === 'apollo'
      ? defineConfig({ path, driver: drivers.apollo({}), pubSub: drivers.pubsub.native() })
      : defineConfig({
          path,
          driver: drivers.yoga({ graphqlEndpoint: path }),
          pubSub: drivers.pubsub.native(),
        })

  return setupApp(
    (factory) =>
      factory.merge({
        config: {
          graphql: graphqlConfig,
          bodyparser: defineBodyParserConfig({
            multipart: {
              autoProcess: true,
              processManually: [path],
            },
          }),
        },
      }),
    (app) => {
      app.booted(async () => {
        const graphql = await app.container.make('graphql')
        const router = await app.container.make('router')
        graphql.resolvers([
          () => Promise.resolve({ default: TestResolver }),
          () => Promise.resolve({ default: UploadResolver }),
        ])

        if (options.registerRoute) {
          await options.registerRoute(app)
        } else {
          graphql.registerRoute(router)
        }
      })
    },
    options
  )
}

for (const driver of ['apollo', 'yoga'] as const) {
  test.group(`graphqlApiClient | ${driver}`, (group) => {
    let terminate: () => Promise<void>

    group.each.setup(async () => {
      const { app } = await setupPluginApp(driver)
      terminate = () => app.terminate()
      return terminate
    })

    test('query returns data', async ({ client }) => {
      const response = await client.query(
        `query TestQuery($name: String!) { testQuery(name: $name) }`,
        { name: 'AdonisJS' }
      )

      response.assertNoErrors()
      response.assertData({ testQuery: 'Hello AdonisJS' })
    })

    test('mutation returns data', async ({ client }) => {
      const response = await client.mutate(`mutation { testMutation }`)

      response.assertNoErrors()
      response.assertData({ testMutation: true })
    })

    test('accepts a DocumentNode', async ({ client }) => {
      const response = await client.query(parse(`query { testQuery(name: "Doc") }`))

      response.assertNoErrors()
      response.assertData({ testQuery: 'Hello Doc' })
    })

    test('assertDataContains matches a subset', async ({ client }) => {
      const response = await client.query(`query { testQuery(name: "A") testMutation: __typename }`)

      response.assertDataContains({ testQuery: 'Hello A' })
    })

    test('exposes validation errors', async ({ client }) => {
      const response = await client.query(`query { unknownField }`)

      response.assertErrors()
      response.assertErrors(1)
      response.assertErrorCode('GRAPHQL_VALIDATION_FAILED')
      response.assertErrorMessage(/Cannot query field "unknownField"/)
      response.assertErrorMessage(response.errors[0].message)
    })

    test('assertNoErrors fails on a response with errors', async ({ client, assert }) => {
      const response = await client.query(`query { unknownField }`)

      assert.throws(() => response.assertNoErrors(), /Cannot query field "unknownField"/)
    })

    test('assertNoErrors fails on a non GraphQL response', async ({ client, assert }) => {
      const response = await client.get('/nowhere')

      assert.throws(
        () => response.assertNoErrors(),
        /Expected a GraphQL response, received status 404/
      )
    })

    test('error assertions fail with the formatted error list', async ({ client, assert }) => {
      const response = await client.query(`query { unknownField }`)

      assert.throws(
        () => response.assertErrorCode('UNAUTHENTICATED'),
        /code: GRAPHQL_VALIDATION_FAILED/
      )
      assert.throws(() => response.assertErrors(2), /Expected 2 GraphQL error\(s\), received 1/)
    })

    test('sends queries over GET', async ({ client }) => {
      const response = await client.query(
        `query TestQuery($name: String!) { testQuery(name: $name) }`,
        { name: 'GET' },
        { method: 'GET' }
      )

      response.assertNoErrors()
      response.assertData({ testQuery: 'Hello GET' })
    })

    test('uploads files following the multipart spec')
      .run(async ({ client }) => {
        const response = await client
          .mutate(`mutation TestUpload($file: File!) { testUpload(file: $file) }`)
          .upload('file', new File(['Hello Yoga'], 'hello.txt', { type: 'text/plain' }))

        response.assertNoErrors()
        response.assertData({ testUpload: 'hello.txt:Hello Yoga' })
      })
      .skip(driver === 'apollo', 'uploads are only supported by the Yoga driver')

    test('uploads a Buffer without a filename as a file')
      .run(async ({ client }) => {
        const response = await client
          .mutate(`mutation TestUpload($file: File!) { testUpload(file: $file) }`)
          .upload('file', Buffer.from('Hello Buffer'))

        response.assertNoErrors()
        response.assertData({ testUpload: 'file:Hello Buffer' })
      })
      .skip(driver === 'apollo', 'uploads are only supported by the Yoga driver')

    test('uploads a list of files using indexed paths')
      .run(async ({ client }) => {
        const response = await client
          .mutate(`mutation TestUploads($files: [File!]!) { testUploads(files: $files) }`)
          .upload('files.0', new File(['One'], 'one.txt'))
          .upload('files.1', new File(['Two'], 'two.txt'))

        response.assertNoErrors()
        response.assertData({ testUploads: ['one.txt:One', 'two.txt:Two'] })
      })
      .skip(driver === 'apollo', 'uploads are only supported by the Yoga driver')

    test('rejects uploads over GET', async ({ client, assert }) => {
      await assert.rejects(
        () =>
          client
            .query(
              `mutation TestUpload($file: File!) { testUpload(file: $file) }`,
              {},
              { method: 'GET' }
            )
            .upload('file', Buffer.from('Hello'))
            .send(),
        /File uploads cannot be sent over GET/
      )
    })

    test('rejects uploads with an actionable error')
      .run(async ({ client, assert }) => {
        await assert.rejects(
          () =>
            client
              .mutate(`mutation TestUpload($file: File!) { testUpload(file: $file) }`)
              .upload('file', new File(['Hello Apollo'], 'hello.txt', { type: 'text/plain' }))
              .send(),
          /File uploads are not supported by the Apollo driver/
        )
      })
      .skip(driver === 'yoga', 'only the Apollo driver rejects uploads')

    test('selects the operation with operationName', async ({ client }) => {
      const response = await client
        .query(
          `query First { testQuery(name: "first") } query Second { testQuery(name: "second") }`
        )
        .operationName('Second')

      response.assertNoErrors()
      response.assertData({ testQuery: 'Hello second' })
    })
  })
}

test.group('graphqlApiClient | lifecycle', () => {
  test('starts the GraphQL server on the first request in the test environment', async ({
    client,
    cleanup,
    assert,
  }) => {
    const { app } = await setupPluginApp('yoga', { environment: 'test' })
    cleanup(() => app.terminate())

    const graphql = await app.container.make('graphql')
    assert.isFalse(graphql.driver.isReady)

    const response = await client.query(`query { testQuery(name: "lazy") }`)

    response.assertNoErrors()
    response.assertData({ testQuery: 'Hello lazy' })
    assert.isTrue(graphql.driver.isReady)
  })

  test('starts the GraphQL server once for concurrent first requests', async ({
    client,
    cleanup,
    assert,
  }) => {
    const { app } = await setupPluginApp('yoga', { environment: 'test' })
    cleanup(() => app.terminate())

    const graphql = await app.container.make('graphql')
    const start = graphql.start.bind(graphql)
    let starts = 0
    graphql.start = async () => {
      starts++
      return start()
    }

    const [first, second] = await Promise.all([
      client.query(`query { testQuery(name: "one") }`),
      client.query(`query { testQuery(name: "two") }`),
    ])

    first.assertData({ testQuery: 'Hello one' })
    second.assertData({ testQuery: 'Hello two' })
    assert.equal(starts, 1)
  })

  test('resolves the endpoint from the named route', async ({ client, cleanup }) => {
    const { app } = await setupPluginApp('yoga', { path: '/api/graphql' })
    cleanup(() => app.terminate())

    const response = await client.query(`query { testQuery(name: "prefixed") }`)

    response.assertNoErrors()
    response.assertData({ testQuery: 'Hello prefixed' })
  })

  test('fails when the named route is missing', async ({ client, cleanup, assert }) => {
    const { app } = await setupPluginApp('yoga', { registerRoute: registerUnnamedRoute })
    cleanup(() => app.terminate())

    await assert.rejects(
      () => client.query(`query { testQuery(name: "custom") }`).send(),
      /Cannot find the "graphql" route/
    )
  })

  test('uses the configured path over the named route', async ({ client, cleanup }) => {
    const { app } = await setupPluginApp('yoga', {
      path: '/custom',
      registerRoute: registerUnnamedRoute,
    })
    pluginOptions.path = '/custom'
    cleanup(() => {
      delete pluginOptions.path
      return app.terminate()
    })

    const response = await client.query(`query { testQuery(name: "custom") }`)

    response.assertNoErrors()
    response.assertData({ testQuery: 'Hello custom' })
  })
})

/**
 * Interface-declared variables, as produced by some code generators.
 */
interface Variables {
  name: string
}

test.group('graphqlApiClient | types', () => {
  test('types data and variables from a TypedDocumentNode', async ({
    client,
    cleanup,
    expectTypeOf,
  }) => {
    const { app } = await setupPluginApp('yoga')
    cleanup(() => app.terminate())

    const document = parse(
      `query TestQuery($name: String!) { testQuery(name: $name) }`
    ) as TypedDocumentNode<{ testQuery: string }, { name: string }>

    const response = await client.query(document, { name: 'Typed' })

    expectTypeOf(response.data).toEqualTypeOf<{ testQuery: string }>()

    const untyped = () => client.query(`query { a }`).then((r) => r.data)
    expectTypeOf(untyped).returns.resolves.toBeAny()

    // @ts-expect-error variables must match the document
    client.query(document, { name: 1 })

    // @ts-expect-error variables are required by the document
    const missing = () => client.query(document)

    const withInterface = () =>
      client.query(document as TypedDocumentNode<{ testQuery: string }, Variables>, { name: 'x' })

    expectTypeOf(missing).toBeFunction()
    expectTypeOf(withInterface).toBeFunction()

    response.assertData({ testQuery: 'Hello Typed' })
  })
})
