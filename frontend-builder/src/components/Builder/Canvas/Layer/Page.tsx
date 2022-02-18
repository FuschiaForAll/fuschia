import React from 'react'
import styled from '@emotion/styled'
import type { Page as PageType } from '@fuchsia/types'

interface PageProps {
  layer: PageType
  selected?: boolean
}

const Wrapper = styled.div`
  background: #fff;
  box-shadow: 0 0 0 1px #ccc;
  position: absolute;
`

const Page: React.FC<PageProps> = function Page({ layer, selected }) {
  const { x, y, width, height } = layer

  const styles: React.CSSProperties = {
    width,
    height,
    left: x,
    top: y,
  }

  if (selected) {
    styles.boxShadow = '0 0 0 2px var(--primary)'
  }

  return <Wrapper style={styles}></Wrapper>
}

export default Page
