import logHandler from './handlers/log.js'
import navigateHandler from './handlers/navigate.js'
import alertHandler from './handlers/alert.js'

export { PowercordClient } from './client.js'

export const defaultHandlers = [logHandler, navigateHandler, alertHandler]
