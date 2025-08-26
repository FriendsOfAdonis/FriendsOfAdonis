import { HomeLayout } from 'fumadocs-ui/layouts/home'
import type { ReactNode } from 'react'
import { baseOptions } from '@/app/layout.config'

export default function Layout({ children }: { readonly children: ReactNode }): React.ReactElement {
  return <HomeLayout {...baseOptions}>{children}</HomeLayout>
}
