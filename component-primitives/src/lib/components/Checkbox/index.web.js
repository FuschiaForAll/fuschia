import React from "react";

export function Checkbox(props) {
  console.log(props);
  return <input type="checkbox" {...props} />;
}
