import React from 'react'
import { TextInput, TextInputProps } from './TextInput'
import { FormControlLabel } from '@mui/material'

interface LabeledTextInputProps extends TextInputProps {
  label: string
  labelPlacement?: 'top' | 'start' | 'end' | 'bottom'
  fontSize?: string
}

export function LabeledTextInput(props: LabeledTextInputProps) {
  const { label, labelPlacement = 'top', fontSize = '0.75rem', ...rest } = props
  return (
    <FormControlLabel
      sx={{
        color: 'var(--text)',
        alignItems: 'start',
        userSelect: 'none',
        marginLeft: 0,
        marginRight: 0,
      }}
      labelPlacement={labelPlacement}
      control={<TextInput {...rest} />}
      label={
        <span style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
          {label}
        </span>
      }
    />
  )
}
