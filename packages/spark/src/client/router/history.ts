export class SparkHistory implements History {
  original: History

  get length(): number {
    return this.original.length
  }

  get scrollRestoration(): ScrollRestoration {
    return this.original.scrollRestoration
  }

  constructor() {
    this.original = window.history

    window.history.pushState = this.pushState.bind(this)
    window.history.replaceState = this.replaceState.bind(this)
  }

  get state() {
    return this.original.state
  }

  back(): void {
    this.original.back()
  }

  forward(): void {
    this.original.forward()
  }

  go(delta?: number): void {
    this.original.go(delta)
  }

  pushState(data: any, unused: string, url?: string | URL | null): void {
    console.log('test', this)
    Spark.emit('history:pushState', { data, url })
    return this.original.pushState(data, unused, url)
  }

  replaceState(data: any, unused: string, url?: string | URL | null): void {
    return this.original.replaceState(data, unused, url)
  }
}
