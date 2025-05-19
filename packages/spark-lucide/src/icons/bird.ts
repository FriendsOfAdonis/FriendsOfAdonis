import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M16 7h.01', key: '1kdx03' }],
  ['path', { d: 'M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20', key: 'oj1oa8' }],
  ['path', { d: 'm20 7 2 .5-2 .5', key: '12nv4d' }],
  ['path', { d: 'M10 18v3', key: '1yea0a' }],
  ['path', { d: 'M14 17.75V21', key: '1pymcb' }],
  ['path', { d: 'M7 18a6 6 0 0 0 3.84-10.61', key: '1npnn0' }],
]

/**
 * @component @name Bird
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgN2guMDEiIC8+CiAgPHBhdGggZD0iTTMuNCAxOEgxMmE4IDggMCAwIDAgOC04VjdhNCA0IDAgMCAwLTcuMjgtMi4zTDIgMjAiIC8+CiAgPHBhdGggZD0ibTIwIDcgMiAuNS0yIC41IiAvPgogIDxwYXRoIGQ9Ik0xMCAxOHYzIiAvPgogIDxwYXRoIGQ9Ik0xNCAxNy43NVYyMSIgLz4KICA8cGF0aCBkPSJNNyAxOGE2IDYgMCAwIDAgMy44NC0xMC42MSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/bird
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Bird = createLucideIcon('bird', __iconNode)

export default Bird
