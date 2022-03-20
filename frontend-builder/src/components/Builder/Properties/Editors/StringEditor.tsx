import React, { useState } from 'react'
import { Props, StringSchema } from '@fuchsia/types'
import { LabeledTextInput } from '../../../Shared/primitives/LabeledTextInput'
import { Color, SketchPicker } from 'react-color'
import Box from '@mui/material/Box'
import Popper from '@mui/material/Popper'
import MuiSelect from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import TextInputBinding from '../../../Shared/TextInputBinding'

export type StringEditorProps = Props<StringSchema, string>

const ColorPicker = ({
  title,
  defaultValue,
  onChange,
}: {
  title: string
  defaultValue: string
  onChange: (value: string) => void
}) => {
  const [color, setColor] = useState<Color>(defaultValue)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleClick = (event: React.FocusEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined
  return (
    <>
      <LabeledTextInput
        label={title}
        value={color?.toString()}
        onFocus={handleClick}
      />

      <Popper id={id} open={open} anchorEl={anchorEl} placement="right">
        <Box sx={{ marginLeft: '0.5em' }}>
          <div
            style={{
              position: 'fixed',
              top: '0px',
              right: '0px',
              bottom: '0px',
              left: '0px',
            }}
            onClick={() => setAnchorEl(null)}
          />
          <SketchPicker
            color={color}
            onChange={color => {
              setColor(color.hex)
              onChange(color.hex)
            }}
          />
        </Box>
      </Popper>
    </>
  )
}

const StringEditor = function StringEditor(props: StringEditorProps) {
  if (props.schema.enum) {
    return (
      <FormControl
        fullWidth={true}
        sx={{ marginTop: '0.5em', marginBottom: '0.5em' }}
      >
        <InputLabel id={`select-${props.schema.title || 'undefined'}-label`}>
          {props.schema.title}
        </InputLabel>
        <MuiSelect
          labelId={`select-${props.schema.title || 'undefined'}-label`}
          label={props.schema.title}
          defaultValue={props.initialValue as string}
          onChange={e => props.updateValue(e.target.value, true)}
        >
          {props.schema.enum.map(item => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    )
  }
  switch (props.schema.format) {
    case 'textarea':
      return <textarea />
    case 'color':
      return (
        <ColorPicker
          defaultValue={props.initialValue as string}
          title={props.schema.title || 'undefined'}
          onChange={e => props.updateValue(e, true)}
        />
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
            initialValue={props.initialValue}
            onChange={value => {
              props.updateValue(value, true)
            }}
          />
        </div>
      )
  }
}

export default StringEditor
