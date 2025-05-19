export function setPropertyFromAccessor(accessor: string, value: any, target: any) {
  const segments = accessor.split('.')
  const key = segments.shift()

  if (!key) return

  if (segments.length === 0) {
    target[key] = value
  }

  setPropertyFromAccessor(segments.join('.'), value, target[key])
}

export function getPropertyFromAccessor(accessor: string, target: any) {
  if (accessor === '') return target
  return accessor.split('.').reduce((acc, i) => acc?.[i], target)
}

export function hydrateObject(target: any, data: Record<string, any>) {
  for (const [k, v] of Object.entries(data)) {
    const current = target[k]

    if (typeof current === 'object') {
      hydrateObject(current, v)
      continue
    }

    target[k] = v
  }
}
