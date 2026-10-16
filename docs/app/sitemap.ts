import type { MetadataRoute } from 'next'
import { blog, source } from '@/lib/source'
import { baseUrl } from '@/utils/metadata'

export const revalidate = false

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string => new URL(path, baseUrl).toString()

  // "/" only redirects to "/docs", so it is deliberately left out.
  return [
    {
      url: url('/docs'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: url('/blog'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...(await Promise.all(
      source
        .getPages()
        .filter((page) => !page.data.noindex)
        .map(async (page) => {
          const { lastModified } = await page.data.load()
          return {
            url: url(page.url),
            lastModified: lastModified ? new Date(lastModified) : undefined,
            changeFrequency: 'weekly',
            // Package landing pages are the entry points, rank them above inner pages.
            priority: page.slugs.length <= 1 ? 0.8 : 0.5,
          } as MetadataRoute.Sitemap[number]
        })
    )),
    ...blog.getPages().map(
      (page) =>
        ({
          url: url(page.url),
          lastModified: new Date(page.data.date),
          changeFrequency: 'monthly',
          priority: 0.5,
        }) as MetadataRoute.Sitemap[number]
    ),
  ]
}
