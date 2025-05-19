import Macroable from '@poppinss/macroable'
import { TextField } from './text.js'
import { LucidRow, ModelAttributes } from '@adonisjs/lucid/types/model'
import { PasswordField } from './password.js'
import { EmailField } from './email.js'
import { IdField } from './id.js'

type Keys<T> = T extends LucidRow ? keyof ModelAttributes<T> & string : keyof T & string

export class FieldsBuilder<T = any> extends Macroable {
  text(property: Keys<T>) {
    return new TextField(property)
  }

  password(property: Keys<T>) {
    return new PasswordField(property)
  }

  email(property: Keys<T>) {
    return new EmailField(property)
  }

  id(property: Keys<T>) {
    return new IdField(property)
  }
}
