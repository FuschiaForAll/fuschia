import React, { useEffect } from "react";
import { View, ImageBackground } from "react-native";

export function Screen(props) {
  const { children, properties, layout, style, actions, editor } = props;
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
        height: style?.height,
        width: style?.width,
        backgroundColor: style?.backgroundColor,
        borderRadius: style?.borderRadius,
        display: style?.display,
        paddingLeft: style?.padding?.left,
        paddingRight: style?.padding?.right,
        paddingTop: style?.padding?.top,
        paddingBottom: style?.padding?.bottom,
        flexDirection: style?.flexContainer?.flexDirection,
        alignItems: style?.flexContainer?.alignItems,
        alignContent: style?.flexContainer?.alignContent,
        justifyContent: style?.flexContainer?.justifyContent,
        justifyItems: style?.flexContainer?.justifyItems,
        flexWrap: style?.flexContainer?.flexWrap,
        gap: style?.flexContainer?.gap,
        flex: style?.flex,
      }}
    >
      {children}
    </View>
  );
}
