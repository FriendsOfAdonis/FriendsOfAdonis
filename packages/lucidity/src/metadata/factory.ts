export function createMetadataStorage<T extends Object>(key: Symbol | string, defaultMetadata?: T) {
  function defineMetadata(object: Object, metadata: T, propertyKey?: string | symbol) {
    if (propertyKey) {
      Reflect.defineMetadata(key, metadata, object, propertyKey)
    } else {
      Reflect.defineMetadata(key, metadata, object)
    }
  }

  function getMetadata(object: Object, propertyKey?: string | symbol): T | undefined {
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
