import { getPageTreePeers } from 'fumadocs-core/server'
import { Popup, PopupContent, PopupTrigger } from 'fumadocs-twoslash/ui'
import { createGenerator } from 'fumadocs-typescript'
import { AutoTypeTable } from 'fumadocs-typescript/ui'
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
import { ConfigurationSteps } from '@/components/configuration-steps'
import { source } from '@/lib/source'
import { createMetadata } from '@/utils/metadata'
import { metadataImage } from '@/utils/metadata-image'

export const revalidate = false

const generator = createGenerator()

export default async function Page(props: {
  readonly params: Promise<{ slug: string[] }>
}): Promise<ReactElement> {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) notFound()

  const path = `apps/docs/content/docs/${page.file.path}`
  const { body: Mdx, toc, lastModified } = await page.data.load()

  return (
    <DocsPage
      article={{
        className: 'max-sm:pb-16',
      }}
      editOnGithub={{
        repo: 'FriendsOfAdonis',
        owner: 'FriendsOfAdonis',
        sha: 'main',
        path,
      }}
      full={page.data.full}
      lastUpdate={lastModified}
      tableOfContent={{
        style: 'clerk',
        single: false,
      }}
      toc={toc}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
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

            // eslint-disable-next-line react/no-unstable-nested-components
            AutoTypeTable: (props) => <AutoTypeTable {...props} generator={generator} />,
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

  if (!page) notFound()

  const description = page.data.description ?? 'The library for building documentation sites'

  return createMetadata(
    metadataImage.withImage(page.slugs, {
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
