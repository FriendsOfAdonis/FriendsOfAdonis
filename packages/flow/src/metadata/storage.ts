import { BaseWorkflow } from '../mixins/workflow.js'

export type StepMetadata<T extends BaseWorkflow> = {
  id: string
  target: BaseWorkflow
  propertyKey: string
}

export class MetadataStorage {
  static steps = new Map<string, StepMetadata>()

  static registerStep(id: string, metadata: StepMetadata) {
    this.steps.set(id, metadata)
  }
}
