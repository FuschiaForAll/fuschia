import { FormControlLabel } from '@mui/material'
import React from 'react'
import { Checkbox, CheckboxProps } from './Checkbox'

export interface LabeledCheckboxProps extends CheckboxProps {
  label: string
}

export function LabeledCheckbox(props: LabeledCheckboxProps) {
  const { label, ...rest } = props
  return (
    <FormControlLabel
      sx={{ marginLeft: 0 }}
      control={<Checkbox {...rest} />}
      label={props.label}
      labelPlacement="start"
    />
  )
}
