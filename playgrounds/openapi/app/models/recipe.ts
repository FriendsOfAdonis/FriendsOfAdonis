import { RecipeSchema } from '#database/schema'
import { ApiProperty } from '@foadonis/openapi/decorators'

class RecipeMeta {
  @ApiProperty({ type: 'string' })
  declare hello: string
}

export default class Recipe extends RecipeSchema {
  @ApiProperty({ type: RecipeMeta })
  declare meta: RecipeMeta
}
