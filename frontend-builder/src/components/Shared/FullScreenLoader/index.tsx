import React from 'react'
import styled from '@emotion/styled'
import CircularProgress from '@mui/material/CircularProgress'

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Loader: React.FC = function FullScreenLoader() {
  return (
    <Wrapper>
      <CircularProgress />
    </Wrapper>
  )
}

export default Loader
