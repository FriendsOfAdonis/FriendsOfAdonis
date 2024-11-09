import { remarkAdmonition } from 'fumadocs-core/mdx-plugins'
import { defineDocs, defineConfig } from 'fumadocs-mdx/config'

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
})

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkAdmonition],
  },
})
