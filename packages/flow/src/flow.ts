import { createDefaultContainer, FlowRuntime } from 'flowcraft'
import { Class, Constructor } from 'type-fest'
import { ExtractWorkflowContext, WorkflowContract } from './types.js'
import { MetadataStorage } from './metadata/storage.js'
import { BaseWorkflow } from './mixins/workflow.js'
import { ContainerResolver } from '@adonisjs/core/container'
import { ContainerBindings } from '@adonisjs/core/types'

export class Flow {
  runtime: FlowRuntime<any, any>

  #resolver: ContainerResolver<ContainerBindings>

  constructor(resolver: ContainerResolver<ContainerBindings>) {
    this.#resolver = resolver
    this.runtime = new FlowRuntime(createDefaultContainer())
    this.#registerSteps()
  }

  async run<T extends WorkflowContract>(workflowClass: Class<T>, state: ExtractWorkflowContext<T>) {
    const instance = new workflowClass()

    const bp = instance.toBlueprint()

    const result = await this.runtime.run(bp, state)
  }

  #registerSteps() {
    for (const step of MetadataStorage.steps.values()) {
      this.runtime.registry.set(step.id, async (context) => {
        const Workflow = step.target.constructor as Constructor<BaseWorkflow>
        const workflow = await this.#resolver.make(Workflow)
        const handler = step.target[step.propertyKey]
        return handler.call(workflow, context)
      })
    }
  }
}
