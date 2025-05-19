import { Component } from '@foadonis/spark'
import { SparkNode } from '@foadonis/spark/jsx'
import { RefAccessor } from '@foadonis/spark/types'
import { BaseResource } from '../../resources/base.js'
import { Table } from '../ui/table.js'
import { FieldsBuilder } from '../../fields/builder.js'
import { EditButton } from './buttons/edit_button.js'

export default class ResourceList extends Component<{ resource: BaseResource }> {
  async render(that: RefAccessor<ResourceList>): Promise<SparkNode> {
    const resource = this.$props.resource
    const records = await resource.list()

    const builder = new FieldsBuilder()
    const fields = resource.fields(builder).filter((f) => f.$display.index)

    return (
      <div>
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
                <Table.Cell>
                  <EditButton className="btn-sm" resource={resource} record={record} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}
