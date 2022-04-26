import React from "react";
import { TextInput as RNTextInput } from "react-native";

export function TextInput(props) {
  const { properties, style, actions, editor } = props;
  return (
    <RNTextInput
      style={style}
      placeholder={properties.placeholder}
      value={properties.text?.value}
      onChange={(e) => properties.text?.onChange(e.target.value)}
      onFocus={(e) => {
        if (editor?.inEditMode) {
          e.stopPropagation();
          editor?.onSelect(editor?.id);
        } else {
          actions?.onFocus();
        }
      }}
      ref={editor?.ref}
    />
  );
}
