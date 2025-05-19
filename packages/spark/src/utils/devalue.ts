import { SuperJSON } from 'superjson'
import JSON5 from 'json5'

/**
 * Serializes Javascript into string.
 *
 * This is used to transform Javascript into an Alpine evaluable expression.
 */
export function devalue(value: any) {
  return JSON5.stringify(SuperJSON.serialize(value))
}

export function revalue<T>(text: string) {
  return SuperJSON.deserialize<T>(JSON5.parse(text))
}
