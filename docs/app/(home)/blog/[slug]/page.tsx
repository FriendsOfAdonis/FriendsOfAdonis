import { Popup, PopupContent, PopupTrigger } from 'fumadocs-twoslash/ui'
import { File, Files, Folder } from 'fumadocs-ui/components/files'
import { InlineTOC } from 'fumadocs-ui/components/inline-toc'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { blog } from '@/lib/source'
import { createMetadata } from '@/utils/metadata'
import { Control } from './page.client'

export default async function Page(props: { readonly params: Promise<{ slug: string }> }) {
  const params = await props.params
  const page = blog.getPage([params.slug])

  if (!page) notFound()
  const { body: Mdx, toc } = await page.data.load()

  return (
    <>
      <header className="container lg:px-4">
        <div className="px-4">
          <Link className={buttonVariants({ size: 'sm', variant: 'link' })} href="/blog">
            <ChevronLeft size={20} />
            <span>Back to articles</span>
          </Link>
          <h1 className="text-4xl font-semibold">{page.data.title}</h1>
        </div>
      </header>
      <article className="container flex flex-col px-0 py-8 lg:flex-row lg:px-4">
        <div className="prose min-w-0 flex-1 p-4">
          <InlineTOC items={toc} />
          <Mdx
            components={{
              ...defaultMdxComponents,
              File,
              Files,
              Folder,
              Tabs,
              Tab,
              Popup,
              PopupContent,
              PopupTrigger,
            }}
          />
        </div>
        <div className="flex flex-col gap-4 border-l p-4 text-sm lg:w-[250px]">
          <div>
            <p className="mb-1 text-fd-muted-foreground">Written by</p>
            <p className="font-medium">{page.data.author}</p>
          </div>
          <div>
            <p className="mb-1 text-sm text-fd-muted-foreground">At</p>
            <p className="font-medium">
              {new Date(page.data.date ?? page.file.name).toDateString()}
            </p>
          </div>
          <Control url={page.url} />
        </div>
      </article>
    </>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const page = blog.getPage([params.slug])

  if (!page) notFound()

  return createMetadata({
    title: page.data.title,
    description: page.data.description ?? '',
    openGraph: {
      type: 'article',
      images: {
        url: page.data.thumbnail,
        width: 1_000,
        height: 420,
      },
    },
  })
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }))
}
