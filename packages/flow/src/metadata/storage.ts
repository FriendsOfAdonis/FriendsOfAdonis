export type StepMetadata = {
  id: string
  target: Object
  propertyKey: string
}

export class MetadataStorage {
  static steps = new Map<string, StepMetadata>()

  static registerStep(id: string, metadata: StepMetadata) {
    this.steps.set(id, metadata)
  }
}
