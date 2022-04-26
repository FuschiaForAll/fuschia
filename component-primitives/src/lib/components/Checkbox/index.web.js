import React from "react";

export function Checkbox(props) {
  return (
    <input
      type="checkbox"
      {...props}
      checked={props.value}
      onChange={(e) => {
        if (props.onValueChange) {
          props.checked.onChange(e.currentTarget.checked);
          props.onValueChange(e.currentTarget.checked);
        }
      }}
    />
  );
}
