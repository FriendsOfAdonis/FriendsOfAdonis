import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'm7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21',
      key: '182aya',
    },
  ],
  ['path', { d: 'M22 21H7', key: 't4ddhn' }],
  ['path', { d: 'm5 11 9 9', key: '1mo9qw' }],
]

/**
 * @component @name Eraser
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNyAyMS00LjMtNC4zYy0xLTEtMS0yLjUgMC0zLjRsOS42LTkuNmMxLTEgMi41LTEgMy40IDBsNS42IDUuNmMxIDEgMSAyLjUgMCAzLjRMMTMgMjEiIC8+CiAgPHBhdGggZD0iTTIyIDIxSDciIC8+CiAgPHBhdGggZD0ibTUgMTEgOSA5IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eraser
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Eraser = createLucideIcon('eraser', __iconNode)

export default Eraser
