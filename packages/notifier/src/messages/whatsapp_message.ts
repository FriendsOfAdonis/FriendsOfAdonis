export type WhatsAppMessageContent =
  | {
      type: 'text'
      text: string
    }
  | {
      type: 'template'
      template: {
        name: string
      }
    }

export type WhatsAppMessageObject = {
  to?: string
  from?: string
  content?: WhatsAppMessageContent
}

export class WhatsAppMessage {
  object: WhatsAppMessageObject = {}

  to(to: string) {
    this.object.to = to
    return this
  }

  text(text: string) {
    this.object.content = {
      type: 'text',
      text,
    }
  }

  template(name: string) {
    this.object.content = {
      type: 'template',
      template: {
        name,
      },
    }
  }

  toObject() {
    return this.object
  }
}
