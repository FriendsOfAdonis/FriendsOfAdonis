import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 2v3a1 1 0 0 0 1 1h5', key: '1xspal' }],
  ['path', { d: 'M18 18v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6', key: '1ra60u' }],
  ['path', { d: 'M18 22H4a2 2 0 0 1-2-2V6', key: 'pblm9e' }],
  [
    'path',
    {
      d: 'M8 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 22 6.828V16a2 2 0 0 1-2.01 2z',
      key: '1yve0x',
    },
  ],
]

/**
 * @component @name SaveAll
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMnYzYTEgMSAwIDAgMCAxIDFoNSIgLz4KICA8cGF0aCBkPSJNMTggMTh2LTZhMSAxIDAgMCAwLTEtMWgtNmExIDEgMCAwIDAtMSAxdjYiIC8+CiAgPHBhdGggZD0iTTE4IDIySDRhMiAyIDAgMCAxLTItMlY2IiAvPgogIDxwYXRoIGQ9Ik04IDE4YTIgMiAwIDAgMS0yLTJWNGEyIDIgMCAwIDEgMi0yaDkuMTcyYTIgMiAwIDAgMSAxLjQxNC41ODZsMi44MjggMi44MjhBMiAyIDAgMCAxIDIyIDYuODI4VjE2YTIgMiAwIDAgMS0yLjAxIDJ6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/save-all
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const SaveAll = createLucideIcon('save-all', __iconNode)

export default SaveAll
