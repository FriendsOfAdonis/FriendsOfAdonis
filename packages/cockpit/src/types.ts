import { FC } from '@foadonis/spark/jsx'
import { LazyImport } from '@foadonis/spark/types'
import { BaseResource } from './resources/base.js'

export type CockpitConfig = {
  menu: LazyImport<{ default: FC }>
  resources: {
    autoload: boolean | string
  }
}

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
