import { inject } from '@adonisjs/core'
import { BaseWorkflow, step, WorkflowBuilder } from '@foadonis/flow'
import type { Workflow } from '@foadonis/flow/types'

@inject()
export default class SynchronizeGoogleDriveWorkflow extends BaseWorkflow<{
  integrationId: string
}> {
  constructor(
    private drive: GoogleDriveService,
    private elasticsearch: ElasticsearchService
  ) {
    super()
  }

  flow(flow: Workflow.Builder): WorkflowBuilder {
    return flow
      .then(this.fetchFiles)
      .batch(this.downloadFile)
      .then(this.indexDocuments)
      .then(this.notifyUser)
  }

  @step()
  async fetchFiles() {
    const integrationId = await this.context.get('integrationId')

    const integration = await Integration.findOrFail(integrationId)
    const documents = await this.drive.listAllFiles(integration.driveId)

    return {
      action: 'noop',
      output: {
        documents,
      },
    }
  }

  @step()
  async downloadFile({ input }: Workflow.Context<drive.File>) {
    const file = await this.drive.downloadFile(input.id)
    return {
      output: {
        ...input,
        content: Buffer.from(file.content).toString('base64'),
      },
    }
  }

  @step()
  async indexDocuments({ input }: Workflow.Context<(drive.File & { content: string })[]>) {
    this.elasticsearch.index(
      input.map((document) => ({
        index: 'documents',
        id: document.id,
        document,
      }))
    )
    return {}
  }

  @step()
  async notifyUser({ input }: Workflow.Context) {
    const integrationId = await this.context.get('integrationId')
    const integration = await Integration.findOrFail(integrationId)

    await mail.send((message) => {
      message
        .to(integration.user.email)
        .from('info@example.org')
        .subject('Synchronization complete')
        .htmlView('emails/synchronization_completed', { user })
    })
  }
}
