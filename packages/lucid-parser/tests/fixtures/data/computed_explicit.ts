import { BaseModel, computed } from '@adonisjs/lucid/orm'

export default class ComputedExplicit extends BaseModel {
  @computed()
  get $string(): string {
    return 'hello'
  }

  @computed()
  get $number(): number {
    return 8
  }

  @computed()
  get $boolean(): boolean {
    return false
  }
}
