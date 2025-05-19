import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M4.9 19.1C1 15.2 1 8.8 4.9 4.9', key: '1vaf9d' }],
  ['path', { d: 'M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5', key: 'u1ii0m' }],
  ['circle', { cx: '12', cy: '12', r: '2', key: '1c9p78' }],
  ['path', { d: 'M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5', key: '1j5fej' }],
  ['path', { d: 'M19.1 4.9C23 8.8 23 15.1 19.1 19', key: '10b0cb' }],
]

/**
 * @component @name Radio
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNC45IDE5LjFDMSAxNS4yIDEgOC44IDQuOSA0LjkiIC8+CiAgPHBhdGggZD0iTTcuOCAxNi4yYy0yLjMtMi4zLTIuMy02LjEgMC04LjUiIC8+CiAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMiIgLz4KICA8cGF0aCBkPSJNMTYuMiA3LjhjMi4zIDIuMyAyLjMgNi4xIDAgOC41IiAvPgogIDxwYXRoIGQ9Ik0xOS4xIDQuOUMyMyA4LjggMjMgMTUuMSAxOS4xIDE5IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/radio
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Radio = createLucideIcon('radio', __iconNode)

export default Radio
