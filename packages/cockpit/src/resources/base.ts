import string from '@adonisjs/core/helpers/string'
import { FieldsBuilder } from '../fields/builder.js'
import { BaseField } from '../fields/base.js'
import { SimplePaginatorContract } from '@adonisjs/lucid/types/querybuilder'
import { RecordId } from '../types.js'
import { ComponentProps, FC } from '@foadonis/spark/jsx'

export abstract class BaseResource<TRecord extends Record<string, any> = any> {
  abstract get icon(): FC<ComponentProps<'i'>>

  /**
   * The name used to identify this resource.
   *
   * @example "user"
   */
  abstract get name(): string

  /**
   * The id key of this resource.
   *
   * @example "id"
   * @default this.model.primaryKey
   */
  abstract get idKey(): keyof TRecord

  /**
   * The title key of this resource.
   *
   * @example "email"
   * @default this.idKey
   */
  get titleKey(): keyof TRecord {
    return this.idKey
  }

  /**
   * The label of the resource.
   *
   * @example "User"
   */
  get label(): string {
    return string.create(this.name).capitalCase().singular().toString()
  }

  /**
   * The plural name of the resource.
   *
   * @example "Users"
   */
  get labelPlural(): string {
    return string.plural(this.label)
  }

  /**
   * Retrieves the title of a record.
   */
  title(record: TRecord): string {
    return record[this.titleKey]
  }

  /**
   * Retrieves the id of a record.
   */
  id(record: TRecord): string {
    return record[this.idKey]
  }

  /**
   * The fields configuration for this resource.
   */
  abstract fields(form: FieldsBuilder<TRecord>): BaseField[]

  /**
   * Operation for creating a single resource record.
   */
  abstract create(data: any): Promise<TRecord>

  /**
   * Operation for updating a record.
   */
  abstract update(id: RecordId, data: any): Promise<TRecord>

  /**
   * Operation for querying the resource records.
   */
  abstract list(): Promise<SimplePaginatorContract<TRecord>>

  /**
   * Operation for querying a single resource record.
   */
  abstract retrieve(id: RecordId): Promise<TRecord>
}
