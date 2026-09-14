import type { InferMetaType, InferPageType } from 'fumadocs-core/source'
import { loader } from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'
import {
  docs as docsCollection,
  blog as blogCollection,
  workbooks as workbooksCollection,
} from 'fumadocs-mdx:collections/server'

export const source = loader(docsCollection.toFumadocsSource(), {
  baseUrl: '/docs',
  plugins: [lucideIconsPlugin()],
})

export const blog = loader(toFumadocsSource(blogCollection, []), {
  baseUrl: '/blog',
})

export const workbooks = loader(toFumadocsSource(workbooksCollection, []), {
  baseUrl: '/workbooks',
})

export type Page = InferPageType<typeof source>
export type Meta = InferMetaType<typeof source>
