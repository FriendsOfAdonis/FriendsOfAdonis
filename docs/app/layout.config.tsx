import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared'
import { AlbumIcon, Braces, CircleDollarSign, Search, Server, Vault } from 'lucide-react'
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
          description: 'Generate compliant OpenAPI V3 specification using decorators',
          url: '/docs/openapi',
        },
        {
          icon: <Braces />,
          text: 'GraphQL',
          description: 'Create GraphQL APIs using your favorite Framework',
          url: '/docs/graphql',
        },
        {
          icon: <CircleDollarSign />,
          text: 'Shopkeeper',
          description: "Fluent interface to Stripe's subscription billing services",
          url: '/docs/shopkeeper',
        },
        {
          icon: <Search />,
          text: 'Magnify',
          description: 'Add Full-Text Search to your Lucid models',
          url: '/docs/magnify',
        },
        {
          icon: <Vault />,
          text: 'Crypt',
          description: 'Safely store your secrets in your repository',
          url: '/docs/crypt',
        },
        {
          icon: <Vault />,
          text: 'Maintenance',
          description: 'Easily put your application in maintenance mode',
          url: '/docs/maintenance',
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
