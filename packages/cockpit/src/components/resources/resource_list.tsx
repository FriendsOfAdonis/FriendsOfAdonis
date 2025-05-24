import { Component } from '@foadonis/spark'
import { SparkNode } from '@foadonis/spark/jsx'
import { RefAccessor } from '@foadonis/spark/types'
import { BaseResource } from '../../resources/base.js'
import { Table } from '../ui/table.js'
import { FieldsBuilder } from '../../fields/builder.js'
import { EditButton } from './buttons/edit_button.js'
import { DeleteButton } from './buttons/delete_button.js'
import { Input } from '../ui/input.js'

export default class ResourceList extends Component<{ resource: BaseResource }> {
  query = ''
  page = 1
  perPage = 20

  async render(that: RefAccessor<ResourceList>): Promise<SparkNode> {
    const resource = this.$props.resource
    const records = await resource.list({
      query: this.query,
      page: this.page,
      perPage: this.perPage,
    })

    const builder = new FieldsBuilder()
    const fields = resource.fields(builder).filter((f) => f.$display.index)

    return (
      <div>
        <div className="flex justify-end mb-2">
          <Input $model={that.query} placeholder={`Search ${resource.labelPlural}...`} />
        </div>
        <Table>
          <Table.Header>
            <Table.Row>
              {fields.map((field) => {
                if (!field.$indexComponent) return null
                return <Table.Head>{field.name}</Table.Head>
              })}
              <Table.Head>Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {records.map((record) => (
              <Table.Row>
                {fields.map((field) => {
                  if (!field.$indexComponent) return null

                  const value = record[field.name]

                  return <Table.Cell>{field.$indexComponent({ value })}</Table.Cell>
                })}
                <Table.Cell className="space-x-2">
                  <EditButton className="btn-sm" resource={resource} record={record} />
                  <DeleteButton
                    className="btn-outline btn-sm"
                    resource={resource}
                    record={record}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}
