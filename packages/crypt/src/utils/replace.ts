import { EnvParser } from '@adonisjs/core/env'
import { quotes as _quotes } from './quotes.js'
import { escapeDollarSigns, escapeForRegex } from './escape.js'

export async function replace(src: string, key: string, replaceValue: string) {
  let output
  let newPart = ''

  const parsed = await new EnvParser(src).parse()
  const quotes = _quotes(src)
  if (Object.prototype.hasOwnProperty.call(parsed, key)) {
    const quote = quotes[key]
    newPart += `${key}=${quote}${replaceValue}${quote}`

    const originalValue = parsed[key]
    const escapedOriginalValue = escapeForRegex(originalValue)

    // conditionally enforce end of line
    let enforceEndOfLine = ''
    if (escapedOriginalValue === '') {
      enforceEndOfLine = '$' // EMPTY scenario
    }

    const currentPart = new RegExp(
      '^' + // start of line
        '(\\s*)?' + // spaces
        '(export\\s+)?' + // export
        key + // KEY
        '\\s*=\\s*' + // spaces (KEY = value)
        '["\'`]?' + // open quote
        escapedOriginalValue + // escaped value
        '["\'`]?' + // close quote
        enforceEndOfLine,
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
