import { type HttpContext } from '@adonisjs/core/http'
import Macroable from '@poppinss/macroable'
import { WebSocket } from 'ws'
import { type SocketEventMap, type MessageEvent, type PowerlineMessages } from './types.ts'
import Emittery from 'emittery'
import { isMessageType } from './utils.ts'
import { debug } from './debug.ts'

export class Socket<Messages extends PowerlineMessages = PowerlineMessages> extends Macroable {
  /**
   * Id of the Socket connection.
   * Used to lookup the socket on subsequent HTTP requests.
   */
  id: string

  /**
   * Native Node.js WebSocket instance
   */
  socket: WebSocket

  /**
   * HttpContext created during connection.
   */
  ctx: HttpContext

  /**
   * Socket event emitter.
   * Acts as a proxy with native socket.
   */
  #emitter = new Emittery<SocketEventMap<Messages>>()

  constructor(id: string, socket: WebSocket, ctx: HttpContext) {
    super()
    this.id = id
    this.socket = socket
    this.ctx = ctx
    this.#setupListeners()
  }

  #setupListeners() {
    this.socket.on('close', async (code, reason) => {
      debug('socket %s received close event (%s)', this.id, code)
      await this.#emitter.emit('close', { code, reason })
      this.#emitter.clearListeners()
    })

    this.socket.on('message', (data) => {
      let message: MessageEvent<Messages>
      try {
        message = JSON.parse(data.toString())
      } catch {
        debug('socket %s received malformed message, skipping', this.id)
        return
      }
      debug('socket %s received message %s', this.id, message.type)
      this.#emitter.emit('message', { socket: this, message })
    })
  }

  /**
   * Sends a message to the client.
   * The payload must be serializable.
   *
   * @param type - The message type
   * @param payload - The message payload
   */
  send<Message extends keyof Messages>(type: Message, payload: Messages[Message]) {
    if (this.socket.readyState !== WebSocket.OPEN) {
      debug('socket %s not open, skipping send for %s', this.id, String(type))
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
   * Listen to socket events.
   */
  on: Emittery<SocketEventMap<Messages>>['on'] = this.#emitter.on

  /**
   * Listen for a specific message type on this socket.
   *
   * @param type - The message type to listen for
   * @param listener - The callback to invoke
   */
  onMessage<Type extends keyof Messages & string>(
    type: Type,
    listener: (message: MessageEvent<Messages, Type>) => Promise<void> | void
  ) {
    this.#emitter.on('message', async ({ data }) => {
      if (isMessageType<Messages>(type, data.message)) {
        await listener(data.message as MessageEvent<Messages, Type>)
      }
    })
  }

  /**
   * Closes the WebSocket connection.
   *
   * @param code - Closing status code
   * @param data - Additional data
   */
  close(code?: number, data?: string | Buffer) {
    this.socket.close(code, data)
  }
}
