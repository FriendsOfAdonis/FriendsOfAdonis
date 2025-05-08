import { test } from '@japa/runner'
import { toAlpineEventAttribute, toAlpineEventAttributeKey } from '../../src/runtime/alpine.js'
import { ref } from '../../src/ref.js'

test.group('toAlpineEventAttributeKey', () => {
  test('{0}')
    .with([
      ['basic no options', '$click', undefined, 'x-on:click'],
      ['custom event no options', '$custom', {}, 'x-on:custom'],
      ['basic single option', '$click', { prevent: true }, 'x-on:click.prevent'],
      ['basic single false option', '$click', { prevent: false }, 'x-on:click'],
      [
        'basic multiple options',
        '$click',
        { prevent: true, stop: true },
        'x-on:click.prevent.stop',
      ],
      ['single key', '$keyup', { key: 'alt' }, 'x-on:keyup.alt'],
      ['multiple keys', '$keyup', { key: ['alt', 'shift'] }, 'x-on:keyup.alt.shift'],
      ['throttle', '$keyup', { throttle: 500 }, 'x-on:keyup.throttle.500ms'],
      ['debounce', '$keyup', { debounce: 1000 }, 'x-on:keyup.debounce.1000ms'],
    ] as [string, string, any, string][])
    .run(({ expect }, value) => {
      expect(toAlpineEventAttributeKey(value[1], value[2])).toBe(value[3])
    })
})

test.group('toAlpineEventAttribute', () => {
  test('{0}')
    .with([
      ['string value', '$click', '$osmos', (r) => r.path, undefined, {}, ['x-on:click', '$osmos']],
      [
        'ref value',
        '$click',
        ref('hello', 'title', 'form.title'),
        (r) => r.path,
        undefined,
        {},
        ['x-on:click', 'form.title'],
      ],
      [
        'toKey',
        '$model',
        'form.title',
        (r) => r.path,
        () => `x-model`,
        {},
        ['x-model', 'form.title'],
      ],
      [
        'withOptions',
        '$click',
        [ref('any', 'title', 'form.title'), { prevent: true }],
        (r) => `$osmos.action('${r.path}')`,
        undefined,
        { stop: true },
        ['x-on:click.stop.prevent', `$osmos.action('form.title')`],
      ],
    ] as [
      string,
      ...Parameters<typeof toAlpineEventAttribute>,
      ReturnType<typeof toAlpineEventAttribute>,
    ][])
    .run(({ expect }, value) => {
      expect(toAlpineEventAttribute(value[1], value[2], value[3], value[4], value[5])).toEqual(
        value[6]
      )
    })
})
