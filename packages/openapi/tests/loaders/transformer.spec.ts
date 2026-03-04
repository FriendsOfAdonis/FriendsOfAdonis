import { BaseTransformer } from '@adonisjs/core/transformers'
import { type SimplePaginatorMetaKeys } from '@adonisjs/lucid/types/querybuilder'
import { test } from '@japa/runner'
import {
  TransformerTypeLoader as TransformerTypeLoader,
  OpenAPISerializer,
  PaginationMetadataSchema,
  LUCID_PAGINATOR_METADATA_SCHEMA,
} from '../../src/loaders/transformer.ts'
import { ApiProperty } from '@martin.xyz/openapi-decorators/decorators'
import { ClassTypeLoader, PrimitiveTypeLoader } from '@martin.xyz/openapi-decorators/loaders'
import { Context, loadType } from '@martin.xyz/openapi-decorators'

class WrapApiSerializer extends OpenAPISerializer<{
  Wrap: 'data'
  PaginationMetaData: SimplePaginatorMetaKeys
}> {
  wrap: 'data' = 'data'

  definePaginationMetaData(metaData: unknown): SimplePaginatorMetaKeys {
    if (!this.isLucidPaginatorMetaData(metaData)) {
      throw new Error(
        'Invalid pagination metadata. Expected metadata to contain Lucid pagination keys'
      )
    }

    return metaData
  }

  definePaginationMetaDataSchema(): PaginationMetadataSchema<SimplePaginatorMetaKeys> {
    return LUCID_PAGINATOR_METADATA_SCHEMA
  }
}

class WithoutWrapApiSerializer extends OpenAPISerializer<{
  PaginationMetaData: SimplePaginatorMetaKeys
}> {
  wrap: undefined

  definePaginationMetaData(metaData: unknown): SimplePaginatorMetaKeys {
    if (!this.isLucidPaginatorMetaData(metaData)) {
      throw new Error(
        'Invalid pagination metadata. Expected metadata to contain Lucid pagination keys'
      )
    }

    return metaData
  }

  definePaginationMetaDataSchema(): PaginationMetadataSchema<SimplePaginatorMetaKeys> {
    return LUCID_PAGINATOR_METADATA_SCHEMA
  }
}

class User {
  @ApiProperty()
  declare id: string

  @ApiProperty()
  declare email: string

  @ApiProperty({ type: () => [Post] })
  declare posts: Post[]
}

class Post {
  @ApiProperty()
  declare id: number

  @ApiProperty()
  declare title: string

  @ApiProperty()
  declare description: string

  @ApiProperty({ type: () => User })
  declare user: User
}

class PostTransformer extends BaseTransformer<Post> {
  toObject() {
    return {
      ...this.pick(this.resource, ['id', 'title']),
      user: UserTransformer.transform(this.resource.user).depth(2),
    }
  }
}

class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return {
      ...this.pick(this.resource, ['email']),
      posts: PostTransformer.transform(this.resource.posts),
    }
  }
}

const withWrapSerializer = new WrapApiSerializer()
const withoutWrapSerializer = new WithoutWrapApiSerializer()

test.group('TransformerTypeLoader', () => {
  test('should serialize with data wrapper', async ({ assert }) => {
    const context: Context = {
      schemas: {},
      typeLoaders: [
        PrimitiveTypeLoader,
        TransformerTypeLoader({ serializer: withWrapSerializer }),
        ClassTypeLoader,
      ],
      logger: console,
    }

    const result = await loadType(context, { type: PostTransformer.schema(Post) })

    assert.deepEqual(result, {
      type: 'object',
      properties: {
        data: {
          $ref: '#/components/schemas/PostObject',
        },
      },
      required: ['data'],
    })

    assert.deepEqual(context.schemas.PostObject, {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        user: { $ref: '#/components/schemas/UserObject' },
      },
      required: ['id', 'title', 'user'],
    })

    assert.deepEqual(context.schemas.UserObject, {
      type: 'object',
      properties: {
        email: { type: 'string' },
        posts: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/PostObject',
          },
        },
      },
      required: ['email', 'posts'],
    })
  })

  test('should serialize without data wrapper', async ({ assert }) => {
    const context: Context = {
      schemas: {},
      typeLoaders: [
        PrimitiveTypeLoader,
        TransformerTypeLoader({ serializer: withoutWrapSerializer }),
        ClassTypeLoader,
      ],
      logger: console,
    }

    const result = await loadType(context, { type: PostTransformer.schema(Post) })

    assert.deepEqual(result, { $ref: '#/components/schemas/PostObject' })

    assert.deepEqual(context.schemas.PostObject, {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        user: { $ref: '#/components/schemas/UserObject' },
      },
      required: ['id', 'title', 'user'],
    })

    assert.deepEqual(context.schemas.UserObject, {
      type: 'object',
      properties: {
        email: { type: 'string' },
        posts: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/PostObject',
          },
        },
      },
      required: ['email', 'posts'],
    })
  })

  test('should serialize collection with data wrapper', async ({ assert }) => {
    const context: Context = {
      schemas: {},
      typeLoaders: [
        PrimitiveTypeLoader,
        TransformerTypeLoader({ serializer: withWrapSerializer }),
        ClassTypeLoader,
      ],
      logger: console,
    }

    const result = await loadType(context, { type: PostTransformer.schema([Post]) })

    assert.deepEqual(result, {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/PostObject' } },
      },
      required: ['data'],
    })
  })

  test('should serialize collection without data wrapper', async ({ assert }) => {
    const context: Context = {
      schemas: {},
      typeLoaders: [
        PrimitiveTypeLoader,
        TransformerTypeLoader({ serializer: withoutWrapSerializer }),
        ClassTypeLoader,
      ],
      logger: console,
    }

    const result = await loadType(context, { type: PostTransformer.schema([Post]) })

    assert.deepEqual(result, { type: 'array', items: { $ref: '#/components/schemas/PostObject' } })
  })

  test('should serialize paginated data', async ({ assert }) => {
    const context: Context = {
      schemas: {},
      typeLoaders: [
        PrimitiveTypeLoader,
        TransformerTypeLoader({ serializer: withoutWrapSerializer }),
        ClassTypeLoader,
      ],
      logger: console,
    }

    const result = await loadType(context, { type: PostTransformer.schema(Post, true) })

    assert.deepEqual(result, {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/PostObject' } },
        metadata: withoutWrapSerializer.definePaginationMetaDataSchema(),
      },
      required: ['data', 'metadata'],
    })
  })
})
