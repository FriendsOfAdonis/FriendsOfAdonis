import { EdgeDefinition, NodeDefinition, WorkflowBlueprint } from 'flowcraft'
import { WorkflowBuilder } from '../builder.js'
import stringHelpers from '@adonisjs/core/helpers/string'

export abstract class BaseWorkflow<Context extends Record<string, any> = Record<string, any>> {
  declare $type: Context

  id = stringHelpers.create(this.constructor.name).dashCase().removeSuffix('workflow').toString()

  declare edges: EdgeDefinition[]
  declare nodes: NodeDefinition[]

  abstract flow(flow: WorkflowBuilder<Context>): WorkflowBuilder

  toBlueprint(): WorkflowBlueprint {
    const flow = this.flow(new WorkflowBuilder(this.id))

    console.log(flow.toBlueprint())

    return flow.toBlueprint()
  }
}
