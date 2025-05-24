import { FakeTransport } from '../src/transports/fake_transport.js'
import { PowercordManager } from '../src/manager.js'

export class PowercordFactory {
  create() {
    const transport = new FakeTransport()
    const powercord = new PowercordManager(transport)
    return { transport, powercord }
  }
}
