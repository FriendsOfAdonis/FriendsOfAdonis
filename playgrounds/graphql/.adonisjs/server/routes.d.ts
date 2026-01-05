import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
  }
  GET: {
  }
  POST: {
  }
  PATCH: {
  }
  HEAD: {
  }
  OPTIONS: {
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}