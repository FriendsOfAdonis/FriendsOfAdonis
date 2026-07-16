import { inspect } from 'node:util'
import { type AsControllerContract } from './mixins/as_controller.ts'
import { type AsListenerContract } from './mixins/as_listener.ts'
import { type MiddlewareFn } from './types.ts'
import { type AsJobContract } from './mixins/as_job.ts'

export const middlewares = {
  asListener: {
    scopedLogger: (([event], action, actionClass) => {
      action.logger = action.logger.child({
        action: actionClass.displayName,
        event: inspect(event),
      })
    }) as MiddlewareFn<AsListenerContract['asListener']>,
  },
  asController: {
    scopedLogger: (([context], action, actionClass) => {
      action.logger = context.logger.child({ action: actionClass.displayName })
    }) as MiddlewareFn<AsControllerContract['asController']>,
  },
  asJob: {
    scopedLogger: (([_, context], action, actionClass) => {
      action.logger = action.logger.child({
        action: actionClass.displayName,
        queue: context.queue,
        job_id: context.jobId,
        job_name: context.name,
      })
    }) as MiddlewareFn<AsJobContract['asJob']>,
  },
}
