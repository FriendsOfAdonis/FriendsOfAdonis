import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '15', cy: '19', r: '2', key: 'u2pros' }],
  [
    'path',
    {
      d: 'M20.9 19.8A2 2 0 0 0 22 18V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5.1',
      key: '1jj40k',
    },
  ],
  ['path', { d: 'M15 11v-1', key: 'cntcp' }],
  ['path', { d: 'M15 17v-2', key: '1279jj' }],
]

/**
 * @component @name FolderArchive
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxNSIgY3k9IjE5IiByPSIyIiAvPgogIDxwYXRoIGQ9Ik0yMC45IDE5LjhBMiAyIDAgMCAwIDIyIDE4VjhhMiAyIDAgMCAwLTItMmgtNy45YTIgMiAwIDAgMS0xLjY5LS45TDkuNiAzLjlBMiAyIDAgMCAwIDcuOTMgM0g0YTIgMiAwIDAgMC0yIDJ2MTNhMiAyIDAgMCAwIDIgMmg1LjEiIC8+CiAgPHBhdGggZD0iTTE1IDExdi0xIiAvPgogIDxwYXRoIGQ9Ik0xNSAxN3YtMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/folder-archive
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FolderArchive = createLucideIcon('folder-archive', __iconNode)

export default FolderArchive
