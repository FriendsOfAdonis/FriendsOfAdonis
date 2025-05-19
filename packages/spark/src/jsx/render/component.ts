import { Component } from '../../components/main.js'
import { RenderContext } from './main.js'
import { renderHTMLElement } from './html_element.js'
import { createRefProxyAccessor } from '../../ref.js'
import { ComponentContext } from '../../types.js'

export async function renderComponentClass(
  componentClass: new (...args: any[]) => Component<any>,
  props: any,
  context: RenderContext
): Promise<void> {
  const component = await context.spark.mount(componentClass as any, props)
  return renderComponent(component, props, context)
}

export async function renderComponent(
  component: Component<any>,
  props: any,
  context: RenderContext
): Promise<void> {
  const { $lazy, ...rest } = props

  if (!('$props' in component)) {
    Reflect.set(component, '$props', rest)
  }

  const proxy = createRefProxyAccessor(component)

  let child: ComponentContext | undefined
  if (context.children) {
    child = context.children.shift()
    if (child) component.$hydrate(child?.data)
  }

  const result = await component.render(proxy)

  const attributes: Record<string, any> = {
    'spark:id': component.$id,
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
