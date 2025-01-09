/// <reference types="@poppinss/hooks" />

import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { Searchable } from '../../src/mixins/searchable.js'
import stringHelpers from '@adonisjs/core/helpers/string'
import { MagnifyEngine } from '../../src/engines/main.js'

export class SearchableModel extends compose(BaseModel, Searchable) {
  @column({ isPrimary: true })
  id: string = stringHelpers.random(10)

  static engine: MagnifyEngine

  constructor(id?: string) {
    super()
    if (id) this.id = id
  }

  static get $engine(): MagnifyEngine {
    return this.engine
  }

  static get $searchIndex(): string {
    return 'table'
  }
}
