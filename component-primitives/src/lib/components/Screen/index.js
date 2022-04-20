import React, { useEffect } from "react";
import { View, ImageBackground } from "react-native";

export function Screen(props) {
  const { children, properties, layout, style, actions } = props;
  return (
    <View
      style={{
        height: style?.height,
        width: style?.width,
        backgroundColor: style?.backgroundColor,
        borderRadius: style?.borderRadius,
        display: style?.display,
        marginLeft: layout?.margin?.left,
        marginRight: layout?.margin?.right,
        marginTop: layout?.margin?.top,
        marginBottom: layout?.margin?.bottom,
        paddingLeft: layout?.padding?.left,
        paddingRight: layout?.padding?.right,
        paddingTop: layout?.padding?.top,
        paddingBottom: layout?.padding?.bottom,
        flexDirection: layout?.flexContainer?.flexDirection,
        alignItems: layout?.flexContainer?.alignItems,
        alignContent: layout?.flexContainer?.alignContent,
        justifyContent: layout?.flexContainer?.justifyContent,
        justifyItems: layout?.flexContainer?.justifyItems,
        flexWrap: layout?.flexContainer?.flexWrap,
        gap: layout?.flexContainer?.gap,
        flex: layout?.flex,
      }}
    >
      {style?.backgroundImage?.source && (
        <ImageBackground
          source={style?.backgroundImage?.source}
          resizeMode={style?.backgroundImage?.resizeMode}
          style={style?.backgroundImage?.style}
        />
      )}
      {children}
    </View>
  );
}
