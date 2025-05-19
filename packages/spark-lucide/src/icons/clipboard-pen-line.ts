import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '8', height: '4', x: '8', y: '2', rx: '1', key: '1oijnt' }],
  ['path', { d: 'M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5', key: '1but9f' }],
  ['path', { d: 'M16 4h2a2 2 0 0 1 1.73 1', key: '1p8n7l' }],
  ['path', { d: 'M8 18h1', key: '13wk12' }],
  [
    'path',
    {
      d: 'M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z',
      key: '2t3380',
    },
  ],
]

/**
 * @component @name ClipboardPenLine
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI0IiB4PSI4IiB5PSIyIiByeD0iMSIgLz4KICA8cGF0aCBkPSJNOCA0SDZhMiAyIDAgMCAwLTIgMnYxNGEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJ2LS41IiAvPgogIDxwYXRoIGQ9Ik0xNiA0aDJhMiAyIDAgMCAxIDEuNzMgMSIgLz4KICA8cGF0aCBkPSJNOCAxOGgxIiAvPgogIDxwYXRoIGQ9Ik0yMS4zNzggMTIuNjI2YTEgMSAwIDAgMC0zLjAwNC0zLjAwNGwtNC4wMSA0LjAxMmEyIDIgMCAwIDAtLjUwNi44NTRsLS44MzcgMi44N2EuNS41IDAgMCAwIC42Mi42MmwyLjg3LS44MzdhMiAyIDAgMCAwIC44NTQtLjUwNnoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/clipboard-pen-line
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ClipboardPenLine = createLucideIcon('clipboard-pen-line', __iconNode)

export default ClipboardPenLine
