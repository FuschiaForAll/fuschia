import React from 'react'
import { Props, ArraySchema, ValueType } from '@fuchsia/types'

export type ArrayEditorProps = Props<ArraySchema, ValueType[]>

const ArrayEditor = function ArrayEditor(props: ArrayEditorProps) {
  return <div>ArrayEditor</div>
}

export default ArrayEditor
