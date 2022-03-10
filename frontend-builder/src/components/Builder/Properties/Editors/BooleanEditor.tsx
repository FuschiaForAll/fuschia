import React from 'react'
import { Props, BooleanSchema } from '@fuchsia/types'

export type BooleanEditorProps = Props<BooleanSchema, boolean>

const BooleanEditor = function BooleanEditor(props: BooleanEditorProps) {
  return <div>BooleanEditor</div>
}

export default BooleanEditor
