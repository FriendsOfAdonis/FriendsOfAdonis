import { test } from '@japa/runner'
import { jsx } from '../../src/runtime/jsx.js'

test.group('jsx', () => {
  test('HTMLElement', () => {
    const result = jsx('div', {})
  })
})
