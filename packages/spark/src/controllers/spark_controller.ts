import { HttpContext } from '@adonisjs/core/http'
import spark from '../../services/main.js'
import vine from '@vinejs/vine'
import { renderToString } from '../jsx/render/main.js'

const ActionSchema = vine.object({ method: vine.string(), params: vine.array(vine.any()) })

const ComponentSchema = vine.object({
  id: vine.string(),
  component: vine.string(),
  data: vine.any(),
  actions: vine.array(ActionSchema),
  children: vine.any(),
})

const schema = vine.compile(
  vine.object({
    component: ComponentSchema,
  })
)

export default class SparkController {
  async update({ request }: HttpContext) {
    const { component } = await schema.validate(request.body())

    const result = await spark.components.update(
      {
        memo: {
          id: component.id,
          name: component.component,
        },
        data: component.data,
      },
      component.actions
    )

    const html = await renderToString(result, { manager: spark.components })

    return html
  }
}
