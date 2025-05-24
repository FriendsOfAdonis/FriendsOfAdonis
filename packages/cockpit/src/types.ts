import { FC } from '@foadonis/spark/jsx'
import { LazyImport } from '@foadonis/spark/types'
import { BaseResource } from './resources/base.js'
import { LucidRow, ModelAttributes } from '@adonisjs/lucid/types/model'

export type CockpitConfig = {
  menu: LazyImport<{ default: FC }>
  resources: {
    autoload: boolean | string
  }
}

export type ObjectProperty<T> = {
  [key in keyof T]: key extends string ? key : never
}[keyof T]

export type Keys<T> = T extends LucidRow ? keyof ModelAttributes<T> & string : keyof T & string

export type ResolvedConfig = {
  menu: LazyImport<{ default: FC }>
  resources: {
    autoload: false | string
  }
}

export type RecordId = string | number

export type ResourceNameOrClass = string | (new (...args: any[]) => BaseResource)

export type ResourceListParams = {
  page: number
  perPage: number
  query?: string
}
