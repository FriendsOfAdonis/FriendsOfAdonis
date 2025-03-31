import { InferMetaType, InferPageType, loader } from 'fumadocs-core/source'
import { createMDXSource } from 'fumadocs-mdx'
import { icons } from 'lucide-react'
import { createElement } from 'react'
import { docs, blog as blogPosts } from '@/.source'
import { IconContainer } from '@/components/ui/icon'

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (icon && icon in icons)
      return createElement(IconContainer, {
        icon: icons[icon as keyof typeof icons],
      })
  },
})

export const blog = loader({
  baseUrl: '/blog',
  source: createMDXSource(blogPosts),
})

export type Page = InferPageType<typeof source>
export type Meta = InferMetaType<typeof source>
