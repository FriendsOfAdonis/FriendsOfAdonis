import { ComponentProps } from '@foadonis/spark/jsx'
import { cn } from '../../utils/cn.js'

export const Breadcrumbs = ({ className, children, ...props }: ComponentProps<'div'>) => (
  <div className={cn('breadcrumbs', className)} {...props}>
    <ul>{children}</ul>
  </div>
)

Breadcrumbs.Item = ({ className, ...props }: ComponentProps<'li'>) => <li {...props} />
