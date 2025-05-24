import { Resolver, SparkConfig } from './types.js'
import { Renderer } from './renderer.js'
import { Logger } from '@adonisjs/core/logger'
import { SparkInstance } from './spark_instance.js'
import { PowercordServer } from '@foadonis/powercord'
import { randomId } from './utils/random.js'
import { HttpRouterService } from '@adonisjs/core/types'
import { Component } from './components/main.js'
import { TestableComponent } from './tests/testable_component.js'

const SparkController = () => import('./controllers/spark_controller.js')

export class SparkManager {
  readonly config: SparkConfig

  powercord: PowercordServer

  #resolver: Resolver
  #logger: Logger
  #router: HttpRouterService

  #instances = new Map<string, SparkInstance>()

  constructor(
    powercord: PowercordServer,
    router: HttpRouterService,
    resolver: Resolver,
    logger: Logger,
    config: SparkConfig
  ) {
    this.config = config
    this.#router = router
    this.#resolver = resolver
    this.#logger = logger
    this.powercord = powercord
  }

  /**
   * Creates a new renderer.
   */
  createRenderer(spark: SparkInstance) {
    return new Renderer(spark)
  }

  createInstance() {
    const id = randomId()

    const powercord = this.powercord.create(id)

    const spark = new SparkInstance({
      id,
      resolver: this.#resolver,
      logger: this.#logger,
      powercord,
    })

    this.#instances.set(id, spark)

    return spark
  }

  getInstance(id: string) {
    return this.#instances.get(id)
  }

  registerRoutes() {
    this.#router.post('/__spark', [SparkController, 'update'])
  }

  async test<C extends Component<any>>(
    componentClass: new (...args: any[]) => C,
    props: C['$props']
  ) {
    const instance = this.createInstance()
    const component = await instance.mount(componentClass, props)
    return new TestableComponent(component)
  }
}
