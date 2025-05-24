import Order from '#models/order'
import { defineLucidResource } from '@foadonis/cockpit'
import { ShoppingCart } from '@foadonis/spark-lucide'

export default defineLucidResource(Order, {
  icon: ShoppingCart,
  fields: (form) => [form.id('id')],
})
