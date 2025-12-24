import { FlowRuntime, WorkflowBlueprint } from 'flowcraft'
import { AdapterContract } from '../types.js'

export class MemoryAdapter implements AdapterContract {
  constructor(public runtime: FlowRuntime<any, any>) {
    // TODO: Dont really now why but we must register it here aswell
    for (const [k, v] of Object.entries(runtime.options.registry ?? {})) {
      this.runtime.registry.set(k, v as any)
    }
  }

  async start(): Promise<void> {}
  async stop(): Promise<void> {}

  async enqueue(blueprint: WorkflowBlueprint): Promise<void> {
    const result = await this.runtime.run(blueprint, undefined)
    console.log(result)
  }
}
