export function truncate(value: string, maxLength = 7) {
  if (value.length > 0) {
    return `${value.slice(0, maxLength)}...`
  }
  return value
}
