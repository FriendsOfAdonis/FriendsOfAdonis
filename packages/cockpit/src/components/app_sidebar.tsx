import { Sidebar } from './ui/sidebar.js'
import spark from '../../services/main.js'

export default async function AppSidebar() {
  const { default: Menu } = await spark.config.menu()

  return (
    <Sidebar>
      <Sidebar.Header className="py-8 text-center">
        <h1>Adonis Cockpit</h1>
      </Sidebar.Header>
      <Sidebar.Content>
        <Menu />
      </Sidebar.Content>
    </Sidebar>
  )
}
