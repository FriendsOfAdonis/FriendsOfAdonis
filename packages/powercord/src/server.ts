import { Logger } from '@adonisjs/core/logger'
import { PowercordMessages, TransmitService } from './types.js'
import { Powercord } from './powercord.js'

export type PowercordServerOptions = {
  path: string
  logger: Logger
  transmit: TransmitService
}

export class PowercordServer {
  transmit: TransmitService
  logger: Logger

  clients = new Map<string, Powercord>()

  constructor(options: PowercordServerOptions) {
    this.logger = options.logger
    this.transmit = options.transmit
  }

  listen() {
    this.transmit.on('subscribe', ({ uid, channel }) => {
      if (!channel.startsWith('/spark')) return
      this.create(uid)
    })

    this.transmit.on('unsubscribe', ({ uid, channel }) => {
      if (!channel.startsWith('/spark')) return
      this.stop(uid)
    })

    this.transmit.on('disconnect', ({ uid }) => {
      this.stop(uid)
    })
  }

  registerRoutes() {
    this.transmit.registerRoutes()
  }

  create(id: string) {
    const powercord = new Powercord(this.transmit, id)
    this.clients.set(id, powercord)

    powercord.send('log', { level: 'debug', message: '[powercord] connected.' })

    return powercord
  }

  stop(id: string) {
    this.clients.delete(id)
  }

  /**
   * Retrieves a Powercord by its id.
   */
  get(id: string) {
    return this.clients.get(id)
  }

  /**
   * Broadcasts an event to all connected Powercord clients.
   */
  broadcast<T extends keyof PowercordMessages>(name: T, payload: PowercordMessages[T]) {
    this.clients.forEach((client) => {
      client.send(name, payload)
    })
  }

  /**
   * Send a message to a specific Powercord by its id
   */
  send<T extends keyof PowercordMessages>(id: string, name: T, payload: PowercordMessages[T]) {
    const client = this.get(id)
    if (!client) return

    client.send(name, payload)
  }
}
