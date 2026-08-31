import { SetupPrompt } from './setup-prompt'
import { workbooks } from '@/lib/source'

export type WorkbookProps = {
  /**
   * A short sentence telling the reader what the workbook does
   */
  readonly title: string

  /**
   * Path of the workbook markdown file, relative to the content
   * directory
   */
  readonly path: string
}

/**
 * Card offering the content of a workbook as a ready-made prompt for a
 * coding agent. The markdown file is read at build time and copied
 * verbatim.
 */
export async function Workbook({ title, path: workbookPath }: WorkbookProps) {
  const page = workbooks.getPage(workbookPath.split('/'))

  if (!page) {
    return null
  }

  const prompt = await page?.data.getText('raw')

  return <SetupPrompt prompt={prompt}>{title}</SetupPrompt>
}
