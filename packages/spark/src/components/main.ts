import { HttpContext } from '@adonisjs/core/http'
import { randomId } from '../utils/random.js'
import { synthetizeObject } from '../synthetize.js'
import { hydrateObject } from '../utils/properties.js'
import { ComponentContext, RefAccessor } from '../types.js'
import { SparkNode } from '../jsx/types/jsx.js'

export interface Component {
  constructor(...args: any[]): any

  mount?(): Promise<void> | void
}

export abstract class Component<P = {}> {
  private static name?: string

  declare readonly $props: P

  $id = randomId()
  $childrenData: ComponentContext[] = []
  $hydrated = false

  static get $name() {
    if (!this.name) {
      this.name = `${this.name}:${randomId()}`
    }
    return this.name
  }

  abstract render(that: RefAccessor<unknown>): SparkNode

  get ctx() {
    return HttpContext.getOrFail()
  }

  get response() {
    return this.ctx.response
  }

  get request() {
    return this.ctx.request
  }

  /**
   * Returns this component name.
   */
  get $name() {
    return this.constructor.name
  }

  /**
   * Redirects the user to a different route.
   *
   * For security reasons browsers does not allow manual redirect handling.
   * This mean we have to use a custom status code.
   */
  redirect(path: string) {
    this.response.status(309).header('Location', path)
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
