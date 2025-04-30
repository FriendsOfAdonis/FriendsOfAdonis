import { $metadata } from '../metadata/storage.js'
import { randomId } from '../utils/random.js'

export abstract class BaseComponent<P = {}> {
  private static id?: string

  declare props: P

  $id = randomId()
  $childrenData: any[] = []
  $hydrated = false

  static get $id() {
    if (!this.id) {
      this.id = `${this.name}:${randomId()}`
    }
    return this.id
  }

  data: Record<string, any> = {}

  abstract render(): Promise<any> | any // TODO: Type this

  /**
   * Returns this component name.
   */
  $name() {
    return this.constructor.name
  }

  /**
   * Hydrate this component with data.
   */
  $hydrate(data: Record<string, any>, children: any[] = []) {
    if (this.$hydrated) return

    Object.assign(this, data)

    this.$childrenData = children
    this.$hydrated = true
  }

  /**
   * Call a component method.
   */
  $call<T extends keyof this>(action: T, ...args: any[]) {
    const fn = this[action]

    if (typeof fn !== 'function') {
      throw new Error(`Method ${String(action)} is not callable`)
    }

    return fn.apply(this, args)
  }

  $data() {
    const reactives = $metadata.getReactiveMetadatas(this.constructor)
    const data: Record<string, any> = {}

    for (const reactive of reactives) {
      data[reactive.propertyKey] = this[reactive.propertyKey as keyof this]
    }

    return data
  }
}
