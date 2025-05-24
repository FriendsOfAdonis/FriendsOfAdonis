import { Component } from '@foadonis/spark'
import { SparkNode } from '@foadonis/spark/jsx'
import { RefAccessor } from '@foadonis/spark/types'
import { BaseResource } from '../../../resources/base.js'
import { Button } from '../../ui/button.js'

export class DeleteModal extends Component<{ resource: BaseResource; id: string }> {
  render(that: RefAccessor<DeleteModal>): SparkNode | Promise<SparkNode> {
    return (
      <dialog id={this.$props.id} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Delete {this.$props.resource.label}</h3>
          <p className="py-4">Are you sure you want to do this? This action is irreversible!</p>
          <div className="modal-action">
            <Button $click={that.delete} className="btn-error">
              Delete
            </Button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    )
  }

  delete() {
    console.log('TEST')
  }
}
