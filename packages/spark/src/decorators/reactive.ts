import { $metadata } from '../metadata/storage.js'

export function reactive() {
  return (target: Object, propertyKey: string) => {
    $metadata.addReactiveMetadata({
      target: target.constructor,
      propertyKey: propertyKey,
    })
  }
}
