/**
 * Public entrypoint of @foadonis/rbac.
 */
export { configure } from './configure.ts'
export * as errors from './src/errors.ts'
export { definePermissions, prefix } from './src/define_permissions.ts'
export { Permissions } from './src/permissions.ts'
export { Access } from './src/access.ts'
export { forgetGrants } from './src/grants_cache.ts'
export { withPermissions } from './src/mixins/with_permissions.ts'
export { withRoles } from './src/mixins/with_roles.ts'
