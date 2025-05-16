import { NormalizeConstructor } from '@poppinss/utils/types'
import { Component } from './main.js'

type ComponentClass = new (...args: any[]) => Component

export class ComponentsRegistry {
  #components = new Map<string, NormalizeConstructor<ComponentClass>>()

  register(component: typeof Component) {
    this.#components.set(component.$name, component as unknown as ComponentClass)
  }

  get(name: string) {
    return this.#components.get(name)
  }
}
