import { randomId } from '../utils/random.js'
import { hydrateObject } from '../utils/properties.js'
import { ComponentActions, ComponentContext, RefAccessor } from '../types.js'
import { SparkNode } from '../jsx/types/jsx.js'
import { HttpContext } from '@adonisjs/core/http'
import { SparkInstance } from '../spark_instance.js'

export interface Component {
  constructor(...args: any[]): any

  mount?(): Promise<void> | void
}

export abstract class Component<P = {}> {
  declare readonly $props: P
  declare readonly spark: SparkInstance

  $id = `${this.constructor.name}_${randomId()}`

  $childrenData: ComponentContext[] = []
  $hydrated = false

  abstract render(that: RefAccessor<unknown>): SparkNode | Promise<SparkNode>

  error?(error: unknown): SparkNode

  /**
   * Returns this component name.
   */
  get $name() {
    return this.constructor.name
  }

  get ctx() {
    return HttpContext.getOrFail()
  }

  /**
   * Redirects the user to a different route.
   */
  redirect(path: string) {
    this.spark.powercord.send('navigate', { url: path })
  }

  /**
   * Hydrate this component with data.
   */
  $hydrate(data: Record<string, any>, children: any[] = []) {
    if (this.$hydrated) return

    hydrateObject(this, data)

    this.$childrenData = children
    this.$hydrated = true
  }

  /**
   * Call a component method.
   */
  $call(action: ComponentActions<this>, ...args: any[]) {
    if (!(action in this)) {
      throw new Error(`Component ${this.$name} does not have a method ${action}`)
    }

    const fn = this[action as keyof this]

    if (typeof fn !== 'function') {
      throw new Error(`Method ${String(action)} is not callable`)
    }

    return fn.apply(this, args)
  }
}
