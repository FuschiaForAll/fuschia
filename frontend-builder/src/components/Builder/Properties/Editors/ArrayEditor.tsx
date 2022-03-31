import React from 'react'
import { Props, ArraySchema, ValueType } from '@fuchsia/types'
import ObjectEditor, { ObjectEditorProps } from './ObjectEditor'

export type ArrayEditorProps = Props<ArraySchema, ValueType[]>

const ArrayEditor = function ArrayEditor(props: ArrayEditorProps) {
  return (
    <div>
      <ObjectEditor {...(props as unknown as ObjectEditorProps)} />
    </div>
  )
}

export default ArrayEditor
