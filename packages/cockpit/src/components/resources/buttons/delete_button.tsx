import { Component } from '@foadonis/spark'
import { BaseResource } from '../../../resources/base.js'
import { ComponentProps, SparkNode } from '@foadonis/spark/jsx'
import { RefAccessor } from '@foadonis/spark/types'
import { Button } from '../../ui/button.js'
import { DeleteModal } from '../modals/delete_modal.js'
import { Trash } from '@foadonis/spark-lucide'
import { cn } from '../../../utils/cn.js'

export class DeleteButton extends Component<
  { resource: BaseResource; record: any } & ComponentProps<typeof Button>
> {
  render(_that: RefAccessor<unknown>): SparkNode | Promise<SparkNode> {
    const { resource, record, className, ...props } = this.$props

    return (
      <>
        <Button
          {...props}
          className={cn('btn-error', className)}
          onClick={`${this.$id}.showModal()`}
        >
          <Trash className="size-4" />
        </Button>
        <DeleteModal id={this.$id} resource={resource} />
      </>
    )
  }
}
