import Alpine from 'alpinejs'
import { HTMLComponentElement } from './components/component.js'
import { TypedEventTarget } from './event.js'
import { HttpClient } from './http.js'
import { Router } from './router/router.js'
import { AlpinePlugin } from './alpine.js'
import morph from '@alpinejs/morph'
import { HTMLErrorElement } from './components/error.js'

customElements.define('osmos-component', HTMLComponentElement)
customElements.define('osmos-error', HTMLErrorElement)

export type OsmosEvents = {
  'history:pushState': { data: any; url?: string | URL | null | undefined }
  'history:replaceState': { data: any; url?: string | URL | null | undefined }
}

export class OsmosInstance extends TypedEventTarget<OsmosEvents> {
  router = new Router()
  http = new HttpClient()

  start() {
    this.http.on('response', (event) => {
      const response = event.detail.response
      if (!event.detail.response.ok) {
        event.preventDefault()

        if (response.status === 309) {
          const location = response.headers.get('Location')
          if (!location) return
          this.router.push(location)
        } else {
          HTMLErrorElement.fromResponse(response)
        }
      }
    })

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
