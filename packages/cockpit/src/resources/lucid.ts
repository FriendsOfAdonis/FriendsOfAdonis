import { BaseResource } from './base.js'
import { LucidModel, ModelAttributes } from '@adonisjs/lucid/types/model'
import { SimplePaginatorContract } from '@adonisjs/lucid/types/querybuilder'
import { RecordId, ResourceListParams } from '../types.js'
import { LucideIcon } from '@foadonis/spark-lucide/types'
import { FieldsBuilder } from '../fields/builder.js'
import { BaseField } from '../fields/base.js'

export interface LucidResource {}

export type MakeLucidResourceOption<T extends LucidModel> = {
  /**
   * Configures the resource Icon.
   *
   * TODO: Accept any HTMLElement
   */
  icon: LucideIcon

  /**
   * Configures resource fields.
   */
  fields: (form: FieldsBuilder<ModelAttributes<InstanceType<T>>>) => BaseField[]

  /**
   * Configures id property.
   *
   * @default
   * model.primaryKey
   */
  idKey?: keyof ModelAttributes<InstanceType<T>> & string

  id?: (row: InstanceType<T>) => string | number
  title?: (row: InstanceType<T>) => string | number
}

export function defineLucidResource<T extends LucidModel>(
  model: T,
  options: MakeLucidResourceOption<T>
) {
  return class LucidResource extends BaseResource<InstanceType<T>> {
    model = model

    get icon() {
      return options.icon
    }

    get name() {
      return this.model.table
    }

    get idKey(): string {
      if (options.idKey) return options.idKey
      return this.model.primaryKey
    }

    id(record: InstanceType<T>) {
      if (options.id) return options.id(record)
      return record.$getAttribute(this.idKey)
    }

    title(record: InstanceType<T>): any {
      if (options.title) return options.title(record)
      return this.id(record)
    }

    fields(form: FieldsBuilder<InstanceType<T>>): BaseField[] {
      return options.fields(form as any)
    }

    query() {
      return this.model.query()
    }

    async create(data: any): Promise<InstanceType<T>> {
      const record = await this.model.create(data)
      return record
    }

    async update(id: RecordId, data: any): Promise<InstanceType<T>> {
      const record = await this.retrieve(id)
      record.merge(data)
      return record.save()
    }

    async list(params: ResourceListParams): Promise<SimplePaginatorContract<InstanceType<T>>> {
      let query = this.query()

      // if (params.query && params.query.length > 0) {
      //   query = query.whereLike(this.titleKey, `%${params.query}%`)
      // }

      const paginator = await query.paginate(params.page, params.perPage)
      return paginator as SimplePaginatorContract<InstanceType<T>>
    }

    async retrieve(id: RecordId): Promise<InstanceType<T>> {
      return this.model
        .query()
        .where(this.idKey as any, id)
        .firstOrFail()
    }
  }
}
