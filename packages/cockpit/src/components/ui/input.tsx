import { ComponentProps } from '@foadonis/spark/jsx'
import { cn } from '../../utils/cn.js'

const Input = ({ className, type, ...props }: ComponentProps<'input'>) => {
  return <input type={type} className={cn('input', className)} {...props} />
}

export { Input }
