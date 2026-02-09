import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import type { ReactNode } from 'react'
import { baseOptions } from '@/app/layout.config'
import { source } from '@/lib/source'
import { CustomSidebarFolder } from '../layout.client'

export default function Layout({ children }: { readonly children: ReactNode }) {
  const base = baseOptions
  return (
    <DocsLayout
      {...base}
      sidebar={{
        components: {
          Folder: CustomSidebarFolder,
        },
        tabs: {
          transform(option, node) {
            const meta = source.getNodeMeta(node)
            if (!meta || !node.icon) return option

            const color = `var(--${meta.path.split('/')[0]}-color, var(--color-fd-foreground))`

            return {
              ...option,
              icon: (
                <div
                  className="[&_svg]:size-full rounded-lg size-full text-(--tab-color) max-md:bg-(--tab-color)/10 max-md:border max-md:p-1.5"
                  style={
                    {
                      '--tab-color': color,
                    } as object
                  }
                >
                  {node.icon}
                </div>
              ),
            }
          },
        },
      }}
      tree={source.pageTree}
    >
      {children}
    </DocsLayout>
  )
}
