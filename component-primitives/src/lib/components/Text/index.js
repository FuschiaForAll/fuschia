import React from 'react'
import { Text as RNText } from 'react-native'

export function Text(props) {
  console.log(props)
  return (
    <RNText {...props}>
      {props.text}
    </RNText>
  )
}