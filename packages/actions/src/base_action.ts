import { BaseCommand } from '@adonisjs/core/ace'
import { HttpContext } from '@adonisjs/core/http'

export abstract class BaseAction {
  abstract handle(..._: any[]): any
}

export interface AsController {
  asController(context: HttpContext): any
}

export interface AsCommand {
  commandName?: string
  description?: string

  asCommand(command: BaseCommand): any
}

export interface AsListener<T = unknown> {
  asListener(event: T): any
}
