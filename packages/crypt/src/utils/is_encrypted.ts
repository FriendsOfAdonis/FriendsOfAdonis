const PREFIX = 'encrypted:'

export function isEncrypted(value: string) {
  if (value.startsWith(PREFIX)) return value.substring(PREFIX.length)
  return false
}
