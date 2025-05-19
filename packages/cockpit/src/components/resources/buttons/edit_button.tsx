import { Link } from '@foadonis/spark'
import { BaseResource } from '../../../resources/base.js'
import { Button } from '../../ui/button.js'
import { ComponentProps } from '@foadonis/spark/jsx'
import { cn } from '../../../utils/cn.js'
import { SquarePen } from '@foadonis/spark-lucide'

export const EditButton = ({
  resource,
  record,
  className,
  ...props
}: ComponentProps<typeof Button> & { resource: BaseResource; record: any }) => {
  return (
    <Button className={cn('btn-info', className)} asChild {...props}>
      <Link href={`/admin/resources/${resource.name}/${resource.id(record)}/edit`}>
        <SquarePen className="size-5" />
        Edit
      </Link>
    </Button>
  )
}
