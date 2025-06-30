import { type DocumentRecord } from 'fumadocs-core/search/algolia'
import { NextResponse } from 'next/server'
import { source } from '@/lib/source'

export const revalidate = false

export async function GET() {
  const results: DocumentRecord[] = []

  for (const page of source.getPages()) {
    results.push({
      _id: page.url,
      structured: await page.data.load().then((data) => data.structuredData),
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      tag: page.slugs[0],
    })
  }

  return NextResponse.json(results)
}
