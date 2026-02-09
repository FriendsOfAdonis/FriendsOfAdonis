'use client'

import { TooltipProvider } from '@radix-ui/react-tooltip'
import { RootProvider } from 'fumadocs-ui/provider/base'
import dynamic from 'next/dynamic'
import { type ReactNode } from 'react'
import type { SearchTag } from '@/components/search'

const SearchDialog = dynamic(async () => import('@/components/search'), {
  ssr: false,
})

export function Provider({
  children,
  tags,
}: {
  readonly children: ReactNode
  readonly tags: SearchTag[]
}): React.ReactElement {
  return (
    <RootProvider
      search={{
        // eslint-disable-next-line react/no-unstable-nested-components
        SearchDialog: (props) => <SearchDialog tags={tags} {...props} />,
      }}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </RootProvider>
  )
}
