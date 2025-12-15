/* eslint-disable @typescript-eslint/unbound-method */
import Link from 'fumadocs-core/link'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { type ReactNode, Suspense } from 'react'
import { cn } from '@/utils/cn'

export type Suggestion = {
  href: string
  id: string
  title: ReactNode
}

export type NotFoundProps = {
  getSuggestions(): Promise<Suggestion[]>
}

export function NotFound(props: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 flex-1 p-8 me-(--fd-toc-width)">
      <h1 className="text-4xl font-bold font-mono">Not Found</h1>
      <div className="w-full border border-fd-foreground/50 border-dashed p-4 max-w-[400px]">
        <Suspense
          fallback={<p className="text-sm text-fd-muted-foreground">Finding Alternatives...</p>}
        >
          <Alternative {...props} />
        </Suspense>
      </div>
    </div>
  )
}

async function Alternative({ getSuggestions }: NotFoundProps) {
  const suggestions = await getSuggestions()

  if (suggestions.length === 0) {
    return (
      <div>
        <p className="mb-2">No Alternative Found</p>
        <Link className={cn(buttonVariants({ variant: 'secondary' }))} href="/">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4">Maybe you are looking for</h2>

      <div className="flex flex-col gap-2">
        {suggestions.map((doc) => (
          <Link
            className="block text-sm p-3 rounded-lg border bg-fd-card text-fd-card-foreground shadow-md transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            href={doc.href}
            key={doc.id}
          >
            <p className="font-medium">{doc.title}</p>
            <p className="text-fd-muted-foreground">{doc.href}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
