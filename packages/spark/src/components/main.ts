import { randomId } from '../utils/random.js'
import { synthetizeObject } from '../synthetize.js'
import { hydrateObject } from '../utils/properties.js'
import { ComponentContext, RefAccessor } from '../types.js'
import { SparkNode } from '../jsx/types/jsx.js'
import { Powercord } from '@foadonis/powercord'
import { HttpContext } from '@adonisjs/core/http'

export interface Component {
  constructor(...args: any[]): any

  mount?(): Promise<void> | void
}

export abstract class Component<P = {}> {
  private static name?: string

  declare readonly $props: P
  declare powercord: Powercord

  $id = randomId()
  $childrenData: ComponentContext[] = []
  $hydrated = false

  static get $name() {
    if (!this.name) {
      this.name = `${this.name}:${randomId()}`
    }
    return this.name
  }

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
    this.powercord.send('navigate', { url: path })
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
  $call(action: string, ...args: any[]) {
    if (!(action in this)) {
      throw new Error(`Component ${this.$name} does not have a method ${action}`)
    }

    const fn = this[action as keyof this]

    if (typeof fn !== 'function') {
      throw new Error(`Method ${String(action)} is not callable`)
    }

    return fn.apply(this, args)
  }

  $data() {
    return synthetizeObject(this)
  }
}
