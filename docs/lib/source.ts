import type { InferMetaType, InferPageType } from 'fumadocs-core/source'
import { loader } from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'
import { docs, blog as blogPosts } from 'fumadocs-mdx:collections/server'

export const source = loader(docs.toFumadocsSource(), {
  baseUrl: '/docs',
  plugins: [lucideIconsPlugin()],
})

export const blog = loader(toFumadocsSource(blogPosts, []), {
  baseUrl: '/blog',
})

export type Page = InferPageType<typeof source>
export type Meta = InferMetaType<typeof source>
