import { BaseResource } from '../../../resources/base.js'
import ResourceForm from '../../resources/resource_form.js'
import { Breadcrumbs } from '../../ui/breadcrumbs.js'
import { PageHeader } from '../../ui/page_header.js'

export default function ResourceCreatePage({ resource }: { resource: BaseResource }) {
  return (
    <div>
      <Breadcrumbs className="pt-0 mb-2">
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>Users</Breadcrumbs.Item>
        <Breadcrumbs.Item>Create</Breadcrumbs.Item>
      </Breadcrumbs>
      <PageHeader>
        <PageHeader.Title>Create {resource.label}</PageHeader.Title>
      </PageHeader>
      <ResourceForm resource={resource} />
    </div>
  )
}
