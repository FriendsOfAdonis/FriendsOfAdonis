import Alpine from 'alpinejs'
import { TypedEventTarget } from '../event.js'

export type RouterEvents = {
  pushState: { data: any; url: string | URL | null | undefined }
  replaceState: { data: any; url: string | URL | null | undefined }
  popstate: {}
}

export class Router extends TypedEventTarget<RouterEvents> {
  constructor() {
    super()

    this.#monkeyPatch()

    this.on('pushState', (event) => {
      if (!event.detail.url) return
      this.#replacePage(event.detail.url)
    })

    this.on('replaceState', (event) => {
      if (!event.detail.url) return
      this.#replacePage(event.detail.url)
    })

    window.addEventListener('popstate', () => {
      this.#replacePage(document.location.href)
    })
  }

  #monkeyPatch() {
    const originalPushState = window.history.pushState
    window.history.pushState = (data, unused, url) => {
      const event = this.emit('pushState', { data, url })
      if (event.defaultPrevented) return
      return originalPushState.call(window.history, data, unused, url)
    }

    const originalReplaceState = window.history.replaceState
    window.history.replaceState = (data, unused, url) => {
      const event = this.emit('replaceState', { data, url })
      if (event.defaultPrevented) return
      originalReplaceState.call(window.history, data, unused, url)
    }
  }

  push(path: string) {
    window.history.pushState({}, '', path)
  }

  replace(path: string) {
    window.history.replaceState({}, '', path)
  }

  async #replacePage(path: string | URL) {
    const page = await Spark.http.get(path)
    const html = await page.text()

    const doc = new DOMParser().parseFromString(html, 'text/html')
    const body = doc.querySelector('body')
    const head = doc.querySelector('head')

    if (!body) throw new Error('The page does not return a body')

    if (head) {
      Alpine.morph(document.head, head, {})
    }

    Alpine.morph(document.body, body, {})
  }
}
