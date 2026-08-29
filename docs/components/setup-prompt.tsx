'use client'

import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button'
import { Check, ChevronDown, Copy, Sparkles } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/utils/cn'

export type SetupPromptProps = {
  /**
   * The prompt copied to the clipboard, written for a coding agent
   */
  readonly prompt: string

  /**
   * A short sentence telling the reader what the prompt does
   */
  readonly children?: ReactNode
}

/**
 * Card offering a ready-made prompt to set a feature up with a coding
 * agent. The prompt is copied in one click and can be previewed in
 * place.
 */
export function SetupPrompt({ prompt, children }: SetupPromptProps) {
  const [open, setOpen] = useState(false)
  const [checked, onClick] = useCopyButton(() => navigator.clipboard.writeText(prompt))

  return (
    <div className="not-prose my-6 rounded-lg border bg-fd-card p-4 text-fd-card-foreground">
      <div className="flex flex-wrap items-center gap-3">
        <Sparkles className="size-4 shrink-0 text-fd-muted-foreground" />
        <div className="min-w-48 flex-1 text-sm">{children}</div>
        <button
          className={cn(
            buttonVariants({
              color: 'secondary',
              size: 'sm',
              className: 'gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground',
            })
          )}
          onClick={onClick}
          type="button"
        >
          {checked ? <Check /> : <Copy />}
          Copy setup prompt
        </button>
      </div>
      <Collapsible onOpenChange={setOpen} open={open}>
        <CollapsibleTrigger className="mt-3 inline-flex items-center gap-1 text-xs text-fd-muted-foreground hover:text-fd-accent-foreground">
          <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} />
          {open ? 'Hide prompt' : 'Show prompt'}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <pre className="mt-3 whitespace-pre-wrap rounded-md bg-fd-secondary p-3 text-xs leading-relaxed text-fd-secondary-foreground">
            {prompt}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
