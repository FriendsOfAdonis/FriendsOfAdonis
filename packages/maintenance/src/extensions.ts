import { Application } from '@adonisjs/core/app'
import { type MaintenanceDriver } from './drivers/maintenance_driver.js'
import maintenance from '../services/main.js'

Application.macro('maintenance', function (this: Application<any>) {
  return maintenance.driver()
})

declare module '@adonisjs/core/app' {
  interface Application<ContainerBindings extends Record<any, any>> {
    maintenance(): MaintenanceDriver
  }
}
