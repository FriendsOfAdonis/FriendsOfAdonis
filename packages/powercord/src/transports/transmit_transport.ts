import { PowercordManager } from '../manager.js'
import { PowercordMessages, TransmitService } from '../types.js'
import { TransportContract } from './tranport.js'

export type TransmitTransportOptions = {
  path: string
}

export class TransmitTransport implements TransportContract {
  options: TransmitTransportOptions

  #transmit: TransmitService

  constructor(transmit: TransmitService, options: TransmitTransportOptions) {
    this.#transmit = transmit
    this.options = options
  }

  async send<T extends keyof PowercordMessages>(
    id: string,
    name: T,
    payload: PowercordMessages[T]
  ): Promise<void> {
    this.#transmit.broadcast(`${this.options.path}/${id}`, {
      event: name,
      payload,
    })
  }

  async boot(server: PowercordManager): Promise<void> {
    this.#transmit.on('subscribe', ({ uid, channel }) => {
      if (!channel.startsWith(this.options.path)) return
      server.create(uid)
    })

    this.#transmit.on('unsubscribe', ({ uid, channel }) => {
      if (!channel.startsWith(this.options.path)) return
      server.stop(uid)
    })

    this.#transmit.on('disconnect', ({ uid }) => {
      server.stop(uid)
    })
  }
}
