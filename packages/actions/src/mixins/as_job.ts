import { type NormalizeConstructor } from '@adonisjs/core/types/common'
import { type BaseAction } from '../base_action.ts'
import { JobDispatcher } from '../job_dispatcher.ts'
import type { JobContext, JobOptions } from '@adonisjs/queue/types'
import { JobBatchDispatcher, ScheduleBuilder } from '@adonisjs/queue'
import { E_NOT_IMPLEMENTED_EXCEPTION } from '../errors.ts'

/**
 * Contract used by the AsJob mixin.
 */
export interface AsJobContract<Payload = any> {
  asJob(payload: Payload, context: JobContext, signal?: AbortSignal): Promise<void>
  asJobFailed?(
    error: Error,
    payload: Payload,
    context: JobContext,
    signal?: AbortSignal
  ): Promise<void>
}

/**
 * Mixin to make an action runnable as a job.
 *
 * Any action using this mixin must implement the `asJob()` method.
 *
 * @param options - JobOptions such as queue name, retry policy, timeout, and more.
 *
 * @example
 * ```ts
 * import { compose } from '@adonisjs/core/helpers'
 * import { BaseAction } from '@foadonis/actions'
 * import { AsJob } from '@foadonis/actions/queue'
 *
 * export interface SendEmailJobPayload {
 *   userId: string
 *   subject: string
 *   body: string
 * }
 *
 * export default class SendEmailAction extends compose(BaseAction, AsJob<SendEmailJobPayload>({ timeout: 30 })) {
 *
 *   async handle(user: User, subject: string, body: string) {
 *     await mailer.send(user.email, subject, body)
 *   }
 *
 *   async asJob({ userId, subject, body }: SendEmailJobPayload, context: JobContext) {
 *     console.log(`Attempted ${context.attempt} for job ${context.jobId}`)
 *     const user = await User.findOrFail(userId)
 *     await this.handle(user, subject, body)
 *   }
 *
 * }
 *
 * ```
 */
