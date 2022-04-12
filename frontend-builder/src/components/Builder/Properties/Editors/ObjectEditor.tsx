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
    props.initialValue[property] = value
    props.updateValue(props.initialValue as any, true)
  }
  if (!props.schema || !props.schema.properties) {
    return null
  }
  return (
    <>
      {Object.keys(props.schema.properties).map(key => (
        <Editor
          componentId={props.componentId}
          key={key}
          schema={props.schema.properties[key]}
          getReference={props.getReference}
          initialValue={
            props.initialValue ? props.initialValue[key] : undefined
          }
          updateValue={(value: ValueType | undefined, isValid: boolean) =>
            onChange(key, value, isValid)
          }
        />
      ))}
    </>
  )
}

export default ObjectEditor
