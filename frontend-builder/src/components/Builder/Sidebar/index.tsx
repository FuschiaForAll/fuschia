import React from 'react'
import styled from '@emotion/styled'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
//import Icon from '../../Shared/Icon'

import LayersIcon from '@mui/icons-material/Layers'
import BorderAllIcon from '@mui/icons-material/BorderAll'

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 2rem;
  pointer-events: none;
  width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const cardStyles = {
  padding: '0.5rem 0',
  margin: '0.5rem 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  pointerEvents: 'all',
}

const buttonStyles = {
  margin: '0.5rem 0',
}

const Item: React.FC = function Item({ children }) {
  return <IconButton sx={buttonStyles}>{children}</IconButton>
}

const Sidebar: React.FC = function Sidebar() {
  return (
    <Wrapper>
      <Paper elevation={12} sx={cardStyles}></Paper>
      <Paper elevation={12} sx={cardStyles}>
        {/*
        <Item>
          <Icon />
        </Item>
        */}
        <Item>
          <LayersIcon />
        </Item>
        <Item>
          <BorderAllIcon />
        </Item>
      </Paper>
    </Wrapper>
  )
}

export default Sidebar
