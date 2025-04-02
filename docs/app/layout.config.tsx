import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared'
import { AlbumIcon, Braces, CircleDollarSign, Plus, Search, Server, Vault } from 'lucide-react'
import Image from 'next/image'
import { GithubInfo } from '@/components/github-info'

export const linkItems: LinkItemType[] = []

export const baseOptions: BaseLayoutProps = {
  nav: {
    url: '/docs',
    title: (
      <div className="flex items-center gap-3 my-2">
        <Image alt="Friends Of Adonis" height={32} src="/logo.png" width={32} />
        Friends Of Adonis
      </div>
    ),
  },
  links: [
    {
      type: 'menu',
      text: 'Packages',
      url: '/docs',
      items: [
        {
          icon: <Server />,
          text: 'OpenAPI',
          description: 'Generate OpenAPI specifications',
          url: '/docs/openapi',
        },
        {
          icon: <Server />,
          text: 'GraphQL',
          description: 'Create GraphQL APIs using AdonisJS',
          url: '/docs/graphql',
        },
        {
          icon: <CircleDollarSign />,
          text: 'Shopkeeper',
          description: 'Fluent interface for Stripe',
          url: '/docs/shopkeeper',
        },
        {
          icon: <Search />,
          text: 'Magnify',
          description: "Plug'n Play full-text search",
          url: '/docs/magnify',
        },
        {
          icon: <Vault />,
          text: 'Crypt',
          description: 'Safely and easily manage your credentials',
          url: '/docs/crypt',
        },
        {
          icon: <Plus />,
          text: 'View more',
          description: 'Discover all our packages',
          url: '/docs',
        },
      ],
    },
    {
      icon: <AlbumIcon />,
      text: 'Blog',
      url: '/blog',
      active: 'nested-url',
    },
    {
      type: 'custom',
      children: <GithubInfo owner="FriendsOfAdonis" repo="FriendsOfAdonis" />,
    },
  ],
}
