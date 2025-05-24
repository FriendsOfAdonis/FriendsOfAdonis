import { TransportContract } from './transports/tranport.js'
import { PowercordMessages } from './types.js'

export class Powercord {
  readonly id: string
  readonly transport: TransportContract

  constructor(transport: TransportContract, id: string) {
    this.id = id
    this.transport = transport
  }

  send<T extends keyof PowercordMessages>(name: T, payload: PowercordMessages[T]) {
    this.transport.send(this.id, name, payload)
  }
}
