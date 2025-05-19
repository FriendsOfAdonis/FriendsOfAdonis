import { renderToReadableStream, renderToString } from './jsx/render/main.js'
import { jsx } from './jsx/runtime/jsx.js'
import { FC, SparkElement, SparkNode } from './jsx/types/jsx.js'
import { SparkInstance } from './spark_instance.js'

export class Renderer {
  #spark: SparkInstance
  #layout?: FC<{ children: SparkNode }>

  constructor(spark: SparkInstance) {
    this.#spark = spark
  }

  layout(layout: FC<{ children: SparkNode }>) {
    this.#layout = layout
    return this
  }

  render(component: SparkElement) {
    const root = this.#layout ? jsx(this.#layout, { children: component }) : component

    return {
      toReadableStream: () => {
        return renderToReadableStream(root, this.#spark)
      },
      toString: () => {
        return renderToString(root, this.#spark)
      },
    }
  }
}
