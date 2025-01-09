import { Application } from '@adonisjs/core/app'
import { MaintenanceDriver } from './drivers/maintenance_driver.js'
import maintenance from '../services/main.js'
import { ContainerBindings } from '@adonisjs/core/types'

Application.macro('maintenance', function (this: Application<ContainerBindings>) {
  return maintenance.driver()
})

declare module '@adonisjs/core/app' {
  interface Application<ContainerBindings> {
    maintenance(): MaintenanceDriver
  }
}
