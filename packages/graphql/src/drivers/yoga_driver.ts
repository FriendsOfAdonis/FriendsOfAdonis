import { type HttpContext } from '@adonisjs/http-server'
import { type GraphQLSchema } from 'graphql'
import { type GraphQLDriverContract } from '../types.js'
import { createYoga, type YogaServerOptions, type YogaServerInstance } from 'graphql-yoga'
import { Readable } from 'node:stream'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { type Logger } from '@adonisjs/core/logger'

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

    const contentType = ctx.request.header('content-type') || ''
    const isMultipart = contentType.startsWith('multipart/form-data')

    const init: RequestInit & { duplex?: 'half' } = {
      method: ctx.request.method(),
      headers: requestHeaders,
    }

    if (isMultipart) {
      /**
       * The bodyparser does not buffer multipart bodies (autoProcess/processManually),
       * so `request.raw()` is null. Stream the untouched Node request into Yoga instead
       * so it can parse the graphql-multipart-request spec (operations/map/files).
       */
      if (ctx.request.request.readableEnded) {
        throw new RuntimeException(
          `Cannot handle the multipart GraphQL request as its body has already been consumed by the bodyparser. Add "${ctx.request.url()}" to "multipart.processManually" in "config/bodyparser.ts" to enable file uploads.`
        )
      }

      init.body = ctx.request.request as unknown as BodyInit
      init.duplex = 'half'
    } else {
      init.body = ctx.request.raw()
    }

    const { status, headers, body } = await this.yoga.fetch(
      ctx.request.request.url,
      init,
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
