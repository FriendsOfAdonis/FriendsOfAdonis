import { TypedEventTarget } from '../events.js'
import { PowercordMessages } from '../types.js'
import { PowercordMessageHandlerFn } from './handlers/main.js'
import { Subscription, Transmit } from '@adonisjs/transmit-client'
import { defaultHandlers } from './index.js'
import { generateRandom } from './utils.js'

export type PowercordClientOptions = {
  /**
   * Powercord ID used to identify connection and link with subsequent requests.
   * If not defined a random one is generated.
   */
  id?: string
}

export class PowercordClient extends TypedEventTarget<PowercordMessages> {
  id: string

  transmit: Transmit
  subscription?: Subscription

  handlers = new Map<string, PowercordMessageHandlerFn[]>()

  constructor(options: PowercordClientOptions) {
    super()
    this.id = options.id ?? generateRandom()

    this.transmit = new Transmit({
      baseUrl: window.location.origin,
      uidGenerator: () => this.id,
    })
  }

  async start() {
    console.debug('[powercord] connecting...')
    this.subscription = this.transmit.subscription(`/powercord/${this.id}`)

    this.subscription.onMessage((message) => {
      this.#handleMessage(message)
    })

    defaultHandlers.forEach((handler) =>
      this.on(handler.name as any, (event) => {
        if (event.defaultPrevented) return
        handler.handler(event)
      })
    )

    await this.subscription.create()
  }

  #handleMessage(data: any) {
    this.emit(data.event, data.payload)
  }
}
