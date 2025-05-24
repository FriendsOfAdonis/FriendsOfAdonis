import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '9', cy: '7', r: '2', key: '1305pl' }],
  [
    'path',
    { d: 'M7.2 7.9 3 11v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-2-3-6-7-8l-3.6 2.6', key: 'xle13f' },
  ],
  ['path', { d: 'M16 13H3', key: '1wpj08' }],
  ['path', { d: 'M16 17H3', key: '3lvfcd' }],
]

/**
 * @component @name CakeSlice
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iNyIgcj0iMiIgLz4KICA8cGF0aCBkPSJNNy4yIDcuOSAzIDExdjljMCAuNi40IDEgMSAxaDE2Yy42IDAgMS0uNCAxLTF2LTljMC0yLTMtNi03LThsLTMuNiAyLjYiIC8+CiAgPHBhdGggZD0iTTE2IDEzSDMiIC8+CiAgPHBhdGggZD0iTTE2IDE3SDMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/cake-slice
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CakeSlice = createLucideIcon('cake-slice', __iconNode)

export default CakeSlice
