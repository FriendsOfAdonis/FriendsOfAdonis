'use client'

import type { Folder } from 'fumadocs-core/page-tree'
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderTrigger,
  SidebarItem,
} from 'fumadocs-ui/components/sidebar/base'
import { useParams } from 'next/navigation'
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function useMode(): string | undefined {
  const { slug } = useParams()
  return Array.isArray(slug) && slug.length > 0 ? slug[0] : undefined
}

export function Body({ children }: { readonly children: ReactNode }): React.ReactElement {
  const mode = useMode()

  return <body className={cn(mode, 'relative flex min-h-screen flex-col')}>{children}</body>
}

export function CustomSidebarFolder({
  children,
  item,
}: {
  readonly children: ReactNode
  readonly item: Folder
}) {
  if (item.root === true) {
    const firstpage = item.children.find((item) => item.type === 'page')

    return (
      <SidebarItem
        className="relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0 transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:hover:transition-colors"
        href={firstpage?.url}
      >
        {item.icon}
        {item.name}
      </SidebarItem>
    )
  }

  return (
    <SidebarFolder>
      <SidebarFolderTrigger className="relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0 transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none w-full">
        {item.icon}
        {item.name}
      </SidebarFolderTrigger>
      <SidebarFolderContent>{children}</SidebarFolderContent>
    </SidebarFolder>
  )
}
