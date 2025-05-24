import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2', key: '4irg2o' }],
  ['path', { d: 'M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10', key: '14fcyx' }],
  ['rect', { width: '13', height: '8', x: '8', y: '6', rx: '1', key: 'o6oiis' }],
  ['circle', { cx: '18', cy: '20', r: '2', key: 't9985n' }],
  ['circle', { cx: '9', cy: '20', r: '2', key: 'e5v82j' }],
]

/**
 * @component @name BaggageClaim
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMThINmEyIDIgMCAwIDEtMi0yVjdhMiAyIDAgMCAwLTItMiIgLz4KICA8cGF0aCBkPSJNMTcgMTRWNGEyIDIgMCAwIDAtMi0yaC0xYTIgMiAwIDAgMC0yIDJ2MTAiIC8+CiAgPHJlY3Qgd2lkdGg9IjEzIiBoZWlnaHQ9IjgiIHg9IjgiIHk9IjYiIHJ4PSIxIiAvPgogIDxjaXJjbGUgY3g9IjE4IiBjeT0iMjAiIHI9IjIiIC8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjIwIiByPSIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/baggage-claim
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const BaggageClaim = createLucideIcon('baggage-claim', __iconNode)

export default BaggageClaim
