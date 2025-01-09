import { DownPayload } from '../types.js'

export abstract class MaintenanceDriver {
  abstract activate(data: DownPayload): Promise<void>
  abstract deactivate(): Promise<void>
  abstract active(): Promise<boolean>
  abstract data(): Promise<DownPayload>
}
