export function parseFunction(fn: Function) {
  const fnStr = fn.toString().trim()

  // Match block-style arrow functions: () => { ... }
  const blockMatch = fnStr.match(/^\s*\(?[\w\s,]*\)?\s*=>\s*{([\s\S]*)}$/)
  if (blockMatch) {
    return blockMatch[1].trim()
  }

  // Match concise-style arrow functions: x => x + 1
  const conciseMatch = fnStr.match(/^\s*\(?[\w\s,]*\)?\s*=>\s*(.*)$/)
  if (conciseMatch) {
    return `${conciseMatch[1].trim()};`
  }

  throw new Error(`Cannot parse function\n${fn}`)
}
