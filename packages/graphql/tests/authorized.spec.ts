import { test } from '@japa/runner'
import { graphql, type GraphQLSchema } from 'graphql'
import { buildSchema, Field, FieldResolver, ObjectType, Query, Resolver, Root } from 'type-graphql'
import { Bouncer, allowGuest, BasePolicy } from '@adonisjs/bouncer'
import { Authorized } from '../src/decorators/authorized.js'
import { authChecker } from '../src/auth_checker.js'

interface TestUser {
  id: number
  isAdmin?: boolean
}

class RecipePolicy extends BasePolicy {
  view(user: TestUser, recipe: { authorId: number }) {
    return user.id === recipe.authorId
  }

  @allowGuest()
  list() {
    return true
  }
}

const isAuthor = Bouncer.ability(
  (user: TestUser, recipe: { authorId: number }) => user.id === recipe.authorId
)

const isAdmin = Bouncer.ability((user: TestUser) => user.isAdmin === true)

let capturedRoot: unknown = 'sentinel'
const captureRoot = Bouncer.ability({ allowGuest: true }, (_user: TestUser | null, root: any) => {
  capturedRoot = root
  return true
})

@ObjectType()
class Recipe {
  declare authorId: number

  @Field()
  declare title: string

  @Field()
  @Authorized(RecipePolicy, 'view')
  declare secret: string

  @Field()
  @Authorized([isAuthor])
  declare notes: string
}

@Resolver()
class RecipeResolver {
  @Query(() => Recipe)
  recipe() {
    return Object.assign(new Recipe(), {
      authorId: 1,
      title: 'Ratatouille',
      secret: 'thyme',
      notes: 'simmer slowly',
    })
  }

  @Query(() => String)
  @Authorized(RecipePolicy, 'list')
  recipeCount() {
    return '42'
  }

  @Query(() => String)
  @Authorized([captureRoot])
  rootProbe() {
    return 'probed'
  }
}

@Resolver(() => Recipe)
class RecipeFieldsResolver {
  @FieldResolver(() => String)
  @Authorized([isAuthor])
  computedSecret(@Root() recipe: Recipe) {
    return `${recipe.title} secret`
  }
}

@Resolver()
@Authorized([isAdmin])
class AdminResolver {
  @Query(() => String)
  adminReport() {
    return 'report'
  }

  @Query(() => String)
  @Authorized()
  memberReport() {
    return 'member report'
  }
}

function createContext(user: TestUser | null) {
  return {
    auth: {
      check: async () => user !== null,
      user,
    },
    bouncer: new Bouncer(() => user),
  }
}

let schema: GraphQLSchema

test.group('Authorized decorator', (group) => {
  group.setup(async () => {
    schema = await buildSchema({
      resolvers: [RecipeResolver, RecipeFieldsResolver, AdminResolver],
      authChecker,
    })
  })

  test('allows policy protected fields when the policy passes', async ({ expect }) => {
    const result = await graphql({
      schema,
      source: '{ recipe { title secret } }',
      contextValue: createContext({ id: 1 }),
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.recipe).toEqual({ title: 'Ratatouille', secret: 'thyme' })
  })

  test('rejects policy protected fields when the policy denies', async ({ expect }) => {
    const result = await graphql({
      schema,
      source: '{ recipe { title secret } }',
      contextValue: createContext({ id: 2 }),
    })

    expect(result.errors).toBeDefined()
    expect(result.errors?.[0]?.path).toEqual(['recipe', 'secret'])
  })

  test('passes the parent object to abilities on fields', async ({ expect }) => {
    const allowed = await graphql({
      schema,
      source: '{ recipe { notes } }',
      contextValue: createContext({ id: 1 }),
    })
    expect(allowed.errors).toBeUndefined()
    expect(allowed.data?.recipe).toEqual({ notes: 'simmer slowly' })

    const denied = await graphql({
      schema,
      source: '{ recipe { notes } }',
      contextValue: createContext({ id: 2 }),
    })
    expect(denied.errors).toBeDefined()
  })

  test('allows guests on policy methods marked with allowGuest', async ({ expect }) => {
    const result = await graphql({
      schema,
      source: '{ recipeCount }',
      contextValue: createContext(null),
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.recipeCount).toBe('42')
  })

  test('rejects guests on policy methods without allowGuest', async ({ expect }) => {
    const result = await graphql({
      schema,
      source: '{ recipe { secret } }',
      contextValue: createContext(null),
    })

    expect(result.errors).toBeDefined()
  })

  test('passes the parent object to abilities on field resolvers', async ({ expect }) => {
    const allowed = await graphql({
      schema,
      source: '{ recipe { computedSecret } }',
      contextValue: createContext({ id: 1 }),
    })
    expect(allowed.errors).toBeUndefined()
    expect(allowed.data?.recipe).toEqual({ computedSecret: 'Ratatouille secret' })

    const denied = await graphql({
      schema,
      source: '{ recipe { computedSecret } }',
      contextValue: createContext({ id: 2 }),
    })
    expect(denied.errors).toBeDefined()
  })

  test('receives undefined instead of a parent object on queries', async ({ expect }) => {
    capturedRoot = 'sentinel'

    const result = await graphql({
      schema,
      source: '{ rootProbe }',
      contextValue: createContext({ id: 1 }),
    })

    expect(result.errors).toBeUndefined()
    expect(capturedRoot).toBeUndefined()
  })

  test('applies class level rules to every operation of the resolver', async ({ expect }) => {
    const denied = await graphql({
      schema,
      source: '{ adminReport }',
      contextValue: createContext({ id: 1 }),
    })
    expect(denied.errors).toBeDefined()

    const allowed = await graphql({
      schema,
      source: '{ adminReport }',
      contextValue: createContext({ id: 1, isAdmin: true }),
    })
    expect(allowed.errors).toBeUndefined()
    expect(allowed.data?.adminReport).toBe('report')
  })

  test('method level rules replace class level rules', async ({ expect }) => {
    const result = await graphql({
      schema,
      source: '{ memberReport }',
      contextValue: createContext({ id: 1 }),
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.memberReport).toBe('member report')
  })
})
