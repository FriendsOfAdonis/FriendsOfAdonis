import { Card, Cards } from 'fumadocs-ui/components/card'
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page'
import { source } from '@/lib/source'

export default function Page() {
  const pages = source.getPageTree()

  return (
    <DocsPage>
      <DocsTitle>Friends Of Adonis</DocsTitle>
      <DocsDescription>
        Well-crafted and battle-tested Adonis packages made with ♥ by the community
      </DocsDescription>
      <DocsBody>
        <Cards>
          {pages.children.map((page) => (
            <Card href={`/docs/${page.name}`} icon={page.icon} key={page.$id} title={page.name}>
              {page.description ?? page.index.description}
            </Card>
          ))}
        </Cards>
      </DocsBody>
    </DocsPage>
  )
}
