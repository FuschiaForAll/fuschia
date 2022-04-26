import React from "react";
import { View, ImageBackground } from "react-native";

export function Container(props) {
  const { style, children, editor } = props;
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
      }}
    >
      {style?.backgroundImage?.source ? (
        <ImageBackground
          source={style?.backgroundImage?.source}
          resizeMode={style?.backgroundImage?.resizeMode}
          style={style?.backgroundImage?.style}
        >
          {children}
        </ImageBackground>
      ) : (
        <>{children}</>
      )}
    </View>
  );
}
