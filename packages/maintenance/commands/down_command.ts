/// <reference types="@adonisjs/core/providers/edge_provider" />

import 'reflect-metadata'
import { inject } from '@adonisjs/core'
import { BaseCommand, flags } from '@adonisjs/core/ace'
import { DownPayload } from '../src/types.js'

export default class DownCommand extends BaseCommand {
  static commandName = 'maintenance:down'
  static description = 'Put the application into maintenance / demo mode'

  static aliases = ['down']

  static options = {
    startApp: true,
  }

  @flags.string({
    description: 'The secret phrase that may be used to bypass maintenance mode',
    alias: 's',
  })
  declare secret: string

  @flags.number({
    description: 'The status code that should be used when returning the maintenance mode response',
    default: 503,
  })
  declare status: number

  @flags.number({
    description: 'The number of seconds after which the browser may refresh',
  })
  declare refresh?: number

  @flags.string({
    description: 'The path that users should be redirected to',
  })
  declare redirect?: string

  @flags.string({
    description: 'The view that should be prerendered for display during maintenance mode',
  })
  declare template?: string

  @flags.number({
    description: 'The number of seconds after which the request may be retried',
  })
  declare retry?: number

  @inject()
  async run(): Promise<any> {
    const maintenance = this.app.maintenance()

    if (await maintenance.active()) {
      this.logger.info('Application is already in maintenance')
      return
    }

    const payload = await this.payload()
    await maintenance.activate(payload)

    this.logger.info('Application is now in maintenance mode.')

    if (payload.secret) {
      this.logger.info(
        `You may bypass maintenance mode using the secret by accessing the path '/${payload.secret}'`
      )
    }
  }

  async payload(): Promise<DownPayload> {
    return {
      secret: this.secret,
      status: this.status,
      refresh: this.refresh,
      redirect: this.redirect,
      template: this.template && (await this.prerenderView(this.template)),
    }
  }

  async prerenderView(template: string) {
    if (!this.app.usingEdgeJS) {
      this.logger.warning(
        'You must configure Edge.js to render a maintenance page. Falling back to default maintenance page'
      )
      return
    }

    const { default: edge } = await import('edge.js')
    return edge.render(template, {
      retryAfter: this.retry,
    })
  }
}
