import { inject } from '@adonisjs/core'
import { BaseWorkflow, workflow, step, WorkflowBuilder } from '@foadonis/flow'
import type { Workflow } from '@foadonis/flow/types'

@inject()
@workflow()
export default class TestWorkflow extends BaseWorkflow<{ userId: string }> {
  flow(flow: Workflow.Builder): WorkflowBuilder {
    return flow
      .then(this.greet)
      .then(this.test)
      .then(this.test)
      .parallel([this.test, this.test])
      .then(this.greet)
  }

  @step()
  async greet(context: Workflow.Context) {
    console.log('START')
    // const userId = await context.context.get('userId')

    return {
      action: 'noop',
      output: {
        data: 'hello',
      },
    }
  }

  @step()
  async test(context: Workflow.Context<{ data: string }>) {
    console.log('Running step1')
    await new Promise((res) => setTimeout(res, 500))
    console.log('Finished step1')
    return {
      output: {},
    }
  }
}
