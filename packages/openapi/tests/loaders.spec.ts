import 'reflect-metadata'

import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { LuxonTypeLoader } from '../src/loaders/luxon.js'
import vine from '@vinejs/vine'
import { validatorToSchema, VineTypeLoader } from '../src/loaders/vine.js'
import { HttpRouterService } from '@adonisjs/core/types'
import { RouteJSON } from '@adonisjs/core/types/http'
import { OperationMetadataStorage } from 'openapi-metadata/metadata'
import { RouterLoader } from '../src/loader.js'
import app from '@adonisjs/core/services/app'

test.group('Luxon', () => {
  test('DateTime', async ({ assert }) => {
    const context = {
      schemas: {},
      typeLoaders: [],
      logger: console,
    }
    assert.deepEqual(await LuxonTypeLoader(context, DateTime), { type: 'string' })
    assert.deepEqual(await LuxonTypeLoader(context, DateTime.now().constructor), { type: 'string' })
    assert.deepEqual(await LuxonTypeLoader(context, 'string'), undefined)
    assert.deepEqual(await LuxonTypeLoader(context, new Date() as any), undefined)

    function FakeDecorator() {
      return (_target: Object, _propertyKey: string) => {}
    }

    class Fake {
      @FakeDecorator()
      declare date: DateTime
    }

    const type = Reflect.getMetadata('design:type', Fake.prototype, 'date')
    assert.deepEqual(await LuxonTypeLoader(context, type), { type: 'string' })
  })
})

test.group('Vine', () => {
  test('Loader', async ({ assert }) => {
    const context = {
      schemas: {} as Record<string, any>,
      typeLoaders: [],
      logger: console,
    }

    const validator = vine.compile(
      vine.object({
        title: vine.string(),
      })
    )

    const res = await VineTypeLoader(context, validator as any, () => validator)
    assert.deepEqual(res, {
      $ref: '#/components/schemas/validator',
    })

    assert.deepEqual(context.schemas['validator'], {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
      },
      required: ['title'],
    })
  })

  test('validatorToSchema', async ({ assert }) => {
    assert.deepEqual(
      await validatorToSchema(
        vine.compile(
          vine.object({
            optional: vine.string().optional(),
            required: vine.string(),
            number: vine.number().optional(),
            boolean: vine.boolean().optional(),
          })
        )
      ),
      {
        type: 'object',
        properties: {
          optional: {
            type: 'string',
          },
          required: {
            type: 'string',
          },
          number: {
            type: 'number',
          },
          boolean: {
            type: 'boolean',
          },
        },
        required: ['required'],
      }
    )

    // Empty
    assert.deepEqual(await validatorToSchema(vine.compile(vine.object({}))), {
      type: 'object',
    })

    // Array
    assert.deepEqual(
      await validatorToSchema(
        vine.compile(
          vine.object({
            list: vine.array(vine.object({})),
          })
        )
      ),
      {
        type: 'object',
        properties: {
          list: {
            type: 'array',
            items: {
              type: 'object',
            },
          },
        },
        required: ['list'],
      }
    )

    // Nested
    assert.deepEqual(
      await validatorToSchema(
        vine.compile(
          vine.object({
            object: vine.object({}),
            list: vine.array(vine.string()),
          })
        )
      ),
      {
        type: 'object',
        properties: {
          object: {
            type: 'object',
          },
          list: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        required: ['object', 'list'],
      }
    )

    // Rules
    assert.deepEqual(
      await validatorToSchema(
        vine.compile(
          vine.object({
            string: vine.string().minLength(1).maxLength(6),
            number: vine.number().min(1).max(6),
          })
        )
      ),
      {
        type: 'object',
        properties: {
          string: {
            type: 'string',
            minimum: 1,
            maximum: 6,
          },
          number: {
            type: 'number',
            minimum: 1,
            maximum: 6,
          },
        },
        required: ['string', 'number'],
      }
    )
  })
})

test.group('RouterLoader', (group) => {
  let routerService: HttpRouterService
  let logger: any

  group.setup(async () => {
    await app.boot()
    routerService = await app.container.make('router')
    logger = { warn: () => {}, info: () => {}, error: () => {} } // Mock logger
  })

  test('should correctly format path parameters', async ({ assert }) => {
    const loader = new RouterLoader(routerService, logger as any)

    // Mock a controller
    class UsersController {
      handle() {}
      show() {}
      showSubscription() {}
      showAll() {}
    }

    const routes: Partial<RouteJSON>[] = [
      {
        pattern: '/api/users/:id',
        // @ts-expect-error For testing purposes, we only need the reference
        handler: { reference: [UsersController, 'show'] },
        methods: ['GET'],
      },
      {
        pattern: '/api/users/:userId/subscriptions/:subscriptionId',
        // @ts-expect-error For testing purposes, we only need the reference
        handler: { reference: [UsersController, 'showSubscription'] },
        methods: ['GET'],
      },
      {
        pattern: '/api/users/*',
        // @ts-expect-error For testing purposes, we only need the reference
        handler: { reference: [UsersController, 'showAll'] },
        methods: ['GET'],
      },
    ]

    for (const route of routes) {
      await loader.loadRouteController(route as RouteJSON)
    }

    const metadataShow = OperationMetadataStorage.getMetadata(UsersController.prototype, 'show')
    assert.deepEqual(metadataShow?.path, '/api/users/{id}')

    const metadataShowSubscription = OperationMetadataStorage.getMetadata(
      UsersController.prototype,
      'showSubscription'
    )
    assert.deepEqual(
      metadataShowSubscription?.path,
      '/api/users/{userId}/subscriptions/{subscriptionId}'
    )

    const metadataShowAll = OperationMetadataStorage.getMetadata(
      UsersController.prototype,
      'showAll'
    )
    assert.deepEqual(metadataShowAll?.path, '/api/users/*') // Wildcard should remain as is
  })
})
