import { BaseResource } from '../../../resources/base.js'
import { CreateButton } from '../../resources/buttons/create_button.js'
import ResourceList from '../../resources/resource_list.js'
import { Breadcrumbs } from '../../ui/breadcrumbs.js'
import { PageHeader } from '../../ui/page_header.js'

export default function ResourcesIndexPage({ resource }: { resource: BaseResource }) {
  return (
    <div>
      <Breadcrumbs className="pt-0 mb-2">
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>Users</Breadcrumbs.Item>
      </Breadcrumbs>
      <PageHeader>
        <PageHeader.Title>{resource.labelPlural}</PageHeader.Title>
        <PageHeader.Actions>
          <CreateButton resource={resource} />
        </PageHeader.Actions>
      </PageHeader>
      <ResourceList resource={resource} />
    </div>
  )
}
