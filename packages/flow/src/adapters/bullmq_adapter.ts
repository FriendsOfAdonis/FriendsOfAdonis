import {
  BullMQAdapter as BaseBullMQAdapter,
  RedisCoordinationStore,
} from '@flowcraft/bullmq-adapter'
import { FlowRuntime } from 'flowcraft'

export default class BullMQAdapter extends BaseBullMQAdapter {
  constructor(rumtime: FlowRuntime<any, any>) {
    super({
      runtimeOptions: this.runtime.options,
    })
  }
}
