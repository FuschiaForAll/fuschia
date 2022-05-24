import React from 'react'
import { Props, NumberSchema } from '@fuchsia/types'
import TextInputBinding from '../../../Shared/TextInputBinding'

export type NumberEditorProps = Props<NumberSchema, number>

const NumberEditor = function NumberEditor(props: NumberEditorProps) {
  switch (props.schema.format) {
    case 'select':
    case 'radiobox':
      return <div>Unsupported</div>
    default:
      return (
        <div>
          <div style={{ fontSize: '0.75rem' }}>{props.schema.title}</div>
          <TextInputBinding
            componentId={props.componentId}
            initialValue={props.initialValue as any}
            onChange={value => {
              props.updateValue({ ...value, type: 'number' }, true)
            }}
          />
        </div>
      )
  }
}

export default NumberEditor
