import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z',
      key: 'hod4my',
    },
  ],
  [
    'path',
    {
      d: 'M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z',
      key: 'w4yl2u',
    },
  ],
  ['path', { d: 'M3 5a2 2 0 0 0 2 2h3', key: 'f2jnh7' }],
  ['path', { d: 'M3 3v13a2 2 0 0 0 2 2h3', key: 'k8epm1' }],
]

/**
 * @component @name FolderTree
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgMTBhMSAxIDAgMCAwIDEtMVY2YTEgMSAwIDAgMC0xLTFoLTIuNWExIDEgMCAwIDEtLjgtLjRsLS45LTEuMkExIDEgMCAwIDAgMTUgM2gtMmExIDEgMCAwIDAtMSAxdjVhMSAxIDAgMCAwIDEgMVoiIC8+CiAgPHBhdGggZD0iTTIwIDIxYTEgMSAwIDAgMCAxLTF2LTNhMSAxIDAgMCAwLTEtMWgtMi45YTEgMSAwIDAgMS0uODgtLjU1bC0uNDItLjg1YTEgMSAwIDAgMC0uOTItLjZIMTNhMSAxIDAgMCAwLTEgMXY1YTEgMSAwIDAgMCAxIDFaIiAvPgogIDxwYXRoIGQ9Ik0zIDVhMiAyIDAgMCAwIDIgMmgzIiAvPgogIDxwYXRoIGQ9Ik0zIDN2MTNhMiAyIDAgMCAwIDIgMmgzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/folder-tree
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FolderTree = createLucideIcon('folder-tree', __iconNode)

export default FolderTree
