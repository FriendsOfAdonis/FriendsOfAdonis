import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '7', height: '7', x: '14', y: '3', rx: '1', key: '6d4xhi' }],
  [
    'path',
    {
      d: 'M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3',
      key: '1fpvtg',
    },
  ],
]

/**
 * @component @name Blocks
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIxNCIgeT0iMyIgcng9IjEiIC8+CiAgPHBhdGggZD0iTTEwIDIxVjhhMSAxIDAgMCAwLTEtMUg0YTEgMSAwIDAgMC0xIDF2MTJhMSAxIDAgMCAwIDEgMWgxMmExIDEgMCAwIDAgMS0xdi01YTEgMSAwIDAgMC0xLTFIMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/blocks
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Blocks = createLucideIcon('blocks', __iconNode)

export default Blocks
