<div align="center">
<br/>

## @foadonis/openapi

### Generate OpenAPI compliant specifications powered by openapi-metadata for you Adonis Application

<br/>
</div>

<div align="center">

<!-- automd:badges color="brightgreen" license name="@foadonis/openapi" bundlephobia packagephobia -->

[![npm version](https://img.shields.io/npm/v/@foadonis/openapi?color=brightgreen)](https://npmjs.com/package/@foadonis/openapi)
[![npm downloads](https://img.shields.io/npm/dm/@foadonis/openapi?color=brightgreen)](https://npm.chart.dev/@foadonis/openapi)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@foadonis/openapi?color=brightgreen)](https://bundlephobia.com/package/@foadonis/openapi)
[![install size](https://badgen.net/packagephobia/install/@foadonis/openapi?color=brightgreen)](https://packagephobia.com/result?p=@foadonis/openapi)

<!-- /automd -->

<!-- automd:coverage -->

![Coverage](https://img.shields.io/badge/coverage-70%25-orange)

<!-- /automd -->

</div>

## Features

- **OpenAPI Compliant**: Automatically converts Adonis-style path parameters to OpenAPI-compliant format
- **Seamless Integration**: Works with your existing AdonisJS routes without any configuration changes
- **Standards Compliant**: Generated OpenAPI documentation passes validation in all OpenAPI tools and validators
- **Advanced Parameter Support**: Handles regular, optional, and wildcard parameters according to AdonisJS routing rules

## Quickstart

[Installation & Getting Started](https://friendsofadonis.com/docs/openapi/getting-started)

## Path Parameter Transformation

This package automatically transforms your AdonisJS route patterns to OpenAPI-compliant format. Based on the [AdonisJS routing documentation](https://docs.adonisjs.com/guides/basics/routing), route patterns don't contain search parameters, and wildcard parameters can only appear at the end of the path.

### Regular Parameters
```typescript
// Your AdonisJS routes
router.get('/users/:id', [UsersController, 'show'])
router.get('/posts/:postId/comments/:commentId', [CommentsController, 'index'])

// Generated OpenAPI paths
// /users/{id}
// /posts/{postId}/comments/{commentId}
```

### Optional Parameters
```typescript
// AdonisJS optional parameters (with ?)
router.get('/users/:id?', [UsersController, 'show'])
router.get('/api/:version?/users/:id', [UsersController, 'index'])

// Generated OpenAPI paths
// /users/{id}
// /api/{version}/users/{id}
```

### Wildcard Parameters
```typescript
// AdonisJS wildcard parameters (with *) - only at end of path
router.get('/files/*', [FilesController, 'serve'])
router.get('/users/:id/*', [FilesController, 'userFiles'])

// Generated OpenAPI paths
// /files{wildcard}
// /users/{id}/{wildcard}
```

### Mixed Parameter Types
```typescript
// Complex routes with mixed parameter types
router.get('/api/:version?/organizations/:orgId?/projects/:projectId/*', [ProjectsController, 'files'])

// Generated OpenAPI path
// /api/{version}/organizations/{orgId}/projects/{projectId}/{wildcard}
```

## AdonisJS Routing Rules

This package follows the official AdonisJS routing conventions:

- **Route patterns don't contain search parameters** - they're handled separately by the request object
- **Wildcard parameters (*) can only appear at the end** of the path and capture all remaining segments
- **Optional parameters use ? suffix** and can appear anywhere in the path
- **Regular parameters use : prefix** and capture single path segments
- **Trailing slashes are not part of route patterns** - they're handled by the router itself

## License

[MIT licensed](LICENSE.md).
