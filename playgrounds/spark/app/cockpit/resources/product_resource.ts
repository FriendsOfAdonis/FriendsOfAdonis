import Product from '#models/product'
import { defineLucidResource } from '@foadonis/cockpit'
import { Boxes } from '@foadonis/spark-lucide'

export default defineLucidResource(Product, {
  icon: Boxes,
  fields: (form) => [form.id('id'), form.text('sku'), form.text('name')],
})
