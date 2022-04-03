import React from "react";

export function Checkbox(props) {
  console.log(props);
  return (
    <input
      type="checkbox"
      {...props}
      checked={props.value}
      onChange={(e) => {
        debugger;
        console.log("onchange fired");
        console.log("props.onValueChanged");
        console.log(props.onValueChange);
        if (props.onValueChange) {
          console.log("firing value changed event");
          props.checked.onChange(e.currentTarget.checked);
          props.onValueChange(e.currentTarget.checked);
        }
      }}
    />
  );
}
