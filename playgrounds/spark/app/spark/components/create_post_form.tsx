import { Form, Component } from '@foadonis/spark'
import vine from '@vinejs/vine'
import { Button } from './ui/button.js'
import { RefAccessor } from '@foadonis/spark/types'

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
          {this.form.title}
          {this.form.error('title')?.message}
          <Button type="submit">Submit</Button>
        </form>
      </div>
    )
  }

  async create() {
    console.log('NOOOOOP')
    this.redirect('/test')
    // await this.form.validate()
  }
}
