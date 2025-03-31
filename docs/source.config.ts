import { remarkAdmonition, rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins'
import { remarkInstall } from 'fumadocs-docgen'
import { defineDocs, defineConfig } from 'fumadocs-mdx/config'
import { transformerTwoslash } from 'fumadocs-twoslash'
import { ModuleKind, ModuleResolutionKind } from 'typescript'

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
})

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions: {
    remarkPlugins: [remarkAdmonition, remarkInstall],
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
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
