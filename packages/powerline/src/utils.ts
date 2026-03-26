import { type PowerlineMessages, type MessageEvent } from './types.ts'

export function isMessageType<
  Messages = PowerlineMessages,
  Type extends keyof Messages = keyof Messages,
>(type: Type, message: MessageEvent<Messages>): message is MessageEvent<Messages, Type> {
  return message.type === type
}

export function assertMessageType<
  Messages = PowerlineMessages,
  Type extends keyof Messages = keyof Messages,
>(type: Type, message: MessageEvent<Messages>): asserts message is MessageEvent<Messages, Type> {
  if (!isMessageType(type, message)) {
    throw new TypeError(
      `PowerlineMessage Type Mismatch: Expected "${String(type)}" but received "${String(message.type)}"`
    )
  }
}
