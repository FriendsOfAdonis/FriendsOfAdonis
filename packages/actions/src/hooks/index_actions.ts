import { type RecursiveFileTree, type AllHooks } from '@adonisjs/assembler/types'
import stringHelpers from '@adonisjs/core/helpers/string'

export interface IndexActionsOptions {
  /**
   * Source directory for resolvers
   *
   * @default 'app/acitons'
   * */
  source?: string

  /**
   * Import alias for resolvers
   *
   * @default '#actions'
   */
  importAlias?: string

  /**
   * Glob patterns for matching resolver files
   */
  glob?: string[]
}

/**
 * Assembler hook that generates an index file for all actions.
 * The generated file exports a tree structure of lazy-loaded actions.
 */
export function indexActions({
  source = 'app/actions',
  importAlias = '#actions',
  glob = ['**/*_action.ts'],
}: IndexActionsOptions = {}): AllHooks['init'][number] {
  return {
    run(_, __, indexGenerator) {
      indexGenerator.add('actions', {
        source,
        glob,
        output: '.adonisjs/server/actions.ts',
        importAlias,
        as(vfs, buffer, ___, helpers) {
          function handleEntry(tree: RecursiveFileTree) {
            for (const [key, entry] of Object.entries(tree)) {
              const name = stringHelpers.create(key).pascalCase().removeSuffix('Action').toString()
              if (typeof entry === 'string') {
                buffer.write(`${name}: loader(() => import('${helpers.toImportPath(entry)}')),`)
                continue
              } else {
                buffer.write(`${name}: {`).indent()
                handleEntry(entry)
                buffer.dedent().write(`},`)
              }
            }
          }

          const filesList = vfs.asTree()

          buffer.writeLine(`import { loader } from '@foadonis/actions'`)
          buffer.write(`export const actions = {`).indent()

          handleEntry(filesList)

          buffer.dedent().write(`}`).indent()
        },
      })
    },
  }
}
