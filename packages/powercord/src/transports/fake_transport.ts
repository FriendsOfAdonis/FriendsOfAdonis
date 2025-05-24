import { AssertionError } from 'node:assert'
import { PowercordMessages } from '../types.js'
import { TransportContract } from './tranport.js'

type SentMessage<T extends keyof PowercordMessages = keyof PowercordMessages> = {
  id: string
  name: T
  payload: PowercordMessages[T]
}

export class FakeTransport implements TransportContract {
  #messages: SentMessage[] = []

  async send<T extends keyof PowercordMessages>(
    id: string,
    name: T,
    payload: PowercordMessages[T]
  ): Promise<void> {
    this.#messages.push({
      id,
      name,
      payload,
    })
  }

  async boot(): Promise<void> {}

  /**
   * Retrieves sent messages.
   *
   * @example
   * messages()
   * messages((message) => message.name === 'log')
   */
  messages(fn?: (message: SentMessage) => boolean) {
    if (!fn) return this.#messages
    return this.#messages.filter(fn)
  }

  /**
   * Asserts how many messages has been sent.
   * Accepts a second function to filter messages.
   *
   * @example
   * assertCount(5)
   * assertCount(2, (message) => message.name === 'log')
   */
  assertCount(expected: number, filter?: (message: SentMessage) => boolean): void {
    const actual = this.messages(filter).length

    if (expected !== actual) {
      throw new AssertionError({
        actual,
        expected,
        operator: 'strictEqual',
      })
    }
  }

  /**
   * Asserts if a message has been sent.
   * Accepts a second argument to filter messages.
   *
   * It only checks if at least one message has been sent. Use `assertCount` to verify count.
   *
   * @example
   * assertSent('log')
   * assertSent('log', (message) => message.payload.level === 'error')
   */
  assertSent<T extends keyof PowercordMessages>(
    name: T,
    filter?: (message: SentMessage<T>) => boolean
  ) {
    const messages = this.messages((message) => {
      if (message.name !== name) return false
      if (!filter) return true
      return filter(message as SentMessage<T>)
    })

    if (messages.length === 0) {
      throw new AssertionError({
        message: `Expected a "${name}" message to be sent but found none`,
        actual: messages.length === 0,
        expected: true,
      })
    }
  }

  clear() {
    this.#messages = []
  }
}
