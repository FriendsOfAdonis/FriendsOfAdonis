import stringHelpers from '@adonisjs/core/helpers/string'
import { AllHooks } from '@adonisjs/core/types/app'

export interface IndexFeaturesOptions {
  /**
   * Source directory for resolvers
   *
   * @default 'app/features'
   * */
  source?: string

  /**
   * Import alias for resolvers
   *
   * @default '#features'
   */
  importAlias?: string

  /**
   * Glob patterns for matching resolver files
   */
  glob?: string[]

  /**
   * Directory segments to skip when building the features tree.
   *
   * For example, if your features live in `app/identity/features/test_feature.ts`
   * and you want the generated tree to be `Identity.Test` instead of
   * `Identity.Features.Test`, set `skipSegments: ['features']`.
   *
   * @default ['features']
   */
  skipSegments?: string[]

  /**
   * Character used to separate feature segments.
   *
   * @default '.'
   */
  separator?: string
}

export function indexFeatures({
  source = 'app/features',
  importAlias = '#features',
  glob = ['**/*_feature.ts'],
  skipSegments = ['features'],
  separator = '.',
}: IndexFeaturesOptions = {}): AllHooks['init'][number] {
  return {
    run(_, __, indexGenerator) {
      indexGenerator.add('features', {
        source,
        glob,
        output: '.adonisjs/server/features.ts',
        importAlias,
        skipSegments,
        as(vfs, buffer, ___, helpers) {
          const filesList = vfs.asList({
            transformKey: (key) => {
              const paths = key.split('/').filter((p) => !skipSegments.includes(p))
              return stringHelpers.create(paths.join(separator)).removeSuffix('_feature').toString()
            },
            transformValue: (value) => `() => import('${helpers.toImportPath(value)}')`,
          })

          buffer.write(`export const features = {`).indent()

          for (const [key, value] of Object.entries(filesList)) {
            buffer.write(`${JSON.stringify(key)}: ${value},`)
          }

          buffer.dedent().writeLine(`}`).indent()
        },
      })
    },
  }
}
