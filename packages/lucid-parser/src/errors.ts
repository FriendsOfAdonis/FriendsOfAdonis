export class LucidParserError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'LucidParserError'
  }
}
