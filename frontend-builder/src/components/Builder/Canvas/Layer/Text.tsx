import React from 'react'
import styled from '@emotion/styled'
import { TextType } from '@fuchsia/types'

interface TextProps {
  layer: TextType
}

const Wrapper = styled.div`
  /* Something here */
`

const TextLayer: React.FC<TextProps> = function TextLayer({ layer }) {
  const { text, fontSize, fontColor } = layer.options

  const styles: React.CSSProperties = {
    fontSize,
    color: fontColor || '#000',
  }

  return <Wrapper style={styles}>{text}</Wrapper>
}

export default TextLayer
