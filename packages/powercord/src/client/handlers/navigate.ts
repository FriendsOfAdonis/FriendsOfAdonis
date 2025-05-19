import { defineMessageHandler } from './main.js'

export default defineMessageHandler('navigate', ({ detail }) => {
  document.location.href = detail.url
})
