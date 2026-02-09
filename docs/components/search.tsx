'use client'
import { liteClient } from 'algoliasearch/lite'
import type { Item, Node } from 'fumadocs-core/page-tree'
import { useDocsSearch } from 'fumadocs-core/search/client'
import type { SearchItemType, SharedProps } from 'fumadocs-ui/components/dialog/search'
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
} from 'fumadocs-ui/components/dialog/search'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover'
import { useI18n } from 'fumadocs-ui/contexts/i18n'
import { useTreeContext } from 'fumadocs-ui/contexts/tree'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/utils/cn'

export type SearchTag = {
  description: string
  name: string
  value: string
}

const appId = 'LQJ82JOML4'
const apiKey = 'c2076af5efab10accbac9fc8ce7d32d0'
const client = liteClient(appId, apiKey)

export default function CustomSearchDialog({
  tags,
  ...props
}: SharedProps & { readonly tags: SearchTag[] }) {
  const [open, setOpen] = useState(false)
  const [tag, setTag] = useState<string | undefined>()
  const { locale } = useI18n() // (optional) for i18n
  const router = useRouter()
  const { full } = useTreeContext()
  const { search, setSearch, query } = useDocsSearch({
    type: 'algolia',
    client,
    indexName: 'document',
    tag: tag ? tag.replace('root:', '') : undefined,
    locale,
  })

  const pathname = usePathname()

  useEffect(() => {
    if (!pathname.startsWith('/docs')) return

    const id = pathname.split('/')[2]
    if (tags.some((tag) => tag.value === `root:${id}`)) {
      setTag(`root:${id}`)
    }
  }, [pathname, tags])

  const searchMap = useMemo(() => {
    const map = new Map<string, Item>()

    function onNode(node: Node) {
      if (node.type === 'page' && typeof node.name === 'string') {
        map.set(node.name.toLowerCase(), node)
      } else if (node.type === 'folder') {
        if (node.index) onNode(node.index)
        for (const item of node.children) onNode(item)
      }
    }

    for (const item of full.children) onNode(item)
    return map
  }, [full])

  const pageTreeAction = useMemo<SearchItemType | undefined>(() => {
    if (search.length === 0) return

    const normalized = search.toLowerCase()
    for (const [key, page] of searchMap) {
      if (!key.startsWith(normalized)) continue

      return {
        id: 'quick-action',
        type: 'action',
        node: (
          <div className="inline-flex items-center gap-2 text-fd-muted-foreground">
            <ArrowRight className="size-4" />
            <p>
              Jump to <span className="font-medium text-fd-foreground">{page.name}</span>
            </p>
          </div>
        ),
        onSelect: () => router.push(page.url),
      }
    }
  }, [router, search, searchMap])

  console.log(query.data)

  return (
    <SearchDialog isLoading={query.isLoading} onSearchChange={setSearch} search={search} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={
            query.data !== 'empty' || pageTreeAction
              ? [
                  ...(pageTreeAction ? [pageTreeAction] : []),
                  ...(Array.isArray(query.data) ? query.data : []),
                ]
              : null
          }
        />
        <SearchDialogFooter className="flex flex-row flex-wrap gap-2 items-center">
          <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger
              className={buttonVariants({
                size: 'sm',
                color: 'ghost',
                className: '-m-1.5 me-auto',
              })}
            >
              <span className="text-fd-muted-foreground/80 me-2">Filter</span>
              {tags.find((item) => item.value === tag)?.name}
              <ChevronDown className="size-3.5 text-fd-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent align="start" className="flex flex-col p-1 gap-1">
              {tags.map((item, index) => {
                const isSelected = item.value === tag

                return (
                  <button
                    className={cn(
                      'rounded-lg text-start px-2 py-1.5',
                      isSelected
                        ? 'text-fd-primary bg-fd-primary/10'
                        : 'hover:text-fd-accent-foreground hover:bg-fd-accent'
                    )}
                    key={index}
                    onClick={() => {
                      setTag(item.value)
                      setOpen(false)
                    }}
                    type="button"
                  >
                    <p className="font-medium mb-0.5">{item.name}</p>
                    <p className="text-xs opacity-70">{item.description}</p>
                  </button>
                )
              })}
            </PopoverContent>
          </Popover>
          <a
            className="ms-auto text-xs text-fd-muted-foreground"
            href="https://algolia.com"
            rel="noreferrer noopener"
          >
            Search powered by Algolia
          </a>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  )
}
