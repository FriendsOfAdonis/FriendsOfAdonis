import { IconNode, LucideProps } from './types.js'
import { jsx } from '@foadonis/spark/jsx-runtime'
import { hasA11yProp, mergeClasses, toKebabCase, toPascalCase } from './utils.js'

interface IconComponentProps extends LucideProps {
  iconNode: IconNode
}

const defaultAttributes = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const createLucideIcon = (iconName: string, iconNode: IconNode) => {
  return ({ className, ...props }: LucideProps) =>
    jsx(Icon, {
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props,
    })
}

const Icon = ({
  color = 'currentColor',
  size = 24,
  strokeWidth = 2,
  absoluteStrokeWidth,
  className = '',
  children,
  iconNode,
  ...rest
}: IconComponentProps) => {
  return jsx('svg', {
    ...defaultAttributes,
    width: size,
    heigth: size,
    stroke: color,
    strokeWidth: absoluteStrokeWidth ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth,
    className: mergeClasses('lucide', className),
    ...(!children && !hasA11yProp(rest) && { 'aria-hidden': 'true' }),
    ...rest,
    children: [
      ...iconNode.map(([tag, attrs]) => jsx(tag, attrs)),
      ...(Array.isArray(children) ? children : [children]),
    ],
  })
}

export default Icon
