import { RuntimeException } from '@adonisjs/core/exceptions'
import { type ManagerModeFactory as ManagerDriverFactory } from './types.js'

export class MaintenanceManager<KnownDrivers extends Record<string, ManagerDriverFactory>> {
  #cachedDrivers: Map<keyof KnownDrivers, ReturnType<KnownDrivers[keyof KnownDrivers]>> = new Map()

  constructor(public config: { default?: keyof KnownDrivers; drivers: KnownDrivers }) {}

  driver<DriverName extends keyof KnownDrivers>(driver?: DriverName) {
    const driverToUse = (driver || this.config.default) as keyof KnownDrivers
    if (!driverToUse) throw new RuntimeException('No search engine selected')

    if (this.#cachedDrivers.has(driverToUse)) {
      return this.#cachedDrivers.get(driverToUse)!
    }

    /**
     * Otherwise create a new instance and cache it
     */
    const newEngine = this.config.drivers[driverToUse]() as ReturnType<KnownDrivers[DriverName]>
    this.#cachedDrivers.set(driverToUse, newEngine)
    return newEngine
  }
}
