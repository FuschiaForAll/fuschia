import React from 'react'
import { Props, NumberSchema } from '@fuchsia/types'
import { LabeledTextInput } from '../../../Shared/primitives/LabeledTextInput'

export type NumberEditorProps = Props<NumberSchema, number>

const NumberEditor = function NumberEditor(props: NumberEditorProps) {
  switch (props.schema.format) {
    case 'select':
    case 'radiobox':
      return <div>Unsupported</div>
    default:
      return (
        <LabeledTextInput
          type="number"
          step={props.schema.step || 1}
          defaultValue={props.initialValue}
          label={props.schema.title || 'undefined'}
          onChange={e => props.updateValue(+e.target.value, true)}
        />
      )
  }
}

export default NumberEditor
