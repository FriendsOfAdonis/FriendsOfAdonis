import vine from '@vinejs/vine'
import { InferInput } from '@vinejs/vine/types'
import { AssertionError } from 'node:assert'

const schema = vine.compile(
  vine.object({
    to: vine.string(),
    from: vine.string().optional(),
    content: vine.string(),
  })
)

export class SMSMessage {
  object: Partial<InferInput<typeof schema>> = {}

  to(to: string) {
    this.object.to = to
    return this
  }

  from(from: string) {
    this.object.from = from
    return this
  }

  content(content: string) {
    this.object.content = content
  }

  /**
   * Asserts "to" message value.
   */
  assertTo(to: string) {
    if (this.object.to !== to) {
      throw new AssertionError({
        message: `Expected message "to" to be "${to}" but found "${this.object.to}"`,
      })
    }

    return this
  }

  /**
   * Asserts "from" message value.
   */
  assertFrom(from: string) {
    if (this.object.from !== from) {
      throw new AssertionError({
        message: `Expected message "from" to be "${from}" but found "${this.object.from}"`,
      })
    }

    return this
  }

  validate() {
    return schema.validate(this.object)
  }
}
