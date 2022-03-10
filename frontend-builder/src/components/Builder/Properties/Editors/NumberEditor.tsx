import React from 'react'
import { Props, NumberSchema } from '@fuchsia/types'
import { LabeledTextInput } from '../../../Shared/primitives/LabeledTextInput'

export type NumberEditorProps = Props<NumberSchema, number>

const NumberEditor = function NumberEditor(props: NumberEditorProps) {
  console.log(props)
  switch (props.schema.format) {
    case 'select':
    case 'radiobox':
      return <div>Unsupported</div>
    default:
      return (
        <LabeledTextInput
          type="number"
          step={props.schema.step || 1}
          defaultValue={props.schema.default as string}
          label={props.schema.title || 'undefined'}
        />
      )
  }
}

export default NumberEditor
