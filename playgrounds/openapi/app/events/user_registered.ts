import { BaseEvent } from '@adonisjs/core/events'

export default class UserRegistered extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(public name: string) {
    super()
  }
}
