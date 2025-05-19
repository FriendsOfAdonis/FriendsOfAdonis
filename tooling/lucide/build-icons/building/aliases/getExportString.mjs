const getExportString = (
  componentName,
  iconName,
  aliasImportFileExtension = '.js',
  deprecated,
  deprecationReason = ''
) =>
  deprecated
    ? `export {\n` +
      `  /** @deprecated ${deprecationReason} */\n` +
      `  default as ${componentName}\n` +
      `} from '../icons/${iconName}${aliasImportFileExtension}.js';\n`
    : `export { default as ${componentName} } from '../icons/${iconName}${aliasImportFileExtension}.js';\n`

export default getExportString
