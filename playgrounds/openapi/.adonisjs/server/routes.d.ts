import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'api.v1.test': { paramsTuple?: []; params?: {} }
    'api.v1.posts.index': { paramsTuple?: []; params?: {} }
    'api.v1.posts.create': { paramsTuple?: []; params?: {} }
    'api.v1.posts.store': { paramsTuple?: []; params?: {} }
    'api.v1.posts.show': { paramsTuple: [ParamValue]; params: { id: ParamValue } }
    'api.v1.posts.edit': { paramsTuple: [ParamValue]; params: { id: ParamValue } }
    'api.v1.posts.update': { paramsTuple: [ParamValue]; params: { id: ParamValue } }
    'api.v1.posts.destroy': { paramsTuple: [ParamValue]; params: { id: ParamValue } }
    'api.v1.create_recipe': { paramsTuple?: []; params?: {} }
    'api.v2.create_recipe': { paramsTuple?: []; params?: {} }
    'openapi.v1.openapi.html': { paramsTuple?: []; params?: {} }
    'openapi.v1.openapi.json': { paramsTuple?: []; params?: {} }
    'openapi.v1.openapi.yaml': { paramsTuple?: []; params?: {} }
    'openapi.v2.openapi.html': { paramsTuple?: []; params?: {} }
    'openapi.v2.openapi.json': { paramsTuple?: []; params?: {} }
    'openapi.v2.openapi.yaml': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'api.v1.test': { paramsTuple?: []; params?: {} }
    'api.v1.posts.store': { paramsTuple?: []; params?: {} }
    'api.v2.create_recipe': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'api.v1.posts.index': { paramsTuple?: []; params?: {} }
    'api.v1.posts.create': { paramsTuple?: []; params?: {} }
    'api.v1.posts.show': { paramsTuple: [ParamValue]; params: { id: ParamValue } }
    'api.v1.posts.edit': { paramsTuple: [ParamValue]; params: { id: ParamValue } }
    'api.v1.create_recipe': { paramsTuple?: []; params?: {} }
    'openapi.v1.openapi.html': { paramsTuple?: []; params?: {} }
    'openapi.v1.openapi.json': { paramsTuple?: []; params?: {} }
    'openapi.v1.openapi.yaml': { paramsTuple?: []; params?: {} }
    'openapi.v2.openapi.html': { paramsTuple?: []; params?: {} }
    'openapi.v2.openapi.json': { paramsTuple?: []; params?: {} }
    'openapi.v2.openapi.yaml': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'api.v1.posts.index': { paramsTuple?: []; params?: {} }
    'api.v1.posts.create': { paramsTuple?: []; params?: {} }
    'api.v1.posts.show': { paramsTuple: [ParamValue]; params: { id: ParamValue } }
    'api.v1.posts.edit': { paramsTuple: [ParamValue]; params: { id: ParamValue } }
    'api.v1.create_recipe': { paramsTuple?: []; params?: {} }
    'openapi.v1.openapi.html': { paramsTuple?: []; params?: {} }
    'openapi.v1.openapi.json': { paramsTuple?: []; params?: {} }
    'openapi.v1.openapi.yaml': { paramsTuple?: []; params?: {} }
    'openapi.v2.openapi.html': { paramsTuple?: []; params?: {} }
    'openapi.v2.openapi.json': { paramsTuple?: []; params?: {} }
    'openapi.v2.openapi.yaml': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'api.v1.posts.update': { paramsTuple: [ParamValue]; params: { id: ParamValue } }
  }
  PATCH: {
    'api.v1.posts.update': { paramsTuple: [ParamValue]; params: { id: ParamValue } }
  }
  DELETE: {
    'api.v1.posts.destroy': { paramsTuple: [ParamValue]; params: { id: ParamValue } }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}
