import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 10v12', key: '6ubwww' }],
  [
    'path',
    {
      d: 'M17.929 7.629A1 1 0 0 1 17 9H7a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 9 2h6a1 1 0 0 1 .928.629z',
      key: '1o95gh',
    },
  ],
  ['path', { d: 'M9 22h6', key: '1rlq3v' }],
]

/**
 * @component @name LampFloor
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTB2MTIiIC8+CiAgPHBhdGggZD0iTTE3LjkyOSA3LjYyOUExIDEgMCAwIDEgMTcgOUg3YTEgMSAwIDAgMS0uOTI4LTEuMzcxbDItNUExIDEgMCAwIDEgOSAyaDZhMSAxIDAgMCAxIC45MjguNjI5eiIgLz4KICA8cGF0aCBkPSJNOSAyMmg2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/lamp-floor
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const LampFloor = createLucideIcon('lamp-floor', __iconNode)

export default LampFloor
