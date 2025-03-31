import next from '@foadonis/eslint-config/next.app.js'

export default [
  {
    ignores: ['.source/*'],
  },
  ...next,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.lint.json',
      },
    },
  },
]
