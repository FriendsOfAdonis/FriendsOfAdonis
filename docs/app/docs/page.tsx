import { Card, Cards } from 'fumadocs-ui/components/card'
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page'
import type { Metadata } from 'next'
import { source } from '@/lib/source'
import { createMetadata, siteDescription } from '@/utils/metadata'

export const metadata: Metadata = createMetadata({
  title: { absolute: 'AdonisJS Packages Documentation | Friends Of Adonis' },
  description:
    'Documentation for the Friends Of Adonis packages: OpenAPI specs, GraphQL APIs, Stripe billing, full-text search, feature flags and more for AdonisJS.',
  path: '/docs',
})

export default function Page() {
  const pages = source.getPageTree()

  return (
    <DocsPage>
      <DocsTitle>Friends Of Adonis</DocsTitle>
      <DocsDescription>{siteDescription}</DocsDescription>
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
