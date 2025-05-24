import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2', key: 'mrq65r' }],
  ['path', { d: 'M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2', key: 'be3xqs' }],
  ['circle', { cx: '12', cy: '12', r: '1', key: '41hilf' }],
  [
    'path',
    {
      d: 'M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0',
      key: '11ak4c',
    },
  ],
]

/**
 * @component @name View
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTd2MmEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtMiIgLz4KICA8cGF0aCBkPSJNMjEgN1Y1YTIgMiAwIDAgMC0yLTJINWEyIDIgMCAwIDAtMiAydjIiIC8+CiAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMSIgLz4KICA8cGF0aCBkPSJNMTguOTQ0IDEyLjMzYTEgMSAwIDAgMCAwLS42NiA3LjUgNy41IDAgMCAwLTEzLjg4OCAwIDEgMSAwIDAgMCAwIC42NiA3LjUgNy41IDAgMCAwIDEzLjg4OCAwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/view
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const View = createLucideIcon('view', __iconNode)

export default View
