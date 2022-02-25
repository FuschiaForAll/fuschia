import React from 'react'
import { Paper } from '@mui/material'
import Modal from '@mui/material/Modal'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetProjectQuery } from '../../../generated/graphql'
import { AuthConfig } from './AuthConfig'

const Settings: React.FC = function Settings() {
  let { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { data, loading, error } = useGetProjectQuery({
    variables: { projectId },
  })
  if (error) {
    return <div>Error</div>
  }
  if (loading) {
    return <div>Loading...</div>
  }
  if (!projectId) {
    return <div>missing project id</div>
  }
  return (
    <Modal open={true} onClose={() => navigate('../')} sx={{ padding: '5rem' }}>
      <Paper
        sx={{
          height: '100%',
          width: '100%',
          padding: '1rem',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
        }}
      >
        {data && data.getProject.appConfig.authConfig && (
          <AuthConfig projectId={projectId} />
        )}
      </Paper>
    </Modal>
  )
}

export default Settings
