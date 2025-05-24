import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M4 10a7.31 7.31 0 0 0 10 10Z', key: '1fzpp3' }],
  ['path', { d: 'm9 15 3-3', key: '88sc13' }],
  ['path', { d: 'M17 13a6 6 0 0 0-6-6', key: '15cc6u' }],
  ['path', { d: 'M21 13A10 10 0 0 0 11 3', key: '11nf8s' }],
]

/**
 * @component @name SatelliteDish
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxMGE3LjMxIDcuMzEgMCAwIDAgMTAgMTBaIiAvPgogIDxwYXRoIGQ9Im05IDE1IDMtMyIgLz4KICA8cGF0aCBkPSJNMTcgMTNhNiA2IDAgMCAwLTYtNiIgLz4KICA8cGF0aCBkPSJNMjEgMTNBMTAgMTAgMCAwIDAgMTEgMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/satellite-dish
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const SatelliteDish = createLucideIcon('satellite-dish', __iconNode)

export default SatelliteDish
