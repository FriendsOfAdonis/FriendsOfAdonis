import { PowercordMessages, TransmitService } from './types.js'

export class Powercord {
  readonly id: string
  readonly transmit: TransmitService

  constructor(transmit: TransmitService, id: string) {
    this.id = id
    this.transmit = transmit
  }

  send<T extends keyof PowercordMessages>(name: T, payload: PowercordMessages[T]) {
    this.transmit.broadcast(`/powercord/${this.id}`, {
      event: name,
      payload,
    })
  }
}
