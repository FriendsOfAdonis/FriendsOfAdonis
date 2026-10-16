import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { billable } from '../../src/mixins/billable.js'
import { DateTime } from 'luxon'

export default class User extends compose(BaseModel, billable()) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare name: string

  @column()
  declare phone: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  stripeTaxRates: string[] = []

  stripeAddress() {
    return {
      city: 'Paris',
      country: 'France',
      line1: '10 rue de la Paix',
      line2: 'Appartement 3',
      postal_code: '75002',
      state: 'Paris',
    }
  }

  taxRates(): string[] {
    return this.stripeTaxRates
  }
}
