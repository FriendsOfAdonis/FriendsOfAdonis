import { type BaseAction } from './base_action.ts'
import { type AsCommandContract } from './mixins/as_command.ts'
import { type AsControllerContract } from './mixins/as_controller.ts'
import { type AsJobContract } from './mixins/as_job.ts'
import { type AsListenerContract } from './mixins/as_listener.ts'

export interface ActionsConfig {
  middlewares: Middlewares
}

type Promisable<T> = T | Promise<T>

export type Middlewares = {
  [key in keyof Entrypoints]?: MiddlewareFn<Entrypoints[key]>[]
} & {
  handle?: MiddlewareFn<any>[]
} & {
  [key: string]: MiddlewareFn<any>[] | undefined
}

export type MiddlewareFn<Fn extends (...args: any) => any> = (
  args: Parameters<Fn>,
  action: BaseAction,
  actionClass: typeof BaseAction
) => Promisable<void | ((output: Fn) => Promisable<void>)>

export interface Entrypoints {
  handle: (...args: any[]) => any
  asController: AsControllerContract['asController']
  asCommand: AsCommandContract['asCommand']
  asListener: AsListenerContract['asListener']
  asJob: AsJobContract['asJob']
}
