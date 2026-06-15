import { type BaseCommand } from '@adonisjs/core/ace'
import { type HttpContext } from '@adonisjs/core/http'

/**
 * Make the action runnable as a controller.
 *
 * @example
 * export class MyAction extends BaseAction implements AsController {
 *   public handle() {
 *      // your business logic
 *   }
 *
 *   public asController(context: HttpContext) {
 *      await this.handle()
 *   }
 * }
 */
export interface AsController {
  asController(context: HttpContext): any
}

/**
 * Make the action runnable as a command.
 *
 * @example
 * export class MyAction extends BaseAction implements AsCommand {
 *   public static commandName: 'my-action';
 *
 *   public handle() {
 *      // your business logic
 *   }
 *
 *   public asController(command: BaseCommand) {
 *      await this.handle()
 *   }
 * }
 */
export interface AsCommand {
  asCommand(command: BaseCommand): any
}

/**
 * Make the action runnable as a listener.
 *
 * @example
 * export class MyAction extends BaseAction implements AsListener {
 *   public handle() {
 *      // your business logic
 *   }
 *
 *   public asListener(event: MyEvent) {
 *      await this.handle()
 *   }
 * }
 */
export interface AsListener<T = unknown> {
  asListener(event: T): any
}
