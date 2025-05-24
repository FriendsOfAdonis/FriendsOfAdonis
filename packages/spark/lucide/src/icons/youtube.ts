import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17',
      key: '1q2vi4',
    },
  ],
  ['path', { d: 'm10 15 5-3-5-3z', key: '1jp15x' }],
]

/**
 * @component @name Youtube
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi41IDE3YTI0LjEyIDI0LjEyIDAgMCAxIDAtMTAgMiAyIDAgMCAxIDEuNC0xLjQgNDkuNTYgNDkuNTYgMCAwIDEgMTYuMiAwQTIgMiAwIDAgMSAyMS41IDdhMjQuMTIgMjQuMTIgMCAwIDEgMCAxMCAyIDIgMCAwIDEtMS40IDEuNCA0OS41NSA0OS41NSAwIDAgMS0xNi4yIDBBMiAyIDAgMCAxIDIuNSAxNyIgLz4KICA8cGF0aCBkPSJtMTAgMTUgNS0zLTUtM3oiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/youtube
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 * @deprecated Brand icons have been deprecated and are due to be removed, please refer to https://github.com/lucide-icons/lucide/issues/670. We recommend using https://simpleicons.org/?q=youtube instead. This icon will be removed in v1.0
 */
const Youtube = createLucideIcon('youtube', __iconNode)

export default Youtube
