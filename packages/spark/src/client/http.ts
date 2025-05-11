import { TypedEventTarget } from './event.js'

export type HttpClientEvents = {
  fetch: { method: string; path: string | URL; body?: Record<string, any> }
  response: { response: Response }
  error: { error: any }
}

export class HttpClient extends TypedEventTarget<HttpClientEvents> {
  fetch(method: string, path: string | URL, body?: Record<string, any>) {
    return new Promise<Response>(async (res) => {
      this.emit('fetch', { method, path, body })

      try {
        const response = await fetch(path, {
          method,
          body: body ? JSON.stringify(body) : undefined,
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const event = this.emit('response', { response })
        if (event.defaultPrevented) return
        res(response)
      } catch (error) {
        this.emit('error', { error })
      }
    })
  }

  post(path: string | URL, body: Record<string, any>) {
    return this.fetch('POST', path, body)
  }

  get(path: string | URL) {
    return this.fetch('GET', path)
  }
}
