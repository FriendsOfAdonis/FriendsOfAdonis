import { SparkNode } from '@foadonis/spark/jsx'
import { BaseResource } from '../resources/base.js'

export type FieldDisplayOptions = {
  index: boolean
  create: boolean
  update: boolean
  peek: boolean
}

export type FieldFormProps = {
  resource: BaseResource
  value?: any
  ref: string
}

export type FieldIndexProps = {
  value: any
}

export abstract class BaseField {
  name: string

  $display: FieldDisplayOptions = {
    index: true,
    create: true,
    update: true,
    peek: true,
  }

  constructor(name: string) {
    this.name = name
  }

  $formComponent?: ({ resource }: FieldFormProps) => SparkNode
  $indexComponent?: ({ value }: FieldIndexProps) => SparkNode

  /**
   * Hides this field on index page.
   */
  hideOnIndex(value = true) {
    this.$display.index = !value
    return this
  }

  /**
   * Hides this field on create page.
   */
  hideOnCreate(value = true) {
    this.$display.create = !value
    return this
  }

  /**
   * Hides this field on update page.
   */
  hideOnUpdate(value = true) {
    this.$display.create = !value
    return this
  }

  /**
   * Hides this field on peek.
   */
  hideOnPeek(value = true) {
    this.$display.create = !value
    return this
  }
}
