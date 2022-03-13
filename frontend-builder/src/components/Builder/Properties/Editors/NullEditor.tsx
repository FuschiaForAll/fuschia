import React from 'react'
import { Props, NullSchema } from '@fuchsia/types'

export type NullEditorProps = Props<NullSchema, null>

const NullEditor = function NullEditor(props: NullEditorProps) {
  return <div>NullEditor</div>
}

export default NullEditor
