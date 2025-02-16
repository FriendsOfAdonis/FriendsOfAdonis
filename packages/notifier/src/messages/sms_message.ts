export class SMSMessage {
  $to?: string
  $from?: string
  $content?: string

  to(to: string) {
    this.$to = to
    return this
  }

  from(from: string) {
    this.$from = from
    return this
  }

  content(content: string) {
    this.$content = content
  }
}
