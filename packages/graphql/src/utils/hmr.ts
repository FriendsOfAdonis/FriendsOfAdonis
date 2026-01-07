import { type HotHookMessage } from '@adonisjs/assembler/types'

export function isHotHookMessage(message: unknown): message is HotHookMessage {
  return (
    message !== null &&
    typeof message === 'object' &&
    'type' in message &&
    typeof message.type === 'string' &&
    message.type.startsWith('hot-hook:')
  )
}
