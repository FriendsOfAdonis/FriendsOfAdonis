import { BaseSchema } from '@adonisjs/lucid/schema'
import { QueueSchemaService } from '@boringnode/queue'

export default class extends BaseSchema {
  async up() {
    const schemaService = new QueueSchemaService(this.db.getWriteClient())

    await schemaService.createJobsTable()
    await schemaService.createSchedulesTable()
  }

  async down() {
    const schemaService = new QueueSchemaService(this.db.getWriteClient())

    await schemaService.dropSchedulesTable()
    await schemaService.dropJobsTable()
  }
}