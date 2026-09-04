import { test } from '@japa/runner'
import type { RouteJSON } from '@adonisjs/core/types/http'
import { RouterLoader } from '../src/loader.ts'
import { OperationParameterMetadataStorage } from '@martin.xyz/openapi-decorators/metadata'
import { ApiParam } from '@martin.xyz/openapi-decorators/decorators'

function createLoader() {
  return new RouterLoader(
    {} as unknown as ConstructorParameters<typeof RouterLoader>[0],
    console as unknown as ConstructorParameters<typeof RouterLoader>[1],
    () => []
  )
}

// Builds a minimal `GET /api/devices/...` route for a controller method with the given path
// parameters — only the fields `loadRouteController` reads.
function route(target: Function, propertyKey: string, ...paramNames: string[]): RouteJSON {
  const tokens = [
    { type: 0, val: 'api' },
    { type: 0, val: 'devices' },
    ...paramNames.map((val) => ({ type: 1, val })),
  ]

  return {
    pattern: '/' + tokens.map((t) => (t.type === 1 ? `:${t.val}` : t.val)).join('/'),
    methods: ['GET', 'HEAD'],
    handler: { reference: [target, propertyKey] },
    tokens,
  } as unknown as RouteJSON
}

test.group('RouterLoader', () => {
  test('marks auto-discovered path parameters as required', async ({ assert }) => {
    class DevicesController {
      show() {}
    }

    // Minimal route for `GET /api/devices/:id` — only the fields the loader reads.
    const route = {
      pattern: '/api/devices/:id',
      methods: ['GET', 'HEAD'],
      handler: { reference: [DevicesController, 'show'] },
      tokens: [
        { type: 0, val: 'api' },
        { type: 0, val: 'devices' },
        { type: 1, val: 'id' },
      ],
    } as unknown as RouteJSON

    await createLoader().loadRouteController(route)

    const parameters = OperationParameterMetadataStorage.getMetadata(
      DevicesController.prototype,
      'show'
    )

    // Path parameters are always required per the OpenAPI Specification.
    assert.lengthOf(parameters, 1)
    assert.deepEqual(parameters[0], {
      in: 'path',
      type: 'string',
      name: 'id',
      required: true,
    })
  })

  test('does not duplicate path parameters across multiple loads', async ({ assert }) => {
    class DevicesController {
      show() {}
    }

    const route = {
      pattern: '/api/devices/:id',
      methods: ['GET', 'HEAD'],
      handler: { reference: [DevicesController, 'show'] },
      tokens: [
        { type: 0, val: 'api' },
        { type: 0, val: 'devices' },
        { type: 1, val: 'id' },
      ],
    } as unknown as RouteJSON

    // The metadata registry lives for the whole process and is re-scanned on every
    // `buildDocument()` call outside production, so loading the same route more than once
    // must stay idempotent instead of appending a duplicate parameter each time.
    const loader = createLoader()
    await loader.loadRouteController(route)
    await loader.loadRouteController(route)
    await loader.loadRouteController(route)

    const parameters = OperationParameterMetadataStorage.getMetadata(
      DevicesController.prototype,
      'show'
    )

    assert.lengthOf(parameters, 1)
    assert.deepEqual(parameters[0], {
      in: 'path',
      type: 'string',
      name: 'id',
      required: true,
    })
  })

  test('does not duplicate a path parameter already declared with @ApiParam', async ({
    assert,
  }) => {
    class DevicesController {
      @ApiParam({ name: 'id', description: 'The device identifier' })
      show() {}
    }

    const route = {
      pattern: '/api/devices/:id',
      methods: ['GET', 'HEAD'],
      handler: { reference: [DevicesController, 'show'] },
      tokens: [
        { type: 0, val: 'api' },
        { type: 0, val: 'devices' },
        { type: 1, val: 'id' },
      ],
    } as unknown as RouteJSON

    await createLoader().loadRouteController(route)

    const parameters = OperationParameterMetadataStorage.getMetadata(
      DevicesController.prototype,
      'show'
    )

    // The user-defined declaration wins; auto-discovery must not append a duplicate.
    assert.lengthOf(parameters, 1)
    assert.deepEqual(parameters[0], {
      in: 'path',
      name: 'id',
      description: 'The device identifier',
    })
  })

  test('reflects a renamed path parameter instead of keeping the stale one', async ({
    assert,
  }) => {
    class DevicesController {
      show() {}
    }

    // Simulates the route pattern changing between two scans of the same process, e.g. `:id`
    // renamed to `:deviceId`. Deduping must not simply keep the first-seen parameter: the current
    // route no longer declares `id`, so the emitted spec must reflect only `deviceId`.
    const loader = createLoader()
    await loader.loadRouteController(route(DevicesController, 'show', 'id'))
    await loader.loadRouteController(route(DevicesController, 'show', 'deviceId'))

    const parameters = OperationParameterMetadataStorage.getMetadata(
      DevicesController.prototype,
      'show'
    )

    assert.lengthOf(parameters, 1)
    assert.deepEqual(parameters[0], {
      in: 'path',
      type: 'string',
      name: 'deviceId',
      required: true,
    })
  })

  test('tracks the current set of path parameters as it changes between loads', async ({
    assert,
  }) => {
    class DevicesController {
      show() {}
    }

    const loader = createLoader()

    // A nested parameter is added...
    await loader.loadRouteController(route(DevicesController, 'show', 'id'))
    await loader.loadRouteController(route(DevicesController, 'show', 'id', 'sensorId'))

    let parameters = OperationParameterMetadataStorage.getMetadata(
      DevicesController.prototype,
      'show'
    )

    // ...both are present, the stable `id` is not duplicated.
    assert.deepEqual(
      parameters.map((p) => p.name),
      ['id', 'sensorId']
    )

    // ...then removed again on a later scan.
    await loader.loadRouteController(route(DevicesController, 'show', 'id'))

    parameters = OperationParameterMetadataStorage.getMetadata(DevicesController.prototype, 'show')

    assert.deepEqual(
      parameters.map((p) => p.name),
      ['id']
    )
  })

  test('preserves a user-declared @ApiParam across repeated loads', async ({ assert }) => {
    class DevicesController {
      @ApiParam({ name: 'id', description: 'The device identifier' })
      show() {}
    }

    // Re-scanning must never drop the user's declaration while pruning auto-discovered entries.
    const loader = createLoader()
    await loader.loadRouteController(route(DevicesController, 'show', 'id'))
    await loader.loadRouteController(route(DevicesController, 'show', 'id'))
    await loader.loadRouteController(route(DevicesController, 'show', 'id'))

    const parameters = OperationParameterMetadataStorage.getMetadata(
      DevicesController.prototype,
      'show'
    )

    assert.lengthOf(parameters, 1)
    assert.deepEqual(parameters[0], {
      in: 'path',
      name: 'id',
      description: 'The device identifier',
    })
  })
})
