/* eslint-disable id-length */
import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb'
import { sync } from 'fumadocs-core/search/orama-cloud'
import type { OramaDocument } from 'fumadocs-core/search/orama-cloud'
import { notFound } from 'next/navigation'
import { DataSourceId, isAdmin, orama } from '@/lib/orama/client'
import { source } from '@/lib/source'

async function getItems() {
  const pages = source.getPages()
  const promises = pages.map(async (page) => {
    const items = getBreadcrumbItems(page.url, source.pageTree, {
      includePage: false,
      includeRoot: true,
    })

    return {
      id: page.url,
      structured: (await page.data.load()).structuredData,
      tag: page.slugs[0],
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      breadcrumbs: items.flatMap<string>((item, i) =>
        i > 0 && typeof item.name === 'string' ? item.name : []
      ),
    } as OramaDocument
  })

  return (await Promise.all(promises)).filter((v) => v !== undefined) as OramaDocument[]
}

export async function GET() {
  if (process.env.NODE_ENV !== 'development') return notFound()
  if (!isAdmin) {
    console.log('no private API key for Orama found, skipping')
    return
  }

  const records = await getItems()

  await sync(orama, {
    index: DataSourceId,
    documents: records,
  })

  console.log(`search updated: ${records.length} records`)
}
