<div align="center">
<br/>

## @foadonis/rbac

### Typed role-based access control for AdonisJS, built on Bouncer and Lucid

<br/>
</div>

<div align="center">

<!-- automd:badges color="brightgreen" license name="@foadonis/rbac" bundlephobia packagephobia -->

[![npm version](https://img.shields.io/npm/v/@foadonis/rbac?color=brightgreen)](https://npmjs.com/package/@foadonis/rbac)
[![npm downloads](https://img.shields.io/npm/dm/@foadonis/rbac?color=brightgreen)](https://npm.chart.dev/@foadonis/rbac)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@foadonis/rbac?color=brightgreen)](https://bundlephobia.com/package/@foadonis/rbac)
[![install size](https://badgen.net/packagephobia/install/@foadonis/rbac?color=brightgreen)](https://packagephobia.com/result?p=@foadonis/rbac)

<!-- /automd -->

<!-- automd:coverage -->

![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)

<!-- /automd -->

</div>

## Quickstart

```sh
node ace add @adonisjs/bouncer
node ace add @foadonis/rbac
```

```ts
// start/permissions.ts
export const permissions = definePermissions({
  product: { create: true, delete: 'Delete products' },
})

// app/models/role.ts
export default class Role extends compose(BaseModel, withPermissions(permissions)) {}

// app/models/user.ts
export default class User extends compose(
  BaseModel,
  withRoles(permissions, { role: () => Role, pivotTable: 'user_roles' })
) {}

// Grants are typed, validated and may be wildcards
await admin.givePermission('*')
await user.assignRole(admin)

// Bouncer abilities are generated for every active permission
await bouncer.authorize('product.delete')
```

[Installation & Getting Started](https://friendsofadonis.com/docs/rbac)

## License

[MIT licensed](LICENSE.md).
