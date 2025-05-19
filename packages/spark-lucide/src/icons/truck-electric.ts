import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M14 19V7a2 2 0 0 0-2-2H9', key: '15peso' }],
  ['path', { d: 'M15 19H9', key: '18q6dt' }],
  [
    'path',
    {
      d: 'M19 19h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L18.3 9.38a1 1 0 0 0-.78-.38H14',
      key: '1dkp3j',
    },
  ],
  ['path', { d: 'M2 13v5a1 1 0 0 0 1 1h2', key: 'pkmmzz' }],
  [
    'path',
    { d: 'M4 3 2.15 5.15a.495.495 0 0 0 .35.86h2.15a.47.47 0 0 1 .35.86L3 9.02', key: '1n26pd' },
  ],
  ['circle', { cx: '17', cy: '19', r: '2', key: '1nxcgd' }],
  ['circle', { cx: '7', cy: '19', r: '2', key: 'gzo7y7' }],
]

/**
 * @component @name TruckElectric
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQgMTlWN2EyIDIgMCAwIDAtMi0ySDkiIC8+CiAgPHBhdGggZD0iTTE1IDE5SDkiIC8+CiAgPHBhdGggZD0iTTE5IDE5aDJhMSAxIDAgMCAwIDEtMXYtMy42NWExIDEgMCAwIDAtLjIyLS42MkwxOC4zIDkuMzhhMSAxIDAgMCAwLS43OC0uMzhIMTQiIC8+CiAgPHBhdGggZD0iTTIgMTN2NWExIDEgMCAwIDAgMSAxaDIiIC8+CiAgPHBhdGggZD0iTTQgMyAyLjE1IDUuMTVhLjQ5NS40OTUgMCAwIDAgLjM1Ljg2aDIuMTVhLjQ3LjQ3IDAgMCAxIC4zNS44NkwzIDkuMDIiIC8+CiAgPGNpcmNsZSBjeD0iMTciIGN5PSIxOSIgcj0iMiIgLz4KICA8Y2lyY2xlIGN4PSI3IiBjeT0iMTkiIHI9IjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/truck-electric
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const TruckElectric = createLucideIcon('truck-electric', __iconNode)

export default TruckElectric
