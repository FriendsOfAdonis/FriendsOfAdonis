import Product from '#models/product'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { FieldsBuilder, LucidResource } from '@foadonis/cockpit'
import { Boxes } from '@foadonis/spark-lucide'

export default class ProductResource extends LucidResource {
  model = Product
  icon = Boxes

  get titleKey(): keyof LucidRow {
    return 'name' as keyof LucidRow
  }

  fields(form: FieldsBuilder<Product>) {
    return [form.id('id'), form.text('sku'), form.text('name')]
  }
}
