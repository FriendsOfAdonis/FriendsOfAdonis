import { test } from '@japa/runner'
import { trace, type Tracer, type Span, type TracerProvider } from '@opentelemetry/api'
import { telemetryHook } from '../modules/otel.ts'

type SpanCall = { name: string; attributes: Record<string, unknown>; ended: boolean }

function fakeTracerProvider(): { provider: TracerProvider; spans: SpanCall[] } {
  const spans: SpanCall[] = []

  const tracer = {
    startSpan(name: string) {
      const record: SpanCall = { name, attributes: {}, ended: false }
      spans.push(record)
      const span: Partial<Span> = {
        setAttribute(key: string, value: any) {
          record.attributes[key] = value
          return span as Span
        },
        end() {
          record.ended = true
        },
      }
      return span as Span
    },
  } as unknown as Tracer

  return {
    provider: { getTracer: () => tracer },
    spans,
  }
}

test.group('telemetryHook', (group) => {
  group.each.teardown(() => {
    trace.disable()
  })

  test('does nothing for the "handle" entrypoint', ({ assert }) => {
    const { provider, spans } = fakeTracerProvider()
    trace.setGlobalTracerProvider(provider)

    const result = telemetryHook.handle({} as any, {
      method: 'handle',
      action: { constructor: { name: 'GreetAction' } },
      handler: () => {},
      args: [],
    } as any)

    assert.isUndefined(result)
    assert.lengthOf(spans, 0)
  })

  test('starts a span named after the action class for asController', ({ assert }) => {
    const { provider, spans } = fakeTracerProvider()
    trace.setGlobalTracerProvider(provider)

    const cleanup = telemetryHook.handle({} as any, {
      method: 'asController',
      action: { constructor: { name: 'CreateUserAction' } },
      handler: () => {},
      args: [],
    } as any)

    assert.isFunction(cleanup)
    assert.lengthOf(spans, 1)
    assert.equal(spans[0].name, 'CreateUserAction')
    assert.equal(spans[0].attributes.action_handler, 'asController')
    assert.isFalse(spans[0].ended)
  })

  test('cleanup ends the span', ({ assert }) => {
    const { provider, spans } = fakeTracerProvider()
    trace.setGlobalTracerProvider(provider)

    const cleanup = telemetryHook.handle({} as any, {
      method: 'asJob',
      action: { constructor: { name: 'SendEmailAction' } },
      handler: () => {},
      args: [],
    } as any)

    assert.isFunction(cleanup)
    ;(cleanup as () => void)()
    assert.isTrue(spans[0].ended)
  })

  test('also instruments asListener and asCommand', ({ assert }) => {
    const { provider, spans } = fakeTracerProvider()
    trace.setGlobalTracerProvider(provider)

    telemetryHook.handle({} as any, {
      method: 'asListener',
      action: { constructor: { name: 'L' } },
      handler: () => {},
      args: [],
    } as any)
    telemetryHook.handle({} as any, {
      method: 'asCommand',
      action: { constructor: { name: 'C' } },
      handler: () => {},
      args: [],
    } as any)

    assert.lengthOf(spans, 2)
    assert.equal(spans[0].attributes.action_handler, 'asListener')
    assert.equal(spans[1].attributes.action_handler, 'asCommand')
  })
})
