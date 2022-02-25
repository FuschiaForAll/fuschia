import React from 'react'
import {
  MenuItem,
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
} from '@mui/material'

export interface SelectProps extends MuiSelectProps {
  options: Array<{
    label: string
    value: any
  }>
}

export function Select(props: SelectProps) {
  const { options, ...rest } = props
  return (
    <MuiSelect
      {...rest}
      sx={{
        '&:focus': {
          outlineColor: 'var(--accent) !important',
          outlineWidth: '1px',
          backgroundColor: 'yellow',
        },
        '& .MuiInputBase-input': {
          padding: 0,
        },
      }}
      MenuProps={{
        sx: {
          paper: {
            backgroundColor: 'red',
            borderRadius: 12,
            marginTop: 8,
          },
        },
        variant: 'menu',
      }}
    >
      {options.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </MuiSelect>
  )
}
