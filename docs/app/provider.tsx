'use client'

import { TooltipProvider } from '@radix-ui/react-tooltip'
import { RootProvider } from 'fumadocs-ui/provider/base'
import dynamic from 'next/dynamic'
import { useMemo, useState, type ReactNode } from 'react'
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
  const [tag, setTag] = useState()

  const context = useMemo(() => ({ tag, setTag }), [tag, setTag])

  return (
    <RootProvider
      search={{
        SearchDialog: (props) => <SearchDialog tags={tags} {...props} />,
      }}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </RootProvider>
  )
}
