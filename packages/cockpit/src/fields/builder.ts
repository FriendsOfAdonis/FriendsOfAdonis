import Macroable from '@poppinss/macroable'
import { TextField } from './text.js'
import { PasswordField } from './password.js'
import { EmailField } from './email.js'
import { IdField } from './id.js'

export class FieldsBuilder<T = any> extends Macroable {
  text(property: keyof T & string) {
    return new TextField(property)
  }

  password(property: keyof T & string) {
    return new PasswordField(property)
  }

  email(property: keyof T & string) {
    return new EmailField(property)
  }

  id(property: keyof T & string) {
    return new IdField(property)
  }
}
