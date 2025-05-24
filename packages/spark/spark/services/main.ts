import app from '@adonisjs/core/services/app'
import { SparkManager } from '../src/spark_manager.js'

let spark: SparkManager

await app.booted(async () => {
  spark = await app.container.make('spark')
})

export { spark as default }
