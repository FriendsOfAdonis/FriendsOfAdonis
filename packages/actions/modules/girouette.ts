import { type LazyImport } from '@adonisjs/core/types/common'
import { type LoaderMethods } from '../src/loader.ts'

type ActionsObject = {
  [key: string]: LoaderMethods<any> | ActionsObject
}

export function flattenActions(actions: ActionsObject): LoaderMethods<any>[] {
  return Object.values(actions).reduce<LoaderMethods<any>[]>((acc, value) => {
    if (value.$type === 'loader') {
      return [...acc, value as LoaderMethods<any>]
    } else {
      return [...acc, ...flattenActions(value as ActionsObject)]
    }
  }, [])
}

export function toGirouetteControllers(actions: ActionsObject): LazyImport<Function>[] {
  const flattened = flattenActions(actions)
  return flattened.map((loader) => loader.import)
}
