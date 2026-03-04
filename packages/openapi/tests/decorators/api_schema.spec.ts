import { test } from '@japa/runner'
import vine from '@vinejs/vine'
import { ApiSchema } from '../../src/decorators/api_schema.ts'
import { generateOperation } from '@martin.xyz/openapi-decorators/generators'
import { OperationMetadataStorage } from '@martin.xyz/openapi-decorators/metadata'

test.group('ApiSchema', () => {
  test('should work', async ({ assert }) => {
    const schema = vine.create({
      firstName: vine.string(),

      qs: vine.object({
        page: vine.number().min(1),
        perPage: vine.number().min(5).max(100),
      }),

      params: vine.object({
        userId: vine.string().uuid(),
      }),

      headers: vine.object({
        'X-Organization-Id': vine.string().uuid(),
      }),

      cookies: vine.object({
        sessionId: vine.string(),
      }),
    })

    class TestController {
      @ApiSchema(schema)
      index() {}
    }

    const result = await generateOperation(
      { schemas: {}, typeLoaders: [], logger: console },
      TestController,
      'index',
      OperationMetadataStorage.getMetadata(TestController)
    )

    assert.deepEqual(result, {
      responses: {},
      security: [],
      parameters: [
        { in: 'path', name: 'userId', schema: { type: 'string', format: 'uuid' } },
        { in: 'query', name: 'page', schema: { type: 'number', minimum: 1 } },
        { in: 'query', name: 'perPage', schema: { type: 'number', minimum: 5, maximum: 100 } },
        { in: 'header', name: 'X-Organization-Id', schema: { type: 'string', format: 'uuid' } },
        { in: 'cookie', name: 'sessionId', schema: { type: 'string' } },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                },
              },
              required: ['firstName'],
              additionalProperties: false,
            },
          },
        },
      },
    })
  })
})
