# Contributing

Thanks for being willing to contribute! 🙏

**Working on your first Pull Request (PR)?** You can learn how from this free series [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

## 🚀 Repository Setup

### Prerequisites

- **Node.js**: Version 18 or higher (we test against Node 20.10.0, 21.x, and 23.x)
- **Yarn**: Version 4.6.0 (this project uses Yarn workspaces)

### Setup Instructions

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/FriendsOfAdonis.git
   cd FriendsOfAdonis
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Verify the setup**
   ```bash
   # Run lint, typecheck and build
   yarn lint typecheck build
   ```

### Development Workflow

This project uses **Turborepo** for managing the monorepo. Here are the key commands:

- `yarn dev` - Start development servers for playgrounds
- `yarn lint` - Lint all packages
- `yarn test` - Run tests across all packages
- `yarn build` - Build all packages
- `yarn typecheck` - Type check all packages
- `yarn format` - Format code with Prettier

**Playground Development:**
- `yarn play:graphql` - Start GraphQL playground
- `yarn play:openapi` - Start OpenAPI playground  
- `yarn play:actions` - Start Actions playground

## 📋 Open Issues

Please check out the [open issues](https://github.com/FriendsOfAdonis/FriendsOfAdonis/issues). Issues labelled [**Good First Issue**](https://github.com/FriendsOfAdonis/FriendsOfAdonis/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) are especially good to start with.

Contributing doesn't have to be in code. Simply answering questions in open issues or providing workarounds is as important as making pull requests.

## 🆕 New Features

New features must always be discussed in a specific issue to ensure a correct implementation and avoid any future breaking changes.

## 🧪 Testing

One of FriendsOfAdonis promises is to be production-ready. To respect this promise, the library must be well-tested to avoid any breaking changes.

The current minimum coverage is: **80%**

## 🎨 Guidelines

### Code Style

- **TypeScript**: We use strict TypeScript configuration based on `@adonisjs/tsconfig`
- **ESLint**: Follow our custom ESLint configuration (`@foadonis/eslint-config`)
- **Prettier**: Code formatting is handled by `@adonisjs/prettier-config`

### Comments

- All public-facing APIs **MUST BE** properly commented using [JSDoc](https://jsdoc.app/) and provide `@example` when applicable.
- Internal-only APIs **MUST BE** properly commented using [JSDoc](https://jsdoc.app/) when complex.

### Structure

Each package must be following this structure:

```
/
├── bin       # Binaries (e.g test.ts) 
├── commands  # AdonisJS commands
├── providers # AdonisJS providers
├── src       # The actual code
├── stubs     # Templates stubs (config, make, etc)
└── tests     # Automated tests
```

### Commit Messages

This repository uses squashing and changesets meaning that your commit messages are not as important as your pull-request title. Simply try to keep them simple and concise.

### Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for version management. Each pull-request must include changeset(s) reflecting the changes.

```bash
yarn changeset

# This will prompt you to:
# 1. Select affected packages
# 2. Choose change type (major/minor/patch)
# 3. Write a description
```

#### Description format

**Must showcase the actual changes**

❌ Not showcasing the changes
```md
Added `toOpenAPIPath` method to utils.
Use `toOpenAPIPath` in loader for path conversion.
```

✅ Showcase the changes
```md
Automatically convert Adonis paths to complient OpenAPI paths.
```

**Must include migration description when breaking changes**
````md

Removed automatic routes registration in favor of manual routes registration.
This allows you to modify routes behavior (prefix, path, middleware, etc).

You must add the following in routes.ts:

```ts
import openapi from '@foadonis/openapi/services/main'

openapi.registerRoutes()
```
````

#### Versions

The packages follow the [Semantic Versioning v2](https://semver.org/).

Given a version number MAJOR.MINOR.PATCH, increment the:

- MAJOR version when you make incompatible API changes
- MINOR version when you add functionality in a backward compatible manner
- PATCH version when you make backward compatible bug fixes

## 📚 Additional Resources

- [FriendsOfAdonis Documentation](https://friendsofadonis.com/)
- [AdonisJS Documentation](https://docs.adonisjs.com/)
- [Turbo Documentation](https://turbo.build/repo/docs)
- [Changesets Documentation](https://github.com/changesets/changesets)

## 🤝 Need Help?

- Open an [issue](https://github.com/FriendsOfAdonis/FriendsOfAdonis/issues) for bugs or feature requests
- Join our community discussions
- Check existing issues and pull requests for similar problems

Thank you for contributing to FriendsOfAdonis! 🎉
