import { test } from '@japa/runner'
import { analyseDatabaseDrift, analyseTableDrift } from '../../src/ddl/drift.ts'

test.group('analyseDatabaseDrift', () => {
  test('should identify new tables', ({ assert }) => {
    const result = analyseDatabaseDrift(
      {
        tables: {},
      },
      {
        tables: {
          users: {
            columns: {},
            indices: {},
          },
          posts: {
            columns: {},
            indices: {},
          },
        },
      }
    )

    assert.snapshot(result).matchInline(`
      [
        {
          "schema": {
            "columns": {},
            "indices": {},
          },
          "table": "users",
          "type": "table:created",
        },
        {
          "schema": {
            "columns": {},
            "indices": {},
          },
          "table": "posts",
          "type": "table:created",
        },
      ]
    `)
  })

  test('should identify altered tables', ({ assert }) => {
    const result = analyseDatabaseDrift(
      {
        tables: {
          users: {
            columns: {},
            indices: {},
          },
          posts: {
            columns: {},
            indices: {},
          },
        },
      },
      {
        tables: {
          users: {
            columns: {
              id: {
                type: 'integer',
                isUnique: false,
                isNullable: false,
                isPrimary: true,
              },
            },
            indices: {},
          },
          posts: {
            columns: {},
            indices: {},
          },
        },
      }
    )

    assert.snapshot(result).matchInline(`
      [
        {
          "drifts": [
            {
              "column": "id",
              "schema": {
                "isNullable": false,
                "isPrimary": true,
                "isUnique": false,
                "type": "integer",
              },
              "type": "column:created",
            },
          ],
          "table": "users",
          "type": "table:altered",
        },
      ]
    `)
  })

  test('should identify deleted tables', ({ assert }) => {
    const result = analyseDatabaseDrift(
      {
        tables: {
          users: {
            columns: {},
            indices: {},
          },
          posts: {
            columns: {},
            indices: {},
          },
        },
      },
      {
        tables: {},
      }
    )

    assert.snapshot(result).matchInline(`
      [
        {
          "schema": {
            "columns": {},
            "indices": {},
          },
          "table": "users",
          "type": "table:deleted",
        },
        {
          "schema": {
            "columns": {},
            "indices": {},
          },
          "table": "posts",
          "type": "table:deleted",
        },
      ]
    `)
  })
})

test.group('analyseTableDrift', () => {
  test('should identify new columns', ({ assert }) => {
    const result = analyseTableDrift(
      {
        columns: {},
        indices: {},
      },
      {
        columns: {
          id: {
            type: 'varchar',
            isUnique: false,
            isPrimary: true,
            isNullable: false,
          },
        },
        indices: {},
      }
    )

    assert.snapshot(result).matchInline(`
      [
        {
          "column": "id",
          "schema": {
            "isNullable": false,
            "isPrimary": true,
            "isUnique": false,
            "type": "varchar",
          },
          "type": "column:created",
        },
      ]
    `)
  })

  test('should identify deleted columns', ({ assert }) => {
    const result = analyseTableDrift(
      {
        columns: {
          id: {
            type: 'varchar',
            isUnique: false,
            isPrimary: true,
            isNullable: false,
          },
        },
        indices: {},
      },
      {
        columns: {},
        indices: {},
      }
    )

    assert.snapshot(result).matchInline(`
      [
        {
          "column": "id",
          "schema": {
            "isNullable": false,
            "isPrimary": true,
            "isUnique": false,
            "type": "varchar",
          },
          "type": "column:deleted",
        },
      ]
    `)
  })
})
