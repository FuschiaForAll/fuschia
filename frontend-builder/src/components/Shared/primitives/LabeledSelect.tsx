import React from 'react'
import { FormControlLabel } from '@mui/material'
import { Select, SelectProps } from './Select'

export interface LabeledSelectProps extends SelectProps {
  label: string
  labelPlacement?: 'top' | 'start' | 'end' | 'bottom'
  fontSize?: string
}

export function LabeledSelect(props: LabeledSelectProps) {
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
      control={<Select {...rest} />}
      label={<span style={{ fontSize }}>{label}</span>}
    />
  )
}
