import { defineMessageHandler } from './main.js'

export default defineMessageHandler('log', ({ detail }) => {
  console[detail.level](detail.message)
})
