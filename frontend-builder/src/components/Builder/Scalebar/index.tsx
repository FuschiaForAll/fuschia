import React from 'react'
import styled from '@emotion/styled'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import { useScale } from '../../../utils/hooks/useScale'

const buttonStyles = {
  margin: '0 0.5rem',
}

const Item: React.FC<{ onClick?: React.MouseEventHandler<HTMLButtonElement> }> =
  function Item({ children, onClick }) {
    return (
      <IconButton color="primary" sx={buttonStyles} onClick={onClick}>
        {children}
      </IconButton>
    )
  }

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 2rem;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Inner = styled.div`
  width: 145px;
  max-height: 100%;
`

const cardStyles = {
  padding: '0.5rem 0',
  margin: '1rem 0',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  pointerEvents: 'all',
}

const Scalebar: React.FC = function Scalebar() {
  const { zoomIn, zoomOut, zoomFactor } = useScale()
  return (
    <Wrapper id="scalebar">
      <Inner>
        <Paper elevation={12} sx={cardStyles}>
          <Item onClick={zoomIn}>
            <ZoomInIcon />
          </Item>
          <span>{Math.floor(parseFloat(zoomFactor) * 100)}%</span>
          <Item onClick={zoomOut}>
            <ZoomOutIcon />
          </Item>
        </Paper>
      </Inner>
    </Wrapper>
  )
}

export default Scalebar
