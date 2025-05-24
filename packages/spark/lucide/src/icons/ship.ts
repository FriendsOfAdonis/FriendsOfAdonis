import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 10.189V14', key: '1p8cqu' }],
  ['path', { d: 'M12 2v3', key: 'qbqxhf' }],
  ['path', { d: 'M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6', key: 'qpkstq' }],
  [
    'path',
    {
      d: 'M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76',
      key: '7tigtc',
    },
  ],
  [
    'path',
    {
      d: 'M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
      key: '1924j5',
    },
  ],
]

/**
 * @component @name Ship
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTAuMTg5VjE0IiAvPgogIDxwYXRoIGQ9Ik0xMiAydjMiIC8+CiAgPHBhdGggZD0iTTE5IDEzVjdhMiAyIDAgMCAwLTItMkg3YTIgMiAwIDAgMC0yIDJ2NiIgLz4KICA8cGF0aCBkPSJNMTkuMzggMjBBMTEuNiAxMS42IDAgMCAwIDIxIDE0bC04LjE4OC0zLjYzOWEyIDIgMCAwIDAtMS42MjQgMEwzIDE0YTExLjYgMTEuNiAwIDAgMCAyLjgxIDcuNzYiIC8+CiAgPHBhdGggZD0iTTIgMjFjLjYuNSAxLjIgMSAyLjUgMSAyLjUgMCAyLjUtMiA1LTIgMS4zIDAgMS45LjUgMi41IDFzMS4yIDEgMi41IDFjMi41IDAgMi41LTIgNS0yIDEuMyAwIDEuOS41IDIuNSAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/ship
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Ship = createLucideIcon('ship', __iconNode)

export default Ship
