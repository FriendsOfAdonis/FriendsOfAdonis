import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M11 20H2', key: 'nlcfvz' }],
  [
    'path',
    {
      d: 'M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z',
      key: 'au4z13',
    },
  ],
  ['path', { d: 'M11 4H8a2 2 0 0 0-2 2v14', key: '74r1mk' }],
  ['path', { d: 'M14 12h.01', key: '1jfl7z' }],
  ['path', { d: 'M22 20h-3', key: 'vhrsz' }],
]

/**
 * @component @name DoorOpen
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMjBIMiIgLz4KICA8cGF0aCBkPSJNMTEgNC41NjJ2MTYuMTU3YTEgMSAwIDAgMCAxLjI0Mi45N0wxOSAyMFY1LjU2MmEyIDIgMCAwIDAtMS41MTUtMS45NGwtNC0xQTIgMiAwIDAgMCAxMSA0LjU2MXoiIC8+CiAgPHBhdGggZD0iTTExIDRIOGEyIDIgMCAwIDAtMiAydjE0IiAvPgogIDxwYXRoIGQ9Ik0xNCAxMmguMDEiIC8+CiAgPHBhdGggZD0iTTIyIDIwaC0zIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/door-open
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const DoorOpen = createLucideIcon('door-open', __iconNode)

export default DoorOpen
