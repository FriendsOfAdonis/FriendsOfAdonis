import { ClassDeclaration, ClassMethod, ClassProperty, Program, TSType } from '@babel/types'
import { ASTType, PropertyType } from './types.js'

export function getExportDefaultDeclaration(ast: Program) {
  const declaration = ast.body.find((statement) => statement.type === 'ExportDefaultDeclaration')
  if (!declaration || declaration.declaration.type !== 'ClassDeclaration') return
  return declaration.declaration
}

export function getClassProperties(ast: ClassDeclaration) {
  return ast.body.body.filter((t) => t.type === 'ClassProperty')
}

export function getClassMethods(ast: ClassDeclaration) {
  return ast.body.body.filter((t) => t.type === 'ClassMethod')
}

function isPrimitiveType(type: string): type is 'string' | 'boolean' | 'number' {
  return ['string', 'boolean', 'number'].includes(type)
}

export function getPropertyTypeFromClassProperty(ast: ClassProperty): PropertyType {
  const node = ast.typeAnnotation

  if (!node || node.type !== 'TSTypeAnnotation')
    return { name: 'unknown', isArray: false, isNullable: false, isOptional: false }

  return getPropertyTypeFromTSType(node.typeAnnotation, undefined, Boolean(ast.optional), undefined)
}

export function getPropertyTypeFromClassMethod(node: ClassMethod): PropertyType {
  if (node.returnType && node.returnType.type === 'TSTypeAnnotation') {
    return getPropertyTypeFromTSType(node.returnType.typeAnnotation)
  }

  return {
    name: 'unknown',
    isArray: false,
    isNullable: false,
    isOptional: false,
  }
}

export function getPropertyTypeFromTSType(
  node: TSType,
  isNullable = false,
  isOptional = false,
  isArray = false
): PropertyType {
  const type = normalizeTSType(node)

  if (type.name === 'array') {
    return getPropertyTypeFromTSType(type.type, isNullable, isOptional, true)
  }

  if (type.name === 'union') {
    if (type.types.length !== 2) {
      return {
        name: 'complex',
        isOptional,
        isArray,
        isNullable: Boolean(type.types.find((t) => t.type === 'TSNullKeyword')),
      }
    }

    const nullOrUndefined = type.types.find(
      (t) => t.type === 'TSUndefinedKeyword' || t.type === 'TSNullKeyword'
    )

    const nonNull = type.types.find((t) => t.type !== 'TSNullKeyword')

    // We have union of two non null types
    if (!nonNull || !nullOrUndefined) {
      return {
        name: 'complex',
        isOptional,
        isArray,
        isNullable: false,
      }
    }

    return getPropertyTypeFromTSType(
      nonNull,
      nullOrUndefined.type === 'TSNullKeyword',
      nullOrUndefined.type === 'TSUndefinedKeyword',
      isArray
    )
  }

  if (type.name === 'reference') {
    return {
      name: type.identifier.name,
      isArray,
      isOptional,
      isNullable,
    }
  }

  if (isPrimitiveType(type.name)) {
    return {
      name: type.name,
      isArray,
      isOptional,
      isNullable,
    }
  }

  return {
    name: 'unknown',
    isArray,
    isOptional,
    isNullable,
  }
}

export function normalizeTSType(node: TSType): ASTType {
  if (node.type === 'TSStringKeyword') return { name: 'string' }
  if (node.type === 'TSBooleanKeyword') return { name: 'boolean' }
  if (node.type === 'TSNumberKeyword') return { name: 'number' }
  if (node.type === 'TSNullKeyword') return { name: 'null' }

  if (node.type === 'TSUnionType') {
    return { name: 'union', types: node.types }
  }

  if (node.type === 'TSArrayType') {
    return { name: 'array', type: node.elementType }
  }

  if (node.type === 'TSTypeReference' && node.typeName.type === 'Identifier') {
    return { name: 'reference', identifier: node.typeName }
  }

  throw new Error(`Not handled ${node.type}`)
}
