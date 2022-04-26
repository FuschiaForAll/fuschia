import React, { useEffect } from "react";
import { View } from "react-native";

export function Stack(props) {
  const { children, editor } = props;
  return (
    <View
      onClick={(e) => {
        if (editor?.inEditMode) {
          e.stopPropagation();
          editor?.onSelect(editor?.id);
        }
      }}
      ref={editor?.ref}
      style={{
        flexDirection: "row",
        gap: "0.5em",
        margin: "30px",
        flexWrap: "wrap",
        height: "auto",
        minHeight: "350px",
      }}
    >
      {children}
    </View>
  );
}
