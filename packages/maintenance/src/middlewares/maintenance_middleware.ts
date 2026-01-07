/// <reference types="@adonisjs/core/providers/edge_provider" />

import { type HttpContext, type Request, type Response } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import hash from '@adonisjs/core/services/hash'
import { type NextFn } from '@adonisjs/core/types/http'
import { type DownPayload } from '../types.js'

export default class MaintenanceMiddleare {
  protected cookie = 'adonis_maintenance'

  async handle(ctx: HttpContext, next: NextFn) {
    const maintenance = app.maintenance()

    if (!(await maintenance.active())) return next()

    const data = await maintenance.data()

    if (data.secret && ctx.request.url(false) === `/${data.secret}`) {
      return this.bypassResponse(ctx.response, data.secret)
    }

    if (data.secret && (await this.hasValidBypassCookie(ctx.request, data.secret))) {
      return next()
    }

    if (data.redirect) {
      return ctx.response.redirect().toPath(data.redirect)
    }

    if (data.template) {
      return this.withHeaders(ctx.response, data).status(data.status).send(data.template)
    }

    return this.withHeaders(ctx.response, data)
      .status(data.status)
      .send(data.template ?? 'Service Unavailable')
  }

  protected async bypassResponse(response: Response, secret: string) {
    return response
      .cookie(this.cookie, await hash.make(secret))
      .redirect()
      .toPath('/')
  }

  protected async hasValidBypassCookie(request: Request, secret: string) {
    const cookie = request.cookie(this.cookie)
    if (!cookie) return false
    return hash.verify(cookie, secret)
  }

  protected withHeaders(response: Response, data: DownPayload) {
    if (data.retry) {
      response.header('Retry-After', data.retry)
    }

    if (data.refresh) {
      response.header('Refresh', data.refresh)
    }

    return response
  }
}
