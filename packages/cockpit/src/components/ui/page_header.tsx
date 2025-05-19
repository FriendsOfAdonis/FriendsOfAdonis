import { ComponentProps } from '@foadonis/spark/jsx'
import { cn } from '../../utils/cn.js'

export const PageHeader = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('mb-4 flex', className)} {...props} />
)

PageHeader.Title = ({ className, ...props }: ComponentProps<'h1'>) => (
  <h1 className={cn('text-2xl flex-1 font-semibold', className)} {...props} />
)

PageHeader.Actions = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('flex items-center gap-3', className)} {...props} />
)
