import { Ref } from '../../ref.js'

type RefOrString<T> = Ref<T> | string
export type AlpineEventAttributeValue<TRef, TOptions> =
  | RefOrString<TRef>
  | [RefOrString<TRef>, TOptions]

/** Correspond to a key or list of key */
type KeyModifier = string | string[]

export interface AlpineEventGlobalOptions {
  /**
   * Equivalent of calling .preventDefault() inside a listener on the browser event object.
   */
  prevent?: boolean

  /**
   * Equivalent of calling .stopPropagation() inside a listener on the browser event object.
   */
  stop?: boolean

  /**
   * A convenience helper for listening for a click outside of the element it is attached to.
   */
  outside?: boolean

  /**
   * Register the event listener on the root window object on the page instead of the element itself.
   */
  window?: boolean

  /**
   * Register the event listener on the document global instead of the element itself.
   */
  document?: boolean

  /**
   * Ensure that it is executed only once.
   */
  once?: boolean

  /**
   * Debounce the event by calling it after a certain period of inactivity.
   *
   * @default 250ms
   */
  debounce?: boolean | number

  /**
   * Ensure the handler cannot be called after a certain amount of time.
   *
   * @default 250ms
   */
  throttle?: boolean | number

  /**
   * Ensure the event come from this element.
   */
  self?: boolean

  /**
   * Browsers optimize scrolling on pages to be fast and smooth even when JavaScript is being executed on the page. However, improperly implemented touch and wheel listeners can block this optimization and cause poor site performance.
   */
  passive?: boolean

  /**
   * Add this modifier if you want to execute this listener in the event's capturing phase, e.g. before the event bubbles from the target element up the DOM.
   */
  capture?: boolean
}

export interface AlpineModelOptions {
  /**
   * By defaults the model is not live synchronized with the backend.
   *
   * When set to true the component is refreshed at every keystroke.
   * When set to "lazy" the component is refreshed when the user focuses away.
   */
  live?: boolean | 'lazy'

  /**
   * Debounce the event by calling it after a certain period of inactivity.
   *
   * @default 250ms
   */
  debounce?: boolean | number

  /**
   * Ensure the handler cannot be called after a certain amount of time.
   *
   * @default 250ms
   */
  throttle?: boolean | number
}

export interface AlpineMouseEventOptions extends AlpineEventGlobalOptions {
  /**
   * Key or list of keys to be pressed to trigger the handler.
   */
  key?: KeyModifier
}

export interface AlpineKeyboardEventOptions extends AlpineEventGlobalOptions {
  /**
   * Key or list of keys to be pressed to trigger the handler.
   */
  key?: KeyModifier
}

export interface AlpineSubmitEventOptions extends AlpineEventGlobalOptions {}

export type AlpineEventOptions =
  | AlpineMouseEventOptions
  | AlpineKeyboardEventOptions
  | AlpineSubmitEventOptions
  | AlpineEventGlobalOptions

export interface AlpineEventAttributes {
  /** Mouse events */
  ['$click']?: AlpineEventAttributeValue<Function, AlpineMouseEventOptions>
  ['$auxclick']?: AlpineEventAttributeValue<Function, AlpineMouseEventOptions>
  ['$context']?: AlpineEventAttributeValue<Function, AlpineMouseEventOptions>
  ['$dblclick']?: AlpineEventAttributeValue<Function, AlpineMouseEventOptions>
  ['$mouseover']?: AlpineEventAttributeValue<Function, AlpineMouseEventOptions>
  ['$mouseenter']?: AlpineEventAttributeValue<Function, AlpineMouseEventOptions>
  ['$mouseleave']?: AlpineEventAttributeValue<Function, AlpineMouseEventOptions>
  ['$mouseout']?: AlpineEventAttributeValue<Function, AlpineMouseEventOptions>
  ['$mouseup']?: AlpineEventAttributeValue<Function, AlpineMouseEventOptions>
  ['$mousedown']?: AlpineEventAttributeValue<Function, AlpineMouseEventOptions>

  /** Keyboard events */
  ['$keyup']?: AlpineEventAttributeValue<Function, AlpineKeyboardEventOptions>
  ['$keydown']?: AlpineEventAttributeValue<Function, AlpineKeyboardEventOptions>
}

export interface AlpineFormAttributes {
  ['$submit']?: AlpineEventAttributeValue<Function, AlpineSubmitEventOptions>
}

export interface AlpineInputAttributes {
  ['$model']?: AlpineEventAttributeValue<string | number | boolean, AlpineModelOptions>
}
