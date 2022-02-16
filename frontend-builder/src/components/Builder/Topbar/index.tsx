import React, { useState } from 'react'
import styled from '@emotion/styled'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'

import PersonIcon from '@mui/icons-material/Person'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import { Project } from '../../../generated/graphql'
import { MenuItem, Select } from '@mui/material'

interface TopbarProps {
  projects?: Partial<Project>[]
  currentProject?: string
}

const Wrapper = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  pointer-events: none;
  display: flex;
  flex-direction: row;
  gap: 1rem;
`

const cardStyles = {
  padding: '0rem 0.5rem',
  margin: '0rem 0.5rem',
  display: 'flex',
  flexDirection: 'row',
  pointerEvents: 'all',
}

const buttonStyles = {
  margin: '0.5rem 0',
}

const Topbar: React.FC<TopbarProps> = function Topbar({
  projects,
  currentProject,
}: TopbarProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = React.useState(false)
  const [selectedProject, setSelectedProject] = useState(currentProject)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen(prev => !prev)
  }
  return (
    <Wrapper>
      <Paper elevation={12} sx={cardStyles}>
        {projects && (
          <Select
            sx={{ width: 150 }}
            value={selectedProject}
            onChange={e => {
              const proj = e.target.value as string
              setSelectedProject(proj)
              localStorage.setItem('currentProjectId', proj)
            }}
          >
            {projects.map(project => (
              <MenuItem key={project._id} value={project._id}>
                {project.projectName}
              </MenuItem>
            ))}
          </Select>
        )}
        <IconButton color="primary" sx={buttonStyles} onClick={handleClick}>
          <PersonIcon />
        </IconButton>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <Typography sx={{ p: 2 }}>
                  The content of the Popper.
                </Typography>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Paper>
    </Wrapper>
  )
}

export default Topbar
