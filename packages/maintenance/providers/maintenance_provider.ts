import { ApplicationService } from '@adonisjs/core/types'
import { FileMaintenanceDriver } from '../src/drivers/file_maintenance_driver.js'
import { configProvider } from '@adonisjs/core'
import { RuntimeException } from '@adonisjs/core/exceptions'

export default class MaintenanceProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton('maintenance', async () => {
      const maintenanceConfigProvider = this.#config()

      const config = await configProvider.resolve<any>(this.app, maintenanceConfigProvider)
      if (!config) {
        throw new RuntimeException(
          'Invalid "config/maintenance.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      const { MaintenanceManager } = await import('../src/maintenance_manager.js')
      return new MaintenanceManager(config)
    })
  }

  async boot() {
    await import('../src/extensions.js')
  }

  #config() {
    return this.app.config.get('maintenance', {
      default: 'file',
      drivers: {
        file: new FileMaintenanceDriver(),
      },
    })
  }
}
