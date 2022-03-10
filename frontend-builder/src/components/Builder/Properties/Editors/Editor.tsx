import React from 'react'
import {
  Props,
  Schema,
  ValueType,
  BooleanSchema,
  StringSchema,
  ObjectSchema,
  ArraySchema,
  NumberSchema,
  AnySchema,
  NullSchema,
} from '@fuchsia/types'
import BooleanEditor from './BooleanEditor'
import StringEditor from './StringEditor'
import ObjectEditor from './ObjectEditor'
import ArrayEditor from './ArrayEditor'
import NumberEditor from './NumberEditor'
import AnyEditor from './AnyEditor'
import NullEditor from './NullEditor'

export type EditorProps = Props<Schema, ValueType>

const Editor = function Editor(props: EditorProps) {
  switch (props.schema.type) {
    case 'boolean':
      return <BooleanEditor {...(props as Props<BooleanSchema, boolean>)} />
    case 'string':
      return <StringEditor {...(props as Props<StringSchema, string>)} />
    case 'array':
      return <ArrayEditor {...(props as Props<ArraySchema, ValueType[]>)} />
    case 'integer':
    case 'number':
      return <NumberEditor {...(props as Props<NumberSchema, number>)} />
    case 'null':
      return <NullEditor {...(props as Props<NullSchema, null>)} />
    case 'object':
      return (
        <ObjectEditor
          {...(props as Props<ObjectSchema, { [name: string]: ValueType }>)}
        />
      )
    case undefined:
      return <AnyEditor {...(props as Props<AnySchema, any>)} />
    default:
      return null
  }
}

export default Editor
