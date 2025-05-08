import { Form, Component } from '@foadonis/osmos'
import vine from '@vinejs/vine'
import { Button } from './ui/button.js'
import { RefAccessor } from '@foadonis/osmos/types'

const Schema = vine.compile(
  vine.object({
    title: vine.string().minLength(12),
  })
)

export default class CreatePostForm extends Component {
  form = Form(Schema, { title: 'Hello World' })

  constructor() {
    super()
  }

  async render(that: RefAccessor<CreatePostForm>) {
    return (
      <div>
        <form $submit={that.create}>
          <input type="text" $model={that.form.title} />
          {this.form.error('title')?.message}
          <Button type="submit">Submit</Button>
        </form>
      </div>
    )
  }

  async create() {
    await this.form.validate()
  }
}
