import { EnvParser } from '@adonisjs/core/env'
import { quotes as _quotes } from './quotes.js'
import { escapeDollarSigns } from './escape.js'

export async function replace(src: string, key: string, replaceValue: string) {
  let output
  let newPart = ''

  const parsed = await new EnvParser(src).parse()
  const quotes = _quotes(src)
  if (Object.prototype.hasOwnProperty.call(parsed, key)) {
    const quote = quotes[key]
    newPart += `${key}=${quote}${replaceValue}${quote}`

    const currentPart = new RegExp(
      '^' + // start of line
        '(\\s*)?' + // spaces
        '(export\\s+)?' + // export
        key + // KEY
        '\\s*=\\s*["\']?.*?["\']?' + // spaces (KEY = value)
        '$',
      'gm' // (g)lobal (m)ultiline
    )

    const saferInput = escapeDollarSigns(newPart) // cleanse user inputted capture groups ($1, $2 etc)

    // $1 preserves spaces
    // $2 preserves export
    output = src.replace(currentPart, `$1$2${saferInput}`)
  } else {
    newPart += `${key}="${replaceValue}"`

    // append
    if (src.endsWith('\n')) {
      newPart = newPart + '\n'
    } else {
      newPart = '\n' + newPart
    }

    output = src + newPart
  }

  return output
}
