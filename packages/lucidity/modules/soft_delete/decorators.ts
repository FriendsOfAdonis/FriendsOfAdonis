import type { HooksDecorator } from '@adonisjs/lucid/types/model'

/**
 * Registers the decorated static method as a hook invoked before a trashed
 * row is restored with `restore()`.
 *
 * @example
 * ```ts
 * class Post extends compose(BaseModel, SoftDeletable) {
 *   @beforeRestore()
 *   static async ensureAuthorIsActive(post: Post) {}
 * }
 * ```
 */
export const beforeRestore: HooksDecorator = () => {
  return function decorateAsHook(target, property) {
    target.boot()
    target.$hooks.add('before:restore', (target as any)[property].bind(target))
  }
}

/**
 * Registers the decorated static method as a hook invoked after a trashed
 * row is restored with `restore()`.
 *
 * @example
 * ```ts
 * class Post extends compose(BaseModel, SoftDeletable) {
 *   @afterRestore()
 *   static async restoreComments(post: Post) {}
 * }
 * ```
 */
export const afterRestore: HooksDecorator = () => {
  return function decorateAsHook(target, property) {
    target.boot()
    target.$hooks.add('after:restore', (target as any)[property].bind(target))
  }
}
