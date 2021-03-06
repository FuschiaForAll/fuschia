/**
 * HEAVILY INFLUENCED BY
 * https://github.com/plantain-00/schema-based-json-editor
 *
 */
export interface Props<TSchema extends CommonSchema, TValue> {
  componentId: string
  schema: TSchema
  initialValue: TValue
  title?: string
  updateValue: (value: TValue | undefined, isValid: boolean) => void
  onDelete?: () => void
  readonly?: boolean
  required?: boolean
  forceHttps?: boolean
  disableCollapse?: boolean
  minItemCountIfNeedFilter?: number
  getReference: (name: string) => TSchema | undefined
  data?: { [key: string]: string }
}

type EqualCondition = [string, '===', any]
type InCondition = [string, 'in', any]
type IsUndefinedCondition = [string, 'isUndefined']

export type AnySchema = CommonSchema & {
  type: undefined
}

export type FlexContainerSchema = CommonSchema & {
  type: 'flexContainer'
  size: string
  style: string
  weight: string
  textAlign: string
  textTransform: string
  lineHeight: string
}

export type FontSchema = CommonSchema & {
  type: 'font'
  size: string
  style: string
  weight: string
  textAlign: string
  textTransform: string
  lineHeight: string
}

export type MarginSchema = CommonSchema & {
  type: 'margin'
  marginLeft: string
  marginRight: string
  marginTop: string
  marginBottom: string
}

export type PositionSchema = CommonSchema & {
  type: 'position'
  left: string
  right: string
  top: string
  bottom: string
}

export type PaddingSchema = CommonSchema & {
  type: 'padding'
  paddingLeft: string
  paddingRight: string
  paddingTop: string
  paddingBottom: string
}

export type UIComponentSchema = Omit<ObjectSchema, 'type'> & {
  type: 'ui-component'
  isRootElement: boolean
  isContainer: boolean
}

export type LayoutComponentSchema = Omit<ObjectSchema, 'type'> & {
  type: 'layout-component'
  layout: ObjectSchema
}

export type FunctionSchema = CommonSchema & {
  type: 'function'
  arguments: Array<{ [name: string]: ValueType }>
  returnType: ValueType
}

export type ObjectSchema = CommonSchema & {
  type: 'object'
  properties: { [name: string]: Schema }
  required?: string[]
  maxProperties?: number
  minProperties?: number
  collapsed?: boolean
}

export type ArraySchema = CommonSchema & {
  type: 'array'
  items: Schema
  properties: { [name: string]: Schema }
  minItems?: number
  uniqueItems?: boolean
  collapsed?: boolean
  enum?: ValueType[]
  enumTitles?: string[]
  format?: 'select2'
}

export type NumberSchema = CommonSchema & {
  type: 'number' | 'integer'
  minimum?: number
  exclusiveMinimum?: boolean
  maximum?: number
  exclusiveMaximum?: boolean
  enum?: number[]
  multipleOf?: number
  enumTitles?: string[]
  format?: 'select' | 'radiobox'
  step?: number | 'any'
  dataBound: boolean
}

export type StringSchema = CommonSchema & {
  type: 'string'
  format?:
    | 'textarea'
    | 'color'
    | 'date'
    | 'datetime'
    | 'datetime-local'
    | 'time'
    | 'month'
    | 'email'
    | 'uri'
    | 'url'
    | 'week'
    | 'hostname'
    | 'ipv4'
    | 'ipv6'
    | 'code'
    | 'markdown'
    | 'base64'
    | 'select'
    | 'radiobox'
    | 'json'
  enum?: string[]
  minLength?: number
  maxLength?: number
  pattern?: string
  enumTitles?: string[]
  step?: number | 'any'
  dataBound: boolean
}

export type BooleanSchema = CommonSchema & {
  type: 'boolean'
  format?: 'checkbox' | 'select'
  dataBound: boolean
}

export type NullSchema = CommonSchema & {
  type: 'null'
}

export type Schema =
  | ObjectSchema
  | ArraySchema
  | NumberSchema
  | StringSchema
  | BooleanSchema
  | NullSchema
  | AnySchema
  | FunctionSchema
  | UIComponentSchema
  | PaddingSchema
  | MarginSchema
  | LayoutComponentSchema
  | FontSchema
  | FlexContainerSchema
  | PositionSchema

export type ValueType =
  | { [name: string]: any }
  | any[]
  | number
  | boolean
  | string
  | null
  | undefined

export interface CommonSchema {
  $schema?: string
  $ref?: string
  definitions?: { [name: string]: Schema }
  title?: string
  id?: string
  description?: string
  default?: ValueType
  readonly?: boolean
  propertyOrder?: number
  requiredWhen?: EqualCondition | InCondition | IsUndefinedCondition
  optionalWhen?: EqualCondition | InCondition | IsUndefinedCondition
  className?: string
  propertyName?: string
}

export function getDefaultValue(
  required: boolean | undefined = undefined,
  schema: Schema,
  initialValue: ValueType | undefined
): ValueType | undefined {
  if (initialValue !== undefined) {
    switch (schema.type) {
      case 'object':
        if (initialValue === Object(initialValue)) {
          return initialValue
        }
        break
      case 'array':
        if (Array.isArray(initialValue)) {
          return initialValue
        }
        break
      case 'number':
      case 'integer':
        if (typeof initialValue === 'number') {
          return initialValue
        }
        break
      case 'boolean':
        if (typeof initialValue === 'boolean') {
          return initialValue
        }
        break
      case 'string':
        if (typeof initialValue === 'string') {
          return initialValue
        }
        break
      case undefined:
        return initialValue
      case 'null':
      default:
        if (initialValue === null) {
          return initialValue
        }
    }
  }

  if (!required) {
    return undefined
  }

  if (schema.default !== undefined) {
    switch (schema.type) {
      case 'object':
        if (schema.default === Object(schema.default)) {
          return schema.default
        }
        break
      case 'array':
        if (Array.isArray(schema.default)) {
          return schema.default
        }
        break
      case 'number':
      case 'integer':
        if (typeof schema.default === 'number') {
          return schema.default
        }
        break
      case 'boolean':
        if (typeof schema.default === 'boolean') {
          return schema.default
        }
        break
      case 'string':
        if (typeof schema.default === 'string') {
          return schema.default
        }
        break
      case 'null':
      default:
        if (schema.default === null) {
          return schema.default
        }
    }
  }

  switch (schema.type) {
    case 'object':
      const value: any = {}
      for (const property in schema.properties) {
        const propertySchema = schema.properties[property]
        value[propertySchema.propertyName || property] = undefined
      }
      return value
    case 'array':
      return []
    case 'number':
    case 'integer':
      if (schema.enum !== undefined && schema.enum.length > 0) {
        return schema.enum[0]
      } else {
        return 0
      }
    case 'boolean':
      return false
    case 'string':
      if (schema.enum !== undefined && schema.enum.length > 0) {
        return schema.enum[0]
      } else {
        return ''
      }
    case 'null':
    default:
      return null
  }
}
