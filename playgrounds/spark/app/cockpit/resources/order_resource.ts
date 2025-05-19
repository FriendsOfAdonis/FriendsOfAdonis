import Order from '#models/order'
import User from '#models/user'
import { FieldsBuilder, LucidResource } from '@foadonis/cockpit'
import { ShoppingCart } from '@foadonis/spark-lucide'

export default class OrderResource extends LucidResource {
  model = Order
  icon = ShoppingCart

  fields(form: FieldsBuilder<User>) {
    return [form.id('id')]
  }
}
