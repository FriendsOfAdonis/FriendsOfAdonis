import { REF_SYMBOL } from './symbols.js'

export type Ref = Object & {
  [REF_SYMBOL]: string
}

/**
 * Create a boxed primitive to append ref metadata.
 */
export function ref<T>(name: string, value: T): Ref {
  const boxed = new Object(value) as Ref

  boxed[REF_SYMBOL] = name

  return boxed
}

/**
 * Returns if a value is a Ref.
 */
export function isRef(value: any): value is Ref {
  return (typeof value === 'function' || typeof value === 'object') && REF_SYMBOL in value
}
