export function createMetadataStorage<T extends object>(key: symbol | string, defaultMetadata?: T) {
  function defineMetadata(object: object, metadata: T, propertyKey?: string | symbol) {
    if (propertyKey) {
      Reflect.defineMetadata(key, metadata, object, propertyKey)
    } else {
      Reflect.defineMetadata(key, metadata, object)
    }
  }

  function getMetadata(object: object, propertyKey?: string | symbol): T | undefined {
    if (propertyKey) {
      let metadata = Reflect.getMetadata(key, object, propertyKey) ?? defaultMetadata

      return metadata
    } else {
      return Reflect.getMetadata(key, object) ?? defaultMetadata
    }
  }

  return {
    defineMetadata,
    getMetadata,
  }
}
