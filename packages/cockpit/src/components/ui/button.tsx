import { Slot } from '@foadonis/spark'
import { cn } from '../../utils/cn.js'
import { ComponentProps } from '@foadonis/spark/jsx'

const Button = ({
  className,
  asChild = false,
  ...props
}: ComponentProps<'button'> & {
  asChild?: boolean
}) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn('btn', className)} {...props} />
}

export { Button }
