import { ImageResponse } from '@takumi-rs/image-response'
import { notFound } from 'next/navigation'
import { source } from '@/lib/source'
import { getPackage, getPageDescription, getPageImage, siteName } from '@/utils/metadata'
import { generate as MetadataImage, getImageResponseOptions } from './generate'

export async function GET(_req: Request, { params }: RouteContext<'/og/[...slug]'>) {
  const { slug } = await params
  const page = source.getPage(slug.slice(0, -1))
  if (!page) notFound()

  const pkg = getPackage(page)

  return new ImageResponse(
    <MetadataImage
      description={getPageDescription(page)}
      eyebrow={pkg?.name ?? siteName}
      title={page.data.title}
    />,
    await getImageResponseOptions()
  )
}

export function generateStaticParams(): {
  slug: string[]
}[] {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }))
}
