import { Box, Typography, Button } from '@mui/material'
import { withStyles } from '@mui/styles'
import { Add } from '@mui/icons-material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const CenteredBox = withStyles({
  root: {
    display: 'grid',
    justifyContent: 'center',
    alignContent: 'center',
    justifyItems: 'center',
    alignItems: 'center',
  },
})(Box)

const NoProjects: React.FC = function NoProjects() {
  const navigate = useNavigate()
  return (
    <CenteredBox>
      <Typography variant="h1">Welcome!</Typography>
      <Typography>
        It looks like you have not created any projects yet. Add a project and
        begin your journey to developing your first app.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => navigate(`/projects/new`)}
      >
        Add new course
      </Button>
    </CenteredBox>
  )
}

export default NoProjects
