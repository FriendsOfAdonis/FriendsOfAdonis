import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M11 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1.5',
      key: '6hud8k',
    },
  ],
  [
    'path',
    {
      d: 'M13.9 17.45c-1.2-1.2-1.14-2.8-.2-3.73a2.43 2.43 0 0 1 3.44 0l.36.34.34-.34a2.43 2.43 0 0 1 3.45-.01c.95.95 1 2.53-.2 3.74L17.5 21Z',
      key: 'wpff58',
    },
  ],
]

/**
 * @component @name FolderHeart
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMjBINGEyIDIgMCAwIDEtMi0yVjVhMiAyIDAgMCAxIDItMmgzLjlhMiAyIDAgMCAxIDEuNjkuOWwuODEgMS4yYTIgMiAwIDAgMCAxLjY3LjlIMjBhMiAyIDAgMCAxIDIgMnYxLjUiIC8+CiAgPHBhdGggZD0iTTEzLjkgMTcuNDVjLTEuMi0xLjItMS4xNC0yLjgtLjItMy43M2EyLjQzIDIuNDMgMCAwIDEgMy40NCAwbC4zNi4zNC4zNC0uMzRhMi40MyAyLjQzIDAgMCAxIDMuNDUtLjAxYy45NS45NSAxIDIuNTMtLjIgMy43NEwxNy41IDIxWiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/folder-heart
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FolderHeart = createLucideIcon('folder-heart', __iconNode)

export default FolderHeart
