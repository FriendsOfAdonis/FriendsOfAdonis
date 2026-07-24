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
})
