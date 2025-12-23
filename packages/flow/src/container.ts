import { ContainerResolver } from '@adonisjs/core/container'
import { ContainerBindings } from '@adonisjs/core/types'
import { DIContainer, ServiceToken, ServiceTokens } from 'flowcraft'

export class FlowResolver extends DIContainer {
  #container: ContainerResolver<ContainerBindings>

  constructor(container: ContainerResolver<ContainerBindings>) {
    super()
    this.#container = container
  }

  resolve<T>(token: ServiceToken<T>): T {
    if (token === ServiceTokens.Logger) {
    }
  }
}
