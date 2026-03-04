import { DateTime } from 'luxon'
import { LuxonTypeLoader } from '../../src/loaders/luxon.ts'
import { test } from '@japa/runner'

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
