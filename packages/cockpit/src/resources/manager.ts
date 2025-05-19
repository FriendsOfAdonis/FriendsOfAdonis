import { globby } from 'globby'
import { BaseResource } from './base.js'
import SuperJSON from 'superjson'
import { ResourceNameOrClass } from '../types.js'
import { ResourceNotFoundException } from '../errors/resource_not_found.js'

export type ResourcesManagerOptions = {
  autoload: string | false
}

export class ResourcesManager {
  #resources = new Map<string, BaseResource>()

  constructor(private options: ResourcesManagerOptions) {}

  /**
   * Registers a new resource with a specific identifier.
   */
  set(name: string, resource: BaseResource) {
    this.#resources.set(name, resource)
  }

  /**
   * Retrieves a resource by its name.
   */
  get(nameOrClass: ResourceNameOrClass) {
    if (typeof nameOrClass === 'function') {
      const pt = new nameOrClass()
      return this.#resources.get(pt.name)
    }

    return this.#resources.get(nameOrClass)
  }

  /**
   * Retrieves a resource by its name.
   *
   * TODO: Refactor this
   */
  getOrFail(nameOrClass: ResourceNameOrClass) {
    if (typeof nameOrClass === 'function') {
      const pt = new nameOrClass()
      const resource = this.#resources.get(pt.name)
      if (!resource) throw new ResourceNotFoundException(pt.name)
      return resource
    }

    const resource = this.#resources.get(nameOrClass)
    if (!resource) throw new ResourceNotFoundException(nameOrClass)
    return resource
  }

  /**
   * Returns all registered resources.
   */
  list() {
    return this.#resources.values().toArray()
  }

  /**
   * Registers a new resource.
   * Uses the resource name as identifier.
   */
  register(resource: BaseResource) {
    this.set(resource.name, resource)

    SuperJSON.registerCustom(
      {
        isApplicable: (v) => v instanceof BaseResource,
        serialize: (v: BaseResource) => v.name,
        deserialize: (v) => this.get(v)!,
      },
      '@foadonis/cockpit'
    )
  }

  async boot() {
    await this.autoload()
  }

  /**
   * Autoload resources by importing them using glob matching.
   */
  async autoload() {
    if (this.options.autoload) {
      const result = await globby(this.options.autoload, {
        expandDirectories: {
          extensions: ['ts', 'js'],
          files: ['*_resource'],
        },
      })

      for (const path of result) {
        // TODO: We should perform some checks here
        const { default: Resource } = await import(path)
        const instance = new Resource()
        this.register(instance)
      }
    }
  }
}
