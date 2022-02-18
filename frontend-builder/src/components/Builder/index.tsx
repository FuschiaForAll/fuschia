import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import { Route, Routes } from 'react-router-dom'
import type { AppBody } from '@fuchsia/types'
import { useListProjectsQuery } from '../../generated/graphql'
import Canvas from './Canvas'
import Database from './Database'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Context, { DEFAULT_BODY } from './context'
import CanvasContext, {
  CanvasState,
  DEFAULT_CANVAS_STATE,
} from './canvas-context'

const Builder: React.FC = function Builder() {
  const [body, setBody] = useState<AppBody>(DEFAULT_BODY)

  const [canvasState, setCanvasState] =
    useState<CanvasState>(DEFAULT_CANVAS_STATE)

  const { data: projects } = useListProjectsQuery()

  const { data: currentProjectData } = useQuery(gql`
    query CurrentProjectId {
      currentProjectId @client
    }
  `)

  return (
    <>
      <Context.Provider value={{ body, setBody }}>
        <CanvasContext.Provider
          value={{ state: canvasState, onChange: setCanvasState }}
        >
          <div>
            <Canvas />
            <Sidebar />
            <Topbar
              projects={projects?.listProjects}
              currentProject={currentProjectData.currentProjectId}
            />
          </div>
        </CanvasContext.Provider>
      </Context.Provider>
      <Routes>
        <Route path="database" element={<Database />} />
      </Routes>
    </>
  )
}

export default Builder
