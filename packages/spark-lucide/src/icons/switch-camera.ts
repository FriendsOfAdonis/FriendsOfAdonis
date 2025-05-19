import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5', key: 'mtk2lu' }],
  ['path', { d: 'M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5', key: '120jsl' }],
  ['circle', { cx: '12', cy: '12', r: '3', key: '1v7zrd' }],
  ['path', { d: 'm18 22-3-3 3-3', key: 'kgdoj7' }],
  ['path', { d: 'm6 2 3 3-3 3', key: '1fnbkv' }],
]

/**
 * @component @name SwitchCamera
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMTlINGEyIDIgMCAwIDEtMi0yVjdhMiAyIDAgMCAxIDItMmg1IiAvPgogIDxwYXRoIGQ9Ik0xMyA1aDdhMiAyIDAgMCAxIDIgMnYxMGEyIDIgMCAwIDEtMiAyaC01IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIC8+CiAgPHBhdGggZD0ibTE4IDIyLTMtMyAzLTMiIC8+CiAgPHBhdGggZD0ibTYgMiAzIDMtMyAzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/switch-camera
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const SwitchCamera = createLucideIcon('switch-camera', __iconNode)

export default SwitchCamera
