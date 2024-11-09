import { test } from '@japa/runner'
import { LuxonDateTimeScalar } from '../src/scalars/luxon_datetime.js'
import { DateTime } from 'luxon'

test.group('Luxon DateTime', () => {
  test('parse', ({ assert }) => {
    const iso = '2024-11-09T02:16:35.240+01:00'
    assert.equal(LuxonDateTimeScalar.parseValue(iso).toISO(), iso)

    assert.equal(LuxonDateTimeScalar.parseValue('invalid date').toISO(), null)

    assert.throws(() => LuxonDateTimeScalar.parseValue(123457))
  })

  test('serialize', ({ assert }) => {
    const date = DateTime.now()

    assert.equal(LuxonDateTimeScalar.serialize(date), date.toISO())
    assert.throws(() => LuxonDateTimeScalar.serialize('not a DateTime'))
    assert.throws(() => LuxonDateTimeScalar.serialize(DateTime.fromISO('not an iso')))
  })
})
