import { test } from '@japa/runner'
import { createDatabase, createTables } from '../helpers.ts'

test.group('TOTP schema', () => {
  test('configure the columns of the authenticators table', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    const columns = await db.connection().columnsInfo('totp_authenticators')

    assert.sameMembers(Object.keys(columns), [
      'id',
      'tokenable_id',
      'label',
      'secret',
      'backup_codes',
      'last_used_counter',
      'failed_verification_count',
      'locked_until',
      'verified_at',
      'created_at',
    ])

    assert.isTrue(columns.label.nullable)
    assert.isFalse(columns.secret.nullable)
    assert.isFalse(columns.backup_codes.nullable)
    assert.isTrue(columns.last_used_counter.nullable)
    assert.isTrue(columns.locked_until.nullable)
    assert.isTrue(columns.verified_at.nullable)
    assert.isFalse(columns.created_at.nullable)
  })

  test('count the failed verifications from zero', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    await db.table('totp_authenticators').insert({
      tokenable_id: 1,
      secret: 'secret',
      backup_codes: 'codes',
      created_at: new Date().toISOString(),
    })

    const row = await db.from('totp_authenticators').first()
    assert.equal(row.failed_verification_count, 0)
    assert.isNull(row.last_used_counter)
    assert.isNull(row.locked_until)
    assert.isNull(row.verified_at)
  })
})
