import React from "react";
import { Button as RNButton, TouchableOpacity } from "react-native";

export function Button(props) {
  const { children, style, actions, editor } = props;
  return (
    <TouchableOpacity
      onPress={(e) => {
        if (editor?.inEditMode) {
          e.stopPropagation();
          editor?.onSelect(editor?.id);
        } else {
          actions?.onPress();
        }
      }}
      ref={editor?.ref}
      style={{
        height: style?.height,
        width: style?.width,
        backgroundColor: style?.backgroundColor,
        borderRadius: style?.borderRadius,
        display: style?.display,
        left: style?.placement?.left,
        right: style?.placement?.right,
        top: style?.placement?.top,
        bottom: style?.placement?.bottom,
        marginLeft: style?.margin?.left,
        marginRight: style?.margin?.right,
        marginTop: style?.margin?.top,
        marginBottom: style?.margin?.bottom,
        paddingLeft: style?.padding?.left,
        paddingRight: style?.padding?.right,
        paddingTop: style?.padding?.top,
        paddingBottom: style?.padding?.bottom,
        position: style?.position,
        flexDirection: style?.flexContainer?.flexDirection,
        alignItems: style?.flexContainer?.alignItems,
        alignContent: style?.flexContainer?.alignContent,
        justifyContent: style?.flexContainer?.justifyContent,
        justifyItems: style?.flexContainer?.justifyItems,
        flexWrap: style?.flexContainer?.flexWrap,
        gap: style?.flexContainer?.gap,
        flex: style?.flex,
        alignSelf: style?.alignSelf,
      }}
    >
      {children}
    </TouchableOpacity>
  );
}
