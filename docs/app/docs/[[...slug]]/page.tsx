/* eslint-disable react/jsx-pascal-case */
import { Popup, PopupContent, PopupTrigger } from 'fumadocs-twoslash/ui'
import { createTypeTable } from 'fumadocs-typescript/ui'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { TypeTable } from 'fumadocs-ui/components/type-table'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'
import { ConfigurationSteps } from '@/components/configuration-steps'
import { source } from '@/lib/source'
import { createMetadata, packages } from '@/utils/metadata'
import { metadataImage } from '@/utils/metadata-image'

const { AutoTypeTable } = createTypeTable()

export default async function Page(props: { readonly params: Promise<{ slug?: string[] }> }) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  const path = `docs/content/docs/${page.file.path}`

  const MDX = page.data.body

  return (
    <DocsPage
      editOnGithub={{
        repo: 'FriendsOfAdonis',
        owner: 'FriendsOfAdonis',
        sha: 'main',
        path,
      }}
      full={page.data.full}
      tableOfContent={{ style: 'clerk' }}
      toc={page.data.toc}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            Step,
            Steps,
            ConfigurationSteps,
            TypeTable,
            AutoTypeTable,
            Tabs,
            Tab,
            Popup,
            PopupContent,
            PopupTrigger,
          }}
        />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  const pkg = packages[page.slugs[0]]

  const description =
    page.data.description ?? pkg?.description ?? 'Well-written and production ready Adonis Packages'

  const suffix = pkg?.name ?? 'FriendsOfAdonis'

  return createMetadata(
    metadataImage.withImage(page.slugs, {
      title: `${page.data.title} | ${suffix}`,
      description,
      openGraph: {
        url: `/docs/${page.slugs.join('/')}`,
      },
    })
  )
}
