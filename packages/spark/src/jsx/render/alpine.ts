import { Ref } from '../ref.js'
import { AlpineEventAttributeValue, AlpineEventOptions } from './types/alpine.js'

const ALPINE_EVENT_MAPPING: Record<
  string,
  {
    defaultOptions?: {}
    toKey?: (attribute: string) => string
    toHandler?: (ref: Ref<any>) => string
  }
> = {
  $submit: {
    defaultOptions: {
      prevent: true,
    },
  },
  $model: {
    toKey: () => `x-model`,
    toHandler: (r) => r.path,
  },
}

export function toAlpineEventAttributes(props: Record<string, any>): Record<string, any> {
  for (const [k, v] of Object.entries(props)) {
    if (!k.startsWith('$')) continue
    const m = ALPINE_EVENT_MAPPING[k]
    const [nk, nv] = toAlpineEventAttribute(
      k,
      v,
      m?.toHandler ?? ((r) => `$spark.action('${r.path}')`),
      m?.toKey,
      m?.defaultOptions
    )
    props[k] = undefined
    props[nk] = nv
  }

  return props
}

/**
 * Creates an Alpine compatible attribute key.
 */
export function toAlpineEventAttributeKey(attribute: string, options?: AlpineEventOptions): string {
  const base = `x-on:${attribute.slice(1)}`
  if (!options) return base

  const modifiers: string[] = []

  const { key, debounce, throttle, ...rest } = options as any // TODO: remove any

  if (key) {
    modifiers.push(...[key].flat())
  }

  if (debounce) {
    modifiers.push('debounce')
    if (typeof debounce === 'number') {
      modifiers.push(`${debounce}ms`)
    }
  }

  if (throttle) {
    modifiers.push('throttle')
    if (typeof throttle === 'number') {
      modifiers.push(`${throttle}ms`)
    }
  }

  for (const [k, v] of Object.entries(rest)) {
    if (!v) continue
    modifiers.push(k)
  }

  if (modifiers.length === 0) return base

  return `${base}.${modifiers.join('.')}`
}

export function toAlpineEventAttribute(
  attribute: string,
  value: AlpineEventAttributeValue<any, AlpineEventOptions>,
  toString: (ref: Ref<any>) => string,
  toKey?: (attribute: string) => string,
  defaultOptions?: AlpineEventOptions
): [string, string] {
  const [v, options] = Array.isArray(value) ? value : [value]

  const key = toKey
    ? toKey(attribute)
    : toAlpineEventAttributeKey(attribute, {
        ...defaultOptions,
        ...options,
      })

  return [key, typeof v === 'string' ? v : toString(v)]
}
