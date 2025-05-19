import { ComponentProps } from '@foadonis/spark/jsx'
import { cn } from '../../utils/cn.js'

export const Fieldset = ({ className, ...props }: ComponentProps<'fieldset'>) => (
  <fieldset className={cn('fieldset', className)} {...props} />
)

Fieldset.Label = ({ className, ...props }: ComponentProps<'label'>) => (
  <legend className={cn('fieldset-legend pb-1', className)} {...props} />
)

Fieldset.Message = ({ className, ...props }: ComponentProps<'p'>) => (
  <p className={cn('label', className)} {...props} />
)
