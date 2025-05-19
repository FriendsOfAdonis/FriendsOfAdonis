import { ComponentProps, FC } from '@foadonis/spark/jsx'

export type CamelToPascal<T extends string> = T extends `${infer FirstChar}${infer Rest}`
  ? `${Capitalize<FirstChar>}${Rest}`
  : never

type SVGElementType = 'circle' | 'ellipse' | 'g' | 'line' | 'path' | 'polygon' | 'polyline' | 'rect'

export type IconNode = [elementName: SVGElementType, attrs: Record<string, string>][]

export interface LucideProps extends ComponentProps<'svg'> {
  size?: string | number
  absoluteStrokeWidth?: boolean
  color?: string
}

export type LucideIcon = FC<LucideProps>
