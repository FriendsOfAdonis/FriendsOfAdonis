import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'graphql': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'graphql': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'graphql': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'graphql': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'graphql': { paramsTuple?: []; params?: {} }
  }
  OPTIONS: {
    'graphql': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}