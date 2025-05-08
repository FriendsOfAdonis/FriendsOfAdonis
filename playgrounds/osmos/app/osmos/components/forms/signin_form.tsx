import User from '#models/user'
import { Button } from '#osmos/components/ui/button'
import { Input } from '#osmos/components/ui/input'
import { Component, Form } from '@foadonis/osmos'
import { RefAccessor } from '@foadonis/osmos/types'
import vine from '@vinejs/vine'

const Schema = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)

export default class SignInForm extends Component {
  form = Form(Schema, {
    email: '',
    password: '',
  })

  render(that: RefAccessor<SignInForm>) {
    return (
      <form className="space-y-2.5" $submit={that.login}>
        <Input placeholder="Email" $model={that.form.email} />
        <Input placeholder="Password" $model={that.form.password} />
        <Button className="w-full mt-4" type="submit">
          Sign In
        </Button>
      </form>
    )
  }

  async login() {
    const data = await this.form.validate()

    const user = await User.verifyCredentials(data.email, data.password)

    await this.ctx.auth.use('web').login(user)

    this.redirect('/')
  }
}
