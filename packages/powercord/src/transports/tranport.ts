import { PowercordManager } from '../manager.js'
import { PowercordMessages } from '../types.js'

export interface TransportContract {
  send<T extends keyof PowercordMessages>(
    id: string,
    name: T,
    payload: PowercordMessages[T]
  ): Promise<void>

  boot(server: PowercordManager): Promise<void>
}
