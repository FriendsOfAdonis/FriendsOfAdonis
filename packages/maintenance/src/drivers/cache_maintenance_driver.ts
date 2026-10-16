import { type MaintenanceDriver } from './maintenance_driver.js'
import { type DownPayload } from '../types.js'
import { RuntimeException } from '@adonisjs/core/exceptions'

export class CacheMaintenanceDriver implements MaintenanceDriver {
  #key: string

  constructor(key: string = 'friendsofadonis:maintenance:down') {
    this.#key = key
  }

  public async activate(data: DownPayload): Promise<void> {
    const store = await this.getStore()
    await store.set({
      key: this.#key,
      value: data,
    })
  }

  public async deactivate(): Promise<void> {
    const store = await this.getStore()
    await store.delete({ key: this.#key })
  }

  public async active(): Promise<boolean> {
    const store = await this.getStore()
    return store.has({ key: this.#key })
  }

  public async data(): Promise<DownPayload> {
    const store = await this.getStore()
    const data = store.get({ key: this.#key })
    if (!data)
      throw new RuntimeException('Tried to retrieve maintenance data when application is live')
    return data
  }

  protected async getStore() {
    const { default: cache } = await import('@adonisjs/cache/services/main')
    return cache
  }
}
