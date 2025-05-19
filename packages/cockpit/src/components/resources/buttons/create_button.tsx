import { Link } from '@foadonis/spark'
import { BaseResource } from '../../../resources/base.js'
import { Button } from '../../ui/button.js'
import { ComponentProps } from '@foadonis/spark/jsx'
import { Plus } from '@foadonis/spark-lucide'

export const CreateButton = ({
  resource,
  ...props
}: ComponentProps<typeof Button> & { resource: BaseResource }) => {
  return (
    <Button {...props} className="btn-primary" asChild>
      <Link href={`/admin/resources/${resource.name}/create`}>
        Create {resource.label}
        <Plus />
      </Link>
    </Button>
  )
}
