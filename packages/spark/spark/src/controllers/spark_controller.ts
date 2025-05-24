/// <reference types="@foadonis/powercord/powercord_provider" />

import { HttpContext } from '@adonisjs/core/http'
import { RuntimeException } from '@poppinss/utils'
import { SparkMessage } from '../types.js'

export default class SparkController {
  async update({ request, response, spark }: HttpContext) {
    const body = request.body() as SparkMessage[]

    if (!spark) {
      throw new RuntimeException('No Spark instance found')
    }

    await spark.handleMessages(body)

    response.status(204)
  }
}
