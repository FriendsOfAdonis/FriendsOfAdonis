import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '12', r: '3', key: '1v7zrd' }],
  [
    'path',
    {
      d: 'M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5',
      key: '14wa3c',
    },
  ],
  ['path', { d: 'M12 7.5V9', key: '1oy5b0' }],
  ['path', { d: 'M7.5 12H9', key: 'eltsq1' }],
  ['path', { d: 'M16.5 12H15', key: 'vk5kw4' }],
  ['path', { d: 'M12 16.5V15', key: 'k7eayi' }],
  ['path', { d: 'm8 8 1.88 1.88', key: 'nxy4qf' }],
  ['path', { d: 'M14.12 9.88 16 8', key: '1lst6k' }],
  ['path', { d: 'm8 16 1.88-1.88', key: 'h2eex1' }],
  ['path', { d: 'M14.12 14.12 16 16', key: 'uqkrx3' }],
]

/**
 * @component @name Flower
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgogIDxwYXRoIGQ9Ik0xMiAxNi41QTQuNSA0LjUgMCAxIDEgNy41IDEyIDQuNSA0LjUgMCAxIDEgMTIgNy41YTQuNSA0LjUgMCAxIDEgNC41IDQuNSA0LjUgNC41IDAgMSAxLTQuNSA0LjUiIC8+CiAgPHBhdGggZD0iTTEyIDcuNVY5IiAvPgogIDxwYXRoIGQ9Ik03LjUgMTJIOSIgLz4KICA8cGF0aCBkPSJNMTYuNSAxMkgxNSIgLz4KICA8cGF0aCBkPSJNMTIgMTYuNVYxNSIgLz4KICA8cGF0aCBkPSJtOCA4IDEuODggMS44OCIgLz4KICA8cGF0aCBkPSJNMTQuMTIgOS44OCAxNiA4IiAvPgogIDxwYXRoIGQ9Im04IDE2IDEuODgtMS44OCIgLz4KICA8cGF0aCBkPSJNMTQuMTIgMTQuMTIgMTYgMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/flower
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Flower = createLucideIcon('flower', __iconNode)

export default Flower
