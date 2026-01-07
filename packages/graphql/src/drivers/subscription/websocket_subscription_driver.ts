import { type GraphQLSchema } from 'graphql'
import { type SubscriptionDriverContract } from '../../types.ts'
import type WebSocket from 'ws'
import { WebSocketServer } from 'ws'
import { type ContainerBindings, type HttpServerService } from '@adonisjs/core/types'
import { useServer } from 'graphql-ws/use/ws'
import { type Context, type Disposable, type ServerOptions } from 'graphql-ws'
import { ServerResponse, type IncomingMessage } from 'node:http'
import { moduleImporter, type Container } from '@adonisjs/core/container'
import { HttpContext } from '@adonisjs/core/http'
import { type LazyImport } from '@adonisjs/core/types/common'
import { type ParsedGlobalMiddleware, type MiddlewareAsClass } from '@adonisjs/core/types/http'
import Middleware from '@poppinss/middleware'

export interface WebsocketSubscriptionDriverConfig extends Omit<WebSocket.ServerOptions, 'server'> {
  /**
   * Path where the websocket endpoint will be served.
   *
   * @example '/graphql'
   */
  path: string

  /**
   * Options provided to graphql-ws `useServer`.
   *
   * @see {@link https://the-guild.dev/graphql/ws/docs/server/interfaces/ServerOptions}
   */
  options?: Omit<ServerOptions, 'schema'>
}

export class WebsocketSubscriptionDriver implements SubscriptionDriverContract {
  #config: WebsocketSubscriptionDriverConfig

  #httpServer: HttpServerService
  #container: Container<ContainerBindings>

  #ws?: WebSocketServer
  #disposable?: Disposable
  #middleware: ParsedGlobalMiddleware[] = []
  #serverMiddlewareStack?: Middleware<ParsedGlobalMiddleware>

  constructor(
    config: WebsocketSubscriptionDriverConfig,
    httpServer: HttpServerService,
    container: Container<ContainerBindings>
  ) {
    this.#config = config
    this.#httpServer = httpServer
    this.#container = container
  }

  get ws() {
    if (!this.#ws) {
      throw new Error('WebSocket server has not been started yet')
    }

    return this.#ws
  }

  async start(schema: GraphQLSchema): Promise<void> {
    const http = this.#httpServer.getNodeServer()

    this.#createMiddlewareStack()

    if (!http) {
      throw new Error(`Could not start WebsockSubscriptionDriver has no http server is available`)
    }

    const { options, ...wsOptions } = this.#config

    this.#ws = new WebSocketServer({
      server: http,
      ...wsOptions,
    })

    this.#disposable = useServer(
      {
        schema,
        context: (context) => this.#createContext(context),
        ...options,
      },
      this.#ws
    )
  }

  async reload(schema: GraphQLSchema): Promise<void> {
    await this.stop()
    await this.start(schema)
  }

  async stop(): Promise<void> {
    await this.#disposable?.dispose()
    this.#ws?.close()
  }

  use(middlewares: LazyImport<MiddlewareAsClass>[]) {
    middlewares.forEach((one) =>
      this.#middleware.push({
        reference: one,
        ...moduleImporter(one, 'handle').toHandleMethod(),
      })
    )
    return this
  }

  #createContext(context: Context) {
    const req = (context.extra as any).request as IncomingMessage
    const ctx = this.#createHttpContext(req)

    return new Promise<HttpContext>((res, rej) => {
      this.#serverMiddlewareStack!.runner()
        .run((executor, next) => {
          return executor.handle(ctx.containerResolver, ctx, next)
        })
        .catch((error) => {
          ctx.logger.fatal({ err: error }, 'Exception raised by error handler')
          rej(error)
        })
        .finally(async () => {
          res(ctx)
        })
    })
  }

  #createHttpContext(req: IncomingMessage) {
    const res = new ServerResponse(req)
    const request = this.#httpServer.createRequest(req, res)
    const response = this.#httpServer.createResponse(req, res)
    const resolver = this.#container.createResolver()
    const ctx = this.#httpServer.createHttpContext(request, response, resolver)

    resolver.bindValue(HttpContext, ctx)

    return ctx
  }

  #createMiddlewareStack() {
    if (this.#serverMiddlewareStack) return // Already initialized
    this.#serverMiddlewareStack = new Middleware()
    this.#middleware.forEach((middleware) => this.#serverMiddlewareStack!.add(middleware))
    this.#serverMiddlewareStack.freeze()
    this.#middleware = []
  }
}
