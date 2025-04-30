import { ComponentProps } from '../../runtime/types/jsx.js'

export const Link = (props: ComponentProps<'a'>) => {
  return <a x-link {...props} />
}
