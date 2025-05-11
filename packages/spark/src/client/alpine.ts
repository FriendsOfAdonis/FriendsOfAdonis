import { Alpine } from 'alpinejs'
import { SparkInstance } from './spark.js'
import { HTMLComponentElement } from './components/component.js'

export function AlpinePlugin(spark: SparkInstance) {
  return (alpine: Alpine) => {
    alpine.magic('spark', (el) => {
      const fragment = HTMLComponentElement.findNearestComponent(el)
      if (!fragment) throw new Error('You are trying to use `$spark` outside a component')
      return fragment
    })

    alpine.directive('link', (el) => {
      el.addEventListener('click', (event) => {
        event.preventDefault()
        console.log(event)
        const anchor = event.target
        if (!anchor || !(anchor instanceof HTMLAnchorElement)) return
        event.preventDefault()
        spark.router.push(anchor.href)
      })
    })
  }
}