export function AsJob<Payload = any>(options: JobOptions = {}) {
  return function <Action extends NormalizeConstructor<typeof BaseAction>>(superclass: Action) {
    abstract class AsJobImpl extends superclass implements AsJobContract {
      #jobPayload: any
      #jobContext?: JobContext
      #jobSignal?: AbortSignal

      constructor(...args: any[]) {
        super(...args)
        this.$wrapMethod('asJob', this.asJob)
      }

      /**
       * Entrypoint executed by the worker when the action is ran as a job.
       *
       * For timeout handling, use `this.signal` which is available after hydration.
       *
       * @throws Any error thrown will trigger retry logic (if configured)
       *
       * @example
       * ```typescript
       * async asJob(payload: Payload, context: JobContext, signal?: AbortSignal) {
       *   await this.handle({ ... })
       * }
       * ```
       */
      // @ts-expect-error -- Required for clean user-facing api
      asJob(payload: Payload, context: JobContext, signal?: AbortSignal): Promise<void> {
        throw new E_NOT_IMPLEMENTED_EXCEPTION([this.constructor.name, 'AsJob', 'asJob'])
      }

      /**
       * Entrypoint executed by the worker when the action ran as a job
       * has permanently failed (after all retries exhaused).
       *
       * Use this hook for cleanup, logging, or notifications.
       * This is optional - implement only if you need failure handling.
       *
       * @param error - The error that caused the final failure
       * @param payload - The provided job payload
       * @param context - The job context
       * @param signal - The job signal
       *
       * @example
       * ```typescript
       * async asJobFailed(error: Error, payload: Payload, context: JobContext, signal?: AbortSignal) {
       *   await notifyAdmin(`Job failed: ${error.message}`)
       *   await cleanup(payload)
       * }
       * ```
       */
      asJobFailed?(
        error: Error,
        payload: Payload,
        context: JobContext,
        signal?: AbortSignal
      ): Promise<void>

      /**
       * Method executed by the worker when processing the job.
       * Used internally as a wrapper of `asJob`.
       *
       * @internal
       */
      async execute() {
        return this.asJob(this.#jobPayload, this.#jobContext!, this.#jobSignal)
      }

      /**
       * Method executed by the worker when the job has permanently failed.
       * Used internally as a wrapper of `asJobFailed`.
       *
       * @internal
       */
      async failed(error: Error) {
        await this.asJobFailed?.(error, this.#jobPayload, this.#jobContext!, this.#jobSignal)
      }

      /**
       * Hydrate the job with payload, context, and optional abort signal.
       *
       * This method is called by the worker after instantiation to provide
       * the job's runtime data. It should not be called directly by user code.
       *
       * @param payload - The data to be processed by this job
       * @param context - The job execution context
       * @param signal - Optional abort signal for timeout handling
       *
       * @internal
       */
      $hydrate(payload: any, context: JobContext, signal?: AbortSignal): void {
        this.#jobPayload = payload
        this.#jobContext = context
        this.#jobSignal = signal
      }

      /**
       * Dispatch this action as a job to the queue.
       *
       * Returns a JobDispatcher for fluent configuration before dispatching.
       * The job is not actually dispatched until `.run()` is called or the
       * dispatcher is awaited.
       *
       * @param payload - The data to pass to the job
       * @returns A JobDispatcher for fluent configuration
       *
       * @extends
       * ```typescript
       * // Simple dispatch
       * await MyAction.dispatch({ to: 'user@example.com', subject: 'Hello' })
       *
       * // With options
       * await MyAction.dispatch({ to: 'user@example.com' })
       *  .toQueue('high-priority')
       *  .priority(1)
       *  .in('5m')
       *  .run()
       * ```
       */
      public static dispatch<This extends new (...args: any[]) => AsJobImpl>(
        this: This,
        payload: Payload
      ) {
        const jobName = options.name || this.name

        const dispatcher = new JobDispatcher<Payload>(jobName, payload)

        if (options.queue) {
          dispatcher.toQueue(options.queue)
        }

        if (options.adapter) {
          dispatcher.with(options.adapter)
        }

        if (options.priority !== undefined) {
          dispatcher.priority(options.priority)
        }

        return dispatcher
      }

      /**
       * Dispatch multiple actions as jobs to the queue in a single batch.
       *
       * Returns a JobBatchDispatcher for fluent configuration before dispatching.
       * The jobs are not actually dispatched until `.run()` is called or the
       * dispatcher is awaited.
       *
       * This is more efficient than calling `dispatch()` multiple times as it
       * uses batched operations (e.g., Redis pipeline, SQL batch insert).
       *
       * @param payloads - Array of data to pass to each job
       * @returns A JobBatchDispatcher for fluent configuration
       *
       * @example
       * ```typescript
       * // Batch dispatch for newsletter
       * const { jobIds } = await MyAction.dispatchMany([
       *   { to: 'user1@example.com', subject: 'Newsletter' },
       *   { to: 'user2@example.com', subject: 'Newsletter' },
       * ])
       *   .group('newsletter-jan-2025')
       *   .toQueue('emails')
       *   .run()
       *
       * console.log(`Dispatched ${jobIds.length} jobs`)
       * ```
       */
      public static dispatchMany<This extends new (...args: any[]) => AsJobImpl>(
        this: This,
        payloads: Payload[]
      ) {
        const jobName = options.name || this.name

        const dispatcher = new JobBatchDispatcher<Payload>(jobName, payloads)

        if (options.queue) {
          dispatcher.toQueue(options.queue)
        }

        if (options.adapter) {
          dispatcher.with(options.adapter)
        }

        if (options.priority !== undefined) {
          dispatcher.priority(options.priority)
        }

        return dispatcher
      }
      /**
       * Create a schedule for this job.
       *
       * Returns a ScheduleBuilder for fluent configuration before creating the schedule.
       * The schedule is not actually created until `.run()` is called or the
       * builder is awaited.
       *
       * @param payload - The data to pass to the job on each run
       * @returns A ScheduleBuilder for fluent configuration
       *
       * @example
       * ```typescript
       * // Cron schedule
       * await CleanupJob.schedule({ days: 30 })
       *   .id('cleanup-daily')
       *   .cron('0 0 * * *')
       *   .timezone('Europe/Paris')
       *   .run()
       *
       * // Interval schedule
       * await SyncJob.schedule({ source: 'api' })
       *   .every('5m')
       *   .run()
       * ```
       */
      public static schedule<This extends new (...args: any[]) => AsJobImpl>(
        this: This,
        payload: Payload
      ) {
        const jobName = options.name || this.name

        return new ScheduleBuilder<Payload>(jobName, payload)
      }
    }

    return AsJobImpl
  }
}
