import { IgnitorFactory } from '@adonisjs/core/factories'
import { type ApplicationService } from '@adonisjs/core/types'
import { ActionExecutor } from '../src/action_executor.ts'
import { BaseAction } from '../src/base_action.ts'

export const BASE_URL = new URL('./tmp/', import.meta.url)

/**
 * Boots a minimal Adonis app with the actions provider registered,
 * sets `BaseAction.executor`, and returns the executor + teardown.
 *
 * Use in `group.each.setup` so the static executor is reset between tests.
 */
export async function setupExecutor() {
  const ignitor = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .merge({
      rcFileContents: {
        providers: [
          {
            file: () => import('../providers/actions_provider.ts'),
            environment: ['web', 'test', 'console'],
          },
        ],
      },
    })
    .create(BASE_URL, {
      importer: (filePath) => {
        if (filePath.startsWith('./') || filePath.startsWith('../')) {
          return import(new URL(filePath, BASE_URL).href)
        }
        return import(filePath)
      },
    })

  const app: ApplicationService = ignitor.createApp('test')
  await app.init()
  await app.boot()

  const executor = await app.container.make('actions.executor')

  return {
    app,
    executor,
    teardown: async () => {
      BaseAction.executor = undefined
      await app.terminate()
    },
  }
}

/**
 * Convenience: install a fresh executor before every test in the group
 * and tear it down afterwards.
 */
export function withExecutor(group: { each: { setup: (fn: () => Promise<any>) => void } }) {
  const ref: { executor?: ActionExecutor; app?: ApplicationService } = {}

  group.each.setup(async () => {
    const setup = await setupExecutor()
    ref.executor = setup.executor
    ref.app = setup.app
    return setup.teardown
  })

  return ref
}
