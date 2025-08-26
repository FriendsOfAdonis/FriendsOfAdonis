import { Config } from 'automd'
import coverage from './tooling/automd/generators/coverage'
import packages from './tooling/automd/generators/packages'

/** @type {import("automd").Config} */
export default {
  input: ['packages/*/README.md'],
  generators: {
    coverage,
    packages,
  },
} satisfies Config
