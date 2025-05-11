import * as devalue from 'devalue'
import { Component } from '../../components/main.js'
import { createRefProxyAccessor } from '../../ref.js'
import { ComponentContext } from '../../types.js'
import { RenderContext } from './main.js'
import { renderHTMLElement } from './html_element.js'

export async function renderComponent(
  component: Component<any>,
  props: any,
  context: RenderContext
): Promise<void> {
  const { $lazy, ...rest } = props

  // @ts-expect-error -- Readonly is for user only
  component.$props = rest

  const proxy = createRefProxyAccessor(component)

  let child: ComponentContext | undefined
  if (context.children) {
    child = context.children.shift()
    if (child) component.$hydrate(child?.data)
  }

  const result = await component.render(proxy)

  context.registry.register(component.constructor as any)

  const data = component.$data()

  const attributes: Record<string, any> = {
    'x-data': devalue.uneval(data).replaceAll('\"', "'"),
    'spark:id': component.$id,
    'spark:component': (component.constructor as any).$id,
    'children': result,
  }

  if ($lazy) {
    attributes['spark:lazy'] = ''
    attributes['children'] = ''
  }

  return renderHTMLElement('spark-component', attributes, {
    ...context,
    children: component.$childrenData,
  })
}
