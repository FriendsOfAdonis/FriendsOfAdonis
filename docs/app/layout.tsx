import './global.css'
import 'fumadocs-twoslash/twoslash.css'
import { NextProvider } from 'fumadocs-core/framework/next'
import { TreeContextProvider } from 'fumadocs-ui/contexts/tree'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import Script from 'next/script'
import type { ReactNode } from 'react'
import { source } from '@/lib/source'
import { baseUrl, createMetadata } from '@/utils/metadata'
import { Body } from './layout.client'
import { Provider } from './provider'

export const metadata = createMetadata({
  title: {
    template: '%s | Friends Of Adonis',
    default: 'Friends Of Adonis',
  },
  description: 'Well-crafted and battle-tested Adonis packages made with ♥ by the community',
  metadataBase: baseUrl,
})

export default async function Layout({ children }: { readonly children: ReactNode }) {
  const pages = source.getPageTree()

  const tags = await Promise.all(
    pages.children
      .filter((page) => page.type === 'folder')
      .map(async (page) => {
        const meta = source.getNodeMeta(page)
        if (!meta) return null
        return {
          name: page.name,
          value: page.$id,
          description: page.description ?? '',
        }
      })
      .filter(Boolean)
  )

  return (
    <html
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <Body>
        <NextProvider>
          <TreeContextProvider tree={source.pageTree}>
            <Provider tags={tags as any}>{children}</Provider>
          </TreeContextProvider>
        </NextProvider>
      </Body>
      <Script data-domain="friendsofadonis.com" src="https://plausible.io/js/script.js" />
    </html>
  )
}
