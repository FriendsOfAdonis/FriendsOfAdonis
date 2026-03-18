import { type ApplicationService } from '@adonisjs/core/types'
import { BaseAction } from '../src/base_action.ts'
import { ActionExecutor } from '../src/action_executor.ts'

/**
 * Service provider that registers the ActionsRunner singleton
 * and configures BaseAction and ActionLoader with the runner.
 */
export default class ActionsProvider {
  constructor(private app: ApplicationService) {}

  /**
   * Registers the ActionsRunner singleton in the container.
   */
  register() {
    this.app.container.singleton(ActionExecutor, async (resolver) => {
      return new ActionExecutor(resolver)
    })

    this.app.container.alias('actions.executor', ActionExecutor)
  }

  /**
   * Configures BaseAction with the resolved executor and
   * register scopped logger hook.
   */
  async boot() {
    const executor = await this.app.container.make('actions.executor')
    BaseAction.useExecutor(executor)

    executor.hook('execute', (context) => {
      if (context.method === 'asController') {
        const [httpContext] = context.args
        context.action.logger = httpContext.logger.child({
          action: context.action.constructor.name,
        })
      }

      if (context.method === 'asJob') {
        const [, jobContext] = context.args
        context.action.logger = context.action.logger.child({
          job_id: jobContext.jobId,
          job_name: jobContext.name,
          queue: jobContext.queue,
        })
      }
    })
  }
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    'actions.executor': ActionExecutor
  }
}
