import { promises as fsp } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parse } from 'recast'
import { getBabelParser } from './babel.js'
import { ColumnProperty, ComputedProperty, FileNode, ParsedModel } from './types.js'
import {
  getClassMethods,
  getClassProperties,
  getExportDefaultDeclaration,
  getPropertyTypeFromClassMethod,
  getPropertyTypeFromClassProperty,
} from './ast.js'
import { LucidParserError } from './errors.js'
import { ClassMethod, ClassProperty, Decorator } from '@babel/types'

export async function loadModule(path: URL | string) {
  const filepath = fileURLToPath(path)

  const content = await fsp.readFile(filepath, 'utf8')

  return parse(content, {
    parser: getBabelParser(),
  }) as FileNode
}

function hasDecorator(decorator: Decorator, ...names: string[]) {
  if (decorator.expression.type !== 'CallExpression') return false

  const callee = decorator.expression.callee
  if (callee.type !== 'Identifier') return false
  if (!names.includes(callee.name)) return false

  return true
}

const isColumnDecorator = (decorator: Decorator) => hasDecorator(decorator, 'column')
const isComputedDecorator = (decorator: Decorator) => hasDecorator(decorator, 'computed')

/**
 * Returns if the ClassProperty is a column property.
 */
function isColumnProperty(property: ClassProperty) {
  const decorator = property.decorators?.filter(isColumnDecorator)
  return Boolean(decorator)
}

/**
 * Returns if the ClassMethod is a computed method.
 */
function isComputedMethod(property: ClassMethod) {
  const decorator = property.decorators?.filter(isComputedDecorator)
  return Boolean(decorator)
}

function normalizeColumnClassProperty(property: ClassProperty): ColumnProperty {
  if (property.key.type !== 'Identifier') {
    throw new LucidParserError(`Tried to parse a ClassProperty without key Identifier`)
  }

  return {
    key: property.key.name,
    type: getPropertyTypeFromClassProperty(property),
  }
}

function normalizeComputedClassMethod(method: ClassMethod): ComputedProperty {
  if (method.key.type !== 'Identifier') {
    throw new LucidParserError(`Tried to parse a ClassMethod without key Identifier`)
  }

  return {
    key: method.key.name,
    type: getPropertyTypeFromClassMethod(method),
  }
}

export async function parseModel(specifier: string | URL): Promise<ParsedModel> {
  const ast = await loadModule(specifier)
  const classAst = getExportDefaultDeclaration(ast.program)

  if (!classAst) {
    throw new LucidParserError('The model does not export a default class')
  }

  const classProperties = getClassProperties(classAst)
  const classMethods = getClassMethods(classAst)

  const columnClassProperties = classProperties.filter(isColumnProperty)
  const computedClassMethods = classMethods.filter(isComputedMethod)

  return {
    columns: columnClassProperties.map(normalizeColumnClassProperty),
    computed: computedClassMethods.map(normalizeComputedClassMethod),
  }
}
