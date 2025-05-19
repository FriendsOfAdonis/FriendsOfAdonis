import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16', key: '1ifwr1' }],
  [
    'path',
    {
      d: 'm7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9',
      key: '17abbs',
    },
  ],
  ['path', { d: 'm2 15 6 6', key: '10dquu' }],
  [
    'path',
    {
      d: 'M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z',
      key: '1h3036',
    },
  ],
]

/**
 * @component @name HandHeart
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMTRoMmEyIDIgMCAxIDAgMC00aC0zYy0uNiAwLTEuMS4yLTEuNC42TDMgMTYiIC8+CiAgPHBhdGggZD0ibTcgMjAgMS42LTEuNGMuMy0uNC44LS42IDEuNC0uNmg0YzEuMSAwIDIuMS0uNCAyLjgtMS4ybDQuNi00LjRhMiAyIDAgMCAwLTIuNzUtMi45MWwtNC4yIDMuOSIgLz4KICA8cGF0aCBkPSJtMiAxNSA2IDYiIC8+CiAgPHBhdGggZD0iTTE5LjUgOC41Yy43LS43IDEuNS0xLjYgMS41LTIuN0EyLjczIDIuNzMgMCAwIDAgMTYgNGEyLjc4IDIuNzggMCAwIDAtNSAxLjhjMCAxLjIuOCAyIDEuNSAyLjhMMTYgMTJaIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/hand-heart
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const HandHeart = createLucideIcon('hand-heart', __iconNode)

export default HandHeart
