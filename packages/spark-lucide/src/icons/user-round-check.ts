import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M2 21a8 8 0 0 1 13.292-6', key: 'bjp14o' }],
  ['circle', { cx: '10', cy: '8', r: '5', key: 'o932ke' }],
  ['path', { d: 'm16 19 2 2 4-4', key: '1b14m6' }],
]

/**
 * @component @name UserRoundCheck
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMiAyMWE4IDggMCAwIDEgMTMuMjkyLTYiIC8+CiAgPGNpcmNsZSBjeD0iMTAiIGN5PSI4IiByPSI1IiAvPgogIDxwYXRoIGQ9Im0xNiAxOSAyIDIgNC00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/user-round-check
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const UserRoundCheck = createLucideIcon('user-round-check', __iconNode)

export default UserRoundCheck
