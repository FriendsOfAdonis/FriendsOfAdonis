import { test } from '@japa/runner'
import { setupApp } from './helpers.ts'
import { assertMessageType } from '../src/utils.ts'
import { type PowerlineMessages, type MessageEvent } from '../src/types.ts'
import { ClientSocket } from '../modules/client/socket.ts'

declare module '../src/types.ts' {
  export interface PowerlineMessages {
    greet: { name: string }
  }
}

test.group('PowerlineServer', () => {
  test('socket should connect/disconnect successfully', async ({ cleanup, assert }) => {
    const { app } = await setupApp()
    cleanup(() => app.terminate())

    const powerline = await app.container.make('powerline')
    const socket = new ClientSocket('ws://localhost:3338')
    cleanup(() => socket.close())

    const message = await socket.wait('powerline:sessionId')
    assertMessageType('powerline:sessionId', message)

    let serverSocket = powerline.findSocket(message.payload.sessionId)
    assert.isDefined(serverSocket)

    socket.close()

    await new Promise((res) => {
      serverSocket!.socket.on('close', res)
    })

    serverSocket = powerline.findSocket(message.payload.sessionId)

    assert.isUndefined(serverSocket)
  })

  test('server should broadcast message event', async ({ cleanup, assert }) => {
    const { app } = await setupApp()
    cleanup(() => app.terminate())

    const powerline = await app.container.make('powerline')
    const socket = new ClientSocket('ws://localhost:3338')
    cleanup(() => socket.close())

    const message = await socket.wait('powerline:sessionId')
    assertMessageType('powerline:sessionId', message)

    powerline.broadcast('greet', { name: 'FriendsOfAdonis' })

    const greetMessage = await socket.wait('greet')
    assertMessageType('greet', greetMessage)

    assert.equal(greetMessage.payload.name, 'FriendsOfAdonis')
  })

  test('server should listen with listener function', async ({ cleanup, assert }) => {
    const { app } = await setupApp()
    cleanup(() => app.terminate())

    const powerline = await app.container.make('powerline')
    const socket = new ClientSocket('ws://localhost:3338')
    cleanup(() => socket.close())

    const message = await socket.wait('powerline:sessionId')
    assertMessageType('powerline:sessionId', message)

    const waitFromServer = new Promise<MessageEvent<PowerlineMessages, 'greet'>>((res) => {
      powerline.listen('greet', (msg) => res(msg))
    })

    socket.send('greet', { name: 'Hello world' })

    const result = await waitFromServer

    assert.equal(result.type, 'greet')
    assert.deepEqual(result.payload, { name: 'Hello world' })
  })

  test('malformed JSON messages should be ignored', async ({ cleanup, assert }) => {
    const { app } = await setupApp()
    cleanup(() => app.terminate())

    const powerline = await app.container.make('powerline')
    const socket = new ClientSocket('ws://localhost:3338')
    cleanup(() => socket.close())

    const message = await socket.wait('powerline:sessionId')
    assertMessageType('powerline:sessionId', message)

    const serverSocket = powerline.findSocket(message.payload.sessionId)
    assert.isDefined(serverSocket)

    // Send malformed JSON via raw WebSocket - should not crash
    socket.socket.send('not valid json{{{')

    // Then send a valid message to confirm the connection still works
    const waitFromServer = new Promise<MessageEvent<PowerlineMessages, 'greet'>>((res) => {
      powerline.listen('greet', (msg) => res(msg))
    })

    socket.send('greet', { name: 'still alive' })

    const result = await waitFromServer
    assert.equal(result.payload.name, 'still alive')
  })

  test('multiple concurrent connections should work', async ({ cleanup, assert }) => {
    const { app } = await setupApp()
    cleanup(() => app.terminate())

    const powerline = await app.container.make('powerline')

    const socket1 = new ClientSocket('ws://localhost:3338')
    const socket2 = new ClientSocket('ws://localhost:3338')
    cleanup(() => socket1.close())
    cleanup(() => socket2.close())

    const msg1 = await socket1.wait('powerline:sessionId')
    const sessionMsg2 = await socket2.wait('powerline:sessionId')

    assert.notEqual(msg1.payload.sessionId, sessionMsg2.payload.sessionId)

    // Broadcast should reach both
    const wait1 = socket1.wait('greet')
    const wait2 = socket2.wait('greet')

    powerline.broadcast('greet', { name: 'everyone' })

    const [r1, r2] = await Promise.all([wait1, wait2])
    assert.equal(r1.payload.name, 'everyone')
    assert.equal(r2.payload.name, 'everyone')
  })

  test('broadcast with filter function', async ({ cleanup, assert }) => {
    const { app } = await setupApp()
    cleanup(() => app.terminate())

    const powerline = await app.container.make('powerline')

    const socket1 = new ClientSocket('ws://localhost:3338')
    const socket2 = new ClientSocket('ws://localhost:3338')
    cleanup(() => socket1.close())
    cleanup(() => socket2.close())

    const msg1 = await socket1.wait('powerline:sessionId')
    await socket2.wait('powerline:sessionId')

    const targetId = msg1.payload.sessionId

    // Only send to socket1
    const wait1 = socket1.wait('greet')
    const wait2 = socket2.wait('greet')

    await powerline.broadcast('greet', { name: 'just you' }, (socket) => socket.id === targetId)

    const r1 = await wait1
    assert.equal(r1.payload.name, 'just you')

    // socket2 should receive this one (unfiltered broadcast)
    await powerline.broadcast('greet', { name: 'now everyone' })

    const r2 = await wait2
    assert.equal(r2.payload.name, 'now everyone')
  })

  test('graceful shutdown should close all sockets', async ({ assert }) => {
    const { app } = await setupApp()

    const powerline = await app.container.make('powerline')

    const socket = new ClientSocket('ws://localhost:3338')

    const message = await socket.wait('powerline:sessionId')
    assertMessageType('powerline:sessionId', message)

    const closePromise = new Promise<void>((res) => {
      socket.socket.addEventListener('close', () => res())
    })

    await powerline.stop()

    await closePromise

    assert.isUndefined(powerline.findSocket(message.payload.sessionId))

    await app.terminate()
  })
})
