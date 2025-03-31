'use client'

import algo from 'algoliasearch/lite'
import type { SharedProps } from 'fumadocs-ui/components/dialog/search'
import SearchDialog from 'fumadocs-ui/components/dialog/search-algolia'
import { useMode } from '@/app/layout.client'
import { TAGS } from '@/app/tags'

const client = algo('LQJ82JOML4', 'c2076af5efab10accbac9fc8ce7d32d0')
const index = client.initIndex('document')

export default function CustomSearchDialog(props: SharedProps): React.ReactElement {
  return (
    <SearchDialog
      {...props}
      index={index}
      allowClear
      defaultTag={useMode() ?? undefined}
      showAlgolia
      tags={TAGS}
    />
  )
}
