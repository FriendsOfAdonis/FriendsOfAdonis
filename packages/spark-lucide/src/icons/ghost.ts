import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M9 10h.01', key: 'qbtxuw' }],
  ['path', { d: 'M15 10h.01', key: '1qmjsl' }],
  [
    'path',
    {
      d: 'M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z',
      key: 'uwwb07',
    },
  ],
]

/**
 * @component @name Ghost
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOSAxMGguMDEiIC8+CiAgPHBhdGggZD0iTTE1IDEwaC4wMSIgLz4KICA8cGF0aCBkPSJNMTIgMmE4IDggMCAwIDAtOCA4djEybDMtMyAyLjUgMi41TDEyIDE5bDIuNSAyLjVMMTcgMTlsMyAzVjEwYTggOCAwIDAgMC04LTh6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/ghost
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Ghost = createLucideIcon('ghost', __iconNode)

export default Ghost
