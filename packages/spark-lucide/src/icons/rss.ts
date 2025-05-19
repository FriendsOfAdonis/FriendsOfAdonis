import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M4 11a9 9 0 0 1 9 9', key: 'pv89mb' }],
  ['path', { d: 'M4 4a16 16 0 0 1 16 16', key: 'k0647b' }],
  ['circle', { cx: '5', cy: '19', r: '1', key: 'bfqh0e' }],
]

/**
 * @component @name Rss
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxMWE5IDkgMCAwIDEgOSA5IiAvPgogIDxwYXRoIGQ9Ik00IDRhMTYgMTYgMCAwIDEgMTYgMTYiIC8+CiAgPGNpcmNsZSBjeD0iNSIgY3k9IjE5IiByPSIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/rss
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Rss = createLucideIcon('rss', __iconNode)

export default Rss
