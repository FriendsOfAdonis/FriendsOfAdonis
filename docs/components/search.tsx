'use client'

import type { SharedProps } from 'fumadocs-ui/components/dialog/search'
import SearchDialog from 'fumadocs-ui/components/dialog/search-default'
import { useMode } from '@/app/layout.client'
import { TAGS } from '@/app/tags'

export default function CustomSearchDialog(props: SharedProps): React.ReactElement {
  return <SearchDialog {...props} allowClear defaultTag={useMode() ?? undefined} tags={TAGS} />
}
