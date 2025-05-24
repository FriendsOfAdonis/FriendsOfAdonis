import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z',
      key: '1l48ns',
    },
  ],
  ['path', { d: 'M9 9h.01', key: '1q5me6' }],
  ['path', { d: 'm15 9-6 6', key: '1uzhvr' }],
  ['path', { d: 'M15 15h.01', key: 'lqbp3k' }],
]

/**
 * @component @name TicketPercent
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMiA5YTMgMyAwIDEgMSAwIDZ2MmEyIDIgMCAwIDAgMiAyaDE2YTIgMiAwIDAgMCAyLTJ2LTJhMyAzIDAgMSAxIDAtNlY3YTIgMiAwIDAgMC0yLTJINGEyIDIgMCAwIDAtMiAyWiIgLz4KICA8cGF0aCBkPSJNOSA5aC4wMSIgLz4KICA8cGF0aCBkPSJtMTUgOS02IDYiIC8+CiAgPHBhdGggZD0iTTE1IDE1aC4wMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/ticket-percent
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const TicketPercent = createLucideIcon('ticket-percent', __iconNode)

export default TicketPercent
