import { inject } from '@adonisjs/core'
import { Logger } from '@adonisjs/core/logger'
import { NextFn, ResolverData } from '@foadonis/graphql'

@inject()
export default class AccessLoggerMiddleware {
  constructor(private readonly logger: Logger) {}

  use({ context, info }: ResolverData, next: NextFn) {
    const user = context.auth.user
    if (user) {
      this.logger.info(`Access: ${user.fullName} -> ${info.parentType.name}.${info.fieldName}`)
    }

    return next()
  }
}
