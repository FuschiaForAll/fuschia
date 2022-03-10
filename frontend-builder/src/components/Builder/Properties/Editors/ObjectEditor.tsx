import React from 'react'
import { Props, ObjectSchema, ValueType } from '@fuchsia/types'
import Editor from './Editor'
export type ObjectEditorProps = Props<
  ObjectSchema,
  { [name: string]: ValueType }
>

const ObjectEditor = function ObjectEditor(props: ObjectEditorProps) {
  function onChange(
    property: string,
    value: ValueType | undefined,
    isValid: boolean
  ) {
    props.updateValue(value as any, true)
  }
  return (
    <>
      <span>{props.schema.title}</span>
      {Object.keys(props.schema.properties).map(key => (
        <Editor
          schema={props.schema.properties[key]}
          initialValue={{}}
          updateValue={(value: ValueType | undefined, isValid: boolean) =>
            onChange(key, value, isValid)
          }
          getReference={props.getReference}
        />
      ))}
    </>
  )
}

export default ObjectEditor
