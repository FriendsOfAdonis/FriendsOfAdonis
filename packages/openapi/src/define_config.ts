import { type OpenAPIDocumentConfig, type OpenAPIConfig } from './types.js'

/**
 * Creates an OpenAPI configuration.
 */
export function defineConfig<KnownDocuments extends Record<string, OpenAPIDocumentConfig>>(
  config: OpenAPIConfig<KnownDocuments>
): OpenAPIConfig<KnownDocuments> {
  return config
}
