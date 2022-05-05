import React, { useEffect, useState } from "react";
import { TextInput as RNTextInput, Text } from "react-native";

export function TextInput(props) {
  const { properties, style, actions, editor } = props;
  const [rerender, setRerender] = useState(0);
  useEffect(() => {
    setRerender((r) => r + 1);
  }, []);
  return (
    <>
      <Text>{rerender}</Text>
      <RNTextInput
        style={style}
        placeholder={properties.placeholder}
        value={properties.text?.value}
        onChangeText={(text) => properties.text?.onChange(text)}
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
    </>
  );
}
