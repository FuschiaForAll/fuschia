import React from 'react'
import styled from '@emotion/styled'
import type { Page as PageType } from '@fuchsia/types'

interface PageProps {
  layer: PageType
  selected?: boolean
}

const Wrapper = styled.div`
  background: #fff;
  box-shadow: inset 0 0 0 1px #ccc;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`

const Page: React.FC<PageProps> = function Page({ layer, selected }) {
  return <Wrapper />
}

export default Page
