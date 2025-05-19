import { defineMessageHandler } from './main.js'

export default defineMessageHandler('reload', () => {
  document.location.reload()
})
