import { Renderable } from './contracts/renderable.js'

export class Renderer {
  #component: Renderable
  #layout?: (children: any) => any

  constructor(component: Renderable) {
    this.#component = component
  }

  layout(layout: (children: any) => any) {
    this.#layout = layout
    return this
  }

  async toResponse(): Promise<Response> {
    if (!this.#layout) throw new Error('No layout')

    return this.#layout(await this.#component.render())
  }
}
