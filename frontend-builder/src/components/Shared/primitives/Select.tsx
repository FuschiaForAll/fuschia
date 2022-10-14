import React from 'react'
import styled from '@emotion/styled'

export interface SelectProps {
  options: Array<{
    label: string
    value: any
  }>
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  selectedValue: any
}

const StyledSelect = styled.select`
  display: grid;
  grid-template-areas: 'select';
  align-items: center;
  position: relative;
  min-width: 15ch;
  max-width: 30ch;
  border: 1px solid var(--text);
  border-radius: 0.25em;
  padding: 0.5em 0.5em;
  margin-left: 10px;
  cursor: pointer;
  background-color: #fff;
  background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
  font-size: 0.75em;
  &:after {
    grid-area: select;
  }
  &:not(#select--multiple)::after {
    content: '';
    justify-self: end;
    width: 0.8em;
    height: 0.5em;
    background-color: var(--select-arrow);
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
  }

  &:disabled {
    cursor: not-allowed;
    background-color: #eee;
    background-image: linear-gradient(to top, #ddd, #eee 33%);
  }
`

export function Select(props: SelectProps) {
  const { options, selectedValue, ...rest } = props
  return (
    <div className="select">
      <StyledSelect className="select" {...rest}>
        <option value="" disabled selected={!selectedValue} hidden>
          Please Choose...
        </option>
        {options.map(option => (
          <option
            key={option.value}
            value={option.value}
            selected={option.value === selectedValue}
          >
            {option.label}
          </option>
        ))}
      </StyledSelect>
      <span className="focus"></span>
    </div>
  )
}
