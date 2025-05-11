import { uneval } from 'devalue'

/**
 * Serializes Javascript into string.
 *
 * This is used to transform Javascript into an Alpine evaluable expression.
 */
export function devalue(value: any) {
  return uneval(value).replaceAll('\"', "'")
}
