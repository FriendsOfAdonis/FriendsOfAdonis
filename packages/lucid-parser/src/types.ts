import type { Identifier, Program, TSType } from '@babel/types'

export interface Loc {
  start?: { line?: number; column?: number; token?: number }
  end?: { line?: number; column?: number; token?: number }
  lines?: any
}

export type FileNode = {
  type: 'File'
  program: Program
  loc: Loc
  comments: null | any
}

export type TypeName = 'string' | 'boolean' | 'number' | 'complex' | 'unknown'
export type PropertyType = {
  name: TypeName | string
  isArray: boolean
  isNullable: boolean
  isOptional: boolean
}

export type ComputedProperty = {
  key: string
  type: PropertyType
}

export type ColumnProperty = {
  key: string
  type: PropertyType
}

export type RelationshipProperty = {}

export type ParsedModel = {
  columns: ColumnProperty[]
  computed: ComputedProperty[]
}

export type ASTType =
  | { name: 'string' }
  | { name: 'boolean' }
  | { name: 'number' }
  | { name: 'null' }
  | { name: 'union'; types: TSType[] }
  | { name: 'array'; type: TSType }
  | { name: 'reference'; identifier: Identifier }
  | { name: 'unknown' }
