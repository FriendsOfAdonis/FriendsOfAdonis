export function escapeForRegex(value: string) {
  return value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
}

export function escapeDollarSigns(value: string) {
  return value.replace(/\$/g, '$$$$')
}
