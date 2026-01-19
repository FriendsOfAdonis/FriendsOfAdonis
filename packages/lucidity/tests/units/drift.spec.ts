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
            foreignKeys: {},
          },
          posts: {
            columns: {},
            indices: {},
            foreignKeys: {},
          },
        },
      }
    )

    assert.snapshot(result).matchInline(`
      [
        {
          "schema": {
            "columns": {},
            "foreignKeys": {},
            "indices": {},
          },
          "table": "users",
          "type": "table:created",
        },
        {
          "schema": {
            "columns": {},
            "foreignKeys": {},
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
            foreignKeys: {},
          },
          posts: {
            columns: {},
            indices: {},
            foreignKeys: {},
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
                autoIncrement: false,
              },
            },
            indices: {},
            foreignKeys: {},
          },
          posts: {
            columns: {},
            indices: {},
            foreignKeys: {},
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
                "autoIncrement": false,
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
            foreignKeys: {},
          },
          posts: {
            columns: {},
            indices: {},
            foreignKeys: {},
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
            "foreignKeys": {},
            "indices": {},
          },
          "table": "users",
          "type": "table:deleted",
        },
        {
          "schema": {
            "columns": {},
            "foreignKeys": {},
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
        foreignKeys: {},
      },
      {
        columns: {
          id: {
            type: 'varchar',
            isUnique: false,
            isPrimary: true,
            isNullable: false,
            autoIncrement: false,
          },
        },
        indices: {},
        foreignKeys: {},
      }
    )

    assert.snapshot(result).matchInline(`
      [
        {
          "column": "id",
          "schema": {
            "autoIncrement": false,
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
            autoIncrement: false,
          },
        },
        indices: {},
        foreignKeys: {},
      },
      {
        columns: {},
        indices: {},
        foreignKeys: {},
      }
    )

    assert.snapshot(result).matchInline(`
      [
        {
          "column": "id",
          "schema": {
            "autoIncrement": false,
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
