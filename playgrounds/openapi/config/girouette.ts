import { defineConfig } from '@adonisjs-community/girouette'

const girouetteConfig = defineConfig({
  /**
   * This regex is used to find matching controller files. You can customize it to suit your needs.
   */
  controllersGlob: /_controller\.(ts|js)$/,
})

export default girouetteConfig