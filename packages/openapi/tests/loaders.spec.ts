import 'reflect-metadata'

import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { LuxonTypeLoader } from '../src/loaders/luxon.js'
import vine from '@vinejs/vine'
import { JSONSchemaLoader } from '../src/loaders/json_schema.ts'
import { StandardJSONSchemaLoader } from '../src/loaders/standard_json_schema.ts'

test('LuxonLoader', async ({ assert }) => {
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

test('JSONSchemaLoader', async ({ assert }) => {
  const context = {
    schemas: {} as Record<string, any>,
    typeLoaders: [],
    logger: console,
  }

  const schema = vine.object({
    title: vine.string(),
  })

  const res = await JSONSchemaLoader(context, schema as any, () => schema)

  assert.deepEqual(res, {
    type: 'object',
    properties: {
      title: {
        type: 'string',
      },
    },
    required: ['title'],
    additionalProperties: false,
  })
})

test('StandardJSONSchemaLoader', async ({ assert }) => {
  const context = {
    schemas: {} as Record<string, any>,
    typeLoaders: [],
    logger: console,
  }

  const schema = vine.create({
    title: vine.string(),
  })

  const res = await StandardJSONSchemaLoader(context, schema as any, () => schema)

  assert.deepEqual(res, {
    type: 'object',
    properties: {
      title: {
        type: 'string',
      },
    },
    required: ['title'],
    additionalProperties: false,
  })
})
