import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12.586 12.586 19 19', key: 'ea5xo7' }],
  [
    'path',
    {
      d: 'M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z',
      key: '277e5u',
    },
  ],
]

/**
 * @component @name MousePointer
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIuNTg2IDEyLjU4NiAxOSAxOSIgLz4KICA8cGF0aCBkPSJNMy42ODggMy4wMzdhLjQ5Ny40OTcgMCAwIDAtLjY1MS42NTFsNi41IDE1Ljk5OWEuNTAxLjUwMSAwIDAgMCAuOTQ3LS4wNjJsMS41NjktNi4wODNhMiAyIDAgMCAxIDEuNDQ4LTEuNDc5bDYuMTI0LTEuNTc5YS41LjUgMCAwIDAgLjA2My0uOTQ3eiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/mouse-pointer
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const MousePointer = createLucideIcon('mouse-pointer', __iconNode)

export default MousePointer
