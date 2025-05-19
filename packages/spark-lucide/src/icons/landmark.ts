import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 18v-7', key: 'wt116b' }],
  [
    'path',
    {
      d: 'M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z',
      key: '1m329m',
    },
  ],
  ['path', { d: 'M14 18v-7', key: 'vav6t3' }],
  ['path', { d: 'M18 18v-7', key: 'aexdmj' }],
  ['path', { d: 'M3 22h18', key: '8prr45' }],
  ['path', { d: 'M6 18v-7', key: '1ivflk' }],
]

/**
 * @component @name Landmark
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTh2LTciIC8+CiAgPHBhdGggZD0iTTExLjEyIDIuMTk4YTIgMiAwIDAgMSAxLjc2LjAwNmw3Ljg2NiAzLjg0N2MuNDc2LjIzMy4zMS45NDktLjIyLjk0OUgzLjQ3NGMtLjUzIDAtLjY5NS0uNzE2LS4yMi0uOTQ5eiIgLz4KICA8cGF0aCBkPSJNMTQgMTh2LTciIC8+CiAgPHBhdGggZD0iTTE4IDE4di03IiAvPgogIDxwYXRoIGQ9Ik0zIDIyaDE4IiAvPgogIDxwYXRoIGQ9Ik02IDE4di03IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/landmark
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Landmark = createLucideIcon('landmark', __iconNode)

export default Landmark
