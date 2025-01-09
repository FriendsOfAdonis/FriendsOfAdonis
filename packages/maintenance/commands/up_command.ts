import 'reflect-metadata'
import { inject } from '@adonisjs/core'
import { BaseCommand } from '@adonisjs/core/ace'

export default class UpCommand extends BaseCommand {
  static commandName = 'maintenance:up'
  static description = 'Bring the application out of maintenance mode'

  static aliases = ['up']

  static options = {
    startApp: true,
  }

  @inject()
  async run(): Promise<any> {
    const maintenance = this.app.maintenance()

    if (!(await maintenance.active())) {
      this.logger.info('Application is not in maintenance')
      return
    }

    await maintenance.deactivate()

    this.logger.info('Application is now live.')
  }
}
