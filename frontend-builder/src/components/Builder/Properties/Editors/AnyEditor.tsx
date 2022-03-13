import React from 'react'
import { Props, AnySchema } from '@fuchsia/types'

export type AnyEditorProps = Props<AnySchema, any>

const AnyEditor = function AnyEditor(props: AnyEditorProps) {
  return <div>AnyEditor</div>
}

export default AnyEditor
