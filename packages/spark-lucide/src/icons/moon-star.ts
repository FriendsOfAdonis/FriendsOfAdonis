import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9', key: '4ay0iu' }],
  ['path', { d: 'M20 3v4', key: '1olli1' }],
  ['path', { d: 'M22 5h-4', key: '1gvqau' }],
]

/**
 * @component @name MoonStar
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgM2E2IDYgMCAwIDAgOSA5IDkgOSAwIDEgMS05LTkiIC8+CiAgPHBhdGggZD0iTTIwIDN2NCIgLz4KICA8cGF0aCBkPSJNMjIgNWgtNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/moon-star
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const MoonStar = createLucideIcon('moon-star', __iconNode)

export default MoonStar
