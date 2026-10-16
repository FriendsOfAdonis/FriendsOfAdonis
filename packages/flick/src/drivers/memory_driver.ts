import { FlickDriverContract } from '../types.ts'

export class FlickMemoryDriver implements FlickDriverContract {
  private state = new Map<string, Map<string | number, unknown>>()

  async set(feature: string, identifier: string | number, value: unknown) {
    let featureState = this.state.get(feature)

    if (!featureState) {
      featureState = new Map()
      this.state.set(feature, featureState)
    }

    featureState.set(identifier, value)
  }

  async get(feature: string, identifier: string | number) {
    const featureState = this.state.get(feature)
    if (!featureState) return
    return featureState.get(identifier)
  }

  async delete(feature: string, identifier: string | number): Promise<void> {
    const featureState = this.state.get(feature)
    if (!featureState) return
    featureState.delete(identifier)
  }

  async purge(features?: string[]): Promise<void> {
    if (!features) {
      this.state = new Map()
      return
    }

    for (const feature of features) {
      this.state.delete(feature)
    }
  }

  async flush() {
    this.state = new Map()
  }
}
