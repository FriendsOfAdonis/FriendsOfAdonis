import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2', key: '1fvzgz' }],
  ['path', { d: 'M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2', key: '1kc0my' }],
  ['path', { d: 'M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8', key: '10h0bg' }],
  [
    'path',
    {
      d: 'M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15',
      key: '1s1gnw',
    },
  ],
]

/**
 * @component @name Hand
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggMTFWNmEyIDIgMCAwIDAtMi0yYTIgMiAwIDAgMC0yIDIiIC8+CiAgPHBhdGggZD0iTTE0IDEwVjRhMiAyIDAgMCAwLTItMmEyIDIgMCAwIDAtMiAydjIiIC8+CiAgPHBhdGggZD0iTTEwIDEwLjVWNmEyIDIgMCAwIDAtMi0yYTIgMiAwIDAgMC0yIDJ2OCIgLz4KICA8cGF0aCBkPSJNMTggOGEyIDIgMCAxIDEgNCAwdjZhOCA4IDAgMCAxLTggOGgtMmMtMi44IDAtNC41LS44Ni01Ljk5LTIuMzRsLTMuNi0zLjZhMiAyIDAgMCAxIDIuODMtMi44Mkw3IDE1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/hand
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Hand = createLucideIcon('hand', __iconNode)

export default Hand
