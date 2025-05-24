import { defineDirective } from './main.js'

export default defineDirective('model', ({ element, directive, component }) => {
  const { value: expression } = directive

  let value = element.getAttribute('value')

  if (!expression) {
    console.warn('[SPARK] `$model` is missing a value')
    return
  }

  Alpine.bind(element, {
    ['@change']() {
      component.commit()
    },
    ['x-model']() {
      return {
        get() {
          return value
        },
        set(v: any) {
          value = v
          component.update(expression, v)
        },
      }
    },
  })
})
