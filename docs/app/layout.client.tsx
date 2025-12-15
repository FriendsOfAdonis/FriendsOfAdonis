'use client'

import type { Folder } from 'fumadocs-core/page-tree'
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderTrigger,
  SidebarItem,
} from 'fumadocs-ui/components/layout/sidebar'
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
  level,
}: {
  readonly children: ReactNode
  readonly item: Folder
  readonly level: number
}) {
  if (item.root === true) {
    const firstpage = item.children.find((item) => item.type === 'page')

    return (
      <SidebarItem href={firstpage?.url}>
        {item.icon}
        {item.name}
      </SidebarItem>
    )
  }

  return (
    <SidebarFolder>
      <SidebarFolderTrigger>
        {item.icon}
        {item.name}
      </SidebarFolderTrigger>
      <SidebarFolderContent>{children}</SidebarFolderContent>
    </SidebarFolder>
  )
}
