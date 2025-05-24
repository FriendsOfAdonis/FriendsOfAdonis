import { defineDirective } from './main.js'

export default defineDirective(
  'link',
  ({ element, cleanup }) => {
    const handleClick = (event: MouseEvent) => {
      if (!(element instanceof HTMLAnchorElement)) return
      event.preventDefault()

      Spark.router.push(element.href)
    }

    element.addEventListener('click', handleClick)

    cleanup(() => {
      element.removeEventListener('click', handleClick)
    })
  },
  true
)
