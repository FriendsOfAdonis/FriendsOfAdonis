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

export class WhatsAppMessage {
  $to?: string
  $from?: string
  $content?: WhatsAppMessageContent

  to(to: string) {
    this.$to = to
    return this
  }

  text(text: string) {
    this.$content = {
      type: 'text',
      text,
    }
  }

  template(name: string) {
    this.$content = {
      type: 'template',
      template: {
        name,
      },
    }
  }
}
