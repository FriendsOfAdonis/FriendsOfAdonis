import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 10H6', key: '1bsnug' }],
  ['path', { d: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2', key: 'wrbu53' }],
  [
    'path',
    {
      d: 'M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14',
      key: 'lrkjwd',
    },
  ],
  ['path', { d: 'M8 8v4', key: '1fwk8c' }],
  ['path', { d: 'M9 18h6', key: 'x1upvd' }],
  ['circle', { cx: '17', cy: '18', r: '2', key: '332jqn' }],
  ['circle', { cx: '7', cy: '18', r: '2', key: '19iecd' }],
]

/**
 * @component @name Ambulance
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTBINiIgLz4KICA8cGF0aCBkPSJNMTQgMThWNmEyIDIgMCAwIDAtMi0ySDRhMiAyIDAgMCAwLTIgMnYxMWExIDEgMCAwIDAgMSAxaDIiIC8+CiAgPHBhdGgKICAgIGQ9Ik0xOSAxOGgyYTEgMSAwIDAgMCAxLTF2LTMuMjhhMSAxIDAgMCAwLS42ODQtLjk0OGwtMS45MjMtLjY0MWExIDEgMCAwIDEtLjU3OC0uNTAybC0xLjUzOS0zLjA3NkExIDEgMCAwIDAgMTYuMzgyIDhIMTQiIC8+CiAgPHBhdGggZD0iTTggOHY0IiAvPgogIDxwYXRoIGQ9Ik05IDE4aDYiIC8+CiAgPGNpcmNsZSBjeD0iMTciIGN5PSIxOCIgcj0iMiIgLz4KICA8Y2lyY2xlIGN4PSI3IiBjeT0iMTgiIHI9IjIiIC8+Cjwvc3ZnPg==) - https://lucide.dev/icons/ambulance
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Ambulance = createLucideIcon('ambulance', __iconNode)

export default Ambulance
