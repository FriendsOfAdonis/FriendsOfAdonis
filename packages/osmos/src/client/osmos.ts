import Alpine from 'alpinejs'
import { HTMLComponentElement } from './component.js'
import { TypedEventTarget } from './event.js'
import { HttpClient } from './http.js'
import { Router } from './router/router.js'
import { AlpinePlugin } from './alpine.js'
import morph from '@alpinejs/morph'

customElements.define('osmos-component', HTMLComponentElement)

export type OsmosEvents = {
  'history:pushState': { data: any; url?: string | URL | null | undefined }
  'history:replaceState': { data: any; url?: string | URL | null | undefined }
}

export class OsmosInstance extends TypedEventTarget<OsmosEvents> {
  router = new Router()
  http = new HttpClient()

  start() {
    window.Alpine = Alpine
    window.Osmos = this

    Alpine.plugin(morph as any)
    Alpine.plugin(AlpinePlugin(this))

    Alpine.start()
  }
}

declare global {
  var Alpine: Alpine.Alpine
  var Osmos: OsmosInstance
}
