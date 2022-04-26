import React from 'react'
import { Props, BooleanSchema } from '@fuchsia/types'
import { EntitySelector } from '../../../Shared/EntitySelector'

export type BooleanEditorProps = Props<BooleanSchema, string>

const BooleanEditor = function BooleanEditor(props: BooleanEditorProps) {
  return (
    <div>
      <div style={{ fontSize: '0.75rem' }}>{props.schema.title}</div>
      <EntitySelector
        componentId={props.componentId}
        onSelect={(entity, path) => {
          throw new Error('THIS NEEDS FIXING')
          //props.updateValue(path, true)
        }}
        additionalEntities={[
          {
            type: 'PRIMITIVE',
            entity: 'boolean',
            hasSubMenu: false,
            label: '$false',
            source: 'false',
          },
          {
            type: 'PRIMITIVE',
            entity: 'boolean',
            hasSubMenu: false,
            label: '$true',
            source: 'true',
          },
        ]}
        selectedLabel={`${props.initialValue}`}
      />
    </div>
  )
}

export default BooleanEditor
