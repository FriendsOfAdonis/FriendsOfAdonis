import { MetadataStorage } from '../metadata/storage.js'
import { BaseWorkflow } from '../mixins/workflow.js'
import { FLOW_STEP_ID } from '../symbols.js'

export function step(id?: string) {
  return (target: BaseWorkflow, propertyKey: string, descriptor: PropertyDescriptor) => {
    const realId = `${target.constructor.name}:${id ?? propertyKey}`

    if (!target.edges) target.edges = []
    if (!target.nodes) target.nodes = []

    // Assigning flow step id to function
    Object.assign(descriptor.value, {
      [FLOW_STEP_ID]: realId,
    })

    target.nodes.push({
      id: realId,
      uses: realId,
    })

    MetadataStorage.registerStep(realId, {
      id: realId,
      target,
      propertyKey,
    })
  }
}
