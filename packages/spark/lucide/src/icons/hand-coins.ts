import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17', key: 'geh8rc' }],
  [
    'path',
    {
      d: 'm7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9',
      key: '1fto5m',
    },
  ],
  ['path', { d: 'm2 16 6 6', key: '1pfhp9' }],
  ['circle', { cx: '16', cy: '9', r: '2.9', key: '1n0dlu' }],
  ['circle', { cx: '6', cy: '5', r: '3', key: '151irh' }],
]

/**
 * @component @name HandCoins
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMTVoMmEyIDIgMCAxIDAgMC00aC0zYy0uNiAwLTEuMS4yLTEuNC42TDMgMTciIC8+CiAgPHBhdGggZD0ibTcgMjEgMS42LTEuNGMuMy0uNC44LS42IDEuNC0uNmg0YzEuMSAwIDIuMS0uNCAyLjgtMS4ybDQuNi00LjRhMiAyIDAgMCAwLTIuNzUtMi45MWwtNC4yIDMuOSIgLz4KICA8cGF0aCBkPSJtMiAxNiA2IDYiIC8+CiAgPGNpcmNsZSBjeD0iMTYiIGN5PSI5IiByPSIyLjkiIC8+CiAgPGNpcmNsZSBjeD0iNiIgY3k9IjUiIHI9IjMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/hand-coins
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const HandCoins = createLucideIcon('hand-coins', __iconNode)

export default HandCoins
