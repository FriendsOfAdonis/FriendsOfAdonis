import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import Image from 'next/image'

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className="flex items-center gap-3">
        <Image alt="Friends Of Adonis" height={32} src="/logo.png" width={32} />
        Friends Of Adonis
      </div>
    ),
  },
  githubUrl: 'https://github.com/FriendsOfAdonis/FriendsOfAdonis',
  links: [],
}
