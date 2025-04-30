import { Alpine } from 'alpinejs'
import { OsmosInstance } from './osmos.js'
import { HTMLComponentElement } from './component.js'

export function AlpinePlugin(osmos: OsmosInstance) {
  return (alpine: Alpine) => {
    alpine.magic('osmos', (el) => {
      const fragment = HTMLComponentElement.findNearestComponent(el)
      if (!fragment) throw new Error('You are trying to use `$osmos` outside a component')
      return fragment
    })

    alpine.directive('link', (el) => {
      el.addEventListener('click', (event) => {
        event.preventDefault()
        console.log(event)
        const anchor = event.target
        if (!anchor || !(anchor instanceof HTMLAnchorElement)) return
        event.preventDefault()
        osmos.router.push(anchor.href)
      })
    })
  }
}
