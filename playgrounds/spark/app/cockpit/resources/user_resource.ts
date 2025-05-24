import User from '#models/user'
import { defineLucidResource } from '@foadonis/cockpit'
import { Users } from '@foadonis/spark-lucide'

export default defineLucidResource(User, {
  icon: Users,
  fields: (form) => {
    return [
      form.id('id'),
      form.text('fullName').placeholder('Full name'),
      form.email('email').placeholder('Email'),
      form.password('password').placeholder('Password'),
    ]
  },
})
