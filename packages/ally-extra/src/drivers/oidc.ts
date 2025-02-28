import { HttpContext } from '@adonisjs/core/http'

export type OIDCDriverConfig = {
  discoveryUrl: string
}

export class OIDCDriver {
  constructor(ctx: HttpContext, config: OIDCDriverConfig) {}
}
