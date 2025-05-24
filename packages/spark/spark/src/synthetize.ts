import { isRef } from './ref.js'

export function synthetizeObject(target: any) {
  const data: Record<string, any> = {}

  for (const key of Object.getOwnPropertyNames(target)) {
    if (key.startsWith('$')) continue

    const value = target[key]

    if (typeof value.valueOf() === 'object') {
      if ('synthetize' in value && typeof value.synthetize === 'function') {
        data[key] = value.synthetize()
      } else {
        data[key] = synthetizeObject(value)
      }

      continue
    }

    if (isRef(value)) {
      data[key] = value.valueOf()
      continue
    }

    data[key] = value
  }

  return data
}
