import Alpine from 'alpinejs'
import { HTMLSparkComponentElement } from './components/component.js'
import { TypedEventTarget } from './event.js'
import { Router } from './router/router.js'
import { AlpinePlugin } from './alpine.js'
import { HTMLErrorElement } from './components/error.js'
import { Directive, DirectiveDefinition } from './directives/main.js'
import { PowercordClient } from '@foadonis/powercord/client'
import { SparkMessage } from '../types.js'

customElements.define('spark-component', HTMLSparkComponentElement)
customElements.define('spark-error', HTMLErrorElement)

export type SparkEvents = {
  'initialized': {}
  'element:init': { element: HTMLElement }
  'directive:init': {
    element: HTMLElement
    directive: Directive
    component: HTMLSparkComponentElement
    cleanup: (cb: () => void) => void
  }
  'directive:global:init': {
    element: HTMLElement
    directive: Directive
    cleanup: (cb: () => void) => void
  }
  'history:pushState': { data: any; url?: string | URL | null | undefined }
  'history:replaceState': { data: any; url?: string | URL | null | undefined }
}

export class SparkInstance extends TypedEventTarget<SparkEvents> {
  router = new Router()

  powercord = new PowercordClient({
    id: window.__spark_id,
  })

  start() {
    window.Alpine = Alpine
    window.Spark = this

    this.powercord.on('spark:morph', ({ detail }) => {
      const element = document.querySelector(`spark-component[spark\\:id='${detail.componentId}']`)
      if (!element) {
        console.warn(
          `[spark] could not morph component ${detail.componentId} as it is not present in the DOM`
        )
        return
      }

      Alpine.morph(element, detail.html, {})
    })

    this.powercord.on('navigate', (event) => {
      event.preventDefault()
      event.stopPropagation()

      this.router.push(event.detail.url)
    })

    Alpine.plugin(AlpinePlugin(this))

    Alpine.start()

    this.powercord.start()
    this.emit('initialized', {})
  }

  send(messages: SparkMessage[]) {
    fetch('/__spark', {
      method: 'POST',
      body: JSON.stringify(messages),
      headers: {
        'content-type': 'application/json',
        'x-powercord-id': window.__spark_id,
      },
    })
  }

  directive(name: string, callback: DirectiveDefinition['callback']) {
    this.on('directive:init', (event) => {
      if (event.detail.directive.name !== name) return
      callback({
        element: event.detail.element,
        component: event.detail.component,
        cleanup: event.detail.cleanup,
        directive: event.detail.directive,
      })
    })
  }

  globalDirective(name: string, callback: DirectiveDefinition['callback']) {
    this.on('directive:global:init', (event) => {
      if (event.detail.directive.name !== name) return
      callback({
        element: event.detail.element,
        cleanup: event.detail.cleanup,
        directive: event.detail.directive,
      } as any) // TODO: Type global directives
    })
  }

  closestComponent(element: Element) {
    const closest = Alpine.findClosest(element, (el) => el.tagName === 'SPARK-COMPONENT')
    return closest as HTMLSparkComponentElement
  }
}

declare global {
  var Alpine: Alpine.Alpine
  var Spark: SparkInstance
  // eslint-disable-next-line @typescript-eslint/naming-convention
  var __spark_id: string
}
