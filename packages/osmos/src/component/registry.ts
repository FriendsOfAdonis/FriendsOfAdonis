import { NormalizeConstructor } from '@poppinss/utils/types'
import { BaseComponent } from './main.js'

type ComponentClass = new (...args: any[]) => BaseComponent

export class ComponentsRegistry {
  #components = new Map<string, NormalizeConstructor<ComponentClass>>()

  register(component: typeof BaseComponent) {
    this.#components.set(component.$id, component as unknown as ComponentClass)
  }

  get(name: string) {
    return this.#components.get(name)
  }
}
