import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '12', r: '2', key: '1c9p78' }],
  ['path', { d: 'M12 2v4', key: '3427ic' }],
  ['path', { d: 'm6.8 15-3.5 2', key: 'hjy98k' }],
  ['path', { d: 'm20.7 7-3.5 2', key: 'f08gto' }],
  ['path', { d: 'M6.8 9 3.3 7', key: '1aevh4' }],
  ['path', { d: 'm20.7 17-3.5-2', key: '1liqo3' }],
  ['path', { d: 'm9 22 3-8 3 8', key: 'wees03' }],
  ['path', { d: 'M8 22h8', key: 'rmew8v' }],
  ['path', { d: 'M18 18.7a9 9 0 1 0-12 0', key: 'dhzg4g' }],
]

/**
 * @component @name FerrisWheel
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIyIiAvPgogIDxwYXRoIGQ9Ik0xMiAydjQiIC8+CiAgPHBhdGggZD0ibTYuOCAxNS0zLjUgMiIgLz4KICA8cGF0aCBkPSJtMjAuNyA3LTMuNSAyIiAvPgogIDxwYXRoIGQ9Ik02LjggOSAzLjMgNyIgLz4KICA8cGF0aCBkPSJtMjAuNyAxNy0zLjUtMiIgLz4KICA8cGF0aCBkPSJtOSAyMiAzLTggMyA4IiAvPgogIDxwYXRoIGQ9Ik04IDIyaDgiIC8+CiAgPHBhdGggZD0iTTE4IDE4LjdhOSA5IDAgMSAwLTEyIDAiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/ferris-wheel
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FerrisWheel = createLucideIcon('ferris-wheel', __iconNode)

export default FerrisWheel
