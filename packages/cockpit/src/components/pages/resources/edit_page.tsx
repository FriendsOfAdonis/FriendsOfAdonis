import { BaseResource } from '../../../resources/base.js'
import { CreateButton } from '../../resources/buttons/create_button.js'
import ResourceForm from '../../resources/resource_form.js'
import { Breadcrumbs } from '../../ui/breadcrumbs.js'
import { PageHeader } from '../../ui/page_header.js'

export default function ResourceEditPage({
  resource,
  record,
}: {
  resource: BaseResource
  record: any
}) {
  return (
    <div>
      <Breadcrumbs className="pt-0 mb-2">
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>Users</Breadcrumbs.Item>
        <Breadcrumbs.Item>Edit</Breadcrumbs.Item>
      </Breadcrumbs>
      <PageHeader>
        <PageHeader.Title>{resource.labelPlural}</PageHeader.Title>
        <PageHeader.Actions>
          <CreateButton resource={resource} />
        </PageHeader.Actions>
      </PageHeader>
      <ResourceForm resource={resource} record={record} />
    </div>
  )
}
