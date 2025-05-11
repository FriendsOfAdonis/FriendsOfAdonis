import { Component } from './main.js'
import { ComponentCall, ComponentSnapshot, Resolver } from '../types.js'

type ComponentClass = new (...args: any[]) => Component

export class ComponentsManager {
  #components = new Map<string, ComponentClass>()
  #resolver: Resolver

  constructor(resolver: Resolver) {
    this.#resolver = resolver
  }

  /**
   * Mounts a component.
   */
  async mount(constructor: typeof Component, props: Record<string, any>) {
    this.register(constructor)

    const component = await this.resolve(constructor.$name, props)

    if (component.mount) {
      await component.mount()
    }

    return component
  }

  async update(snapshot: ComponentSnapshot, calls: ComponentCall[]) {
    const component = await this.getFromSnapshot(snapshot)

    for (const call of calls) {
      // TODO: Handle exceptions
      try {
        await component.$call(call.method, ...(call.params ?? []))
      } catch (e) {
        console.error(e)
        continue
      }
    }

    return component
  }

  /**
   * Resolves a component by its name.
   *
   * It uses the provided resolver to allow dependency injection.
   */
  async resolve(name: string, props: Record<string, any>) {
    const componentClass = this.get(name)

    if (!componentClass) throw new Error(`component ${name} not found`) // TODO: error

    const component = await this.#resolver.resolve(componentClass)

    Reflect.set(component, '$props', props)

    return component
  }

  register(component: typeof Component) {
    this.#components.set(component.$name, component as unknown as ComponentClass)
  }

  get(name: string) {
    return this.#components.get(name)
  }

  /**
   * Returns a component instance from a snapshot.
   */
  async getFromSnapshot(snapshot: ComponentSnapshot) {
    const component = await this.resolve(snapshot.memo.name, {}) // TODO: Pass props?

    component.$hydrate(snapshot.data)

    return component
  }
}
