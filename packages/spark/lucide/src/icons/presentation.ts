import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M2 3h20', key: '91anmk' }],
  ['path', { d: 'M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3', key: '2k9sn8' }],
  ['path', { d: 'm7 21 5-5 5 5', key: 'bip4we' }],
]

/**
 * @component @name Presentation
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMiAzaDIwIiAvPgogIDxwYXRoIGQ9Ik0yMSAzdjExYTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjMiIC8+CiAgPHBhdGggZD0ibTcgMjEgNS01IDUgNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/presentation
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Presentation = createLucideIcon('presentation', __iconNode)

export default Presentation
