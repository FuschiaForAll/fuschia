import React from 'react'
import { Props, StringSchema } from '@fuchsia/types'
import { LabeledTextInput } from '../../../Shared/primitives/LabeledTextInput'
import TextInputBinding from '../../../Shared/TextInputBinding'
import { LabeledSelect } from '../../../Shared/primitives/LabeledSelect'
import ColorInputBinding from '../../../Shared/ColorInputBinding'
export type StringEditorProps = Props<StringSchema, string>

const StringEditor = function StringEditor(props: StringEditorProps) {
  if (props.schema.enum) {
    return (
      <LabeledSelect
        label={props.schema.title || ''}
        selectedValue={props.initialValue as string}
        onChange={e => props.updateValue(e.target.value, true)}
        options={props.schema.enum.map(item => ({
          label: item,
          value: item,
        }))}
      />
    )
  }
  switch (props.schema.format) {
    case 'textarea':
      return <textarea />
    case 'color':
      return (
        <div>
          <div style={{ fontSize: '0.75rem' }}>{props.schema.title}</div>
          <ColorInputBinding
            componentId={props.componentId}
            initialValue={props.initialValue as any}
            onChange={value => {
              props.updateValue(value, true)
            }}
          />
        </div>
      )
    case 'ipv4':
      return (
        <>
          <LabeledTextInput
            label={props.schema.title || 'undefined'}
            defaultValue={props.initialValue as string}
            onChange={e => props.updateValue(e.target.value, true)}
          />
        </>
      )
    default:
      return (
        <div>
          <div style={{ fontSize: '0.75rem' }}>{props.schema.title}</div>
          <TextInputBinding
            componentId={props.componentId}
            initialValue={props.initialValue as any}
            onChange={value => {
              props.updateValue(value, true)
            }}
          />
        </div>
      )
  }
}

export default StringEditor
