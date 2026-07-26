import { type HookHandlerProvider } from '@poppinss/hooks/types'
import { type ActionDispatcherHooks } from '../src/action_executor.ts'
import { trace } from '@opentelemetry/api'

export const telemetryHook: HookHandlerProvider<
  ActionDispatcherHooks[keyof ActionDispatcherHooks][0],
  ActionDispatcherHooks[keyof ActionDispatcherHooks][1]
> = {
  name: 'Telemetry',
  handle(_, context) {
    if (context.method.startsWith('as')) {
      const tracer = trace.getTracer('@adonisjs/otel')
      const span = tracer.startSpan(context.action.constructor.name)
      span.setAttribute('action_handler', context.method)

      return () => {
        span.end()
      }
    }
  },
}
