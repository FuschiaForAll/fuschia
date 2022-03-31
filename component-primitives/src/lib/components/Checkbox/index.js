import React from "react";
import RNCCheckBox from "@react-native-community/checkbox";

export function Checkbox(props) {
  console.log(props);
  return <RNCCheckBox {...props} />;
}
