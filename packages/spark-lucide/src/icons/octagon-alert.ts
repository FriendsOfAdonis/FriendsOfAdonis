import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 16h.01', key: '1drbdi' }],
  ['path', { d: 'M12 8v4', key: '1got3b' }],
  [
    'path',
    {
      d: 'M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z',
      key: '1fd625',
    },
  ],
]

/**
 * @component @name OctagonAlert
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTZoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xMiA4djQiIC8+CiAgPHBhdGggZD0iTTE1LjMxMiAyYTIgMiAwIDAgMSAxLjQxNC41ODZsNC42ODggNC42ODhBMiAyIDAgMCAxIDIyIDguNjg4djYuNjI0YTIgMiAwIDAgMS0uNTg2IDEuNDE0bC00LjY4OCA0LjY4OGEyIDIgMCAwIDEtMS40MTQuNTg2SDguNjg4YTIgMiAwIDAgMS0xLjQxNC0uNTg2bC00LjY4OC00LjY4OEEyIDIgMCAwIDEgMiAxNS4zMTJWOC42ODhhMiAyIDAgMCAxIC41ODYtMS40MTRsNC42ODgtNC42ODhBMiAyIDAgMCAxIDguNjg4IDJ6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/octagon-alert
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const OctagonAlert = createLucideIcon('octagon-alert', __iconNode)

export default OctagonAlert
