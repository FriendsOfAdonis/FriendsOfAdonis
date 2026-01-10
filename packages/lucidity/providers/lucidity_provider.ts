import { type ApplicationService } from '@adonisjs/core/types'

export default class LucidityProvider {
  constructor(protected app: ApplicationService) {}

  register() {}

  async ready() {}

  async shutdown() {}
}
