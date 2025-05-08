import type { ComponentProps } from '../runtime/index.js'

export const Link = (props: ComponentProps<'a'>) => {
  return <a x-link {...props} />
}
