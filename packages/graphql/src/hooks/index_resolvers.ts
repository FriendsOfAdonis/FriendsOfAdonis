import { type AllHooks } from '@adonisjs/assembler/types'

export interface IndexResolversOptions {
  /**
   * Source directory for resolvers
   *
   * @default 'app/graphql/resolvers'
   * */
  source?: string

  /**
   * Import alias for resolvers
   *
   * @default '#graphql/resolvers'
   */
  importAlias?: string

  /**
   * Glob patterns for matching resolver files
   */
  glob?: string[]
}

export function indexResolvers({
  source = 'app/graphql/resolvers',
  glob = ['**/*_resolver.ts'],
  importAlias = '#graphql/resolvers',
}: IndexResolversOptions = {}): AllHooks['init'][number] {
  return {
    run(_, __, indexGenerator) {
      indexGenerator.add('graphqlResolvers', {
        source,
        glob,
        output: 'start/graphql.ts',
        importAlias,
        as(vfs, buffer, ___, helpers) {
          const filesList = vfs.asList()

          buffer.writeLine(`/*
|--------------------------------------------------------------------------
| GraphQL resolvers registration file
|--------------------------------------------------------------------------
|
| DO NOT MODIFY THIS FILE AS IT WILL BE OVERRIDDEN DURING THE BUILD PROCESS
|
| It automatically register your resolvers present in \`${source}\`.
| You can disable this behavior by removing the \`indexResolvers\` from your \`adonisrc.ts\`.
|
*/`)

          const imports = [
            `import graphql from '@foadonis/graphql/services/main'`,
            `import app from '@adonisjs/core/services/app'`,
          ]

          buffer.writeLine(imports.join('\n'))

          buffer.write(`graphql.resolvers([`).indent()

          for (const [, path] of Object.entries(filesList)) {
            const specifier = helpers.toImportPath(path)
            buffer.write(`() => import('${specifier}'),`)
          }

          buffer.dedent().write(`])`)

          buffer.write(`\ngraphql.hmr(app.makePath('${source}'))`)
        },
      })
    },
  }
}
