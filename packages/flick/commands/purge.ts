import { args, BaseCommand, flags } from '@adonisjs/core/ace'

export default class PurgeCommand extends BaseCommand {
  static commandName = 'flick:purge'
  static description = 'Purge cached feature resolutions'

  static options = { startApp: true }

  @args.spread({
    description: 'Features to purge. Purges every feature when omitted',
    required: false,
  })
  declare features?: string[]

  @flags.array({
    description: 'Purge every feature except the given ones',
  })
  declare except?: string[]

  async run(): Promise<void> {
    if (this.features?.length && this.except?.length) {
      this.logger.error('The "--except" flag cannot be combined with feature arguments')
      this.exitCode = 1
      return
    }

    const flick = await this.app.container.make('flick')
    const known = flick.features

    const unknown = [...(this.features ?? []), ...(this.except ?? [])].filter(
      (feature) => !known.includes(feature)
    )

    if (unknown.length) {
      this.logger.error(`Unknown feature(s): ${unknown.join(', ')}`)
      this.exitCode = 1
      return
    }

    const targets = this.except?.length
      ? known.filter((feature) => !this.except!.includes(feature))
      : this.features

    await flick.purge(targets)

    if (!targets) {
      this.logger.success('Purged every feature')
    } else if (targets.length) {
      this.logger.success(`Purged feature(s): ${targets.join(', ')}`)
    } else {
      this.logger.info('No features to purge')
    }
  }
}
