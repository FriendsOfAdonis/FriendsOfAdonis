import { ApplicationService } from '@adonisjs/core/types'
import transmit from '@adonisjs/transmit/services/main'
import { TransportContract } from './transports/tranport.js'

export type PowercordConfig = {
  transport: TransportConfigProvider<() => TransportContract>
}

export type ResolvedConfig = {
  transport: () => TransportContract
}

export type TransportFactory = () => TransportContract

export type TransportConfigProvider<Factory extends TransportFactory> = {
  type: 'provider'
  resolver: (app: ApplicationService) => Promise<Factory>
}

export interface PowercordMessages {
  alert: { message?: string }
  log: { level: 'log' | 'info' | 'error' | 'warn' | 'debug' | 'trace'; message: string }
  navigate: { url: string }
  reload: {}
}

export type PowercordMessageName = keyof PowercordMessages

export type TransmitService = typeof transmit
