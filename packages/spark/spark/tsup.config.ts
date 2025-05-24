import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/client/index.ts'],
  clean: true,
  outDir: './lib',
  format: 'esm',
  dts: true,
  noExternal: [/.*/],
})
