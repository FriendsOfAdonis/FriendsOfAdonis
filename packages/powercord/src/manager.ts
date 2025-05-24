import { Logger } from '@adonisjs/core/logger'
import { PowercordMessages, TransmitService } from './types.js'
import { Powercord } from './powercord.js'
import { TransportContract } from './transports/tranport.js'
import { FakeTransport } from './transports/fake_transport.js'

export type PowercordServerOptions = {
  path: string
  logger: Logger
  transmit: TransmitService
}

export class PowercordManager {
  transport: TransportContract

  clients = new Map<string, Powercord>()

  #fakeTransport?: FakeTransport

  constructor(transport: TransportContract) {
    this.transport = transport
  }

  async boot() {
    await this.transport.boot(this)
  }

  create(id: string) {
    const powercord = new Powercord(this.#fakeTransport ? this.#fakeTransport : this.transport, id)
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

  /**
   * Turns on fake mode.
   */
  fake() {
    this.#fakeTransport = new FakeTransport()
    return this.#fakeTransport
  }

  /**
   * Disables fake mode.
   */
  restore() {
    this.#fakeTransport = undefined
  }
}
