import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 9h4', key: 'u4k05v' }],
  ['path', { d: 'M12 7v5', key: 'ma6bk' }],
  ['path', { d: 'M14 22v-4a2 2 0 0 0-4 0v4', key: '1pdhuj' }],
  [
    'path',
    {
      d: 'M18 22V5.618a1 1 0 0 0-.553-.894l-4.553-2.277a2 2 0 0 0-1.788 0L6.553 4.724A1 1 0 0 0 6 5.618V22',
      key: '1rkokr',
    },
  ],
  [
    'path',
    {
      d: 'm18 7 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.618a1 1 0 0 1 .553-.894L6 7',
      key: '1w6esw',
    },
  ],
]

/**
 * @component @name Church
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgOWg0IiAvPgogIDxwYXRoIGQ9Ik0xMiA3djUiIC8+CiAgPHBhdGggZD0iTTE0IDIydi00YTIgMiAwIDAgMC00IDB2NCIgLz4KICA8cGF0aCBkPSJNMTggMjJWNS42MThhMSAxIDAgMCAwLS41NTMtLjg5NGwtNC41NTMtMi4yNzdhMiAyIDAgMCAwLTEuNzg4IDBMNi41NTMgNC43MjRBMSAxIDAgMCAwIDYgNS42MThWMjIiIC8+CiAgPHBhdGggZD0ibTE4IDcgMy40NDcgMS43MjRhMSAxIDAgMCAxIC41NTMuODk0VjIwYTIgMiAwIDAgMS0yIDJINGEyIDIgMCAwIDEtMi0yVjkuNjE4YTEgMSAwIDAgMSAuNTUzLS44OTRMNiA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/church
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Church = createLucideIcon('church', __iconNode)

export default Church
