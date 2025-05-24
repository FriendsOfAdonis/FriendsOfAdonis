import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm12 14-1 1', key: '11onhr' }],
  ['path', { d: 'm13.75 18.25-1.25 1.42', key: '1yisr3' }],
  ['path', { d: 'M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12', key: '1qtqk6' }],
  ['path', { d: 'M18.8 9.3a1 1 0 0 0 2.1 7.7', key: 'fbbbr2' }],
  [
    'path',
    {
      d: 'M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z',
      key: '1hyfdd',
    },
  ],
]

/**
 * @component @name Pizza
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTIgMTQtMSAxIiAvPgogIDxwYXRoIGQ9Im0xMy43NSAxOC4yNS0xLjI1IDEuNDIiIC8+CiAgPHBhdGggZD0iTTE3Ljc3NSA1LjY1NGExNS42OCAxNS42OCAwIDAgMC0xMi4xMjEgMTIuMTIiIC8+CiAgPHBhdGggZD0iTTE4LjggOS4zYTEgMSAwIDAgMCAyLjEgNy43IiAvPgogIDxwYXRoIGQ9Ik0yMS45NjQgMjAuNzMyYTEgMSAwIDAgMS0xLjIzMiAxLjIzMmwtMTgtNWExIDEgMCAwIDEtLjY5NS0xLjIzMkExOS42OCAxOS42OCAwIDAgMSAxNS43MzIgMi4wMzdhMSAxIDAgMCAxIDEuMjMyLjY5NXoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pizza
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Pizza = createLucideIcon('pizza', __iconNode)

export default Pizza
