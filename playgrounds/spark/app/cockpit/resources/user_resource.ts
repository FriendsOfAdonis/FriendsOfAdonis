import User from '#models/user'
import { FieldsBuilder, LucidResource } from '@foadonis/cockpit'
import { Users } from '@foadonis/spark-lucide'

export default class UserResource extends LucidResource {
  model = User
  icon = Users

  fields(form: FieldsBuilder<User>) {
    return [
      form.id('id'),
      form.text('fullName').placeholder('Full name'),
      form.email('email').placeholder('Email'),
      form.password('password').placeholder('Password'),
    ]
  }
}
