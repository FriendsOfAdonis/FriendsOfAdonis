import { HTMLSparkComponentElement } from '../components/component.js'

export type DirectiveDefinition = {
  name: string
  global: boolean
  callback: (options: {
    element: HTMLElement
    component: HTMLSparkComponentElement
    directive: Directive
    cleanup: (cb: () => void) => void
  }) => void
}

export function defineDirective(
  name: string,
  callback: DirectiveDefinition['callback'],
  global = false
): DirectiveDefinition {
  return { name, callback, global }
}

export class Directive {
  readonly rawName: string

  constructor(
    name: string,
    public readonly element: HTMLElement
  ) {
    this.rawName = name
  }

  get name() {
    return this.rawName.replace('spark:', '')
  }

  get value() {
    return this.element.getAttribute(this.rawName)
  }

  static fromElement(element: HTMLElement, name: string) {
    return new Directive(name, element)
  }
}
