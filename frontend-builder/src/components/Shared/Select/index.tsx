import React from 'react'
import './Select.css'

const Select: React.FC = function Select() {
  return (
    <>
      <label htmlFor="standard-select">Standard Select</label>
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
