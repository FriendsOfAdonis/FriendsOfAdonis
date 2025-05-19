import { PowercordMessages } from '../../types.js'

export type PowercordMessageHandlerFn<T extends keyof PowercordMessages = keyof PowercordMessages> =
  (event: CustomEvent<PowercordMessages[T]>) => void | Promise<void>

export type PowercordMessageHandler<T extends keyof PowercordMessages = keyof PowercordMessages> = {
  name: T
  handler: PowercordMessageHandlerFn<T>
}

export function defineMessageHandler<T extends keyof PowercordMessages>(
  name: T,
  handler: PowercordMessageHandlerFn<T>
): PowercordMessageHandler<T> {
  return {
    name,
    handler,
  }
}
