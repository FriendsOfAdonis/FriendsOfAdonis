import './global.css'
import 'fumadocs-twoslash/twoslash.css'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import Script from 'next/script'
import type { ReactNode } from 'react'
import { baseUrl, createMetadata } from '@/utils/metadata'
import { Provider } from './provider'

export const metadata = createMetadata({
  title: {
    template: '%s',
    default: 'FriendsOfAdonis',
  },
  description: 'Well-crafted and battle-tested Adonis packages made with ♥ by the community',
  metadataBase: baseUrl,
})

export default function Layout({ children }: { readonly children: ReactNode }) {
  return (
    <html
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
      <Script data-domain="friendsofadonis.com" src="https://plausible.io/js/script.js" />
    </html>
  )
}
