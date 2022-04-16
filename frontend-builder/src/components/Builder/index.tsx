import React from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import Settings from '../App/Settings'

import Canvas from './Canvas'
import Database from './Database'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import FullScreenLoader from '../Shared/FullScreenLoader'
import Scalebar from './Scalebar'
import LabelLibrary from './LabelLibrary'
import Previewer from '../Previewer'
import { Modal, Paper } from '@mui/material'
import Dashboard from '../Dashboard'
import { DesignerHistoryProvider } from '../../utils/hooks/useDesignerHistory'
import { useGetProjectQuery } from '../../generated/graphql'
import ImageLibrary from './ImageLibrary'

const Builder: React.FC = function Builder() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { data, loading } = useGetProjectQuery({
    variables: {
      projectId,
    },
  })

  if (!data?.getProject && loading) {
    return <FullScreenLoader />
  } else if (!data) {
    return (
      <div>
        <h1>Could not load project!</h1>
      </div>
    )
  }
  const project = data.getProject
  return (
    <DesignerHistoryProvider>
      <div>
        <Canvas />
        <Topbar projectName={project.projectName} />
        <Sidebar />
        <Scalebar />
      </div>
      <Routes>
        <Route path="database" element={<Database />} />
        <Route path="previewer" element={<Previewer />} />
        <Route path="app-settings" element={<Settings />} />
        <Route path="label-library" element={<LabelLibrary />} />
        <Route path="asset-library/*" element={<ImageLibrary />} />
        <Route
          path="dashboard"
          element={
            <Modal
              open={true}
              onClose={() => navigate('./')}
              sx={{ padding: '5rem' }}
            >
              <Paper
                sx={{
                  height: '100%',
                  width: '100%',
                  padding: '1rem',
                  display: 'grid',
                  gridTemplateRows: 'auto 1fr',
                }}
              >
                <Dashboard />
              </Paper>
            </Modal>
          }
        />
      </Routes>
    </DesignerHistoryProvider>
  )
}

export default Builder
