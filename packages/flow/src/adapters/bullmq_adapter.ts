import {
  BullMQAdapter as BaseBullMQAdapter,
  BullMQAdapterOptions,
  RedisCoordinationStore,
} from '@flowcraft/bullmq-adapter'
import { analyzeBlueprint, FlowRuntime, WorkflowBlueprint } from 'flowcraft'
import { Redis, RedisOptions } from 'ioredis'
import { AdapterContract } from '../types.js'
import stringHelpers from '@adonisjs/core/helpers/string'

export type BullMQAdapterConfig = Omit<
  BullMQAdapterOptions,
  'runtimeOptions' | 'coordinationStore' | 'connection'
> & {
  connection: RedisOptions
}

export class BullMQAdapter extends BaseBullMQAdapter implements AdapterContract {
  receiver: Redis

  constructor(
    runtime: FlowRuntime<any, any>,
    { connection: redisOptions, ...config }: BullMQAdapterConfig
  ) {
    const connection = new Redis({
      lazyConnect: true,
      ...redisOptions,
    })

    const coordinationStore = new RedisCoordinationStore(connection)

    super({
      runtimeOptions: runtime.options,
      connection,
      coordinationStore,
      ...config,
    })

    this.receiver = connection
  }

  async start(): Promise<void> {
    super.start()
  }

  async stop(): Promise<void> {
    await this.receiver.quit()
  }

  async enqueue(blueprint: WorkflowBlueprint): Promise<void> {
    const runId = stringHelpers.uuid()
    const analysis = analyzeBlueprint(blueprint)

    const context = this.createContext(runId)

    await context.set('blueprintVersion', blueprint.metadata?.version)

    await this.enqueueJob({
      runId,
      blueprintId: blueprint.id,
      nodeId: analysis.startNodeIds[0],
    })
  }
}
