import { compose } from '@adonisjs/core/helpers'
import { BaseAction } from '@foadonis/actions'
import { AsJob } from '@foadonis/actions/queue'

export default class GreetJobAction extends compose(BaseAction, AsJob()) {
  async handle(name: string) {
    this.logger.info(`Hello ${name}`)
  }

  async asJob(payload: { name: string }) {
    await this.handle(payload.name)
  }
}
