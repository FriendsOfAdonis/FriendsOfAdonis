import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 9.5 8 12l2 2.5', key: '3mjy60' }],
  ['path', { d: 'm14 9.5 2 2.5-2 2.5', key: '1bir2l' }],
  ['path', { d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22z', key: 'k85zhp' }],
]

/**
 * @component @name MessageCircleCode
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgOS41IDggMTJsMiAyLjUiIC8+CiAgPHBhdGggZD0ibTE0IDkuNSAyIDIuNS0yIDIuNSIgLz4KICA8cGF0aCBkPSJNNy45IDIwQTkgOSAwIDEgMCA0IDE2LjFMMiAyMnoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/message-circle-code
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const MessageCircleCode = createLucideIcon('message-circle-code', __iconNode)

export default MessageCircleCode
