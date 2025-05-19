import { Component } from '@foadonis/spark'
import { BaseResource } from '../../../resources/base.js'
import { ComponentProps, SparkNode } from '@foadonis/spark/jsx'
import { RefAccessor } from '@foadonis/spark/types'
import { Button } from '../../ui/button.js'

export class DeleteButton extends Component<
  { resource: BaseResource; record: any } & ComponentProps<typeof Button>
> {
  render(that: RefAccessor<unknown>): SparkNode | Promise<SparkNode> {
    const { resource, record, ...props } = this.$props

    return (
      <>
        <Button {...props} onclick={`${this.$id}.showModal()`}>
          Delete
        </Button>
        <dialog id={this.$id} className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Delete {resource.label}</h3>
            <p className="py-4">Are you sure you want to do this? This action is irreversible!</p>
          </div>
        </dialog>
      </>
    )
  }
}
