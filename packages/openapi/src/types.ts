import { generateDocument } from 'openapi-metadata'

type GenerateDocumentParameters = Parameters<typeof generateDocument>[0]

export type OpenAPIConfig = {
  document: GenerateDocumentParameters['document']
  controllers?: GenerateDocumentParameters['controllers']
  loaders?: GenerateDocumentParameters['loaders']
}
