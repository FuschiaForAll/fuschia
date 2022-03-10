/**
 * HEAVILY INFLUENCED BY
 * https://github.com/plantain-00/schema-based-json-editor
 *
 */
export interface Props<TSchema extends CommonSchema, TValue> {
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
}

type EqualCondition = [string, '===', any]
type InCondition = [string, 'in', any]
type IsUndefinedCondition = [string, 'isUndefined']

export type AnySchema = CommonSchema & {
  type: undefined
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
}

export type BooleanSchema = CommonSchema & {
  type: 'boolean'
  format?: 'checkbox' | 'select' | 'select2'
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
  description?: string
  default?: ValueType
  readonly?: boolean
  propertyOrder?: number
  requiredWhen?: EqualCondition | InCondition | IsUndefinedCondition
  optionalWhen?: EqualCondition | InCondition | IsUndefinedCondition
  className?: string
  propertyName?: string
}
