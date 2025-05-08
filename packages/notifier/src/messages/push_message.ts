import vine from '@vinejs/vine'
import { InferInput } from '@vinejs/vine/types'

const schema = vine.compile(
  vine.object({
    token: vine.string(),
    title: vine.string(),
    body: vine.string().optional(),
    link: vine.string().url().optional(),
  })
)

export type PushMessageObject = {
  title?: string
  description?: string
}

export class PushMessage {
  object: Partial<InferInput<typeof schema>> = {}

  token(token: string) {
    this.object.token = token
    return this
  }

  title(title: string) {
    this.object.title = title
    return this
  }

  body(body: string) {
    this.object.body = body
    return this
  }

  link(link: string) {
    this.object.link = link
    return this
  }

  validate() {
    return schema.validate(this.object)
  }
}
