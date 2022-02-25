import React from 'react'
import { FormControlLabel } from '@mui/material'
import { Select, SelectProps } from './Select'

export interface LabeledSelectProps extends SelectProps {
  label: string
}

export function LabeledSelect(props: LabeledSelectProps) {
  const { label, ...rest } = props
  return (
    <FormControlLabel
      label={label}
      control={<Select {...rest} />}
      labelPlacement="start"
      sx={{
        marginLeft: 0,
      }}
    />
  )
}
