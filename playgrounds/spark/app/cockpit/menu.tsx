import { Sidebar } from '@foadonis/cockpit/components/ui/sidebar'
import cockpit from '@foadonis/cockpit/services/main'
import UserResource from './resources/user_resource.js'
import OrderResource from './resources/order_resource.js'
import { House } from '@foadonis/spark-lucide'
import ProductResource from './resources/product_resource.js'

export default async function Menu() {
  return (
    <>
      <Sidebar.Group>
        <Sidebar.MenuItem>
          <Sidebar.Link href="/admin">
            <House className="size-5" />
            Homepage
          </Sidebar.Link>
        </Sidebar.MenuItem>
      </Sidebar.Group>
      <Sidebar.Group>
        <Sidebar.GroupLabel>E-commerce</Sidebar.GroupLabel>
        <Sidebar.MenuItem>
          <Sidebar.ResourceLink resource={cockpit.resources.getOrFail(UserResource)} />
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <Sidebar.ResourceLink resource={cockpit.resources.getOrFail(ProductResource)} />
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <Sidebar.ResourceLink resource={cockpit.resources.getOrFail(OrderResource)} />
        </Sidebar.MenuItem>
      </Sidebar.Group>
    </>
  )
}
