import type { ComponentProps } from '../jsx/types/jsx.js'

/**
 * Teleports its content into an other place in the page.
 */
export function Teleport({
  to,
  ...props
}: ComponentProps<'template'> & {
  /**
   * Query selector for the element you want to teleport to.
   *
   * @example "body"
   */
  to: string
}) {
  return <template x-teleport={`[data-portal-id=${to}]`} {...props}></template>
}
