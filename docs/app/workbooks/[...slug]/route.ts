import { workbooks } from '@/lib/source'
import { notFound } from 'next/navigation'

export const revalidate = false

export async function GET(_req: Request, { params }: RouteContext<'/workbooks/[...slug]'>) {
  const { slug } = await params
  const page = workbooks.getPage(slug)
  if (!page) notFound()

  const content = await page.data.getText('raw')

  return new Response(content, {
    headers: {
      'Content-Type': 'text/markdown',
    },
  })
}

export function generateStaticParams() {
  return workbooks.generateParams()
}
