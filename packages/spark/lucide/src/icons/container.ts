import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z',
      key: '1t2lqe',
    },
  ],
  ['path', { d: 'M10 21.9V14L2.1 9.1', key: 'o7czzq' }],
  ['path', { d: 'm10 14 11.9-6.9', key: 'zm5e20' }],
  ['path', { d: 'M14 19.8v-8.1', key: '159ecu' }],
  ['path', { d: 'M18 17.5V9.4', key: '11uown' }],
]

/**
 * @component @name Container
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgNy43YzAtLjYtLjQtMS4yLS44LTEuNWwtNi4zLTMuOWExLjcyIDEuNzIgMCAwIDAtMS43IDBsLTEwLjMgNmMtLjUuMi0uOS44LS45IDEuNHY2LjZjMCAuNS40IDEuMi44IDEuNWw2LjMgMy45YTEuNzIgMS43MiAwIDAgMCAxLjcgMGwxMC4zLTZjLjUtLjMuOS0xIC45LTEuNVoiIC8+CiAgPHBhdGggZD0iTTEwIDIxLjlWMTRMMi4xIDkuMSIgLz4KICA8cGF0aCBkPSJtMTAgMTQgMTEuOS02LjkiIC8+CiAgPHBhdGggZD0iTTE0IDE5Ljh2LTguMSIgLz4KICA8cGF0aCBkPSJNMTggMTcuNVY5LjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/container
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Container = createLucideIcon('container', __iconNode)

export default Container
