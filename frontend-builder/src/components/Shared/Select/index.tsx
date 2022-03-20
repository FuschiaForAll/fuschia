import React from 'react'
import { SelectProps } from '../primitives/Select'
import './Select.css'

export interface LabeledSelectProps extends SelectProps {
  label: string
}

const Select: React.FC<LabeledSelectProps> = function Select(props) {
  const { label } = props
  return (
    <>
      <label htmlFor="standard-select">{label}</label>
      <div className="select">
        <select id="standard-select">
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
          <option value="Option 4">Option 4</option>
          <option value="Option 5">Option 5</option>
          <option value="Option length">
            Option that has too long of a value to fit
          </option>
        </select>
        <span className="focus"></span>
      </div>
    </>
  )
}

export default Select
