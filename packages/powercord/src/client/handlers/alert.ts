import { defineMessageHandler } from './main.js'

export default defineMessageHandler('alert', ({ detail }) => {
  alert(detail.message)
})
