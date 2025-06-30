import type { PropsWithChildren } from 'react'

export default async function Layout({ children }: PropsWithChildren) {
  return <main className="py-12">{children}</main>
}
