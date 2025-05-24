import stringHelpers from '@adonisjs/core/helpers/string'
import { BaseResource } from './base.js'
import { LucidModel, LucidRow } from '@adonisjs/lucid/types/model'
import { SimplePaginatorContract } from '@adonisjs/lucid/types/querybuilder'
import { RecordId, ResourceListParams } from '../types.js'

export abstract class LucidResource<
  TModel extends LucidModel = LucidModel,
  TRecord extends LucidRow = InstanceType<TModel>,
> extends BaseResource<TRecord> {
  abstract model: TModel

  get name() {
    return stringHelpers.create(this.model.table).noCase().slugify().toString()
  }

  get idKey() {
    return this.model.primaryKey as keyof TRecord
  }

  query() {
    return this.model.query()
  }

  async create(data: any): Promise<TRecord> {
    const record = await this.model.create(data)
    return record as TRecord
  }

  async update(id: RecordId, data: any): Promise<TRecord> {
    const record = await this.retrieve(id)
    record.merge(data)
    return record.save()
  }

  async list(params: ResourceListParams): Promise<SimplePaginatorContract<TRecord>> {
    let query = this.query()

    if (params.query && params.query.length > 0) {
      query = query.whereLike(this.titleKey, `%${params.query}%`)
    }

    const paginator = await query.paginate(params.page, params.perPage)
    return paginator as SimplePaginatorContract<TRecord>
  }

  async retrieve(id: RecordId): Promise<TRecord> {
    return this.model
      .query()
      .where(this.idKey as any, id)
      .firstOrFail() as Promise<TRecord>
  }
}
