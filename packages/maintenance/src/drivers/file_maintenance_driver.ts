import app from '@adonisjs/core/services/app'
import { MaintenanceDriver } from './maintenance_driver.js'
import { rm, writeFile, stat, readFile } from 'node:fs/promises'
import { DownPayload } from '../types.js'

export class FileMaintenanceDriver implements MaintenanceDriver {
  public async activate(data: DownPayload): Promise<void> {
    await writeFile(this.#path(), JSON.stringify(data))
  }

  public async deactivate(): Promise<void> {
    await rm(this.#path())
  }

  public async active(): Promise<boolean> {
    return stat(this.#path())
      .then(() => true)
      .catch(() => false)
  }

  public async data(): Promise<DownPayload> {
    return readFile(this.#path()).then((r) => JSON.parse(r.toString()))
  }

  #path(): string {
    return app.tmpPath('down.lock')
  }
}
