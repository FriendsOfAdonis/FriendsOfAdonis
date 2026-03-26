import app from '@adonisjs/core/services/app'
import { type Shopkeeper } from '../src/shopkeeper.js'

let shopkeeper: Shopkeeper

app.booted(async () => {
  shopkeeper = await app.container.make('shopkeeper')
})

export { shopkeeper as default }
