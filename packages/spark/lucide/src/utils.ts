import { CamelToPascal } from './types.js'

export const toKebabCase = (string: string) =>
  string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

export const toCamelCase = <T extends string>(string: T) =>
  string.replace(/^([A-Z])|[\s-_]+(\w)/g, (_match, p1, p2) =>
    p2 ? p2.toUpperCase() : p1.toLowerCase()
  )

export const toPascalCase = <T extends string>(string: T): CamelToPascal<T> => {
  const camelCase = toCamelCase(string)

  return (camelCase.charAt(0).toUpperCase() + camelCase.slice(1)) as CamelToPascal<T>
}

export const mergeClasses = <ClassType = string | undefined | null>(
  ...classes: ClassType[]
): string =>
  classes
    .filter((className, index, array) => {
      return (
        Boolean(className) &&
        (className as string).trim() !== '' &&
        array.indexOf(className) === index
      )
    })
    .join(' ')
    .trim()

export const hasA11yProp = (props: Record<string, any>) => {
  for (const prop in props) {
    if (prop.startsWith('aria-') || prop === 'role' || prop === 'title') {
      return true
    }
  }
}
