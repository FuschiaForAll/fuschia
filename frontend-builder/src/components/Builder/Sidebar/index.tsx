import React from 'react'
import styled from '@emotion/styled'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Icon from '../../Shared/Icon'

import AppsIcon from '@mui/icons-material/Apps'
import FormatColorTextIcon from '@mui/icons-material/FormatColorText'
import ImageIcon from '@mui/icons-material/Image'

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
  return (
    <IconButton color="primary" sx={buttonStyles}>
      {children}
    </IconButton>
  )
}

const Sidebar: React.FC = function Sidebar() {
  return (
    <Wrapper>
      <Paper elevation={12} sx={cardStyles}>
        <Item>
          <AppsIcon />
        </Item>
        <Item>
          <FormatColorTextIcon />
        </Item>
        <Item>
          <ImageIcon />
        </Item>
        <Item>
          <Icon icon="shapes" />
        </Item>
        <Item>
          <Icon icon="expandRight" />
        </Item>
        <Item>
          <Icon icon="input" />
        </Item>
      </Paper>
      <Paper elevation={12} sx={cardStyles}>
        <Item>
          <Icon icon="database" />
        </Item>
        <Item>
          <Icon icon="styles" />
        </Item>
        <Item>
          <Icon icon="analytics" />
        </Item>
      </Paper>
    </Wrapper>
  )
}

export default Sidebar
