import { REF_SYMBOL } from './symbols.js'

export type RefMeta = {
  path?: string
}

export type Ref<T> = {
  $$typeof: symbol
  property: string
  path: string
  value: T
}

/**
 * Create a boxed primitive to append ref metadata.
 */
export function ref<T>(value: T, property: string, path: string): Ref<T> {
  let v = {
    $$typeof: REF_SYMBOL,
    property,
    path: path,
    value,
  }

  if (typeof value === 'object') {
    v = createRefProxyAccessor(v, path)
  }

  return v
}

/**
 * Returns if a value is a Ref.
 */
export function isRef(value: any): value is Ref<unknown> {
  return typeof value === 'object' && value.$$typeof === REF_SYMBOL
}

/**
 * Creates a Ref proxy accessor.
 *
 * Ref proxy accessor creates a proxy around an object to returns refs when accessing properties.
 */
export function createRefProxyAccessor(object: any, prefix?: string) {
  return new Proxy(object, {
    get(target, property) {
      const value = target[property]
      if (typeof property === 'symbol') return value

      const path = prefix ? `${prefix}.${property}` : property

      return ref(value, property, path)
    },
  })
}
