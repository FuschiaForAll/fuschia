import React from 'react'
import styled from '@emotion/styled'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import PersonIcon from '@mui/icons-material/Person'
import Typography from '@mui/material/Typography'
import { Button, MenuItem, Select } from '@mui/material'
import { Box } from '@mui/system'
import SettingsIcon from '@mui/icons-material/Settings'
import SearchIcon from '@mui/icons-material/Search'
import RedditIcon from '@mui/icons-material/Reddit'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import HistoryIcon from '@mui/icons-material/History'
import { useNavigate } from 'react-router-dom'

interface TopbarProps {
  projectName: string
}
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
  top: 1rem;
  right: 2rem;
  left: 2rem;
  pointer-events: none;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: space-between;
  pointer-events: all;
`

const Topbar: React.FC<TopbarProps> = function Topbar({
  projectName,
}: TopbarProps) {
  const navigate = useNavigate()
  return (
    <Wrapper>
      <Box sx={{ display: 'grid', gridAutoFlow: 'column', gap: '1rem' }}>
        <Paper
          elevation={12}
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            alignItems: 'center',
            padding: '0.5rem',
          }}
        >
          <Item>
            <RedditIcon />
          </Item>
          <Typography>{projectName}</Typography>
          <Item onClick={() => navigate('app-settings')}>
            <SettingsIcon />
          </Item>
          <Item>
            <SearchIcon />
          </Item>
        </Paper>
        <Paper
          elevation={12}
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            alignItems: 'center',
            padding: '0.5rem',
          }}
        >
          <Item>
            <UndoIcon />
          </Item>
          <Item>
            <RedoIcon />
          </Item>
        </Paper>
        <Box
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            gap: '1rem',
            alignItems: 'center',
            padding: '0.5rem',
          }}
        >
          <Item>
            <HistoryIcon />
          </Item>
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridAutoFlow: 'column', gap: '1rem' }}>
        <Select value={'editingMode'}>
          <MenuItem value={'editingMode'}>Editing Mode</MenuItem>
        </Select>
        <Button variant="contained" onClick={() => navigate('previewer')}>
          Preview
        </Button>
        <Paper
          elevation={12}
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            alignItems: 'center',
            padding: '0.5rem',
          }}
        >
          <Item onClick={() => navigate('dashboard')}>
            <PersonIcon />
          </Item>
        </Paper>
      </Box>
    </Wrapper>
  )
}

export default Topbar
