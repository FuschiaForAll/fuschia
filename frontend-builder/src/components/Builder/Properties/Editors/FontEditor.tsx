import React, { useEffect, useState } from 'react'
import { Props, FontSchema } from '@fuchsia/types'
import { LabeledTextInput } from '../../../Shared/primitives/LabeledTextInput'
import { Color, SketchPicker } from 'react-color'
import Box from '@mui/material/Box'
import Popper from '@mui/material/Popper'
import TextInputBinding from '../../../Shared/TextInputBinding'
import { LabeledSelect } from '../../../Shared/primitives/LabeledSelect'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

export type FontEditorProps = Props<FontSchema, any>

const MarginEditor = function StringEditor(props: FontEditorProps) {
  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    font.textAlign = newAlignment
    props.updateValue(font, true)
  }

  const font = props.initialValue
    ? props.initialValue
    : {
        size: '12',
        style: 'normal',
        weight: 'weight',
        textAlign: 'auto',
        textTransform: 'none',
        lineHeight: '1em',
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
      <div>Size</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={font.size}
        onChange={value => {
          font.size = value
          props.updateValue(font, true)
        }}
      />
      <div>Style</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={font.style}
        onChange={value => {
          font.style = value
          props.updateValue(font, true)
        }}
      />
      <div>Weight</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={font.weight}
        onChange={value => {
          font.weight = value
          props.updateValue(font, true)
        }}
      />
      <div>Alignment</div>
      <ToggleButtonGroup
        value={font.textAlign}
        exclusive={true}
        onChange={handleAlignment}
        aria-label="text alignment"
      >
        <ToggleButton value="left" aria-label="left aligned">
          <FormatAlignLeftIcon />
        </ToggleButton>
        <ToggleButton value="center" aria-label="centered">
          <FormatAlignCenterIcon />
        </ToggleButton>
        <ToggleButton value="right" aria-label="right aligned">
          <FormatAlignRightIcon />
        </ToggleButton>
        <ToggleButton value="justify" aria-label="justified" disabled>
          <FormatAlignJustifyIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      <div>Transform</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={font.textTransform}
        onChange={value => {
          font.textTransform = value
          props.updateValue(font, true)
        }}
      />
    </div>
  )
}

export default MarginEditor
