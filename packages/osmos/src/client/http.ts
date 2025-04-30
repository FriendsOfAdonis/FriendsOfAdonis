export class HttpClient {
  fetch(method: string, path: string | URL, body?: Record<string, any>) {
    return fetch(path, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  post(path: string | URL, body: Record<string, any>) {
    return this.fetch('POST', path, body)
  }

  get(path: string | URL) {
    return this.fetch('GET', path)
  }
}
