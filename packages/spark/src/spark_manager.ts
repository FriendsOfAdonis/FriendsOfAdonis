import { Resolver, SparkConfig } from './types.js'
import { Renderer } from './renderer.js'
import { ComponentsManager } from './components/manager.js'
import { Component } from './components/main.js'

export class SparkManager {
  readonly components: ComponentsManager
  readonly config: SparkConfig

  constructor(resolver: Resolver, config: SparkConfig) {
    this.components = new ComponentsManager(resolver)
    this.config = config
  }

  /**
   * Creates a new renderer.
   */
  createRenderer() {
    return new Renderer(this.components)
  }

  test<P = {}>(componentClass: new (...args: any) => Component<P>, props: P) {
    this.components.register(componentClass as unknown as typeof Component)

    return
  }
}
