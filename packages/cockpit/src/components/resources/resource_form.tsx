import { Component, getPropertyFromAccessor } from '@foadonis/spark'
import { SparkNode } from '@foadonis/spark/jsx'
import { RefAccessor } from '@foadonis/spark/types'
import { BaseResource } from '../../resources/base.js'
import { FieldsBuilder } from '../../fields/builder.js'
import { Button } from '../ui/button.js'
import { Fieldset } from '../ui/fieldset.js'
import { Icon } from '../ui/icon.js'
import { DeleteButton } from './buttons/delete_button.js'
import { Trash } from '@foadonis/spark-lucide'

export default class ResourceForm extends Component<{ resource: BaseResource; record?: any }> {
  mode: 'create' | 'update' = 'create'
  data: Record<string, any> = {}

  mount(): Promise<void> | void {
    if (this.$props.record) {
      this.data = this.$props.record
      this.mode = 'update'
    }
  }

  render(that: RefAccessor<ResourceForm>): SparkNode {
    const resource = this.$props.resource
    const builder = new FieldsBuilder()

    const fields = resource.fields(builder).filter((f) => f.$display.update)

    return (
      <form $submit={that.submit} className="space-y-4">
        <Fieldset className="bg-base-200 border-base-300 rounded-box w-xs border p-4 w-full grid grid-cols-4 gap-4">
          <Fieldset.Label>General</Fieldset.Label>
          {fields.map((field) => {
            if (!field.$formComponent) return null
            const accessor = `data.${field.name}`
            return field.$formComponent({
              resource: this.$props.resource,
              value: getPropertyFromAccessor(accessor, this),
              ref: `data.${field.name}`,
            })
          })}
        </Fieldset>
        <div className="flex justify-end gap-3">
          {this.$props.record ? (
            <DeleteButton type="button" resource={resource} record={this.$props.record} />
          ) : null}
          <Button type="button" className="btn-outline btn-error">
            <Trash className="size-4" /> Delete {resource.label}
          </Button>
          <Button type="submit" className="btn-primary">
            {this.mode === 'create' ? 'Create' : 'Save'} {resource.label}
          </Button>
        </div>
      </form>
    )
  }

  async submit() {
    const resource = this.$props.resource

    if (this.mode === 'update') {
      const record = this.$props.record
      await resource.update(resource.id(record), this.data)
    }

    this.redirect(`/admin/resources/${resource.name}`)
  }
}
