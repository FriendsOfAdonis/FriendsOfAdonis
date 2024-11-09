import { inject } from '@adonisjs/core'
import { Logger } from '@adonisjs/core/logger'
import { NextFn, ResolverData } from '@foadonis/graphql'

@inject()
export default class PerformanceLoggerMiddleware {
  constructor(private readonly logger: Logger) {}

  async use({ info }: ResolverData, next: NextFn) {
    const start = Date.now()
    await next()
    const diff = Date.now() - start
    this.logger.info(`${info.parentType.name}.${info.fieldName} [${diff}ms]`)
  }
}
