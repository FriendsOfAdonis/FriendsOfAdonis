export type ReactiveMetadata = {
  target: Function
  propertyKey: string
}

export class MetadataStorage {
  reactives = new Map<Function, ReactiveMetadata[]>()

  addReactiveMetadata(metadata: ReactiveMetadata) {
    const existing = this.reactives.get(metadata.target)
    if (existing) {
      existing.push(metadata)
    } else {
      this.reactives.set(metadata.target, [metadata])
    }
  }

  getReactiveMetadatas(target: Function) {
    return this.reactives.get(target) ?? []
  }
}

export const $metadata = new MetadataStorage()
