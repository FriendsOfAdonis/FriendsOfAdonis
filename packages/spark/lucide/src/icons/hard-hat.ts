import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5', key: '1p9q5i' }],
  ['path', { d: 'M14 6a6 6 0 0 1 6 6v3', key: '1hnv84' }],
  ['path', { d: 'M4 15v-3a6 6 0 0 1 6-6', key: '9ciidu' }],
  ['rect', { x: '2', y: '15', width: '20', height: '4', rx: '1', key: 'g3x8cw' }],
]

/**
 * @component @name HardHat
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTBWNWExIDEgMCAwIDEgMS0xaDJhMSAxIDAgMCAxIDEgMXY1IiAvPgogIDxwYXRoIGQ9Ik0xNCA2YTYgNiAwIDAgMSA2IDZ2MyIgLz4KICA8cGF0aCBkPSJNNCAxNXYtM2E2IDYgMCAwIDEgNi02IiAvPgogIDxyZWN0IHg9IjIiIHk9IjE1IiB3aWR0aD0iMjAiIGhlaWdodD0iNCIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/hard-hat
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const HardHat = createLucideIcon('hard-hat', __iconNode)

export default HardHat
