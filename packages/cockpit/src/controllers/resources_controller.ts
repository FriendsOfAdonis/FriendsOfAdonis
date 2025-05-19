import { jsx } from '@foadonis/spark/jsx-runtime'
import ResourcesIndexPage from '../components/pages/resources/index_page.js'
import { HttpContext } from '@adonisjs/core/http'
import cockpit from '../../services/main.js'
import ResourceCreatePage from '../components/pages/resources/create_page.js'
import ResourceEditPage from '../components/pages/resources/edit_page.js'

export default class ResourcesController {
  async index({ request }: HttpContext) {
    const resourceId = request.param('resourceId')

    const resource = cockpit.resources.getOrFail(resourceId)

    return jsx(ResourcesIndexPage, {
      resource,
    })
  }

  async create({ request }: HttpContext) {
    const resourceId = request.param('resourceId')

    const resource = cockpit.resources.getOrFail(resourceId)

    return jsx(ResourceCreatePage, {
      resource,
    })
  }

  async edit({ request }: HttpContext) {
    const resourceId = request.param('resourceId')
    const recordId = request.param('recordId')

    const resource = cockpit.resources.getOrFail(resourceId)
    const record = await resource.retrieve(recordId)

    return jsx(ResourceEditPage, {
      resource,
      record,
    })
  }
}
