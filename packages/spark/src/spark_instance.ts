import { Logger } from '@adonisjs/core/logger'
import { Resolver, SparkActionMessage, SparkMessage, SparkUpdatesMessage } from './types.js'
import { Component } from './components/main.js'
import { Powercord } from '@foadonis/powercord'
import { renderToString } from './jsx/render/main.js'
import { setPropertyFromAccessor } from './utils/properties.js'

type ComponentClass = new (...args: any[]) => Component

export type SparkInstanceOptions = {
  id: string
  logger: Logger
  resolver: Resolver
  powercord: Powercord
}

export class SparkInstance {
  #resolver: Resolver

  readonly id: string
  readonly logger: Logger
  readonly powercord: Powercord

  components = new Map<string, Component>()

  constructor(options: SparkInstanceOptions) {
    this.id = options.id
    this.powercord = options.powercord
    this.logger = options.logger
    this.#resolver = options.resolver
  }

  async mount(constructor: typeof Component, props: Record<string, any>) {
    const component = await this.resolve(constructor, props)

    component.powercord = this.powercord

    if (component.mount) {
      await component.mount()
    }

    return component
  }

  async resolve(constructor: typeof Component, props: Record<string, any>) {
    const component = await this.#resolver.resolve(constructor as unknown as ComponentClass)

    Reflect.set(component, '$props', props)

    this.components.set(component.$id, component)

    return component
  }

  async handleMessages(messages: SparkMessage[]) {
    for (const message of messages) {
      const component = this.components.get(message.componentId)

      if (!component) {
        throw new Error('Commponent not found') // TODO: Error
      }

      try {
        for (const event of message.events) {
          if (event.name === 'action') {
            await this.#handleAction(component, event)
          }

          if (event.name === 'updates') {
            await this.#handleUpdates(component, event)
          }
        }

        const html = await renderToString(component, this)
        this.powercord.send('spark:morph', { componentId: component.$id, html })
      } catch (error: unknown) {
        console.warn('An error occured', error) // TODO: Render component error
      }
    }
  }

  async #handleUpdates(component: Component, { payload }: SparkUpdatesMessage) {
    for (const [k, v] of Object.entries(payload.data)) {
      setPropertyFromAccessor(k, v, component)
    }
  }

  async #handleAction(component: Component, { payload }: SparkActionMessage) {
    await component.$call(payload.method)
  }
}
