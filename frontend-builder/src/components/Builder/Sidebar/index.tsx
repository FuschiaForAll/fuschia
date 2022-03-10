import React from 'react'
import styled from '@emotion/styled'
import Paper from '@mui/material/Paper'
import Icon from '../../Shared/Icon'
import LabelIcon from '@mui/icons-material/Label'
import { useNavigate } from 'react-router-dom'
import Item from './Item'
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

const cardStyles = {
  padding: '0.5rem 0',
  margin: '1rem 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  pointerEvents: 'all',
}

const Sidebar: React.FC = function Sidebar() {
  const navigate = useNavigate()
  return (
    <Wrapper>
      <Inner>
        <Toolbar />
        <Paper elevation={12} sx={cardStyles}>
          <Item title="Database" onClick={() => navigate('database')}>
            <Icon icon="database" />
          </Item>
          <Item title="Label Library" onClick={() => navigate('label-library')}>
            <LabelIcon />
          </Item>
          <Item title="Styles">
            <Icon icon="styles" />
          </Item>
          <Item title="Analytics">
            <Icon icon="analytics" />
          </Item>
        </Paper>
      </Inner>
    </Wrapper>
  )
}

export default Sidebar
