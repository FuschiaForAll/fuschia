import React from 'react'
import { View } from 'react-native'

export function Screen({children, ...props}) {
  return (
    <View {...props}>
        {children}
    </View>
  )
}