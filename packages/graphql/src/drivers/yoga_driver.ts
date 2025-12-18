import { HttpContext } from '@adonisjs/http-server'
import { GraphQLSchema } from 'graphql'
import { GraphQLDriverContract } from '../types.js'
import { createYoga, YogaServerOptions, YogaServerInstance } from 'graphql-yoga'
import { Readable } from 'node:stream'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { Logger } from '@adonisjs/core/logger'

export type YogaDriverConfig<
  TServerContext extends Record<string, any> = any,
  TUserContext extends Record<string, any> = any,
> = YogaServerOptions<TServerContext, TUserContext>

export class YogaDriver<
  TServerContext extends HttpContext = HttpContext,
  TUserContext extends Record<string, any> = any,
> implements GraphQLDriverContract {
  #config: YogaDriverConfig<TServerContext, TUserContext>
  #server?: YogaServerInstance<TServerContext, TUserContext>
  #logger: Logger
  #isReady = false

  constructor(config: YogaDriverConfig<TServerContext, TUserContext>, logger: Logger) {
    this.#config = config
    this.#logger = logger
  }

  get yoga() {
    if (!this.#server) {
      throw new Error('Yoga server has not been configured yet')
    }

    return this.#server
  }

  get isReady() {
    return this.#isReady
  }

  async start(schema: GraphQLSchema): Promise<void> {
    this.#server = createYoga({
      schema: schema,
      logging: this.#logger,
      ...this.#config,
    })

    this.#isReady = true
  }

  async reload(schema: GraphQLSchema): Promise<void> {
    await this.#server?.dispose()
    await this.start(schema)
  }

  async handle(ctx: HttpContext): Promise<void> {
    if (!ctx.request.request.url) {
      throw new RuntimeException(
        'Yoga received a request with an empty URL. This should not happen.'
      )
    }

    const requestHeaders: [string, string][] = []

    for (const [key, value] of Object.entries(ctx.request.headers())) {
      requestHeaders.push([key, value as string])
    }

    const { status, headers, body } = await this.yoga.fetch(
      ctx.request.request.url,
      {
        method: ctx.request.method(),
        headers: requestHeaders,
        body: ctx.request.raw(),
      },
      ctx as TServerContext
    )

    for (const [key, value] of headers) {
      ctx.response.header(key, value)
    }

    ctx.response.status(status)

    if (body) {
      ctx.response.stream(Readable.from(body))
    }
  }

  async stop(): Promise<void> {
    await this.yoga.dispose()
  }
}
