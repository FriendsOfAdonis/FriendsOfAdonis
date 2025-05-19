import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M18 21a8 8 0 0 0-16 0', key: '3ypg7q' }],
  ['circle', { cx: '10', cy: '8', r: '5', key: 'o932ke' }],
  ['path', { d: 'M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3', key: '10s06x' }],
]

/**
 * @component @name UsersRound
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggMjFhOCA4IDAgMCAwLTE2IDAiIC8+CiAgPGNpcmNsZSBjeD0iMTAiIGN5PSI4IiByPSI1IiAvPgogIDxwYXRoIGQ9Ik0yMiAyMGMwLTMuMzctMi02LjUtNC04YTUgNSAwIDAgMC0uNDUtOC4zIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/users-round
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const UsersRound = createLucideIcon('users-round', __iconNode)

export default UsersRound
