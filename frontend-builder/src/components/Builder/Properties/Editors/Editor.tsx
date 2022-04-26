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
  FunctionSchema,
  PaddingSchema,
  MarginSchema,
  FontSchema,
  FlexContainerSchema,
  PositionSchema,
} from '@fuchsia/types'
import BooleanEditor from './BooleanEditor'
import StringEditor from './StringEditor'
import ObjectEditor from './ObjectEditor'
import ArrayEditor from './ArrayEditor'
import NumberEditor from './NumberEditor'
import AnyEditor from './AnyEditor'
import NullEditor from './NullEditor'
import FunctionEditor from './FunctionEditor'
import PaddingEditor from './PaddingEditor'
import MarginEditor from './MarginEditor'
import FontEditor from './FontEditor'
import FlexContainerEditor from './FlexContainerEditor'
import PositionEditor from './PositionEditor'

export type EditorProps = Props<Schema, ValueType>

const Editor = function Editor(props: EditorProps) {
  if (props.schema.$ref) {
    const ref = props.getReference(props.schema.$ref)
    if (ref) {
      props = { ...props, schema: ref }
    }
  }
  switch (props.schema.type) {
    case 'boolean':
      return <BooleanEditor {...(props as Props<BooleanSchema, string>)} />
    case 'string':
      return <StringEditor {...(props as Props<StringSchema, string>)} />
    case 'array':
      return <ArrayEditor {...(props as Props<ArraySchema, ValueType[]>)} />
    case 'integer':
    case 'number':
      return <NumberEditor {...(props as Props<NumberSchema, number>)} />
    case 'null':
      return <NullEditor {...(props as Props<NullSchema, null>)} />
    case 'function':
      return <FunctionEditor {...(props as Props<FunctionSchema, any>)} />
    case 'ui-component':
    case 'layout-component':
    case 'object':
      return (
        <ObjectEditor
          {...(props as Props<ObjectSchema, { [name: string]: ValueType }>)}
        />
      )
    case 'padding':
      return <PaddingEditor {...(props as Props<PaddingSchema, any>)} />
    case 'margin':
      return <MarginEditor {...(props as Props<MarginSchema, any>)} />
    case 'position':
      return <PositionEditor {...(props as Props<PositionSchema, any>)} />
    case 'font':
      return <FontEditor {...(props as Props<FontSchema, any>)} />
    case 'flexContainer':
      return (
        <FlexContainerEditor {...(props as Props<FlexContainerSchema, any>)} />
      )
    case undefined:
      return <AnyEditor {...(props as Props<AnySchema, any>)} />
    default:
      return null
  }
}

export default Editor
