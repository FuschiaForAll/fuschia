import React, { useEffect, useState } from 'react'
import { Props, MarginSchema } from '@fuchsia/types'
import { LabeledTextInput } from '../../../Shared/primitives/LabeledTextInput'
import { Color, SketchPicker } from 'react-color'
import Box from '@mui/material/Box'
import Popper from '@mui/material/Popper'
import TextInputBinding from '../../../Shared/TextInputBinding'
import { LabeledSelect } from '../../../Shared/primitives/LabeledSelect'
export type MarginEditorProps = Props<MarginSchema, any>

const MarginEditor = function StringEditor(props: MarginEditorProps) {
  const margin = props.initialValue
    ? props.initialValue
    : {
        left: '0px',
        right: '0px',
        top: '0px',
        bottom: '0px',
      }
  return (
    <div>
      <div
        style={{
          fontSize: '0.75rem',
        }}
      >
        {props.schema.title}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5em',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '0.5em',
            alignItems: 'center',
          }}
        >
          <span>L</span>
          <TextInputBinding
            componentId={props.componentId}
            initialValue={margin.left}
            onChange={value => {
              margin.left = value
              props.updateValue(margin, true)
            }}
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '0.5em',
            alignItems: 'center',
          }}
        >
          <span>R</span>
          <TextInputBinding
            componentId={props.componentId}
            initialValue={margin.right}
            onChange={value => {
              margin.right = value
              props.updateValue(margin, true)
            }}
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '0.5em',
            alignItems: 'center',
          }}
        >
          <span>T</span>
          <TextInputBinding
            componentId={props.componentId}
            initialValue={margin.top}
            onChange={value => {
              margin.top = value
              props.updateValue(margin, true)
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '0.5em',
            alignItems: 'center',
          }}
        >
          <span>B</span>
          <TextInputBinding
            componentId={props.componentId}
            initialValue={margin.bottom}
            onChange={value => {
              margin.bottom = value
              props.updateValue(margin, true)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default MarginEditor
