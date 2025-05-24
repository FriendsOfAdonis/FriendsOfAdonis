import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '16', cy: '20', r: '2', key: '1vifvg' }],
  [
    'path',
    {
      d: 'M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2',
      key: '3hgo9p',
    },
  ],
  ['path', { d: 'm22 14-4.5 4.5', key: '1ef6z8' }],
  ['path', { d: 'm21 15 1 1', key: '1ejcpy' }],
]

/**
 * @component @name FolderKey
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjIwIiByPSIyIiAvPgogIDxwYXRoIGQ9Ik0xMCAyMEg0YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDMuOWEyIDIgMCAwIDEgMS42OS45bC44MSAxLjJhMiAyIDAgMCAwIDEuNjcuOUgyMGEyIDIgMCAwIDEgMiAydjIiIC8+CiAgPHBhdGggZD0ibTIyIDE0LTQuNSA0LjUiIC8+CiAgPHBhdGggZD0ibTIxIDE1IDEgMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/folder-key
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FolderKey = createLucideIcon('folder-key', __iconNode)

export default FolderKey
