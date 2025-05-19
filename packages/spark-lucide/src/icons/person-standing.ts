import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '5', r: '1', key: 'gxeob9' }],
  ['path', { d: 'm9 20 3-6 3 6', key: 'se2kox' }],
  ['path', { d: 'm6 8 6 2 6-2', key: '4o3us4' }],
  ['path', { d: 'M12 10v4', key: '1kjpxc' }],
]

/**
 * @component @name PersonStanding
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjUiIHI9IjEiIC8+CiAgPHBhdGggZD0ibTkgMjAgMy02IDMgNiIgLz4KICA8cGF0aCBkPSJtNiA4IDYgMiA2LTIiIC8+CiAgPHBhdGggZD0iTTEyIDEwdjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/person-standing
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const PersonStanding = createLucideIcon('person-standing', __iconNode)

export default PersonStanding
