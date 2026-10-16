import { inject } from '@adonisjs/core'
import { Logger } from '@adonisjs/core/logger'

@inject()
export class TestService {
  logger: Logger

  constructor(logger: Logger) {
    this.logger = logger.child({ service: this.constructor.name })
  }

  greet() {
    this.logger.info('Hello world')
  }
}
