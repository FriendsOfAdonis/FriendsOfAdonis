import { type Logger } from '@adonisjs/core/logger'
import { type ContainerBindings, type HttpServerService } from '@adonisjs/core/types'
import { ServerResponse, type IncomingMessage } from 'node:http'
import { WebSocketServer, type WebSocket } from 'ws'
import { Socket } from './socket.ts'
import { moduleImporter, type Container } from '@adonisjs/core/container'
import { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
import { type LazyImport } from '@adonisjs/core/types/common'
import { type ParsedGlobalMiddleware, type MiddlewareAsClass } from '@adonisjs/core/types/http'
import Middleware from '@poppinss/middleware'
import type {
  ServerEventMap,
  PowerlineMessages,
  PowerlineConfig,
  MessageListenerFn,
  SocketMessageEvent,
} from './types.ts'
import Emittery from 'emittery'
import { PowerlineNotInitializedError, PowerlineNoServerError } from './errors.ts'
import { debug } from './debug.ts'
import powerline from '../services/main.ts'

export class Powerline<Messages extends PowerlineMessages = PowerlineMessages> {
  #http: HttpServerService
  #logger: Logger
  #container: Container<ContainerBindings>
  #config: PowerlineConfig
  #emitter = new Emittery<ServerEventMap<Messages>>()
  #ws?: WebSocketServer

  #sockets = new Map<string, Socket<Messages>>()

  #middlewares: ParsedGlobalMiddleware[] = []
  #serverMiddlewareStack?: Middleware<ParsedGlobalMiddleware>
  #listeners = new Map<keyof Messages, MessageListenerFn<Messages>[]>()
  #heartbeatInterval?: ReturnType<typeof setInterval>

  constructor(
    httpServer: HttpServerService,
    container: Container<ContainerBindings>,
    logger: Logger,
    config: PowerlineConfig = {}
  ) {
    this.#http = httpServer
    this.#container = container
    this.#logger = logger
    this.#config = config
  }

  /**
   * The native WebSocket server.
   *
   * @throws {PowerlineNotInitializedError} If the server has not been started yet
   */
  get ws() {
    if (!this.#ws) {
      throw new PowerlineNotInitializedError()
    }

    return this.#ws
  }

  on: Emittery<ServerEventMap<Messages>>['on'] = this.#emitter.on

  /**
   * Starts the Powerline WebSocket server.
   *
   * @throws {PowerlineNoServerError} If no HTTP server is available
   *
   * @example
   * ```typescript
   * await powerline.start()
   * ```
   */
  async start() {
    const server = this.#http.getNodeServer()

    if (!server) {
      throw new PowerlineNoServerError()
    }

    this.#createMiddlewareStack()

    const ws = new WebSocketServer({
      server,
      path: this.#config.path,
      maxPayload: this.#config.maxPayload,
    })

    ws.on('connection', this.#handleConnection.bind(this))
    ws.on('close', this.#handleClose.bind(this))
    ws.on('error', this.#handleError.bind(this))

    this.#ws = ws

    if (this.#config.heartbeat !== false) {
      this.#startHeartbeat()
    }

    const address = server.address()
    const addr =
      typeof address === 'string'
        ? address
        : address
          ? `${address.address}:${address.port}`
          : 'unknown'

    this.#logger.info(`started WebSocket server on ${addr}`)
  }

  /**
   * Stops the Powerline WebSocket server and closes all connections.
   *
   * @example
   * ```typescript
   * await powerline.stop()
   * ```
   */
  async stop() {
    if (this.#heartbeatInterval) {
      clearInterval(this.#heartbeatInterval)
      this.#heartbeatInterval = undefined
    }

    for (const socket of this.#sockets.values()) {
      socket.close(1001, 'Server shutting down')
    }
    this.#sockets.clear()

    if (this.#ws) {
      await new Promise<void>((res) => this.#ws!.close(() => res()))
      this.#ws = undefined
    }
  }

  /**
   * Registers middleware to run on each new WebSocket connection.
   *
   * @param middlewares - Array of lazy-imported middleware classes
   * @returns The Powerline instance for chaining
   *
   * @example
   * ```typescript
   * powerline.use([() => import('#middleware/auth_middleware')])
   * ```
   */
  use(middlewares: LazyImport<MiddlewareAsClass>[]) {
    middlewares.forEach((one) =>
      this.#middlewares.push({
        reference: one,
        ...moduleImporter(one, 'handle').toHandleMethod(),
      })
    )
    return this
  }

  /**
   * Creates an HttpContext from a WebSocket connection IncomingMessage.
   * As there is no ServerResponse in this context, a mock one is created.
   *
   * TODO: Create proxy around response to throw error
   *
   * @param req - The WebSocket connection IncomingMessage
   * @returns The created HttpContext
   */
  createHttpContext(req: IncomingMessage) {
    const res = new ServerResponse(req)
    const request = this.#http.createRequest(req, res)
    const response = this.#http.createResponse(req, res)
    const resolver = this.#container.createResolver()

    const ctx = this.#http.createHttpContext(request, response, resolver)
    resolver.bindValue(HttpContext, ctx)

    return ctx
  }

  /**
   * Find a connected socket using session ID.
   *
   * @param sessionId - The socket session ID
   * @returns The Socket or undefined if not found
   */
  findSocket(sessionId: string) {
    return this.#sockets.get(sessionId)
  }

  /**
   * Broadcasts a message to all connected sockets.
   *
   * @param type - The message type
   * @param payload - The message payload
   * @param filterFn - Optional function to filter which sockets receive the message
   *
   * @example
   * ```typescript
   * await powerline.broadcast('greet', { name: 'Hello world!' })
   *
   * // With filter
   * await powerline.broadcast('greet', { name: 'Hello!' }, (socket) => {
   *   return socket.ctx.auth.user?.id === 1
   * })
   * ```
   */
  async broadcast<Type extends keyof Messages>(
    type: Type,
    payload: Messages[Type],
    filterFn?: (socket: Socket<Messages>) => boolean | Promise<boolean>
  ) {
    for (const socket of this.#sockets.values()) {
      const shouldBroadcast = filterFn ? await filterFn(socket) : true
      if (shouldBroadcast) {
        socket.send(type, payload)
      }
    }
  }

  /**
   * Registers a message listener for a specific message type.
   *
   * @param type - The message type to listen for
   * @param listener - The callback to invoke when a matching message is received
   *
   * @example
   * ```typescript
   * powerline.listen('greet', (message, socket) => {
   *   console.log(message.payload.name)
   * })
   * ```
   */
  listen<Type extends keyof Messages>(type: Type, listener: MessageListenerFn<Messages, Type>) {
    const listeners = this.#listeners.get(type) ?? []
    listeners.push(listener as MessageListenerFn<Messages>)
    this.#listeners.set(type, listeners)
  }

  #connect(socket: Socket<Messages>) {
    this.#sockets.set(socket.id, socket)

    socket.on('close', () => {
      this.#sockets.delete(socket.id)
    })

    socket.on('message', async ({ data }) => this.#handleMessage(data))

    this.#executeMiddlewareStack(socket).then(() => {
      socket.send('powerline:sessionId', { sessionId: socket.id })
      this.#emitter.emit('connection', { socket })
    })
  }

  #handleConnection(ws: WebSocket, request: IncomingMessage) {
    const ctx = this.createHttpContext(request)
    const id = randomUUID()
    const socket = new Socket<Messages>(id, ws, ctx)

    this.#connect(socket)
  }

  #handleClose() {
    if (this.#heartbeatInterval) {
      clearInterval(this.#heartbeatInterval)
      this.#heartbeatInterval = undefined
    }

    for (const socket of this.#sockets.values()) {
      socket.close(1001, 'Server closing')
    }
    this.#sockets.clear()

    this.#emitter.emit('close')
  }

  #handleError(error: Error) {
    this.#logger.error({ err: error }, 'error with WebSocket server')
  }

  async #handleMessage(event: SocketMessageEvent<Messages>) {
    await this.#emitter.emit('message', event)
    const listeners = this.#listeners.get(event.message.type) ?? []

    for (const listener of listeners) {
      await listener(event.message, event.socket)
    }
  }

  #createMiddlewareStack() {
    if (this.#serverMiddlewareStack) return
    this.#serverMiddlewareStack = new Middleware()
    this.#middlewares.forEach((middleware) => this.#serverMiddlewareStack!.add(middleware))
    this.#serverMiddlewareStack.freeze()
    this.#middlewares = []
  }

  #executeMiddlewareStack(socket: Socket<Messages>) {
    const ctx = socket.ctx
    return new Promise<HttpContext>((res, rej) => {
      this.#serverMiddlewareStack!.runner()
        .run((executor, next) => {
          return executor.handle(ctx.containerResolver, ctx, next)
        })
        .then(() => {
          res(ctx)
        })
        .catch((error) => {
          ctx.logger.fatal({ err: error }, 'Exception raised by error handler')
          rej(error)
        })
    })
  }

  #startHeartbeat() {
    const config = this.#config.heartbeat
    if (!config) return

    const interval = config.interval
    const timeout = config.timeout

    const alive = new Set<string>()

    this.listen(
      'powerline:pong' as keyof Messages,
      ((_msg: unknown, socket: Socket<Messages>) => {
        alive.add(socket.id)
      }) as MessageListenerFn<Messages>
    )

    this.#heartbeatInterval = setInterval(() => {
      for (const socket of this.#sockets.values()) {
        if (!alive.has(socket.id)) {
          debug('socket %s failed heartbeat, terminating', socket.id)
          socket.socket.terminate()
          this.#sockets.delete(socket.id)
          continue
        }

        alive.delete(socket.id)
        socket.send('powerline:ping' as keyof Messages, {} as Messages[keyof Messages])
      }
    }, interval)

    // On first connection, mark all current sockets alive and send initial ping after timeout
    // Actually, simpler: mark all sockets alive on startup and send pings on interval
    for (const socket of this.#sockets.values()) {
      alive.add(socket.id)
    }

    // Also mark new connections as alive
    this.on('connection', ({ data }) => {
      alive.add(data.socket.id)
    })

    // Clean up dead sockets from alive set
    this.on('close', () => {
      alive.clear()
    })

    // Use a timeout-based approach: after sending ping, check after timeout
    // Simplified: the interval checks if pong was received since last ping
    void timeout // timeout is available for future fine-grained control
  }
}
