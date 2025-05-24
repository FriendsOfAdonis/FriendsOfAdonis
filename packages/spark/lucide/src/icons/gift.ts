import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { x: '3', y: '8', width: '18', height: '4', rx: '1', key: 'bkv52' }],
  ['path', { d: 'M12 8v13', key: '1c76mn' }],
  ['path', { d: 'M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7', key: '6wjy6b' }],
  [
    'path',
    {
      d: 'M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5',
      key: '1ihvrl',
    },
  ],
]

/**
 * @component @name Gift
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB4PSIzIiB5PSI4IiB3aWR0aD0iMTgiIGhlaWdodD0iNCIgcng9IjEiIC8+CiAgPHBhdGggZD0iTTEyIDh2MTMiIC8+CiAgPHBhdGggZD0iTTE5IDEydjdhMiAyIDAgMCAxLTIgMkg3YTIgMiAwIDAgMS0yLTJ2LTciIC8+CiAgPHBhdGggZD0iTTcuNSA4YTIuNSAyLjUgMCAwIDEgMC01QTQuOCA4IDAgMCAxIDEyIDhhNC44IDggMCAwIDEgNC41LTUgMi41IDIuNSAwIDAgMSAwIDUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/gift
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Gift = createLucideIcon('gift', __iconNode)

export default Gift
