import transmit from '@adonisjs/transmit/services/main'

export type PowercordConfig = {
  path: string
}

export interface PowercordMessages {
  alert: { message?: string }
  log: { level: 'log' | 'info' | 'error' | 'warn' | 'debug' | 'trace'; message: string }
  navigate: { url: string }
  reload: {}
}

export type PowercordMessageName = keyof PowercordMessages

export type TransmitService = typeof transmit
