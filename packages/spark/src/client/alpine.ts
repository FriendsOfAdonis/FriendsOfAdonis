import type { Alpine } from 'alpinejs'
import { SparkInstance } from './spark.js'
import { HTMLSparkComponentElement } from './components/component.js'
import morph from '@alpinejs/morph'
import sparkModel from './directives/spark_model.js'
import { Directive } from './directives/main.js'
import sparkLink from './directives/spark_link.js'

export function AlpinePlugin(spark: SparkInstance) {
  return (alpine: Alpine) => {
    alpine.plugin(morph as any)

    alpine.addRootSelector(() => 'body')
    alpine.addRootSelector(() => 'osmos-component')

    alpine.magic('spark', (el) => {
      const fragment = HTMLSparkComponentElement.findNearestComponent(el)
      if (!fragment) throw new Error('You are trying to use `$spark` outside a component')
      return fragment
    })

    alpine.interceptInit(
      alpine.skipDuringClone((element) => {
        const directives = Array.from(element.getAttributeNames())
          .filter((name) => name.startsWith('spark:'))
          .map((name) => Directive.fromElement(element, name))

        for (const directive of directives) {
          spark.emit('directive:global:init', {
            element,
            directive,
            cleanup: (callback) => {
              Alpine.onAttributeRemoved(element, directive.rawName, callback)
            },
          })
        }

        spark.emit('element:init', { element: element })

        const component = spark.closestComponent(element)

        if (!component) return

        for (const directive of directives) {
          spark.emit('directive:init', {
            element,
            directive,
            component,
            cleanup: (callback) => {
              Alpine.onAttributeRemoved(element, directive.rawName, callback)
            },
          })
        }
      })
    )

    const directives = [sparkModel, sparkLink]

    for (const directive of directives) {
      directive.global
        ? spark.globalDirective(directive.name, directive.callback)
        : spark.directive(directive.name, directive.callback)
    }
  }
}
