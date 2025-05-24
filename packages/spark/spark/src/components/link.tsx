import { ComponentProps } from '../jsx/types/jsx.js'

export const Link = (props: ComponentProps<'a'>) => {
  return <a $link {...props} />
}
