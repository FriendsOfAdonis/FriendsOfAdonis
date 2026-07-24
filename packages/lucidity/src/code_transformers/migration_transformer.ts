import {
  type CodeBlockWriter,
  type SourceFile,
  type FormatCodeSettings,
  type Project,
  type ClassDeclaration,
  type MethodDeclaration,
  type ExpressionStatement,
  type CallExpression,
  type ArrowFunction,
} from 'ts-morph'
import { type KnexColumnBuilderMethod, type KnexTableBuilderMethod } from '../types.ts'

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

  column(
    method: KnexTableBuilderMethod,
    args: string[] = [],
    callback: (writer: ColumnExpressionWriter) => void
  ) {
    this.body.addStatements((writer) => {
      writer.write(`table.${method}(${args.join(', ')})`)

      const column = new ColumnExpressionWriter(writer)
      callback(column)
      writer.newLine()
    })
  }

  callTableMethod(name: KnexTableBuilderMethod, args: string[] = []) {
    this.body.addStatements(`table.${name}(${args.join(', ')})`)
  }

  addDropColumn(column: string) {
    this.callTableMethod('dropColumn', [`'${column}'`])
  }

  addSetNullable(column: string) {
    this.callTableMethod('setNullable', [`'${column}'`])
  }

  addDropNullable(column: string) {
    this.callTableMethod('dropNullable', [`'${column}'`])
  }

  addUnique(columns: string[]) {
    const inner = columns.map((column) => `'${column}'`).join(', ')
    this.callTableMethod('unique', [inner])
  }

  addDropUnique(columns: string[]) {
    const inner = columns.map((column) => `'${column}'`).join(',')
    this.callTableMethod('dropUnique', [inner])
  }

  addPrimary(columns: string[]) {
    const inner = columns.map((column) => `'${column}'`).join(',')
    this.callTableMethod('primary', [inner])
  }

  addDropPrimary(columns: string[]) {
    const inner = columns.map((column) => `'${column}'`).join(',')
    this.callTableMethod('dropPrimary', [inner])
  }
}

export class ColumnExpressionWriter {
  constructor(public writer: CodeBlockWriter) {}

  callMethod(name: KnexColumnBuilderMethod, args: string[] = []) {
    this.writer.write(`.${name}(${args.join(', ')})`)
  }
}
