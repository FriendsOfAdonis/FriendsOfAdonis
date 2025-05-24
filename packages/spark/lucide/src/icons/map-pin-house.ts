import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z',
      key: '1p1rcz',
    },
  ],
  [
    'path',
    {
      d: 'M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2',
      key: 'mcbcs9',
    },
  ],
  ['path', { d: 'M18 22v-3', key: '1t1ugv' }],
  ['circle', { cx: '10', cy: '10', r: '3', key: '1ns7v1' }],
]

/**
 * @component @name MapPinHouse
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMjJhMSAxIDAgMCAxLTEtMXYtNGExIDEgMCAwIDEgLjQ0NS0uODMybDMtMmExIDEgMCAwIDEgMS4xMSAwbDMgMkExIDEgMCAwIDEgMjIgMTd2NGExIDEgMCAwIDEtMSAxeiIgLz4KICA8cGF0aCBkPSJNMTggMTBhOCA4IDAgMCAwLTE2IDBjMCA0Ljk5MyA1LjUzOSAxMC4xOTMgNy4zOTkgMTEuNzk5YTEgMSAwIDAgMCAuNjAxLjIiIC8+CiAgPHBhdGggZD0iTTE4IDIydi0zIiAvPgogIDxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/map-pin-house
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const MapPinHouse = createLucideIcon('map-pin-house', __iconNode)

export default MapPinHouse
