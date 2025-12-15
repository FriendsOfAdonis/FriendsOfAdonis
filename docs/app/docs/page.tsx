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
          {pages.children
            .filter((page) => page.type === 'folder')
            .map(async (page) => {
              const meta = source.getNodeMeta(page)
              if (!meta) return null

              return (
                <Card
                  href={`/docs/${page.$id?.replace('root:', '')}`}
                  icon={page.icon}
                  key={page.$id}
                  title={meta.data.title}
                >
                  {meta.data.description}
                </Card>
              )
            })}
        </Cards>
      </DocsBody>
    </DocsPage>
  )
}
