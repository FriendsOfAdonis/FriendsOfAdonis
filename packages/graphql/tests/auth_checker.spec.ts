import { test } from '@japa/runner'
import { authChecker } from '../src/auth_checker.js'
import { UnavailableFeatureError } from '../src/errors/unavailable_feature.js'
import { Bouncer } from '@adonisjs/bouncer'
import { type BouncerAbility } from '@adonisjs/bouncer/types'

const checker = authChecker as any
test.group('AuthChecker', () => {
  test('throws an error if auth is not configured', async ({ expect }) => {
    await expect(checker({ context: {} })).rejects.toThrow(UnavailableFeatureError)
  })

  test('returns false if not authenticated', async ({ expect }) => {
    await expect(
      checker({
        context: {
          auth: {
            check: () => false,
          },
        },
      })
    ).resolves.toBe(false)
  })

  test('returns true if authenticated', async ({ expect }) => {
    await expect(
      checker({
        context: {
          auth: {
            check: () => true,
          },
        },
      })
    ).resolves.toBe(true)
  })

  test('throws an error if abilities passed without bouncer available', async ({ expect }) => {
    await expect(
      checker(
        {
          context: {
            auth: {
              check: () => true,
            },
          },
        },
        Bouncer.ability(() => false)
      )
    ).rejects.toThrow(UnavailableFeatureError)
  })

  test('returns false if bouncer denies', async ({ expect }) => {
    await expect(
      checker(
        {
          context: {
            auth: {
              check: () => true,
            },
            bouncer: {
              denies(ability: BouncerAbility<any>) {
                return !ability.execute({})
              },
            },
          },
        },
        [Bouncer.ability(() => false)]
      )
    ).resolves.toBe(false)
  })

  test('returns true if bouncer allow', async ({ expect }) => {
    await expect(
      checker(
        {
          context: {
            auth: {
              check: () => true,
            },
            bouncer: {
              denies(ability: BouncerAbility<any>) {
                return !ability.execute({})
              },
            },
          },
        },
        [Bouncer.ability(() => true)]
      )
    ).resolves.toBe(true)
  })

  test('passes the root object to abilities', async ({ expect }) => {
    const user = { id: 1 }
    const context = {
      auth: { check: () => true },
      bouncer: new Bouncer(user),
    }
    const editRecipe = Bouncer.ability(
      (u: { id: number }, recipe: { authorId: number }) => u.id === recipe.authorId
    )

    await expect(checker({ context, root: { authorId: 1 } }, [editRecipe])).resolves.toBe(true)
    await expect(checker({ context, root: { authorId: 2 } }, [editRecipe])).resolves.toBe(false)
  })

  test('authorizes using a policy method and passes the root object', async ({ expect }) => {
    class RecipePolicy {
      edit(u: { id: number }, recipe: { authorId: number }) {
        return u.id === recipe.authorId
      }
    }

    const context = {
      auth: { check: () => true },
      bouncer: new Bouncer({ id: 1 }),
    }

    await expect(
      checker({ context, root: { authorId: 1 } }, [{ policy: RecipePolicy, method: 'edit' }])
    ).resolves.toBe(true)
    await expect(
      checker({ context, root: { authorId: 2 } }, [{ policy: RecipePolicy, method: 'edit' }])
    ).resolves.toBe(false)
  })

  test('lets bouncer decide for guests when rules are provided', async ({ expect }) => {
    const context = {
      auth: { check: () => false },
      bouncer: new Bouncer(() => null),
    }

    await expect(
      checker({ context }, [Bouncer.ability({ allowGuest: true }, () => true)])
    ).resolves.toBe(true)
    await expect(checker({ context }, [Bouncer.ability(() => true)])).resolves.toBe(false)
  })

  test('evaluates guest rules when no authenticator is available', async ({ expect }) => {
    const context = {
      bouncer: new Bouncer(() => null),
    }

    await expect(
      checker({ context }, [Bouncer.ability({ allowGuest: true }, () => true)])
    ).resolves.toBe(true)
    await expect(checker({ context }, [Bouncer.ability(() => true)])).resolves.toBe(false)
  })

  test('requires all rules to pass', async ({ expect }) => {
    class RecipePolicy {
      edit(u: { id: number }, recipe: { authorId: number }) {
        return u.id === recipe.authorId
      }
    }

    const allows = Bouncer.ability(() => true)
    const denies = Bouncer.ability(() => false)
    const context = {
      auth: { check: () => true },
      bouncer: new Bouncer({ id: 1 }),
    }

    await expect(checker({ context }, [allows, denies])).resolves.toBe(false)
    await expect(checker({ context }, [allows, allows])).resolves.toBe(true)
    await expect(
      checker({ context, root: { authorId: 1 } }, [
        allows,
        { policy: RecipePolicy, method: 'edit' },
      ])
    ).resolves.toBe(true)
    await expect(
      checker({ context, root: { authorId: 2 } }, [
        allows,
        { policy: RecipePolicy, method: 'edit' },
      ])
    ).resolves.toBe(false)
  })

  test('resolves pre-registered ability names and passes the root object', async ({ expect }) => {
    const abilities = {
      editRecipe: Bouncer.ability(
        (u: { id: number }, recipe: { authorId: number }) => u.id === recipe.authorId
      ),
    }
    const context = {
      auth: { check: () => true },
      bouncer: new Bouncer({ id: 1 }, abilities),
    }

    await expect(checker({ context, root: { authorId: 1 } }, ['editRecipe'])).resolves.toBe(true)
    await expect(checker({ context, root: { authorId: 2 } }, ['editRecipe'])).resolves.toBe(false)
  })

  test('throws when an invalid rule is provided', async ({ expect }) => {
    const context = {
      auth: { check: () => true },
      bouncer: new Bouncer({ id: 1 }),
    }

    await expect(checker({ context }, [42])).rejects.toThrow(
      /Invalid authorization requirement passed to @Authorized/
    )
  })
})
