/*
|--------------------------------------------------------------------------
| Package entrypoint
|--------------------------------------------------------------------------
|
| Export values from the package entrypoint as you see fit.
|
*/

export { configure } from './configure.js'
export { defineConfig, engines } from './src/define_config.js'
export { MagnifyManager } from './src/magnify_manager.js'
export { MagnifyEngine } from './src/engines/main.js'
export { SearchBuilder as Builder } from './src/builder.js'
export { Searchable } from './src/mixins/searchable.js'
