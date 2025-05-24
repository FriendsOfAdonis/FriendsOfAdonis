import { test } from '@japa/runner'
import { html } from '../../src/jsx/tags.js'
import { VNODE_HTML_TAG, VNODE_SYMBOL } from '../../src/jsx/symbols.js'

test.group('tags', () => {
  test('html', ({ expect }) => {
    const result = html`Hello world`

    expect(result).toEqual({
      $$typeof: VNODE_SYMBOL,
      type: VNODE_HTML_TAG,
      props: {
        innerHTML: 'Hello world',
      },
    })
  })
})
