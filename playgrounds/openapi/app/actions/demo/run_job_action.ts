import { compose } from '@adonisjs/core/helpers'
import { AsController, BaseAction } from '@foadonis/actions'
import { ApiOperation } from '@foadonis/openapi/decorators'
import GreetJobAction from './greet_job_action.ts'
import { Get } from '@adonisjs-community/girouette'

export default class RunJobAction extends compose(BaseAction, AsController()) {
  async handle() {
    console.log('Running job')
    await GreetJobAction.dispatch({ name: 'Martin' })
    console.log('Dispatched')
  }

  @ApiOperation({ summary: 'Run job' })
  @Get('/jobs')
  async asController() {
    this.logger.info('Hello world')
    await this.handle()
  }
}
