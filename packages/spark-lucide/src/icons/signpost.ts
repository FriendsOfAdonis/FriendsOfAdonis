import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 13v8', key: '1l5pq0' }],
  ['path', { d: 'M12 3v3', key: '1n5kay' }],
  [
    'path',
    {
      d: 'M18 6a2 2 0 0 1 1.387.56l2.307 2.22a1 1 0 0 1 0 1.44l-2.307 2.22A2 2 0 0 1 18 13H6a2 2 0 0 1-1.387-.56l-2.306-2.22a1 1 0 0 1 0-1.44l2.306-2.22A2 2 0 0 1 6 6z',
      key: 'gqqp9m',
    },
  ],
]

/**
 * @component @name Signpost
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTN2OCIgLz4KICA8cGF0aCBkPSJNMTIgM3YzIiAvPgogIDxwYXRoIGQ9Ik0xOCA2YTIgMiAwIDAgMSAxLjM4Ny41NmwyLjMwNyAyLjIyYTEgMSAwIDAgMSAwIDEuNDRsLTIuMzA3IDIuMjJBMiAyIDAgMCAxIDE4IDEzSDZhMiAyIDAgMCAxLTEuMzg3LS41NmwtMi4zMDYtMi4yMmExIDEgMCAwIDEgMC0xLjQ0bDIuMzA2LTIuMjJBMiAyIDAgMCAxIDYgNnoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/signpost
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Signpost = createLucideIcon('signpost', __iconNode)

export default Signpost
