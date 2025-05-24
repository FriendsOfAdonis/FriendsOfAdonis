import { Logger } from '@adonisjs/core/logger'
import { Resolver, SparkActionMessage, SparkMessage, SparkUpdatesMessage } from './types.js'
import { Component } from './components/main.js'
import { Powercord } from '@foadonis/powercord'
import { renderToString } from './jsx/render/main.js'
import { setPropertyFromAccessor } from './utils/properties.js'
import { HttpContext } from '@adonisjs/core/http'

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
  ctx?: HttpContext

  constructor(options: SparkInstanceOptions) {
    this.id = options.id
    this.powercord = options.powercord
    this.logger = options.logger
    this.#resolver = options.resolver
  }

  setCtx(ctx: HttpContext) {
    this.ctx = ctx
  }

  getCtxOrFail() {
    if (!this.ctx) throw new Error('NO CTX') // TODO: Ctx not found
    return this.ctx
  }

  async mount<C extends Component<any>>(
    constructor: new (...args: any[]) => C,
    props: C['$props']
  ): Promise<C> {
    const component = await this.resolve(constructor, props)

    if (component.mount) {
      await component.mount()
    }

    return component
  }

  async resolve<C extends Component<any>>(
    constructor: new (...args: any[]) => C,
    props: C['$props']
  ): Promise<C> {
    const component = await this.#resolver.resolve(constructor)

    Reflect.set(component, '$props', props)
    Reflect.set(component, 'spark', this)

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
