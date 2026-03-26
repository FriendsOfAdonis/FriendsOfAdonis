export class PowerlineError extends Error {
  override name = 'PowerlineError'
}

export class PowerlineNotInitializedError extends PowerlineError {
  override name = 'PowerlineNotInitializedError'
  override message = 'WebSocket server is not initialized. Call start() first.'
}

export class PowerlineNoServerError extends PowerlineError {
  override name = 'PowerlineNoServerError'
  override message =
    'No HTTP server available. Ensure the AdonisJS HTTP server is started before starting Powerline.'
}
