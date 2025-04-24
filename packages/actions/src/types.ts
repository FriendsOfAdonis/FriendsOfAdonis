export type Constructor<T> = new (...args: any[]) => T

export type LazyImport<DefaultExport> = () => Promise<{
  default: DefaultExport
}>
