import User from '#models/user'
import { Button } from '#spark/components/ui/button'
import { Input } from '#spark/components/ui/input'
import auth from '@adonisjs/auth/services/main'
import { Component, Form } from '@foadonis/spark'
import { RefAccessor } from '@foadonis/spark/types'
import vine from '@vinejs/vine'

const Schema = vine.compile(
  vine.object({
    username: vine.string().minLength(12).maxLength(50),
    email: vine.string().email(),
    password: vine.string(),
  })
)

export default class SignUpForm extends Component {
  form = Form(Schema, {
    username: '',
    email: '',
    password: '',
  })

  render(that: RefAccessor<SignUpForm>) {
    return (
      <form className="space-y-2.5" $submit={that.login}>
        <Input placeholder="Username" $model={that.form.username} />
        <Input placeholder="Email" $model={that.form.email} />
        <Input placeholder="Password" $model={that.form.password} />
        <Button className="w-full mt-4" type="submit">
          Sign In
        </Button>
      </form>
    )
  }

  async login() {
    await this.form.validate()

    const user = await User.create({
      fullName: this.form.username,
      email: this.form.email,
      password: this.form.password,
    })

    await this.ctx.auth.use('web').login(user)

    this.redirect('/')
  }
}
