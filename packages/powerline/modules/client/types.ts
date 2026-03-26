import { type PowerlineMessages, type MessageEvent } from '../../src/types.ts'

export type ClientSocketEventMap<Messages extends PowerlineMessages = PowerlineMessages> = {
  close: CloseEvent
  open: never
  error: ErrorEvent
  message: MessageEvent<Messages>
}
