import { type TypeLoaderFn } from '@martin.xyz/openapi-decorators/types'
import { SimpleMessagesProvider, VineValidator } from '@vinejs/vine'
import type { OpenAPIV3 } from 'openapi-types'
import _ from 'lodash'
import { extractNameFromThunk } from '../utils.js'

type Validator = ReturnType<VineValidator<any, any>['toJSON']>
type Refs = Validator['refs']
type CompilerNode = Validator['schema']['schema']
type ObjectNode = CompilerNode & { type: 'object' }
type LiteralNode = CompilerNode & { type: 'literal' }
type ArrayNode = CompilerNode & { type: 'array' }
type ValidationNode = ObjectNode['validations'][number]

// TODO: We might want to autoload validators and import theme dynamically to discover constant name

export function parseValidations(
  validations: ValidationNode[],
  refs: Refs
): Partial<OpenAPIV3.SchemaObject> {
  const schema: Partial<OpenAPIV3.SchemaObject> = {}

  for (const validation of validations) {
    const rule = refs[validation.ruleFnId]

    if (!rule || !('options' in rule) || !rule.options) {
      continue
    }

    if (rule.options.min) {
      schema.minimum = rule.options.min
    }

    if (rule.options.max) {
      schema.maximum = rule.options.max
    }

    // TODO: Surely a cleaner way to identify regex
    if (rule.options.toString().includes('/')) {
      schema.pattern = rule.options.toString()
    }

    // TODO: Choices
  }

  return schema
}

export function parseCompilerNode(node: CompilerNode, refs: Refs): OpenAPIV3.SchemaObject {
  let schema: OpenAPIV3.SchemaObject

  switch (node.type) {
    case 'object':
      schema = parseObjectNode(node, refs)
      break
    case 'literal':
      schema = parseLiteralNode(node, refs)
      break
    case 'array':
      schema = parseArrayNode(node, refs)
      break
    default:
      throw new Error(`No parser found for type ${node.type}`)
  }

  // TODO: FIX TYPE
  return {
    ...parseValidations(node.validations, refs),
    ...schema,
  } as OpenAPIV3.SchemaObject
}

export function parseObjectNode(node: ObjectNode, refs: Refs): OpenAPIV3.SchemaObject {
  const schema: OpenAPIV3.SchemaObject = {
    type: 'object',
  }

  for (const property of node.properties) {
    schema.properties = {
      ...schema.properties,
      [property.fieldName]: parseCompilerNode(property, refs),
    }

    if ('isOptional' in property && property.isOptional === false) {
      schema.required = [...(schema.required ?? []), property.fieldName]
    }
  }

  return schema
}

export function parseArrayNode(node: ArrayNode, refs: Refs): OpenAPIV3.SchemaObject {
  return {
    type: 'array',
    items: parseCompilerNode(node.each, refs),
  }
}

// A literal is always marked as string and is then specified properly depending on validator
export function parseLiteralNode(_node: LiteralNode, _refs: Refs): OpenAPIV3.SchemaObject {
  return {
    type: 'string',
  }
}

export async function enrichType(
  validator: VineValidator<any, any>,
  schema: OpenAPIV3.SchemaObject
) {
  if (!schema.properties) {
    return
  }

  const obj = nodeToTestObject(schema)

  const [error] = await validator.tryValidate(obj, {
    messagesProvider: new SimpleMessagesProvider({
      required: 'REQUIRED',
      string: 'TYPE',
      object: 'TYPE',
      number: 'TYPE',
      boolean: 'TYPE',
    }),
  })

  if (!error) {
    return schema
  }

  for (const message of error.messages) {
    // TODO: This should break if property name starts with 0
    const fieldPath = message.field
      .replaceAll(/\.(?!0)/g, '.properties.')
      .replaceAll('.0', '.items')

    if (message.message === 'TYPE') {
      _.set(schema.properties, `${fieldPath}.type`, message.rule)
    }
  }
}

function nodeToTestObject(schema: OpenAPIV3.SchemaObject) {
  const res: any = {}

  for (const [name, property] of Object.entries(schema.properties ?? {})) {
    if (!('type' in property)) {
      continue
    }

    if (property.type === 'object') {
      res[name] = nodeToTestObject(property)
    } else if (property.type === 'array') {
      if (!('type' in property.items)) {
        continue
      }

      if (property.items.type === 'object') {
        res[name] = [nodeToTestObject(property.items)]
      } else {
        res[name] = ['example']
      }
    } else {
      res[name] = 'example'
    }
  }

  return res
}

export async function validatorToSchema(
  validator: VineValidator<any, any>
): Promise<OpenAPIV3.SchemaObject> {
  const json = validator.toJSON()
  const node = json.schema.schema

  if (node.type !== 'object') {
    // TODO: Better errors
    throw new Error('Only object top-level schemas are currently supported')
  }

  const schema = parseCompilerNode(node, json.refs)

  await enrichType(validator, schema)

  return schema
}

export const VineTypeLoader: TypeLoaderFn = async (context, value, original) => {
  if (value instanceof VineValidator) {
    if (original === value) {
      context.logger.warn(`Vine Validators can only be loaded using Thunk '() => myValidator'`)
      return
    }

    const name = extractNameFromThunk(original as Function)
    if (!name) {
      context.logger.warn(`Cannot extract Validator name from Thunk`)
      return
    }

    if (context.schemas[name]) {
      return context.schemas[name]
    }

    const schema = await validatorToSchema(value)

    context.schemas[name] = schema

    return { $ref: `#/components/schemas/${name}` }
  }
}
