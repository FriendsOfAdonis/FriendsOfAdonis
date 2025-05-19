import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'm18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2',
      key: '142zxg',
    },
  ],
  [
    'path',
    {
      d: 'M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z',
      key: '2t3380',
    },
  ],
  ['path', { d: 'M8 18h1', key: '13wk12' }],
]

/**
 * @component @name FilePenLine
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTggNS0yLjQxNC0yLjQxNEEyIDIgMCAwIDAgMTQuMTcyIDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMiIgLz4KICA8cGF0aCBkPSJNMjEuMzc4IDEyLjYyNmExIDEgMCAwIDAtMy4wMDQtMy4wMDRsLTQuMDEgNC4wMTJhMiAyIDAgMCAwLS41MDYuODU0bC0uODM3IDIuODdhLjUuNSAwIDAgMCAuNjIuNjJsMi44Ny0uODM3YTIgMiAwIDAgMCAuODU0LS41MDZ6IiAvPgogIDxwYXRoIGQ9Ik04IDE4aDEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/file-pen-line
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FilePenLine = createLucideIcon('file-pen-line', __iconNode)

export default FilePenLine
