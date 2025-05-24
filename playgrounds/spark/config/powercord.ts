import { defineConfig, transports } from '@foadonis/powercord'

export default defineConfig({
  transport: transports.transmit({
    path: '/powercord',
  }),
})
