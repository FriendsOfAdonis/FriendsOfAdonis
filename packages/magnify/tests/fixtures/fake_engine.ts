import { type SimplePaginator } from '@adonisjs/lucid/database'
import { MagnifyEngine } from '../../src/engines/main.js'

export class FakeEngine extends MagnifyEngine {
  update(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  delete(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  search(): Promise<any> {
    throw new Error('Method not implemented.')
  }
  map(): Promise<any[]> {
    throw new Error('Method not implemented.')
  }
  paginate(): Promise<SimplePaginator> {
    throw new Error('Method not implemented.')
  }
  flush(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
