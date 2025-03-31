import { remarkAdmonition, rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins'
import { remarkInstall } from 'fumadocs-docgen'
import {
  defineDocs,
  defineConfig,
  defineCollections,
  metaSchema,
  frontmatterSchema,
} from 'fumadocs-mdx/config'
import { transformerTwoslash } from 'fumadocs-twoslash'
import { ModuleResolutionKind } from 'typescript'
import { z } from 'zod'

export const docs = defineDocs({
  docs: {
    async: true,
    schema: frontmatterSchema.extend({
      preview: z.string().optional(),
      index: z.boolean().default(true),
      method: z.string(),
    }),
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string(),
    }),
  },
})

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  async: true,
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z.string().date().or(z.date()).optional(),
  }),
})

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions: {
    remarkPlugins: [remarkAdmonition, remarkInstall],
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      langs: ['ts', 'js', 'html', 'tsx', 'mdx'],
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash({
          twoslashOptions: {
            compilerOptions: {
              experimentalDecorators: true,
              moduleResolution: ModuleResolutionKind.Bundler,
            },
          },
        }),
      ],
    },
  },
})
