import { HttpContext } from '@adonisjs/core/http'
import spark from '../../services/main.js'
import vine from '@vinejs/vine'

const ActionSchema = vine.tuple([vine.string(), vine.array(vine.any())])

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

    return spark.updateComponent({
      id: component.id,
      component: component.component,
      data: component.data,
      actions: component.actions,
      children: component.children,
    })
  }
}
