import React from 'react'
import styled from '@emotion/styled'
import Toolbar from './Toolbar'

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 2rem;
  height: 100%;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Inner = styled.div`
  width: 60px;
  max-height: 100%;
  padding-top: calc(56px + 1rem);
`

const Sidebar: React.FC = function Sidebar() {
  return (
    <Wrapper>
      <Inner>
        <Toolbar />
      </Inner>
    </Wrapper>
  )
}

export default Sidebar
