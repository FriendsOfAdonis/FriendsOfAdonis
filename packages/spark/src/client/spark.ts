import Alpine from 'alpinejs'
import { HTMLComponentElement } from './components/component.js'
import { TypedEventTarget } from './event.js'
import { HttpClient } from './http.js'
import { Router } from './router/router.js'
import { AlpinePlugin } from './alpine.js'
import morph from '@alpinejs/morph'
import { HTMLErrorElement } from './components/error.js'

customElements.define('spark-component', HTMLComponentElement)
customElements.define('spark-error', HTMLErrorElement)

export type SparkEvents = {
  'history:pushState': { data: any; url?: string | URL | null | undefined }
  'history:replaceState': { data: any; url?: string | URL | null | undefined }
}

export class SparkInstance extends TypedEventTarget<SparkEvents> {
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
    window.Spark = this

    Alpine.plugin(morph as any)
    Alpine.plugin(AlpinePlugin(this))

    Alpine.start()
  }
}

declare global {
  var Alpine: Alpine.Alpine
  var Spark: SparkInstance
}
