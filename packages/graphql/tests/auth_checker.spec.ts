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
})
