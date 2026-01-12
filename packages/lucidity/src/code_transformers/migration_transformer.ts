import {
  type SourceFile,
  type FormatCodeSettings,
  type Project,
  type ClassDeclaration,
  type MethodDeclaration,
  type ExpressionStatement,
  type CallExpression,
  type ArrowFunction,
  type CodeBlockWriter,
} from 'ts-morph'
import { DATA_TYPES_MAPPING } from '../ddl/mappings.ts'

export class MigrationTransformer {
  #project: Project
  #source: SourceFile

  #classDeclaration: ClassDeclaration
  #upMethodDeclaration: MethodDeclaration
  #downMethodDeclaration: MethodDeclaration

  /**
   * Settings to use when persisting files
   */
  #editorSettings: FormatCodeSettings = {
    indentSize: 2,
    convertTabsToSpaces: true,
    trimTrailingWhitespace: true,
    ensureNewLineAtEndOfFile: true,
    indentStyle: 2,
    // @ts-expect-error SemicolonPreference doesn't seem to be re-exported from ts-morph
    semicolons: 'remove',
  }
  /**
   * Create a new MigrationTrasnformer instance
   *
   * @param path - Absolute path to the migration file
   * @param project - The TsMorph project instance
   */
  constructor(path: string, project: Project) {
    this.#project = project
    this.#source = this.#project.createSourceFile(path)

    this.#source.addImportDeclaration({
      moduleSpecifier: '@adonisjs/lucid/schema',
      namedImports: ['BaseSchema'],
    })

    this.#classDeclaration = this.#source.addClass({
      extends: 'BaseSchema',
      isDefaultExport: true,
    })

    this.#upMethodDeclaration = this.#classDeclaration.addMethod({
      name: 'up',
      isAsync: true,
    })

    this.#downMethodDeclaration = this.#classDeclaration.addMethod({
      name: 'down',
      isAsync: true,
    })
  }

  #addSchemaExpression(lifecycle: 'up' | 'down', method: string, table: string) {
    const target = lifecycle === 'up' ? this.#upMethodDeclaration : this.#downMethodDeclaration
    const statements = target.addStatements((writer) => {
      writer.write(`this.schema.${method}('${table}', (table) => {})`)
    })

    const expression = statements[0] as ExpressionStatement
    const call = expression.getChildren()[0] as CallExpression
    const arrowFn = call.getArguments()[1] as ArrowFunction

    return new MigrationTableTransformer(arrowFn)
  }

  addCreateTable(lifecycle: 'up' | 'down', table: string) {
    return this.#addSchemaExpression(lifecycle, 'createTable', table)
  }

  addAlterTable(lifecycle: 'up' | 'down', tableName: string) {
    return this.#addSchemaExpression(lifecycle, 'alterTable', tableName)
  }

  addDropTable(lifecycle: 'up' | 'down', table: string) {
    const target = lifecycle === 'up' ? this.#upMethodDeclaration : this.#downMethodDeclaration
    target.addStatements(`this.schema.dropTable('${table}')`)
  }

  save() {
    this.#source.formatText(this.#editorSettings)
    return this.#source.save()
  }

  text() {
    this.#source.formatText(this.#editorSettings)
    return this.#source.getText()
  }
}

export class MigrationTableTransformer {
  constructor(public body: ArrowFunction) {}

  addColumn(name: string, type: string, callback: (writer: ColumnWriter) => void) {
    const realtype = DATA_TYPES_MAPPING[type] ?? type

    this.body.addStatements((writer) => {
      writer.write(`table.${realtype}('${name}')`)
      const transformer = new ColumnWriter(writer)
      callback(transformer)
      writer.write(';').newLine()
    })
  }

  addDropColumn(column: string) {
    this.body.addStatements(`table.dropColumn('${column}')`)
  }

  addSetNullable(column: string) {
    this.body.addStatements(`table.setNullable('${column}')`)
  }

  addDropNullable(column: string) {
    this.body.addStatements(`table.dropNullable('${column}')`)
  }

  addUnique(columns: string[]) {
    const inner = columns.map((column) => `'${column}'`).join(',')
    this.body.addStatements(`table.unique([${inner}])`)
  }

  addDropUnique(columns: string[]) {
    const inner = columns.map((column) => `'${column}'`).join(',')
    this.body.addStatements(`table.dropUnique([${inner}])`)
  }

  addPrimary(columns: string[]) {
    const inner = columns.map((column) => `'${column}'`).join(',')
    this.body.addStatements(`table.primary([${inner}])`)
  }

  addDropPrimary(columns: string[]) {
    const inner = columns.map((column) => `'${column}'`).join(',')
    this.body.addStatements(`table.dropPrimary([${inner}])`)
  }

  addAlterColumn(column: string, type: string, args: (string | number)[] = []) {
    const realtype = DATA_TYPES_MAPPING[type] ?? type
    const argsStr = args.length > 0 ? `, ${args.join(', ')}` : ''
    this.body.addStatements(`table.${realtype}('${column}'${argsStr}).alter()`)
  }
}

export class ColumnWriter {
  constructor(public writer: CodeBlockWriter) {}

  callMethod(name: string, args: string[] = []) {
    this.writer.write(`.${name}(${args.join(', ')})`)
  }
}
