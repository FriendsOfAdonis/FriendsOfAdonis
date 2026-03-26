import Emittery from 'emittery'
import type { PowerlineMessages, MessageEvent } from '../../src/types.ts'
import { type ClientSocketEventMap } from './types.ts'
import { isMessageType } from '../../src/utils.ts'

export interface ClientSocketOptions {
  /** Enable automatic reconnection (default: false) */
  reconnect?: boolean
  /** Maximum number of reconnection attempts (default: 5) */
  maxRetries?: number
  /** Base backoff delay in ms for reconnection (default: 1000) */
  backoffMs?: number
}

export class ClientSocket<Messages extends PowerlineMessages = PowerlineMessages> extends Emittery<
  ClientSocketEventMap<Messages>
> {
  /**
   * The native WebSocket.
   */
  socket: WebSocket

  /**
   * Current connection state.
   */
  state: 'connecting' | 'connected' | 'disconnected' = 'connecting'

  #url: string | URL
  #options: ClientSocketOptions
  #retryCount = 0
  #intentionalClose = false

  constructor(url: string | URL, options: ClientSocketOptions = {}) {
    super()
    this.#url = url
    this.#options = options
    this.socket = new WebSocket(url)
    this.#registerListeners()
  }

  #registerListeners() {
    this.socket.addEventListener('message', (event) => {
      let message: MessageEvent<Messages>
      try {
        message = JSON.parse(event.data)
      } catch {
        return
      }

      // Auto-respond to heartbeat pings
      if (isMessageType<Messages>('powerline:ping' as keyof Messages, message)) {
        this.send('powerline:pong' as keyof Messages, {} as Messages[keyof Messages])
        return
      }

      this.emit('message', message)
    })

    this.socket.addEventListener('close', (event) => {
      this.state = 'disconnected'
      this.emit('close', event)
      this.clearListeners()

      if (
        !this.#intentionalClose &&
        this.#options.reconnect &&
        this.#retryCount < (this.#options.maxRetries ?? 5)
      ) {
        this.#reconnect()
      }
    })

    this.socket.addEventListener('open', () => {
      this.state = 'connected'
      this.#retryCount = 0
      this.emit('open')
    })

    this.socket.addEventListener('error', (error) => {
      this.emit('error', error)
    })
  }

  #reconnect() {
    const delay = (this.#options.backoffMs ?? 1000) * Math.pow(2, this.#retryCount)
    this.#retryCount++
    this.state = 'connecting'

    setTimeout(() => {
      this.socket = new WebSocket(this.#url)
      this.#registerListeners()
    }, delay)
  }

  /**
   * Sends a message to the server.
   * The payload must be serializable.
   *
   * @param type - The message type
   * @param payload - The message payload
   */
  send<Message extends keyof Messages>(type: Message, payload: Messages[Message]) {
    if (this.socket.readyState !== WebSocket.OPEN) {
      return
    }

    this.socket.send(
      JSON.stringify({
        type,
        payload,
      })
    )
  }

  /**
   * Registers a listener for a specific message type.
   *
   * @param type - The message type to listen for
   * @param listener - The callback to invoke when a matching message is received
   */
  listen<Type extends keyof Messages>(
    type: Type,
    listener: (message: MessageEvent<Messages, Type>) => any
  ) {
    this.on('message', ({ data }) => {
      if (isMessageType<Messages, Type>(type, data)) {
        listener(data)
      }
    })
  }

  /**
   * Wait for a message of a specific type to be received.
   *
   * @param type - The message type to wait for
   * @returns The received message
   */
  async wait<Type extends keyof Messages>(type: Type) {
    const event = await this.once('message', ({ data }) => isMessageType(type, data))
    return event.data as MessageEvent<Messages, Type>
  }

  /**
   * Closes the WebSocket connection.
   */
  close() {
    this.#intentionalClose = true
    this.socket.close()
  }
}

const socket = new ClientSocket('ws://localhost:3333')

socket.send('powerline:ping', {})
const message = await socket.wait('powerline:pong')
