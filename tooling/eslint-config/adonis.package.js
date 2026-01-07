import { configPkg } from '@adonisjs/eslint-config'

export default configPkg({
  ignores: ['tests/tmp/**', 'coverage/**', 'build/**'],
  languageOptions: {
    parserOptions: {
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    },
  },
})
