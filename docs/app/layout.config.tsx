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
      type: 'custom',
      children: <GithubInfo owner="FriendsOfAdonis" repo="FriendsOfAdonis" />,
    },
  ],
}
