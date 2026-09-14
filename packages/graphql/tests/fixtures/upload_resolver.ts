import { GraphQLScalarType } from 'graphql'
import { Arg, Mutation, Resolver } from '../../index.js'

export const FileScalar = new GraphQLScalarType({
  name: 'File',
  description: 'The `File` scalar type represents a file upload.',
})

@Resolver()
export class UploadResolver {
  @Mutation(() => String)
  async testUpload(@Arg('file', () => FileScalar) file: File) {
    return `${file.name}:${await file.text()}`
  }

  @Mutation(() => [String])
  async testUploads(@Arg('files', () => [FileScalar]) files: File[]) {
    return Promise.all(files.map(async (file) => `${file.name}:${await file.text()}`))
  }
}
