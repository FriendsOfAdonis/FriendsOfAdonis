import { remarkStructureDefaultOptions } from 'fumadocs-core/mdx-plugins'
import {
  defineDocs,
  defineConfig,
  defineCollections,
  metaSchema,
  frontmatterSchema,
} from 'fumadocs-mdx/config'
import lastModified from 'fumadocs-mdx/plugins/last-modified'
import { ModuleResolutionKind } from 'typescript'
import { z } from 'zod'

export const docs = defineDocs({
  docs: {
    async: true,
    schema: frontmatterSchema.extend({
      preview: z.string().optional(),
      index: z.boolean().default(false),
      method: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
    },
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
    thumbnail: z.string(),
    date: z.iso.date().or(z.date()),
  }),
})

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: async () => {
    const { rehypeCodeDefaultOptions } = await import('fumadocs-core/mdx-plugins/rehype-code')
    const { remarkAdmonition } = await import('fumadocs-core/mdx-plugins/remark-admonition')
    const { remarkNpm } = await import('fumadocs-core/mdx-plugins/remark-npm')
    const { transformerTwoslash } = await import('fumadocs-twoslash')
    const { transformerNotationFocus } = await import('@shikijs/transformers')
    const { createFileSystemTypesCache } = await import('fumadocs-twoslash/cache-fs')

    return {
      remarkPlugins: [remarkAdmonition, remarkNpm],
      remarkStructureOptions: {
        types: [...remarkStructureDefaultOptions.types, 'code'],
      },
      remarkCodeTabOptions: {
        parseMdx: true,
      },
      remarkNpmOptions: {
        persist: {
          id: 'package-manager',
        },
      },
      rehypeCodeOptions: {
        ...rehypeCodeDefaultOptions,
        langs: ['ts', 'js', 'html', 'tsx', 'mdx'],
        inline: ['tailing-curly-colon'],
        themes: {
          light: 'catppuccin-latte',
          dark: 'catppuccin-mocha',
        },
        transformers: [
          ...(rehypeCodeDefaultOptions.transformers ?? []),
          transformerNotationFocus(),
          transformerTwoslash({
            typesCache: createFileSystemTypesCache(),
            twoslashOptions: {
              compilerOptions: {
                experimentalDecorators: true,
                moduleResolution: ModuleResolutionKind.Bundler,
              },
            },
          }),
        ],
      },
    } as any // TODO: Fix type
  },
})
