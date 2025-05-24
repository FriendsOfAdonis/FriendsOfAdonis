import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M22 12a10.06 10.06 1 0 0-20 0Z', key: '1teyop' }],
  ['path', { d: 'M12 12v8a2 2 0 0 0 4 0', key: 'ulpmoc' }],
  ['path', { d: 'M12 2v1', key: '11qlp1' }],
]

/**
 * @component @name Umbrella
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTJhMTAuMDYgMTAuMDYgMSAwIDAtMjAgMFoiIC8+CiAgPHBhdGggZD0iTTEyIDEydjhhMiAyIDAgMCAwIDQgMCIgLz4KICA8cGF0aCBkPSJNMTIgMnYxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/umbrella
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Umbrella = createLucideIcon('umbrella', __iconNode)

export default Umbrella
