import Product from '#models/product'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Product.createMany(
      Array(100)
        .fill(null)
        .map(() => this.factory())
    )
  }

  factory() {
    return {
      sku: faker.commerce.isbn(),
      name: faker.commerce.productName(),
      quantity: faker.helpers.rangeToNumber({ min: 0, max: 10_000 }),
    }
  }
}
