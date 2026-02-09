import { ConfigProvider } from '@adonisjs/core/types'
import { MaintenanceDriver } from './drivers/maintenance_driver.js'
import { MaintenanceManager } from './maintenance_manager.js'

export type DownPayload = {
  retry?: number
  refresh?: number
  secret?: string
  status: number
  template?: string
  redirect?: string
}

export type ManagerModeFactory = () => MaintenanceDriver

export interface DriversList {}
export type InferEngines<
  T extends ConfigProvider<{ engines: Record<string, ManagerModeFactory> }>,
> = Awaited<ReturnType<T['resolver']>>['engines']

export interface MaintenanceService extends MaintenanceManager<
  DriversList extends Record<string, ManagerModeFactory> ? DriversList : never
> {}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    maintenance: MaintenanceService
  }
}
