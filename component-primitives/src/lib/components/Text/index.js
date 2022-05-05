import React from "react";
import { Text as RNText } from "react-native";

export function Text(props) {
  const { properties, style, actions, editor } = props;

  return (
    <RNText
      style={{
        height: style?.height,
        width: style?.width,
        color: style?.color,
        fontSize: style?.font?.size,
        fontStyle: style?.font?.style,
        fontWeight: style?.font?.weight,
        textAlign: style?.font?.textAlign,
        textTransform: style?.font?.textTransform,
      }}
      onPress={
        editor?.inEditMode
          ? (e) => {
              if (editor?.inEditMode) {
                e.stopPropagation();
                editor?.onSelect(editor?.id);
              }
            }
          : undefined
      }
      ref={editor?.ref}
    >
      {properties?.text}
    </RNText>
  );
}
