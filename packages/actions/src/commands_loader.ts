import { type CommandMetaData, type LoadersContract } from '@adonisjs/core/types/ace'
import { fsReadAll, importDefault, slash } from '@poppinss/utils'
import { basename, extname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { type BaseAction } from './base_action.ts'
import { type BaseCommand } from '@adonisjs/core/ace'
import { type ApplicationService } from '@adonisjs/core/types'
import { generateCommandName, implementsAsCommand } from './utils.ts'
import { type Constructor } from '@adonisjs/core/types/common'
import type { AsCommandOptions, AsCommandContract } from './mixins/as_command.ts'

const JS_MODULES = ['.js', '.cjs', '.mjs']

/**
 * Custom Ace commands loader that discovers actions implementing
 * AsCommand and exposes them as CLI commands.
 */
export class ActionCommandsLoader implements LoadersContract<typeof BaseCommand> {
  #actionsDirectory: string
  #commands: { command: typeof BaseCommand; filePath: string }[] = []

  /**
   * @param actionsDirectory - Absolute path to the actions directory
   */
  constructor(actionsDirectory: string) {
    this.#actionsDirectory = actionsDirectory
  }

  /**
   * Retrieves a command class by its metadata.
   */
  async getCommand(metadata: CommandMetaData): Promise<typeof BaseCommand | null> {
    const entry = this.#commands.find((m) => m.filePath === metadata.filePath)
    if (!entry) return null
    return entry.command
  }

  serialize(Action: Constructor<AsCommandContract>): CommandMetaData {
    const {
      commandName = generateCommandName(Action.name),
      description = `Run the action ${Action.name}`,
      aliases = [],
      flags = [],
      args = [],
      options = {},
    } = '$commandOptions' in Action ? (Action.$commandOptions as AsCommandOptions) : {}

    const [namespace, name] = commandName.split(':')

    return {
      commandName,
      description,
      namespace: name ? namespace : null,
      aliases: aliases,
      flags: flags,
      args: args,
      options,
    }
  }

  /**
   * Scans the actions directory and returns metadata for all
   * actions implementing AsCommand.
   */
  async getMetaData(): Promise<CommandMetaData[]> {
    const actions = await this.#loadActions()

    return Object.entries(actions).map(([filePath, Action]) => ({
      filePath,
      ...this.serialize(Action),
    }))
  }

  async #loadActions() {
    const commands: Record<string, Constructor<AsCommandContract>> = {}

    const files = await fsReadAll(this.#actionsDirectory, {
      pathType: 'url',
      ignoreMissingRoot: true,
      filter: (filePath: string) => {
        const ext = extname(filePath)

        if (basename(filePath).startsWith('_')) return false
        if (JS_MODULES.includes(ext)) return true
        if (ext === '.ts' && !filePath.endsWith('.d.ts')) return true
        return false
      },
    })

    for (let file of files) {
      if (file.endsWith('.ts')) {
        file = file.replace(/\.ts$/, '.js')
      }

      const relativeFileName = slash(relative(this.#actionsDirectory, fileURLToPath(file)))

      const Action = await importDefault<{ default: typeof BaseAction }>(
        () => import(file),
        relativeFileName
      )

      if (implementsAsCommand(Action.prototype)) {
        commands[relativeFileName] = Action as unknown as Constructor<AsCommandContract>
      }
    }

    return commands
  }

  /**
   * Registers the loader with Ace to discover action-based commands.
   */
  static async configure(app: ApplicationService) {
    const ace = await app.container.make('ace')
    const directory = app.rcFile.directories.actions ?? 'app/actions'
    ace.addLoader(new ActionCommandsLoader(directory))
  }
}
