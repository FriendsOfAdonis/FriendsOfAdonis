import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z',
      key: 'xwnzip',
    },
  ],
  ['path', { d: 'M5 17A12 12 0 0 1 17 5', key: '1okkup' }],
  ['circle', { cx: '19', cy: '5', r: '2', key: 'mhkx31' }],
  ['circle', { cx: '5', cy: '19', r: '2', key: 'v8kfzx' }],
]

/**
 * @component @name SplinePointer
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIuMDM0IDEyLjY4MWEuNDk4LjQ5OCAwIDAgMSAuNjQ3LS42NDdsOSAzLjVhLjUuNSAwIDAgMS0uMDMzLjk0M2wtMy40NDQgMS4wNjhhMSAxIDAgMCAwLS42Ni42NmwtMS4wNjcgMy40NDNhLjUuNSAwIDAgMS0uOTQzLjAzM3oiIC8+CiAgPHBhdGggZD0iTTUgMTdBMTIgMTIgMCAwIDEgMTcgNSIgLz4KICA8Y2lyY2xlIGN4PSIxOSIgY3k9IjUiIHI9IjIiIC8+CiAgPGNpcmNsZSBjeD0iNSIgY3k9IjE5IiByPSIyIiAvPgo8L3N2Zz4=) - https://lucide.dev/icons/spline-pointer
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const SplinePointer = createLucideIcon('spline-pointer', __iconNode)

export default SplinePointer
