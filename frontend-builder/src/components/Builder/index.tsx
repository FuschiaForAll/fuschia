import React, { useState, useCallback } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Route, Routes, useParams } from 'react-router-dom'
import type { AppBody } from '@fuchsia/types'

import {
  useListProjectsQuery,
  // useGetProjectQuery,
} from '../../generated/graphql'

import Canvas from './Canvas'
import Database from './Database'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import FullScreenLoader from '../Shared/FullScreenLoader'
import Context from './context'

import CanvasContext, {
  CanvasState,
  DEFAULT_CANVAS_STATE,
} from './canvas-context'

const Builder: React.FC = function Builder() {
  const { projectId } = useParams()

  const [canvasState, setCanvasState] =
    useState<CanvasState>(DEFAULT_CANVAS_STATE)

  const { data: projects } = useListProjectsQuery()

  const { data, loading } = useQuery(
    gql`
      query GetBuilderProject($projectId: ObjectId!) {
        project: getProject(projectId: $projectId) {
          _id
          appId
          projectName
          body
        }
      }
    `,
    { variables: { projectId } }
  )

  const project = data?.project

  const [updateBody] = useMutation(gql`
    mutation UpdateBody($projectId: ObjectId!, $input: ProjectInput!) {
      updateProject(projectId: $projectId, input: $input) {
        body
      }
    }
  `)

  const setBody = useCallback(
    (body: AppBody) => {
      updateBody({
        variables: {
          projectId,
          input: { body },
        },
      })
    },
    [updateBody, projectId]
  )

  if (!data && loading) {
    return <FullScreenLoader />
  } else if (!data) {
    return (
      <div>
        <h1>Could not load project!</h1>
      </div>
    )
  }

  const body = JSON.parse(project.body) as any as AppBody

  console.log('BODY:', body)

  return (
    <>
      <Context.Provider value={{ body, setBody }}>
        <CanvasContext.Provider
          value={{ state: canvasState, onChange: setCanvasState }}
        >
          <div>
            <Canvas />
            <Topbar
              projects={projects?.listProjects}
              currentProject={projectId}
              projectName={project.projectName}
            />
            <Sidebar />
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
