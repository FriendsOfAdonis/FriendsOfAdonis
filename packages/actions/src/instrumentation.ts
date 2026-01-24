import {
  InstrumentationBase,
  isWrapped,
  type InstrumentationConfig,
} from '@opentelemetry/instrumentation'
import { trace, context, SpanKind, SpanStatusCode, type Span } from '@opentelemetry/api'
import { ActionsRunner } from './runner.ts'
import type { BaseAction } from './base_action.js'

const PACKAGE_NAME = '@foadonis/actions'
const PACKAGE_VERSION = '0.1.0'

/**
 * Configuration options for the Actions instrumentation
 */
export interface ActionsInstrumentationConfig extends InstrumentationConfig {
  /**
   * Hook called when a span is started for an action
   * Can be used to add custom attributes to the span
   */
  requestHook?: (span: Span, info: { actionName: string }) => void
}

/**
 * OpenTelemetry instrumentation for @foadonis/actions
 *
 * This instrumentation creates spans for each action execution, capturing:
 * - Action name
 * - Execution duration
 * - Errors (if any)
 *
 * @example
 * ```typescript
 * import { registerInstrumentations } from '@opentelemetry/instrumentation'
 * import { ActionsInstrumentation } from '@foadonis/actions/instrumentation'
 *
 * registerInstrumentations({
 *   instrumentations: [new ActionsInstrumentation()],
 * })
 * ```
 */
export class ActionsInstrumentation extends InstrumentationBase<ActionsInstrumentationConfig> {
  constructor(config: ActionsInstrumentationConfig = {}) {
    super(PACKAGE_NAME, PACKAGE_VERSION, config)
  }

  protected init() {
    return []
  }

  /**
   * Enables instrumentation by wrapping ActionsRunner.dispatch.
   */
  enable() {
    if (isWrapped(ActionsRunner.prototype.dispatch)) {
      this._unwrap(ActionsRunner.prototype, 'dispatch')
    }
    this._wrap(ActionsRunner.prototype, 'dispatch', this._getDispatchPatch() as any)
  }

  /**
   * Disables instrumentation by unwrapping ActionsRunner.dispatch.
   */
  disable() {
    if (isWrapped(ActionsRunner.prototype.dispatch)) {
      this._unwrap(ActionsRunner.prototype, 'dispatch')
    }
  }

  private _getDispatchPatch() {
    const instrumentation = this

    return (original: ActionsRunner['dispatch']) => {
      return async function patchedDispatch(
        this: ActionsRunner,
        actionClass: typeof BaseAction,
        runner: (action: BaseAction) => Promise<any>,
        container?: any
      ): Promise<any> {
        const actionName = actionClass.name
        const tracer = trace.getTracer(PACKAGE_NAME, PACKAGE_VERSION)

        const span = tracer.startSpan(`action ${actionName}`, {
          kind: SpanKind.INTERNAL,
          attributes: {
            'foadonis.action.name': actionName,
          },
        })

        const config = instrumentation.getConfig()

        if (config.requestHook) {
          try {
            config.requestHook(span, { actionName })
          } catch (hookError) {
            instrumentation._diag.error('actions instrumentation: requestHook error', hookError)
          }
        }

        return context.with(trace.setSpan(context.active(), span), async () => {
          try {
            const result = await original.call(this, actionClass, runner, container)
            span.setStatus({ code: SpanStatusCode.OK })
            return result
          } catch (error) {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: error instanceof Error ? error.message : String(error),
            })
            span.recordException(error as Error)
            throw error
          } finally {
            span.end()
          }
        })
      }
    }
  }
}
