import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker'

export default class extends BaseSeeder {
  async run() {
    await User.createMany(
      Array(10)
        .fill(null)
        .map(() => this.factory())
    )
  }

  factory() {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    return {
      fullName: faker.person.fullName({ firstName, lastName }),
      email: faker.internet.email({ firstName, lastName }),
      password: faker.internet.password(),
    }
  }
}
