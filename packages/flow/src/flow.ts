import { createDefaultContainer, FlowRuntime, NodeFunction, WorkflowBlueprint } from 'flowcraft'
import { Class, Constructor } from 'type-fest'
import { AdapterContract, WorkflowContract } from './types.js'
import { MetadataStorage } from './metadata/storage.js'
import { BaseWorkflow } from './mixins/workflow.js'
import { ContainerResolver } from '@adonisjs/core/container'
import { ContainerBindings } from '@adonisjs/core/types'
import { ResolvedConfig } from './define_config.js'
import { Autoloader } from '@foadonis/autoloader'

export class Flow {
  declare runtime: FlowRuntime<any, any>
  declare adapter: AdapterContract

  #resolver: ContainerResolver<ContainerBindings>
  #blueprints: Record<string, WorkflowBlueprint> = {}
  #registry = new Map<string, NodeFunction>()

  constructor(
    resolver: ContainerResolver<ContainerBindings>,
    private config: ResolvedConfig<AdapterContract>
  ) {
    this.#resolver = resolver
  }

  async run<T extends WorkflowContract>(workflowClass: Class<T>) {
    const instance = new workflowClass()

    const bp = instance.toBlueprint()

    await this.adapter.enqueue(bp, this.#registry)
  }

  async boot() {
    await this.#autoload()
    this.#registerSteps()

    this.runtime = new FlowRuntime(createDefaultContainer(), {
      ...this.config,
      blueprints: this.#blueprints,
      registry: Object.fromEntries(this.#registry),
    })

    this.adapter = this.config.adapter(this.runtime)
    this.adapter.start()
  }

  async shutdown() {
    await this.adapter.stop()
  }

  #registerSteps() {
    for (const step of MetadataStorage.steps.values()) {
      this.#registry.set(step.id, async (context) => {
        const Workflow = step.target.constructor as Constructor<BaseWorkflow>
        const workflow = await this.#resolver.make(Workflow)
        const handler = step.target[step.propertyKey as keyof typeof Workflow] as Function
        return handler.call(workflow, context)
      })
      // this.#registry[step.id] = async (context) => {
      //   const Workflow = step.target.constructor as Constructor<BaseWorkflow>
      //   const workflow = await this.#resolver.make(Workflow)
      //   const handler = step.target[step.propertyKey]
      //   return handler.call(workflow, context)
      // }
    }
  }

  async #autoload() {
    const autoloader = new Autoloader({
      path: this.config.autoload,
      glob: '**/*_workflow.ts',
    })

    for await (const [, module] of autoloader.autoload()) {
      const { default: Workflow } = module
      const workflow = await this.#resolver.make(Workflow)
      const bp = workflow.toBlueprint()
      this.#blueprints[bp.id] = bp
    }
  }
}
