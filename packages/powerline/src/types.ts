import { type Socket } from './socket.ts'

export interface PowerlineConfig {
  /** WebSocket path (default: '/') */
  path?: string
  /** Max message size in bytes */
  maxPayload?: number
  /** Heartbeat configuration, or false to disable */
  heartbeat?:
    | {
        /** Ping interval in ms */
        interval: number
        /** Pong timeout in ms */
        timeout: number
      }
    | false
}

export interface PowerlineMessages {
  'powerline:sessionId': { sessionId: string }
  'powerline:ping': {}
  'powerline:pong': {}
}

export type SocketMessageEvent<Messages extends PowerlineMessages = PowerlineMessages> = {
  socket: Socket<Messages>
  message: MessageEvent<Messages>
}

export type PowerlineMessage<
  Messages extends PowerlineMessages = PowerlineMessages,
  Message extends keyof Messages = keyof Messages,
> = {
  type: Message
  payload: Messages[Message]
}

export type SocketEventMap<Messages extends PowerlineMessages = PowerlineMessages> = {
  close: { code: number; reason: Buffer }
  message: SocketMessageEvent<Messages>
}

export type ServerEventMap<Messages extends PowerlineMessages = PowerlineMessages> = {
  connection: { socket: Socket<Messages> }
  close: undefined
  message: SocketMessageEvent<Messages>
}

export type MessageEvent<Messages, Type extends keyof Messages = keyof Messages> = {
  type: Type
  payload: Messages[Type]
}

export type MessageListenerFn<
  Messages extends PowerlineMessages = PowerlineMessages,
  Type extends keyof Messages = keyof Messages,
> = (message: MessageEvent<Messages, Type>, socket: Socket<Messages>) => any
