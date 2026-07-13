import { test } from '@japa/runner'
import type { RouteJSON } from '@adonisjs/core/types/http'
import { RouterLoader } from '../src/loader.ts'
import { OperationParameterMetadataStorage } from '@martin.xyz/openapi-decorators/metadata'

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

    const loader = new RouterLoader(
      {} as unknown as ConstructorParameters<typeof RouterLoader>[0],
      console as unknown as ConstructorParameters<typeof RouterLoader>[1],
      () => []
    )

    await loader.loadRouteController(route)

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
})
