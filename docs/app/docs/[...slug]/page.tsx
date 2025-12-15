import { getPageTreePeers } from 'fumadocs-core/page-tree'
import { Popup, PopupContent, PopupTrigger } from 'fumadocs-twoslash/ui'
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { File, Folder, Files } from 'fumadocs-ui/components/files'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from 'fumadocs-ui/page'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type ComponentProps, type FC, type ReactElement } from 'react'
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions'
import { ConfigurationSteps } from '@/components/configuration-steps'
import { NotFound } from '@/components/not-found'
import { source } from '@/lib/source'
import { createMetadata, withPageImage } from '@/utils/metadata'

export const revalidate = false

export default async function Page(props: {
  readonly params: Promise<{ slug: string[] }>
}): Promise<ReactElement> {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) return <NotFound getSuggestions={async () => []} />

  const { body: Mdx, toc } = await page.data.load()

  return (
    <DocsPage
      tableOfContent={{
        style: 'clerk',
        single: false,
      }}
      toc={toc}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <div className="flex flex-row flex-wrap gap-2 items-center border-b pb-6">
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions
          githubUrl={`https://github.com/FriendsOfAdonis/FriendsOfAdonis/blob/main/apps/docs/content/docs/${page.path}`}
          markdownUrl={`${page.url}.mdx`}
        />
      </div>
      <DocsBody className="text-fd-foreground/80">
        <Mdx
          components={{
            ...defaultMdxComponents,
            Popup,
            PopupContent,
            PopupTrigger,
            Tabs,
            Tab,
            Accordion,
            Accordions,
            ConfigurationSteps,
            File,
            Folder,
            Files,
            blockquote: Callout as unknown as FC<ComponentProps<'blockquote'>>,
          }}
        />
        {page.data.index ? <DocsCategory url={page.url} /> : null}
      </DocsBody>
    </DocsPage>
  )
}

function DocsCategory({ url }: { readonly url: string }) {
  return (
    <Cards>
      {getPageTreePeers(source.pageTree, url).map((peer) => (
        <Card href={peer.url} key={peer.url} title={peer.name}>
          {peer.description}
        </Card>
      ))}
    </Cards>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page)
    return createMetadata({
      title: 'Not found',
    })

  const description = page.data.description ?? 'The library for building documentation sites'

  return createMetadata(
    withPageImage(page, {
      title: page.data.title,
      description,
      openGraph: {
        url: `/docs/${page.slugs.join('/')}`,
      },
    })
  )
}

export function generateStaticParams() {
  return source.generateParams()
}
